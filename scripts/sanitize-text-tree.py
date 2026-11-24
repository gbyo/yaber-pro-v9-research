#!/usr/bin/env python3
import argparse
import pathlib
import re
import shutil

TEXT_EXTS = {
    ".txt", ".md", ".js", ".sh", ".py", ".xml", ".json",
    ".yaml", ".yml", ".log", ".csv"
}

SKIP_NAMES = {
    ".git", ".DS_Store", "__pycache__", ".frida", "private",
    "backup", "backups", "decompiled", "oatdumps"
}

SKIP_FILE_PATTERNS = (
    "disasm",
    "decompile",
    "full-dump",
    "firmware-dump",
)

BINARY_EXTS = {
    ".apk", ".so", ".odex", ".vdex", ".oat", ".art", ".img",
    ".bin", ".zip", ".xz", ".gz", ".7z", ".tar", ".tgz",
    ".pem", ".pk8", ".key", ".p12", ".pfx"
}

REPLACEMENTS = [
    (re.compile(r"/Users/[^/\s]+"), "~"),
    (re.compile(r"\b(?:10|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.(?:\d{1,3}\.)\d{1,3}\b"), "<PRIVATE_IP>"),
    (re.compile(r"\b(?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}\b"), "<PRIVATE_MAC>"),
]

SUSPICIOUS = re.compile(
    r"(password|passwd|secret|token|api[_-]?key|private[_-]?key|"
    r"authorization:\s*bearer|cookie:)",
    re.I,
)

def sanitize_text(s):
    for pattern, replacement in REPLACEMENTS:
        s = pattern.sub(replacement, s)
    return s

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("destination")
    args = ap.parse_args()

    src = pathlib.Path(args.source).expanduser().resolve()
    dst = pathlib.Path(args.destination).expanduser().resolve()
    dst.mkdir(parents=True, exist_ok=True)

    copied = 0
    skipped = 0
    flagged = []

    for p in src.rglob("*"):
        rel = p.relative_to(src)

        if any(part in SKIP_NAMES for part in rel.parts):
            continue

        if not p.is_file():
            continue

        if any(token in p.name.lower() for token in SKIP_FILE_PATTERNS):
            skipped += 1
            continue

        if p.suffix.lower() in BINARY_EXTS:
            skipped += 1
            continue

        if p.suffix.lower() not in TEXT_EXTS:
            skipped += 1
            continue

        try:
            raw = p.read_text(errors="replace")
        except Exception:
            skipped += 1
            continue

        cleaned = sanitize_text(raw)

        if SUSPICIOUS.search(cleaned):
            flagged.append(str(rel))
            continue

        out = dst / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(cleaned)
        copied += 1

    print(f"copied:  {copied}")
    print(f"skipped: {skipped}")

    if flagged:
        print("\nNOT COPIED because they may contain secrets:")
        for name in flagged:
            print("  " + name)
        print("\nReview those manually before adding them.")

if __name__ == "__main__":
    main()
