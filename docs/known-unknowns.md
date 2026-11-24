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
