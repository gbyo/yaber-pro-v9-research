# Finalizing local-only evidence

Most public-safe research material is already in the repository. A few items
can only be produced from the private local Mac research tree because the
public repository intentionally does not contain the proprietary binaries.

## One-command helper

From the repository root:

```sh
./scripts/finalize-local-evidence.sh ~/ProjectorUI/research
```

This generates SHA-256 fingerprints for matching local APK/native/OAT/VDEX
research inputs without copying those proprietary files into the repository.

To also capture a fresh system snapshot:

```sh
./scripts/finalize-local-evidence.sh   ~/ProjectorUI/research   <adb-serial>
```

The second form captures:

- `getprop`
- package paths
- registered shared libraries
- `dumpsys display`
- `dumpsys tv_input`

and passes the text through the repository sanitizer before placing it under
`research/local-sanitized/system-snapshot/`.

## Review

Before committing:

```sh
git status --short

grep -RniE   '192\.168\.|([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}|password|passwd|secret|token|api[_-]?key|private[_-]?key'   research || true
```

Then inspect the actual diff:

```sh
git diff
git diff --cached
```

## Original vendor-api-hits.txt

The original local `vendor-api-hits.txt` was flagged by the automatic
sanitizer and should not be force-added without manual inspection.

The useful known public-safe contents have already been reconstructed in:

```text
research/symbols/vendor-api-hits-curated.txt
```

If manual review finds additional harmless API names or strings, add those
specific findings to the curated file rather than publishing the original
file blindly.
