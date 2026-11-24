# Evidence index

This page maps the major conclusions in the repository to the evidence used
to establish them.

| Finding | Evidence |
| --- | --- |
| Android UI is 1920x1080 at ~60 Hz | display/SurfaceFlinger observations and baseline dumps |
| Build is Android 9 userdebug/dev-keys | build properties and package/system dumps |
| Hidden Game Mode exists | recovered `Picture.enableGameMode(boolean)` and `isGameModeEnable()` APIs |
| Game Mode SET command is `0x1030` | Java-level Frida trace of `excuteCommandSet(4144, 1)` |
| Game Mode GET command is `0x1031` | Java-level Frida trace of `excuteCommandGet(4145)` |
| Game Mode changes the native video path | `HiPicture::SetGameModeEnable` -> `HiVideoPlay::SetGameModeEnable` call chain |
| Game Mode restarts video input | native disassembly shows `HiVideoPlay::Stop()` followed by `start(hiMW_VIDEO_INFO_S)` |
| `+0x08` maps to `bBypassVpss` | native disassembly plus live runtime VI logs |
| `+0x28` maps to `bInterlace` | native disassembly plus vendor diagnostic strings |
| `+0x3c` maps to `bGraphicMode` | native disassembly plus live runtime VI logs |
| Game Mode enables VPSS bypass on 1080p60 progressive HDMI | OFF/ON runtime logs in `research/evidence/game-mode-vpss-1080p60.log` |
| Normal stored PQ getters do not change with Game Mode | `pq-state.js` comparison captured in `research/evidence/game-mode-pq-state.txt` |
| HDMI bypass logic has UHD-specific gating | `ConfigBypassVpss()` disassembly and `globalconfig:UHDVideoMode` string |
| `globalconfig:ViLowLatencyMode` exists | native string inventory |
| Stock source/launcher use the public AOSP platform test cert | APK signing-certificate inspection |
| Source IDs include HDMI1=11 and HDMI2=10 | source-app/API observations |
| Proprietary HiSilicon middleware is the working CEC owner | runtime `HiMW_rxcecctrl` traffic from logical address 0 plus Android framework address-allocation failure |
| Apple TV is discoverable through vendor CEC API | `HdmiCECImpl.getDeviceList()` returned logical address 4 / OSD name `Apple TV` |
| Android framework CEC cannot allocate a local TV address | `HdmiControlService: Failed to allocate address:[device_type:0]` after successful pings at 0 and 14 |
| TIF CEC option IDs 0-4 are mapped | `EnumTifCecOption` reflection from exact `HitvShare` framework |
| Wake-source IDs 0-12 are mapped | `EnumWakeupMode` reflection from exact `HitvShare` framework |
| Vendor suspend modes include `lightsleep`, `lowpower`, `shutdown`, and `str` | `EnumStandbyMode` reflection |
| Tested unit currently uses full `shutdown` mode | `persist.sys.suspend.mode=shutdown` plus cold-boot behavior after normal power-off |
| AP standby is a real writable vendor control | reversible `enableAPStandby(true/false)` runtime probe |
| System wake mask currently has HDMI enabled and CEC disabled | `getSrcWakeupEnable()` runtime dump |
| TIF CEC wake is independently enabled | `getTifCecOption(TIF_CEC_OPTION_WAKEUP)` runtime dump |
| User-facing HDMI labels do not map 1:1 to TIF/source/CEC IDs | trace of `HDMI0000C3` -> port 3 -> source 11/HDMI3 -> CEC 0x3000 while Newlink stored `zysys.source.hdmi1` |
| Launcher has measurable jank on stock firmware | `research/local-sanitized/baseline/launcher-framestats.txt` |

## Evidence quality

There are three useful evidence classes in this repository:

1. **Runtime proof** — logs or API traces from the running projector.
2. **Static proof** — symbols, strings, and disassembly from the exact
   firmware build.
3. **Inference** — conclusions that combine runtime and static evidence.

Whenever possible, documentation distinguishes direct proof from inference.
