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


## `HdmiCECImpl`

`HitvManager.getHdmiCEC()` returns:

```text
com.hisilicon.android.tvapi.impl.HdmiCECImpl
```

Recovered public methods:

```text
broadcastVendorID(int)
getDeviceList()
getTifCecOption(int)
getUIStatus(int)
requestMenuStat(int, boolean)
selectDevice(int)
setMenuLag(int)
setTifCecOption(int, boolean)
setUICommand(int)
setUIStatus(int, boolean)
```

Recovered TIF CEC option IDs:

```text
0 = TIF_CEC_OPTION_WAKEUP
1 = TIF_CEC_OPTION_ENABLE_CEC
2 = TIF_CEC_OPTION_SYSTEM_CEC_CONTROL
3 = TIF_CEC_OPTION_STANDBY
4 = TIF_CEC_OPTION_MENUCTRL
5 = TIF_CEC_OPTION_BUTT
```

The tested runtime currently reports:

```text
WAKEUP              true
ENABLE_CEC          true
SYSTEM_CEC_CONTROL  false
STANDBY             false
MENUCTRL             false
```

`getDeviceList()` returned an attached Apple TV as logical address 4 with OSD name `Apple TV`.

Do not call CEC setters casually. A later Frida session disconnected while beginning a setter probe; the cause has not been established.

## `SystemSettingImpl` power / wake controls

Recovered methods include:

```text
SetWakeupTimeOutBG(boolean)
enableAPStandby(boolean)
enablePowerOnPanel(boolean)
getPowerSaveMode()
getSrcWakeupEnable(int)
getWakeup()
getWakeupTimeOutVolume()
isAPStandbyEnable()
isPowerOnPanelEnable()
setPowerSaveMode(int)
setShutdownRecoveryEnable(boolean)
setSrcWakeupEnable(int, boolean)
setWakeupTimeOutVolume(int)
shutdown()
```

Recovered wake-source IDs:

```text
0  = WAKEUP_IR
1  = WAKEUP_KEYLED
2  = WAKEUP_TIMEOUT
3  = WAKEUP_ETH
4  = WAKEUP_USB
5  = WAKEUP_GPIO
6  = WAKEUP_LSADC
7  = WAKEUP_CEC
8  = WAKEUP_UART
9  = WAKEUP_VGA
10 = WAKEUP_HDMI
11 = WAKEUP_SCART
12 = WAKEUP_TIMEOUT_BG
13 = WAKEUP_BUTT
```

Recovered standby-mode strings:

```text
lightsleep
lowpower
shutdown
str
```

The persistent mode key is:

```text
persist.sys.suspend.mode
```

The tested unit currently uses `shutdown`.

See `docs/power-and-cec.md` for runtime behavior, setter semantics, and safety notes.
