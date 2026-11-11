# Repository safeguards

Credential rotation is a separate recovery step and is still needed. These checks reduce risk; they do not certify a machine, deployment, dependency or repository as malware-free.

## Checks

- Repository safety reads Git blobs as data: exact campaign fingerprints, several known loader shapes, tracked real environment files, common provider token/private key formats, malformed package JSON, automatic editor execution, escaping symlinks and unreviewed submodules.
- Code quality runs the project checks on an ephemeral GitHub-hosted runner after repository safety succeeds. No production credentials are supplied by this workflow.
- Actions and the scanner policy checkout use reviewed commit SHAs. A policy change requires a reviewed new policy commit and an explicit workflow pin update.
- Both checks run on pushes and pull requests without path filters. There is no skip-on-error fallback.

## Server enforcement

Actions start after a push and cannot reject an incoming Git push or intercept a local git pull. Enable repository branch rules separately after the first successful check run.

The prepared all-branch rule blocks non-fast-forward updates without bypass actors. The default-branch rule blocks deletion and requires a pull request, resolved review threads, an up-to-date base, and the Repository safety and Code quality checks from GitHub Actions.

GitHub currently requires Pro (personal repositories) or an eligible organization plan for private-repository rulesets. Keep private repositories private. Workflow presence alone does not mean force pushes are blocked.

The solo ruleset has zero mandatory approvals so a sole owner can merge. A trusted second reviewer is needed before enabling required approval or code-owner approval. A writer who can change workflows can potentially weaken or imitate checks; independent review of security files and removal of exposed access remain essential.

## Optional checks before a local push

After reviewing this hook and preserving any existing local hook configuration, enable it in this clone:

```sh
git config --local core.hooksPath .githooks
```

Python 3.11+ and Git must be available. The hook checks each outgoing commit (up to 200), rejects known non-fast-forward updates and fails if the remote commit is unavailable. Fetch and review before retrying. It never downloads or executes payloads.

Local hooks are editable, can be bypassed and do not automatically activate in existing clones. They supplement server rules. To restore an existing hook setup, restore the saved core.hooksPath value.

## Reviewing a finding

Findings show category and file path, not secret values. Do not bypass a finding by disabling this workflow. Inspect the source as text, quarantine suspect artifacts outside the working tree, remove leaked values and rotate them at their provider from a trusted device. Sanitized .env.example, .env.sample and .env.template files may be committed; real .env variants must remain ignored.

Never rerun a historical compromised workflow revision. Test the current reviewed revision instead.
