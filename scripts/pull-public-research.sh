#!/bin/sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "usage: $0 <adb-serial>"
  exit 2
fi

D="$1"
OUT="${2:-./device-research}"

mkdir -p "$OUT"

adb -s "$D" shell getprop > "$OUT/getprop.txt"
adb -s "$D" shell pm list packages -f > "$OUT/packages.txt"
adb -s "$D" shell pm list libraries > "$OUT/libraries.txt"
adb -s "$D" shell dumpsys display > "$OUT/dumpsys-display.txt"
adb -s "$D" shell dumpsys tv_input > "$OUT/dumpsys-tv-input.txt"
adb -s "$D" shell dumpsys package com.newlink.nlsource > "$OUT/nlsource-package.txt"
adb -s "$D" shell dumpsys package com.newlink.hisilauncher > "$OUT/launcher-package.txt"
adb -s "$D" shell dumpsys package com.hisilicon.tvinput.external > "$OUT/tvinput-package.txt"

echo "Review and sanitize $OUT before committing."
echo "Do not commit IP/MAC/serial/token/private-key data."
