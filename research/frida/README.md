# Frida helpers

These scripts are small research helpers for the exact tested projector build.

They are intentionally kept narrow and readable. Attach them only to a process
that already loads the HiSilicon TV API classes, such as
`com.newlink.nlsource`.

## Read-only helpers

- `pq-state.js` — reads public picture/PQ state
- `trace-game-mode.js` — traces the Game Mode command path
- `cec-inspect.js` — reads proprietary CEC devices and enum constants
- `power-state.js` — reads suspend/wakeup/CEC state and enum mappings

## Mutating helpers

The existing Game Mode helpers intentionally toggle a known picture control.

Power/standby/CEC mutation scripts from the 2026-11-24 investigation are not
published here as reusable helpers. The runtime evidence showed unusual setter
semantics, and a later Frida session disconnected while beginning a TIF CEC
setter probe.

See:

- `docs/power-and-cec.md`
- `research/evidence/power-cec-runtime-20261124.txt`

before doing any power-management experiments.

Do not restart `hwtvmw` as a generic troubleshooting step.
