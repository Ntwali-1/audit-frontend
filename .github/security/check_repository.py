"""Inspect tracked Git blobs as data. Never import or execute repository code."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path, PurePosixPath

MAX_BLOB_BYTES = 8 * 1024 * 1024
LARGE_BINARY_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".glb"}
FONT_SUFFIXES = {".woff", ".woff2", ".ttf", ".eot", ".orc"}
SOURCE_SUFFIXES = {".js", ".cjs", ".mjs", ".jsx", ".ts", ".tsx", ".py"}
SECRET_PATTERNS = (
    (
        "PRIVATE_KEY",
        re.compile(r"-----BEGIN (?:OPENSSH |RSA |EC |DSA |ENCRYPTED )?PRIVATE KEY-----"),
    ),
    ("GITHUB_TOKEN", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{36,}\b")),
    ("GITHUB_FINE_GRAINED_TOKEN", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{50,}\b")),
    ("AWS_ACCESS_KEY_ID", re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b")),
    ("GOOGLE_API_KEY", re.compile(r"\bAIza[A-Za-z0-9_-]{35}\b")),
    ("OPENAI_STYLE_KEY", re.compile(r"\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b")),
)


@dataclass(frozen=True)
class Finding:
    path: str
    code: str
    message: str
    line: int = 1


def git_blob_sha(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode()
    return hashlib.sha1(header + data).hexdigest()


def jsonc_loads(text: str) -> object:
    """Strip JSONC comments/trailing commas while preserving strings and URLs."""
    output = []
    quoted = False
    escaped = False
    index = 0
    while index < len(text):
        char = text[index]
        if quoted:
            output.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                quoted = False
            index += 1
            continue
        if char == '"':
            quoted = True
        elif text[index:index + 2] == "//":
            end = text.find("\n", index)
            index = len(text) if end == -1 else end
            continue
        elif text[index:index + 2] == "/*":
            end = text.find("*/", index + 2)
            if end == -1:
                raise ValueError("Unclosed JSONC comment")
            output.append(" " * (end + 2 - index))
            index = end + 2
            continue
        output.append(char)
        index += 1
    cleaned = "".join(output)
    output = []
    quoted = False
    escaped = False
    for index, char in enumerate(cleaned):
        if quoted:
            output.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                quoted = False
            continue
        if char == '"':
            quoted = True
        if char == ",":
            after = cleaned[index + 1:].lstrip()
            if after.startswith(("}", "]")):
                continue
        output.append(char)
    return json.loads("".join(output))


def scan_blob(
    filename: str,
    data: bytes,
    fingerprints: set[str],
    mode: str = "100644",
) -> list[Finding]:
    findings = []
    name = PurePosixPath(filename).name.lower()
    suffix = PurePosixPath(filename).suffix.lower()

    def add(code: str, message: str, offset: int = 0) -> None:
        line = data[:offset].count(b"\n") + 1
        findings.append(Finding(filename, code, message, line))

    if git_blob_sha(data) in fingerprints:
        add("KNOWN_CAMPAIGN_BLOB", "Matches a confirmed original campaign file fingerprint.")
    if name == ".env" or (
        name.startswith(".env.") and not name.endswith((".example", ".sample", ".template"))
    ):
        add("TRACKED_ENV", "Keep real environment files out of Git; use a sanitized example.")
    if name == "config.bat":
        add("CAMPAIGN_BATCH_FILE", "This campaign-associated filename requires security review.")
    if mode == "120000":
        target = data.decode("utf-8", errors="replace").replace("\\", "/")
        depth = len(PurePosixPath(filename).parent.parts)
        escapes = target.startswith("/") or bool(re.match(r"^[A-Za-z]:", target))
        for part in PurePosixPath(target).parts:
            if part == "..":
                depth -= 1
                escapes = escapes or depth < 0
            elif part != ".":
                depth += 1
        if escapes:
            add("EXTERNAL_SYMLINK", "Tracked symlink points outside the repository.")
        return findings
    if data.startswith(b"\xff\xfe"):
        text = data[2:].decode("utf-16le", errors="replace")
    elif b"\0" in data:
        return findings
    else:
        text = data.decode("utf-8", errors="replace")
    for code, pattern in SECRET_PATTERNS:
        match = pattern.search(text)
        if match:
            add(code, "Possible credential material; remove it and review rotation.")
    if name == ".gitignore" and re.search(r"^\s*/?config\.bat\s*$", text, re.I | re.M):
        add("CONCEALED_BATCH_FILE", "Remove the campaign-associated batch-file concealment rule.")
    if name in {"package.json", "package-lock.json"}:
        try:
            package = json.loads(text)
        except (ValueError, TypeError):
            add("INVALID_PACKAGE_JSON", "Package manifest/lockfile must be valid JSON.")
        else:
            if name == "package.json" and isinstance(package, dict):
                scripts = package.get("scripts", {})
                if not isinstance(scripts, dict):
                    add("INVALID_PACKAGE_JSON", "Package scripts must be an object.")
                    scripts = {}
                for command in scripts.values():
                    if isinstance(command, str) and re.search(
                        r"\bnode\s+(?:\./)?(?:[^\s]+/)?init\b", command
                    ):
                        add("INIT_EXECUTION_HOOK", "Review initialization execution hook.")
    lower_path = filename.lower()
    if "/.vscode/" in "/" + lower_path and name in {"tasks.json", "settings.json"}:
        try:
            config = jsonc_loads(text)
        except (ValueError, TypeError):
            add("INVALID_EDITOR_JSON", "Editor execution settings must be reviewable JSON/JSONC.")
        else:
            if isinstance(config, dict):
                automatic = config.get("task.allowAutomaticTasks")
                if automatic is True or automatic == "on":
                    add("AUTOMATIC_EDITOR_TASKS", "Automatic editor tasks are disabled by policy.")
                tasks = config.get("tasks", [])
                if not isinstance(tasks, list):
                    add("INVALID_EDITOR_JSON", "Editor tasks must be an array.")
                    tasks = []
                for task in tasks:
                    options = task.get("runOptions", {}) if isinstance(task, dict) else {}
                    if isinstance(options, dict) and options.get("runOn") == "folderOpen":
                        add("FOLDER_OPEN_TASK", "Do not execute commands on folder open.")
    if suffix in SOURCE_SUFFIXES or suffix in FONT_SUFFIXES or name == "init":
        if (
            "AUTH_API_KEY" in text
            and re.search(r"\batob\s*\(", text)
            and re.search(r"\beval\s*\(", text)
        ):
            add("ENCODED_REMOTE_LOADER", "Encoded authentication variable is used for evaluation.")
        if re.search(r"eth_call|\beth\.call\s*\(", text) and re.search(
            r"subprocess\.(?:run|Popen)\s*\(\s*\[\s*['\"](?:node|nodejs)['\"]", text
        ):
            add("ETHEREUM_NODE_LOADER", "Blockchain RPC is paired with launching a Node payload.")
        for padded in re.finditer(r"[ \t]{200,}(\S[^\r\n]*)", text):
            if re.search(
                r"\beval\s*\(|child_process|fromCharCode|Buffer\.from|\bFunction\s*\(",
                padded.group(1),
            ):
                add("PADDED_EXECUTABLE_TAIL", "Executable code hidden after a long whitespace run.")
                break
    if suffix in FONT_SUFFIXES and re.match(
        r"\s*(?:const |let |var |function |import |\(\s*(?:async\s*)?\(?\s*\)?\s*=>)", text
    ) and re.search(r"require\s*\(|\beval\s*\(|child_process|Buffer\.from|https?://", text):
        add("SCRIPT_DISGUISED_AS_FONT", "Font-like file contains script loader syntax.")
    return findings


def git_command(repository: Path, args: list[str], data: bytes | None = None) -> bytes:
    env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
    env.update({"GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull})
    command = [
        "git", "--no-optional-locks", "-c", "core.fsmonitor=false", "-c",
        f"core.hooksPath={os.devnull}", "-C", str(repository), *args,
    ]
    completed = subprocess.run(command, input=data, capture_output=True, check=True, env=env)
    return completed.stdout


def scan_repository(
    repository: Path, fingerprints: set[str], revision: str | None = None
) -> tuple[list[Finding], int]:
    if revision is not None and not re.fullmatch(r"[0-9a-f]{40,64}", revision):
        raise ValueError("Revision must be a full commit SHA")
    index = git_command(
        repository,
        ["ls-tree", "-r", "-z", revision] if revision else ["ls-files", "--stage", "-z"],
    )
    entries = []
    findings = []
    for record in index.split(b"\0"):
        if not record:
            continue
        metadata, raw_path = record.split(b"\t", 1)
        if revision:
            mode, _kind, oid = metadata.decode("ascii").split()
            stage = "0"
        else:
            mode, oid, stage = metadata.decode("ascii").split()
        filename = raw_path.decode("utf-8", errors="replace")
        if stage != "0":
            findings.append(Finding(filename, "UNMERGED_INDEX", "Resolve index conflicts first."))
        elif mode == "160000":
            findings.append(Finding(filename, "UNINSPECTED_SUBMODULE", "Review this submodule."))
        else:
            entries.append((filename, mode, oid))
    objects = list(dict.fromkeys(oid for _, _, oid in entries))
    if not objects:
        return findings, 0
    query = ("\n".join(objects) + "\n").encode()
    sizes = {}
    for line in git_command(repository, ["cat-file", "--batch-check"], query).splitlines():
        oid, kind, length = line.decode("ascii").split()
        if kind != "blob":
            raise ValueError("Expected a Git blob")
        sizes[oid] = int(length)
    readable = [oid for oid in objects if sizes[oid] <= MAX_BLOB_BYTES]
    content = {}
    if readable:
        batch_query = ("\n".join(readable) + "\n").encode()
        raw = git_command(repository, ["cat-file", "--batch"], batch_query)
        cursor = 0
        for _ in readable:
            end = raw.index(b"\n", cursor)
            oid, kind, length = raw[cursor:end].decode("ascii").split()
            if kind != "blob":
                raise ValueError("Expected blob content")
            cursor = end + 1
            count = int(length)
            content[oid] = raw[cursor:cursor + count]
            cursor += count + 1
    for filename, mode, oid in entries:
        if oid not in content:
            if PurePosixPath(filename).suffix.lower() not in LARGE_BINARY_SUFFIXES:
                findings.append(Finding(filename, "SCAN_LIMIT", "Source exceeds 8 MiB limit."))
            continue
        findings.extend(scan_blob(filename, content[oid], fingerprints, mode))
    return findings, len(entries)


def annotation_escape(value: str) -> str:
    return value.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A").replace(
        ",", "%2C"
    ).replace(":", "%3A")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repository", type=Path, default=Path.cwd())
    parser.add_argument("--revision", help="Scan a full commit SHA instead of the staged index")
    args = parser.parse_args()
    policy = Path(__file__).with_name("campaign-fingerprints.json")
    try:
        fingerprints = set(json.loads(policy.read_text(encoding="utf-8"))["git_blob_sha1"])
        findings, checked = scan_repository(args.repository.resolve(), fingerprints, args.revision)
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError):
        print("Repository safety could not inspect all required Git data.", file=sys.stderr)
        return 2
    for finding in findings[:100]:
        message = f"{finding.code}: {finding.message}"
        if os.environ.get("GITHUB_ACTIONS") == "true":
            print(f"::error file={annotation_escape(finding.path)},line={finding.line}::{message}")
        else:
            print(f"{finding.path}:{finding.line}: {message}")
    print(f"Repository safety: {checked} tracked entries; {len(findings)} finding(s).")
    print("Checks cover known campaign patterns and common credential formats, not all malware.")
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
