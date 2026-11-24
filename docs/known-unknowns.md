# Known unknowns and next investigations

## Game Mode / latency

Known:

- Game Mode is real
- Game Mode uses command `0x1030`
- getter uses `0x1031`
- on 1080p60 progressive HDMI it enables `bBypassVpss`
- it restarts the video input path

Still unknown:

- exact end-to-end latency reduction in milliseconds
- whether `HI_UNF_VO_QueryVideoDelay` reports a useful comparable delay
- role of `globalconfig:ViLowLatencyMode`
- behavior at 24/25/30/50 Hz
- behavior at 4K timings
- behavior with interlaced sources
- behavior with HDR
- whether bypass affects specific PQ features internally despite stored getter values remaining unchanged
- persistence across reboot and source switching

## `com.zhiying.sourceui`

A process/package named `com.zhiying.sourceui` was observed. Its exact responsibilities should be mapped.

## Picture mode enums

Integer values for:

- picture mode
- PC mode
- MEMC level
- NR level
- SR level

should be mapped from the actual vendor enums before any settings UI writes arbitrary integers.

## Focus / keystone

Recovered APIs strongly suggest full focus/keystone control is possible, but argument semantics and valid ranges need documentation.

## HDMI / EDID

Potential future work:

- EDID mode mapping
- HDMI color-range behavior
- source-specific EDID settings
- 4K compatibility limits
- HDR handling

## Replacement UI

Before making a custom launcher default:

- prove platform-test-key privilege behavior with a minimal app
- test source switching
- test power/resume
- test CEC
- test focus/keystone
- test settings persistence
- test safe return to stock UI


## Power / standby / CEC

Known:

- Android framework `HdmiControlService` does not successfully allocate a local TV logical address on the tested build.
- The proprietary HiSilicon middleware is the working CEC implementation and sends CEC as logical address `0x0` (TV).
- The attached Apple TV is discoverable through `HdmiCECImpl.getDeviceList()`.
- The vendor framework exposes TIF CEC wake/standby/menu-control options.
- The vendor framework exposes wake-source IDs for IR, Ethernet, USB, GPIO, CEC, UART, VGA, HDMI, SCART, and timers.
- the tested configuration uses `persist.sys.suspend.mode=shutdown`
- AP standby is currently disabled but can be toggled at runtime and restored
- system-level `WAKEUP_HDMI` is currently true
- system-level `WAKEUP_CEC` is currently false
- the independent TIF CEC `WAKEUP` option is true
- waking the Apple TV did not power the projector on from the normal shutdown path
- idempotent writes to already-enabled wake sources return success, while writes involving currently-disabled wake sources returned `-1` in the tested configuration

Still unknown:

- exact semantics/implementation of `setSrcWakeupEnable()` and why disabled sources reject writes
- whether `str`, `lightsleep`, or `lowpower` are safe on this exact Yaber board
- what the stock POWER-button path calls before shutdown
- whether `WAKEUP_HDMI=true` works from STR/light sleep
- whether CEC Image View On/Text View On can resume the projector from a non-shutdown standby mode
- whether `WAKEUP_ETH` is usable on this board and whether it applies only to wired Ethernet
- whether Wi-Fi hardware/firmware supports WoWLAN
- meaning of `Wakeup.Src` and `Wakeup.Value`
- cause of the Frida/device disconnect observed while beginning a TIF CEC setter probe

See `docs/power-and-cec.md` before doing more power experiments.
