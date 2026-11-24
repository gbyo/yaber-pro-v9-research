#!/bin/sh
set -eu

if [ "$#" -ne 2 ]; then
  echo "usage: $0 /path/to/libhitvservice.so output-dir"
  exit 2
fi

LIB="$1"
OUT="$2"
BINUTILS="${BINUTILS:-$(brew --prefix binutils 2>/dev/null)/bin}"

mkdir -p "$OUT"

if [ ! -f "$LIB" ]; then
  echo "missing input: $LIB"
  exit 1
fi

SHA256=$(shasum -a 256 "$LIB" | awk '{print $1}')
SIZE=$(wc -c < "$LIB" | tr -d ' ')

printf '%s  %s\n' "$SHA256" "$(basename "$LIB")" > "$OUT/SHA256SUMS"
printf 'size_bytes=%s\n' "$SIZE" > "$OUT/binary-info.txt"

"$BINUTILS/greadelf" -Ws "$LIB" |
  "$BINUTILS/gc++filt" |
  grep -Ei 'GameMode|BypassVpss|VideoDelay|Memc|GraphicMode|Interlace'   > "$OUT/relevant-symbols.txt" || true

strings -a "$LIB" |
  grep -Ei 'game.?mode|ViLowLatencyMode|UHDVideoMode|bBypassVpss|bGraphicMode|bInterlace|QueryVideoDelay|SetChnDelay|Memc'   > "$OUT/relevant-strings.txt" || true

"$BINUTILS/gobjdump" -d -C   --start-address=0x143e40   --stop-address=0x144380   "$LIB" > "$OUT/hi-picture-game-mode.txt"

"$BINUTILS/gobjdump" -d -C   --start-address=0x16ee24   --stop-address=0x16f084   "$LIB" > "$OUT/hi-video-game-mode.txt"

"$BINUTILS/gobjdump" -d -C   --start-address=0x0f9f24   --stop-address=0x0fa094   "$LIB" > "$OUT/hdmi-bypass-vpss.txt"

echo "Wrote reproducibility artifacts to $OUT"
echo "Verify the SHA-256 before comparing build-specific offsets."
