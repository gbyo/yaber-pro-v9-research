# Importing local Mac research into this repository

The local research directory used during the investigation contains a mixture of:

- your own scripts
- logs and text dumps
- decompiler/disassembly output
- proprietary vendor binaries
- full backups
- device/network identifiers

Do **not** recursively `git add` the entire directory into a public repository.

## Recommended import

From the repository root:

```sh
python3 scripts/sanitize-text-tree.py \
  ~/ProjectorUI/research \
  research/local-sanitized
```

Then inspect what was copied:

```sh
git status --short
grep -RniE \
  '192\.168\.|([0-9a-f]{2}:){5}[0-9a-f]{2}|password|secret|token|private.key|api.key' \
  research/local-sanitized || true
```

Review the diff:

```sh
git diff -- research/local-sanitized
```

If it looks clean:

```sh
git add research/local-sanitized
git commit -m "research: import sanitized local notes and logs"
git push
```

## What the sanitizer intentionally skips

The helper also skips obvious decompiler/OAT-disassembly trees and filenames containing `disasm`, `decompile`, or full-firmware-dump markers. It refuses common binary/private formats including:

```text
.apk .so .odex .vdex .oat .art
.img .bin .zip .xz .gz .7z .tar .tgz
.pem .pk8 .key .p12 .pfx
```

That means it will **not** publish:

- vendor firmware
- OTA packages
- APKs/native libraries
- boot/system images
- private signing material

## Large text outputs

Full decompiler or disassembly output may be legally and practically undesirable in a public repository even if it contains no private information.

Prefer:

- symbol lists
- short relevant excerpts
- hashes
- scripts that reproduce the extraction from a legally obtained local firmware copy
- your own analysis

rather than committing massive reconstructed vendor code.

## If you really want to preserve everything locally

Keep an untracked private archive next to the repository, for example:

```sh
mkdir -p ../yaber-pro-v9-private
```

Store firmware, binaries, device backups, and raw dumps there.

The public repo should document how to reproduce findings without redistributing the proprietary blobs.
