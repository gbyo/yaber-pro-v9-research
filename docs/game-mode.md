# Hidden Game Mode / low-latency path

This is the strongest reverse-engineering result so far.

## Java API

The hidden HiSilicon API exposes:

```java
Picture.enableGameMode(boolean)
Picture.isGameModeEnable()
```

The stock Yaber UI does not visibly expose this control.

## Command IDs

Frida tracing at the Java `HitvManager` layer established:

```text
SET Game Mode: command 4144 decimal = 0x1030
GET Game Mode: command 4145 decimal = 0x1031
```

Example trace:

```text
excuteCommandSet(4144, 1)
invoke(...)
-> 0

excuteCommandGet(4145)
invoke(...)
-> 1
```

Toggling the API reliably changes `isGameModeEnable()` and returns `0` from the setter on success.

## Normal PQ state does not change

Comparing the ordinary picture getters with Game Mode ON and OFF showed the same values for:

```text
PcMode
PictureMode
MEMCLevel
NR
Sharpness
SRLevel
Overscan
DynamicBL
DCI
GraphicsMode getter
```

On the test unit, one captured state was:

```text
getPcMode = 2
getPictureMode = 0
getMEMCLevel = 3
getNR = 2
getSharpness = 50
getSRLevel = 1
isOverscanEnable = true
isDynamicBLEnable = false
isDCIEnable = true
isGraphicsMode = false
```

Do not interpret `MEMCLevel=3` without mapping the vendor enum.

This indicates that Game Mode is not implemented by simply rewriting the normal saved picture preset.

## Native implementation

Relevant native symbols recovered from `libhitvservice.so` include:

```text
HiPicture::SetGameModeEnable(HI_BOOL)
HiPicture::SetGameModeEnableSub(...)
HiPicture::GetGameModeEnable(HI_BOOL*)

HiVideoPlay::SetGameModeEnable(HI_BOOL)
HiVideoPlay::SetGameModeEnableSub(HI_BOOL, hiMW_VIDEO_INFO_S&, hiMW_VI_ATTR_S&)

HiHdmiPlayer::ConfigBypassVpss(hiMW_VIDEO_INFO_S&)
```

Observed symbol addresses in this firmware build:

```text
HiPicture::SetGameModeEnableSub  0x143e41
HiPicture::SetGameModeEnable     0x1440c1
HiPicture::GetGameModeEnable     0x144299

HiVideoPlay::SetGameModeEnableSub 0x16ee25
HiVideoPlay::SetGameModeEnable    0x16eee1

HiHdmiPlayer::ConfigBypassVpss    0x0f9f25
```

ARM Thumb symbols use the low bit, so disassembly starts at the corresponding even address.

## What the implementation does

`HiPicture::SetGameModeEnableSub()` calls:

```text
HiVideoPlay::SetGameModeEnable(enable)
```

and persists the source-specific state after the player-level change succeeds.

At the `HiVideoPlay` layer:

1. current signal state is checked
2. current `hiMW_VIDEO_INFO_S` is fetched
3. current `hiMW_VI_ATTR_S` is fetched
4. the structures are modified for the requested Game Mode state
5. `HiVideoPlay::Stop()` is called
6. `HiVideoPlay::start(videoInfo)` recreates the path with the new video-input attributes

The firmware therefore rebuilds the active video path; it is not just a stored flag.

## Field mapping

The HDMI bypass function and firmware log strings strongly identify these `hiMW_VIDEO_INFO_S` fields:

```text
+0x08 = bBypassVpss
+0x28 = bInterlace
+0x3c = bGraphicMode
```

This mapping is consistent with both the disassembly and live runtime logs.

The firmware contains the literal diagnostic:

```text
if bInterlace , force bGraphicMode = HI_FALSE , bBypassVpss = HI_FALSE
```

## Definitive live test

On a live 1920×1080 60 Hz progressive HDMI source, toggling Game Mode produced these middleware logs.

### Game Mode OFF

```text
InitVi bGraphicMode = 0 ,bBypassVpss : 0
create VI with enAccess:2,bBypassVpss:0,bGraphicMode:0,bInterlace:0,Width:1920,Height:1080,FrameRate:60
```

### Game Mode ON

```text
InitVi bGraphicMode = 0 ,bBypassVpss : 1
create VI with enAccess:2,bBypassVpss:1,bGraphicMode:0,bInterlace:0,Width:1920,Height:1080,FrameRate:60
```

This is direct runtime proof that the hidden Game Mode enables **VPSS bypass** for this 1080p60 progressive signal.

## Practical conclusion

For this tested signal, Game Mode can accurately be described as:

> Restart the active video input using a HiSilicon VPSS-bypass path when the signal supports it.

VPSS is the HiSilicon video post-processing subsystem. Bypassing it is a plausible low-latency mechanism because it shortens the processing path.

This proves a different video pipeline is selected, but it does **not** by itself quantify the number of milliseconds saved.

## `ViLowLatencyMode`

The binary contains:

```text
globalconfig:ViLowLatencyMode
```

However, the examined `HiHdmiPlayer::ConfigBypassVpss()` routine separately parses:

```text
globalconfig:UHDVideoMode
```

and contains special handling for 3840/4096-wide timings.

Therefore:

- `ViLowLatencyMode` definitely exists in the firmware
- it should not yet be claimed as the exact boolean read by `ConfigBypassVpss()`
- its role remains to be mapped

## Potential hardware-delay measurement

The native library exposes:

```text
HI_UNF_VO_QueryVideoDelay
HI_UNF_DISP_SetChnDelay
HI_UNF_DISP_GetChnDelay
```

A future experiment may be able to query internal video delay directly and compare Game Mode OFF vs ON without requiring an external high-speed-camera measurement.
