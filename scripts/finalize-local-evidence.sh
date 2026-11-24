#!/bin/bash
set -euo pipefail

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "usage: $0 /path/to/ProjectorUI/research [adb-serial]"
  exit 2
fi

LOCAL_RESEARCH="$1"
ADB_SERIAL="${2:-}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$REPO_ROOT/research/manifests"
mkdir -p "$REPO_ROOT/research/local-sanitized/system-snapshot"

echo "== Hashing local research inputs =="

find "$LOCAL_RESEARCH" -type f \(   -name 'libhitvservice.so' -o   -name 'libhitvclient.so' -o   -name 'libhitvsupport.so' -o   -name 'vendor.hisilicon.hardware.hwtvmw@1.0-impl.so' -o   -name 'RGTPLauncher.apk' -o   -name 'NLSourcePlayer.apk' -o   -name 'NLProvision.apk' -o   -name 'HiTvService.apk' -o   -name 'HiExternalTvInput.apk' -o   -name 'HitvShare.odex' -o   -name 'HitvShare.vdex' -o   -name 'HitvManager.odex' -o   -name 'HitvManager.vdex' -o   -name 'NLSourcePlayer.odex' -o   -name 'NLSourcePlayer.vdex' \) -print0 |
while IFS= read -r -d '' f; do
  shasum -a 256 "$f"
done | sort > "$REPO_ROOT/research/manifests/local-SHA256SUMS.txt"

echo "Wrote research/manifests/local-SHA256SUMS.txt"

if [ -n "$ADB_SERIAL" ]; then
  echo "== Capturing fresh public system snapshot =="

  adb -s "$ADB_SERIAL" shell getprop > "$TMP/getprop.txt"
  adb -s "$ADB_SERIAL" shell pm list packages -f > "$TMP/packages.txt"
  adb -s "$ADB_SERIAL" shell pm list libraries > "$TMP/libraries.txt"
  adb -s "$ADB_SERIAL" shell dumpsys display > "$TMP/dumpsys-display.txt"
  adb -s "$ADB_SERIAL" shell dumpsys tv_input > "$TMP/dumpsys-tv-input.txt"

  python3 "$REPO_ROOT/scripts/sanitize-text-tree.py"     "$TMP"     "$REPO_ROOT/research/local-sanitized/system-snapshot"
else
  echo "No adb serial supplied; skipped fresh device snapshot."
fi

echo
echo "== Review before commit =="
git -C "$REPO_ROOT" status --short
echo
echo "Run this before committing:"
echo "grep -RniE '192\\.168\\.|([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}|password|passwd|secret|token|api[_-]?key|private[_-]?key' '$REPO_ROOT/research' || true"
echo
echo "The original vendor-api-hits.txt still requires manual review."
