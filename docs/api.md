# Recovered HiSilicon API surface

The following API names were recovered from optimized framework/native artifacts. This is not a complete SDK reference.

## `HitvManager`

Notable methods:

```text
getInstance()
getPicture()
getSourceManager()
getCusEx()
getHdmiCEC()
getHdmiTx()
getSystemSetting()

excuteCommandGet(...)
excuteCommandSet(...)
invoke(Parcel, Parcel)
```

## `SourceManager`

Recovered methods include:

```text
getAvailSourceList()
getBootSource()
getCurSourceId(int)
getSelectSourceId()
getSignalStatus()
getSourceList()
getTimingInfo()
getVideoDefinition()
getWindowRect(int)

selectSource(int,int)
selectSource(int,int,int)
setBootSource(int)
setFocusWindow(int)
```

## `Picture`

Recovered controls include:

```text
getBrightness()
getContrast()
getSaturation()
getHue()
getSharpness()

getPictureMode()
setPictureMode(int)

getPcMode()
setPcMode(int)

getNR()
setNR(int)

getMEMCLevel()
setMEMCLevel(int)

getMemcDelay()
setMemcDelay(...)

getSRLevel()
setSRLevel(int)

getPQModule(int)
setPQModule(int, boolean)

isOverscanEnable()
enableOverscan(...)

isDynamicBLEnable()
isDCIEnable()
isGraphicsMode()

isGameModeEnable()
enableGameMode(boolean)
```

Do not set unknown integer enum values until the corresponding vendor enum has been mapped.

## PQ module names seen in the firmware

```text
PQ_MODULE_ALL
BLUE_STRETCH
CCCL
COLOR
COLOR_CORING
DB
DBC
DCI
DR
DS
FMD
GAMMA
HDR
HSHARPNESS
IQTM
NR
SDR2HDR
SHARPNESS
SR
WCG
```

## `CusEx` projector controls

Recovered methods include:

```text
getAdvancedPictureSetting(int)
setAdvancedPictureSetting(int,int)

getAutoFocus()
setAutoFocus(float)

getAutoKeystone(...)
getAutoKeystoneUncalib(...)
interceptAutoKeystone(int)

getFocusDistance()
getFocusDistanceRange(int[])
setFocusDistance(int)

getFocusMotorKind()
getFocusMotorLens()
getFocusMotorLimit()
getFocusMotorStage()

setFocusMotor(...)
setFocusMotorForward()
setFocusMotorBackward()
setFocusMotorBrake()
resetFocusMotor()

getNativeKeystone(int[])
setNativeKeystone(int[])
```

This is important for a replacement UI: focus and keystone can likely remain on the proprietary control stack rather than being reimplemented.

## HDMI / EDID-related controls

The firmware also exposes APIs around:

- HDMI color range
- HDMI-RX EDID capability/type
- EDID 1.4 / 2.0 / 2.1 / AUTO
- HDMI-TX timing
- HDMI-TX color format

These are candidates for a future advanced settings/diagnostics page.
