# Replacement UI plan

## Goal

Replace the sluggish/custom launcher and source-selection experience while preserving the projector's proprietary HDMI, audio, CEC, focus, keystone, TV-input, and PQ stack.

## Proposed architecture

```text
Projector UI
Kotlin + classic Android Views/XML
        |
HiSilicon tvapi Java API
        |
HiSilicon TV middleware + Newlink services/HALs
```

A native/Rust bridge is not currently necessary for the primary control surface because useful high-level Java APIs have already been recovered.

## Why classic Android Views

The tested device has:

- 1 GB RAM
- 32-bit ARM
- Android 9
- Mali-450 / OpenGL ES 2.0
- low-RAM configuration

For this hardware, a compact classic-Views application is a better fit than a heavy web shell, Flutter app, or modern Compose-heavy stack.

## UX goals

- single main Activity
- D-pad-first navigation
- fixed home layout rather than large dynamic lists
- minimal overdraw
- opaque/static backgrounds
- no blur
- no large continuously animated images
- short focus transitions (~100–130 ms)
- avoid layout-triggering animations
- pre-sized/pre-decoded graphics
- lazy-load Settings/Diagnostics
- asynchronous source switching

## Suggested home destinations

- HDMI 1
- HDMI 2
- Cast / wireless display
- Apps
- Focus
- Keystone
- Picture
- Settings
- Diagnostics

Game Mode should be exposed as a first-class control. Since runtime behavior is now established, a label such as `Game / Low Latency` is reasonable, with explanatory text that it enables the HiSilicon VPSS-bypass path when supported.

## Diagnostics page

Useful diagnostics:

- active source
- HDMI signal state
- timing/resolution/frame rate
- SDR/HDR status
- audio format/rate/channels
- Game Mode / VPSS bypass state
- focus distance
- keystone geometry
- network state
- service health
- temperature if available
- link back to stock source UI
- safe recovery/restart actions

## Performance targets

Reasonable goals:

- maintain <16.7 ms UI frame time
- remote-to-focus response within one display frame where possible
- warm HOME appearance under ~100 ms perceived
- cold start under ~500 ms
- RSS under ~30 MB
- near-zero idle CPU
- no unnecessary wakeups

## Deployment strategy

1. Install alongside the stock UI.
2. Keep an explicit `Stock UI` escape action.
3. Do not disable Newlink provisioning.
4. Do not replace the default launcher until the custom shell has been tested extensively.
5. Keep an ADB recovery command documented.
6. Only after stability testing, consider making the custom shell the default HOME handler.


## CEC integration guidance

The replacement UI should use the proprietary HiSilicon CEC layer exposed by `HitvManager.getHdmiCEC()`.

Useful proven capabilities include:

- CEC device discovery
- OSD-name retrieval
- logical-address retrieval
- vendor/source-port metadata
- device selection API
- UI/menu command API
- vendor CEC option API

The tested stack discovered an attached Apple TV by name.

Do not enable Android framework `HdmiControlService` as part of the replacement shell. On the tested firmware it failed to allocate a local TV logical address while the proprietary middleware was already acting as the TV.

## HDMI identity model

Do not hardcode a single numbering scheme for HDMI.

Keep separate concepts for:

- user-facing product label
- Android TV-input ID
- TIF physical port
- HiSilicon source ID
- CEC physical address
- discovered CEC device

For example, one observed path involved `HDMI0000C3`, TIF port 3, HiSilicon source 11 / HDMI3, CEC path `0x3000`, while Newlink stored the product-facing property `zysys.source.hdmi1`.

The UI should resolve these relationships dynamically.

## Power integration guidance

Early replacement builds should leave the stock power services and power-button path intact.

Current tested state:

```text
persist.sys.suspend.mode=shutdown
AP standby=false
system WAKEUP_HDMI=true
system WAKEUP_CEC=false
TIF CEC WAKEUP=true
```

Do not expose `str`, `lightsleep`, `lowpower`, AP standby, or system wake-source mutation as normal user settings yet.

The vendor framework clearly contains those features, but their safe behavior on this exact projector has not been established.

Read-only diagnostics may display:

- current suspend mode
- AP-standby state
- wake-source mask
- TIF CEC option state
- discovered CEC devices

See `docs/power-and-cec.md`.
