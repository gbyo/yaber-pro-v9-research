# Yaber Pro V9 reverse-engineering notes

Public-safe research notes for the Yaber Pro V9 projector platform, focused on its Android/HiSilicon/Newlink software stack, HDMI pipeline, hidden picture controls, and the feasibility of a replacement UI.

This repository intentionally contains **facts, scripts, command recipes, and small research excerpts only**. It does **not** include firmware images, OTA packages, vendor APKs, native libraries, full device backups, private keys, device identifiers, or private LAN information.

## What has been established

- The projector runs Android 9 on a HiSilicon `bigfish` platform.
- The unit studied reports Newlink/Yaber firmware `RG_5H045_886_DC`, version `V1.0.1.0`.
- ADB-over-TCP is enabled and the build is a permissive `userdebug` build.
- The Android UI is genuinely 1920×1080 at ~60 Hz.
- The projector uses HiSilicon TV middleware and Newlink apps rather than a conventional Android TV launcher architecture.
- The stock source app can call hidden HiSilicon APIs through `com.hisilicon.android.tvapi`.
- `Picture.enableGameMode(boolean)` is a real hidden vendor control.
- Game Mode command IDs are:
  - `0x1030` / decimal `4144`: set Game Mode
  - `0x1031` / decimal `4145`: get Game Mode
- On a live 1920×1080 60 Hz progressive HDMI signal:
  - Game Mode OFF recreates VI with `bBypassVpss=0`, `bGraphicMode=0`, `bInterlace=0`
  - Game Mode ON recreates VI with `bBypassVpss=1`, `bGraphicMode=0`, `bInterlace=0`
- Therefore, on this signal, the hidden Game Mode **enables VPSS bypass** and restarts the video input path.
- The normal stored PQ getters (picture mode, MEMC level, NR, sharpness, SR, DCI, etc.) do not change when Game Mode toggles.
- The firmware also contains a `globalconfig:ViLowLatencyMode` key, although the HDMI `ConfigBypassVpss()` routine examined separately parses `globalconfig:UHDVideoMode`, not that low-latency key.
- The stock launcher/source APKs are signed with the public AOSP platform test certificate, making a carefully designed platform-signed replacement shell plausible on this unit.
- The working HDMI-CEC implementation is the proprietary HiSilicon middleware, not Android's framework `HdmiControlService` on this build.
- The HiSilicon CEC API discovers the attached Apple TV by OSD name and logical address.
- The vendor framework exposes CEC wake/standby options, HDMI/CEC/Ethernet wake-source enums, AP standby, and `shutdown` / `str` / `lightsleep` / `lowpower` suspend modes.
- The tested Yaber configuration currently uses `persist.sys.suspend.mode=shutdown`; an Apple TV wake test did not power the projector back on.
- `WAKEUP_HDMI` is enabled in the current power-source mask, while system-level `WAKEUP_CEC` is not; the TIF CEC layer independently reports CEC wake enabled.

## Repository map

- `docs/hardware.md` — hardware and display facts
- `docs/firmware.md` — firmware/build properties
- `docs/architecture.md` — Android/Newlink/HiSilicon process and package architecture
- `docs/hdmi.md` — HDMI source and TV-input behavior
- `docs/power-and-cec.md` — power modes, wake sources, proprietary CEC, and Apple TV wake investigation
- `docs/game-mode.md` — hidden Game Mode investigation and conclusions
- `docs/api.md` — recovered HiSilicon Java/native API surface
- `docs/ota.md` — OTA findings and checksum warning
- `docs/replacement-ui.md` — replacement UI plan
- `docs/security-and-recovery.md` — safety boundaries and recovery notes
- `docs/research-method.md` — tooling and repeatable methodology
- `docs/known-unknowns.md` — remaining questions
- `docs/network-and-debug.md` — network/debug surface without private addressing
- `docs/app-and-file-inventory.md` — package/APK/OAT inventory
- `docs/processes.md` — important process/service snapshot
- `docs/focus-and-keystone.md` — projector-specific controls
- `docs/native-video-details.md` — native symbols and video/PQ details
- `docs/backup.md` — what was backed up locally and why it stays private
- `research/frida/` — small Frida scripts
- `scripts/` — helper scripts for pulling public-safe research artifacts
- `LOCAL_IMPORT.md` — how to import local Mac research safely

## Scope and caution

These notes describe one tested Yaber Pro V9 firmware/hardware combination. Do not assume another projector with a similar UI, model number, or `NL5H00X` base is bit-for-bit identical.

Avoid flashing firmware or modifying partitions based only on these notes.

## Related public research

These projects are related to the broader Newlink/HiSilicon projector family, but are **not** confirmed exact matches for this hardware:

- `kolezka/NL5H00X`
- `Vibhav-Aggarwal/hi3751v350-projector`
- `axelp/ImperfectProjector`



## Evidence and reproducibility

The repository now includes public-safe runtime evidence, curated API/symbol
inventories, compatibility notes, and scripts for reproducing the native
Game Mode investigation from a locally obtained firmware copy.

Key additions:

- `docs/evidence.md` — finding-to-evidence map
- `docs/compatibility.md` — exact tested build and offset caveats
- `docs/performance-baseline.md` — stock launcher performance sample
- `research/evidence/game-mode-vpss-1080p60.log` — direct VPSS-bypass proof
- `research/evidence/java-game-mode-command-trace.log` — `0x1030`/`0x1031` trace
- `research/evidence/game-mode-pq-state.txt` — unchanged public PQ getters
- `research/symbols/` — curated Java/native API and symbol inventories
- `research/manifests/binary-fingerprints.md` — binary identity guidance
- `scripts/extract-game-mode-research.sh` — reproduce targeted disassembly
- `scripts/hash-research-inputs.sh` — generate local SHA-256 fingerprints

The original local `vendor-api-hits.txt` was not force-published after the
sanitizer flagged it for manual review. Its useful public-safe findings are
captured in `research/symbols/vendor-api-hits-curated.txt`.

Exact SHA-256 hashes for proprietary local binaries are intentionally left
for a follow-up local commit rather than guessed. The binaries themselves
should remain outside the public repository.

## Licensing

Original project documentation, scripts, and analysis are MIT licensed.
See `NOTICE.md` for the treatment of vendor names, strings, symbols, log
excerpts, and small reverse-engineering excerpts.
