#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "usage: $0 /path/to/research-tree"
  exit 2
fi

ROOT="$1"

find "$ROOT" -type f \(   -name '*.so' -o   -name '*.apk' -o   -name '*.odex' -o   -name '*.vdex' -o   -name '*.oat' -o   -name '*.jar' \) -print0 |
while IFS= read -r -d '' f; do
  shasum -a 256 "$f"
done
