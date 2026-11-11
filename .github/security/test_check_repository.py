"""Regression fixtures are inert strings; no payload is executed."""

import json
import unittest

from check_repository import annotation_escape, git_blob_sha, jsonc_loads, scan_blob


class RepositorySafetyTests(unittest.TestCase):
    def codes(self, filename, data, fingerprints=None, mode="100644"):
        return {f.code for f in scan_blob(filename, data, fingerprints or set(), mode)}

    def test_real_environment_is_blocked_but_sanitized_templates_are_allowed(self):
        self.assertIn("TRACKED_ENV", self.codes("nested/.env.production", b"PORT=3000"))
        self.assertEqual(self.codes(".env.example", b"API_KEY=replace_me"), set())
        self.assertEqual(self.codes(".env.production.example", b"API_KEY=replace_me"), set())

    def test_json_corruption_that_broke_drive_deploy_is_rejected(self):
        bad = b'{"scripts":{"dev":"vite" "build":"tsc -b"}}'
        self.assertIn("INVALID_PACKAGE_JSON", self.codes("package.json", bad))
        self.assertEqual(self.codes("package.json", b'{"scripts":{"build":"vite build"}}'), set())

    def test_exact_campaign_fingerprint_survives_filename_changes(self):
        data = b"inert fingerprint fixture"
        self.assertIn("KNOWN_CAMPAIGN_BLOB", self.codes("renamed.txt", data, {git_blob_sha(data)}))

    def test_encoded_remote_loader_shape_is_rejected(self):
        data = ("const u=at" + "ob(process.env.AUTH_API_KEY); ev" + "al(u);").encode()
        self.assertIn("ENCODED_REMOTE_LOADER", self.codes("vite.config.ts", data))

    def test_whitespace_hidden_tail_is_rejected(self):
        data = b"export default {};" + b" " * 300 + b"ev" + b"al(hidden);"
        self.assertIn("PADDED_EXECUTABLE_TAIL", self.codes("config.js", data))

    def test_fake_font_is_rejected_and_real_font_header_is_allowed(self):
        fake = ("const f = re" + 'quire("node:child_process");').encode()
        self.assertIn("SCRIPT_DISGUISED_AS_FONT", self.codes("assets/font.woff2", fake))
        self.assertEqual(self.codes("assets/font.woff2", b"wOF2\0\1\2\0"), set())

    def test_editor_task_comments_do_not_hide_automatic_execution(self):
        data = b'{/* note */"tasks":[{"runOptions":{"runOn":"folderOpen"},}],}'
        self.assertIn("FOLDER_OPEN_TASK", self.codes(".vscode/tasks.json", data))
        manual = b'{"tasks":[{"runOptions":{"runOn":"default"}}]}'
        self.assertEqual(self.codes(".vscode/tasks.json", manual), set())

    def test_jsonc_preserves_urls_and_commas_inside_strings(self):
        parsed = jsonc_loads('{"url":"https://example.invalid/a,}",/* c */"v":[1,],}')
        self.assertEqual(parsed["url"], "https://example.invalid/a,}")
        self.assertEqual(parsed["v"], [1])

    def test_private_keys_and_provider_tokens_are_rejected_without_echoing_values(self):
        private = b"-----BEGIN " + b"OPENSSH PRIVATE KEY-----\ninert\n"
        self.assertIn("PRIVATE_KEY", self.codes("notes.txt", private))
        token = ("gh" + "p_" + "A" * 36).encode()
        findings = scan_blob("settings.js", token, set())
        self.assertIn("GITHUB_TOKEN", {f.code for f in findings})
        self.assertNotIn(token.decode(), " ".join(f.message for f in findings))

    def test_batch_concealment_and_init_execution_hooks_are_rejected(self):
        self.assertIn("CONCEALED_BATCH_FILE", self.codes(".gitignore", b"config.bat\n"))
        manifest = json.dumps({"scripts": {"postinstall": "node ./init"}}).encode()
        self.assertIn("INIT_EXECUTION_HOOK", self.codes("package.json", manifest))

    def test_external_symlink_is_rejected_and_internal_link_is_allowed(self):
        self.assertIn("EXTERNAL_SYMLINK", self.codes("docs/link", b"../../outside", mode="120000"))
        self.assertEqual(self.codes("docs/link", b"../README.md", mode="120000"), set())

    def test_annotation_names_cannot_inject_an_extra_workflow_command(self):
        value = annotation_escape("path\n::error::injected,property:value")
        self.assertNotIn("\n", value)
        self.assertNotIn(",", value)
        self.assertNotIn(":", value)


if __name__ == "__main__":
    unittest.main()
