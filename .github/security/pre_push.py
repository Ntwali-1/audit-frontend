"""Optional local pre-push checks. Editable hooks are not server enforcement."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

POLICY = Path(__file__).resolve().parent
sys.path.insert(0, str(POLICY))


def main() -> int:
    from check_repository import git_command, scan_repository

    repository = POLICY.parent.parent
    policy = json.loads((POLICY / "campaign-fingerprints.json").read_text())
    fingerprints = set(policy["git_blob_sha1"])
    revisions = set()
    for line in sys.stdin:
        fields = line.split()
        if len(fields) != 4:
            print("Cannot inspect pre-push input.", file=sys.stderr)
            return 2
        _local_ref, local_sha, _remote_ref, remote_sha = fields
        if set(local_sha) == {"0"}:
            continue
        if set(remote_sha) != {"0"}:
            try:
                git_command(repository, ["cat-file", "-e", remote_sha + "^{commit}"])
                git_command(repository, ["merge-base", "--is-ancestor", remote_sha, local_sha])
            except subprocess.CalledProcessError:
                print("Push blocked: fetch and review first; force updates are refused.")
                return 1
            arguments = ["rev-list", local_sha, "^" + remote_sha]
        else:
            arguments = ["rev-list", local_sha, "--not", "--remotes"]
        revisions.update(git_command(repository, arguments).decode("ascii").split())
        revisions.add(local_sha)
    if len(revisions) > 200:
        print("Push blocked: over 200 outgoing commits. Push reviewed history in smaller batches.")
        return 1
    for revision in sorted(revisions):
        findings, checked = scan_repository(repository, fingerprints, revision)
        if findings:
            for finding in findings[:50]:
                print(f"{revision[:12]} {finding.path}: {finding.code}: {finding.message}")
            print("Push blocked by repository safety.")
            return 1
        print(f"Repository safety: {revision[:12]} checked {checked} tracked entries.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError):
        print("Pre-push inspection failed; no push was approved.", file=sys.stderr)
        raise SystemExit(2) from None
