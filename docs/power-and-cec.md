# Power management and HDMI-CEC

This page records the current state of the power/standby/CEC investigation on the tested Yaber Pro V9 / Newlink / HiSilicon build.

The main conclusion is that the projector contains a much more capable HiSilicon power and HDMI-CEC stack than the stock Yaber UI exposes, but the tested product configuration is currently set up for a full `shutdown` power path rather than suspend-to-RAM or light sleep. Several wake-capable APIs and enums exist in the vendor framework, but not all of them are writable in the current configuration.

## Tested build

These findings apply to the same tested unit documented elsewhere in this repository:

- Android 9 / API 28
- Newlink/Yaber `RG_5H045_886_DC`
- firmware `V1.0.1.0`
- HiSilicon `NL5H00X` / Hi3751V35x-family platform
- `userdebug`, `dev-keys`, root-capable ADB

Do not assume another projector using a similar shell has the same power wiring or standby-controller configuration.

## Two separate CEC implementations are present

The device exposes Android's normal `HdmiControlService`, but the real working TV-side CEC behavior is handled by the proprietary HiSilicon middleware.

### Android framework CEC

When Android framework CEC was enabled for testing:

```text
hdmi_control_enabled=1
```

`dumpsys hdmi_control` showed:

```text
mHdmiControlEnabled: true
mCecController:
  CEC message history:
mPortInfo:
  port 1 ... cec: true
  port 2 ... cec: true
  port 3 ... cec: true
mPowerStatus: 0
```

but there was no local CEC device and no message history.

The HAL log showed the initialization failure directly:

```text
HdmiControlService: initializeCec by:0
hdmi_cec_clear_logical_address
sendping Src:0, Dst:0, SndRslt:0
sendping Src:14, Dst:14, SndRslt:0
HdmiControlService: Failed to allocate address:[device_type:0]
```

The build reports:

```text
ro.hdmi.device_type=0
```

so Android is trying to allocate a TV logical address. The allocation fails because the proprietary stack is already behaving as the TV on the bus.

After this test, Android framework CEC was returned to its original disabled state:

```text
hdmi_control_enabled=0
```

The temporary Android global auto-wakeup/auto-device-off test settings were also removed.

### Proprietary HiSilicon CEC

The proprietary `hwtvmw` stack emits real CEC traffic as logical address `0x0` (TV). Observed examples include:

```text
TV -> broadcast 0x80 Routing Change
TV -> broadcast 0x86 Set Stream Path
TV -> broadcast 0x82 Active Source
```

One source transition logged:

```text
routing change to HDMI src, afterPhyAddr:0x3000
```

followed by a Routing Change from `0x2000` to `0x3000`, then Set Stream Path `0x3000`.

This is direct evidence that the proprietary stack owns CEC routing and understands HDMI physical addresses.

## Apple TV discovery

The HiSilicon Java CEC API returns the attached Apple TV as a real discovered CEC device:

```text
HdmiCecDeviceInfo [
  iHdmiDevPort: 10,
  iLogicAddr: 4,
  iDevVendID: 4346,
  strOsdName: Apple TV
]
```

Observed values:

- logical address: `4`
- vendor ID: decimal `4346` / hex `0x10FA`
- OSD name: `Apple TV`
- vendor device-port/source value: `10`

The exact semantic meaning of `iHdmiDevPort=10` still needs to be mapped, but it is consistent with a HiSilicon/Newlink source identifier rather than a literal physical connector number.

## User-facing HDMI labels do not map 1:1 to low-level IDs

A boot/session trace showed:

```text
TIF input: HDMI0000C3
TIF port: 3
HiSilicon source: [11] HDMI3
CEC physical path: 0x3000
```

while the Newlink provisioning layer later reported:

```text
sourceProperty = zysys.source.hdmi1
```

Therefore a replacement UI must not assume that:

```text
user-facing HDMI 1 == TIF C1 == middleware HDMI1 == source ID 1
```

The product shell is clearly remapping user-facing labels to lower-level source/TIF/CEC identifiers.

## Recovered proprietary CEC Java API

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

These APIs are strong candidates for:

- showing CEC OSD names such as `Apple TV`
- device-aware HDMI labels
- selecting attached CEC devices
- forwarding supported UI/menu commands
- controlling vendor CEC policy

A replacement UI should reuse this stack rather than attempting to implement another CEC controller.

## TIF CEC option IDs

The exact integer constants were recovered from `HitvShare.vdex`:

```text
0 = TIF_CEC_OPTION_WAKEUP
1 = TIF_CEC_OPTION_ENABLE_CEC
2 = TIF_CEC_OPTION_SYSTEM_CEC_CONTROL
3 = TIF_CEC_OPTION_STANDBY
4 = TIF_CEC_OPTION_MENUCTRL
5 = TIF_CEC_OPTION_BUTT
```

Current runtime values on the tested unit:

```text
WAKEUP              = true
ENABLE_CEC          = true
SYSTEM_CEC_CONTROL  = false
STANDBY             = false
MENUCTRL             = false
```

This is important: the CEC middleware's own `WAKEUP` option is already enabled even though the system-level CEC wake source is not.

## CEC-related middleware events

Static strings also expose explicit CEC events:

```text
HI_TV_EVT_CEC_DEVICE_MENU_STATE
HI_TV_EVT_CEC_IMAGE_VIEW_ON
HI_TV_EVT_CEC_MUTE_CHANGE
HI_TV_EVT_CEC_SELECT_SOURCE
HI_TV_EVT_CEC_STANDBY
HI_TV_EVT_CEC_TEXT_VIEW_ON
HI_TV_EVT_TIF_CEC_MESSAGE
```

The presence of `IMAGE_VIEW_ON`, `TEXT_VIEW_ON`, and `STANDBY` shows that the vendor middleware was designed to handle the standard wake/standby side of CEC, even though the tested product configuration did not wake from Apple TV during the experiment.

## Power / standby modes

The vendor framework contains four named suspend modes:

```text
lightsleep
lowpower
shutdown
str
```

with property:

```text
persist.sys.suspend.mode
```

The tested Yaber unit is currently configured as:

```text
persist.sys.suspend=0
persist.sys.suspend.mode=shutdown
```

The normal power-off test behaved like a cold shutdown: on the next manual power-on, the kernel and Android boot logs restarted from uptime zero and the panel/HDMI/system services initialized again.

This is consistent with the `shutdown` property and explains why a network or HDMI event cannot simply wake the running Android userspace.

### Related public HiSilicon platform evidence

A public Android 9 HiSilicon Hi3751V350 device configuration from the same platform family uses:

```text
# suspend prop shutdown/str
persist.sys.suspend.mode=str
```

This does **not** prove `str` is safe on this exact Yaber board, but it is evidence that STR is a real supported HiSilicon configuration in the closely related platform family rather than an unused leftover string.

## Recovered wake-source IDs

`EnumWakeupMode` maps:

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

Current runtime state:

```text
IR          false
KEYLED      false
TIMEOUT     false
ETH         false
USB         false
GPIO        false
LSADC       true
CEC         false
UART        false
VGA         true
HDMI        true
SCART       true
TIMEOUT_BG  false
```

The presence of `WAKEUP_ETH` proves that the generic HiSilicon power framework contains a network-wake concept. It does **not** prove this projector's Wi-Fi chipset supports WoWLAN, and it may be intended for wired Ethernet on other products.

Likewise, `WAKEUP_HDMI=true` does not by itself make the projector wake while the configured power mode is `shutdown`.

## SystemSetting power API

Recovered `SystemSettingImpl` methods include:

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

Current values observed:

```text
isAPStandbyEnable = false
getPowerSaveMode = 0
isPowerOnPanelEnable = true
```

### AP standby probe

A reversible runtime probe showed:

```text
before = false
enableAPStandby(true) returned = 0
after enable = true
enableAPStandby(false) returned = 0
final = false
```

So AP standby is a real writable control.

However, enabling AP standby did **not** make the system-level CEC wake source writable:

```text
CEC while AP standby enabled:
false -> set(true) returned -1 -> false
```

and it did not change:

```text
persist.sys.suspend=0
persist.sys.suspend.mode=shutdown
```

Therefore AP standby and suspend mode are separate controls.

## Strange semantics of setSrcWakeupEnable()

The system wake-source setter does not behave like a conventional idempotent boolean setter.

For wake sources that were already `true`:

```text
LSADC before=true set(true)=0 after=true
VGA   before=true set(true)=0 after=true
HDMI  before=true set(true)=0 after=true
SCART before=true set(true)=0 after=true
```

For every tested wake source that was already `false`, an idempotent `set(false)` returned `-1`:

```text
IR          -1
KEYLED      -1
TIMEOUT     -1
ETH         -1
USB         -1
GPIO        -1
CEC         -1
UART        -1
TIMEOUT_BG  -1
```

Attempting to change CEC from false to true also returned `-1` and left it false.

Therefore:

- `-1` must **not** be interpreted as proof that CEC alone is unsupported.
- The API may reject writes to sources that are not provisioned in this product configuration.
- It may be exposing firmware/board capability bits rather than a freely writable user preference.
- Further writes should be avoided until the underlying implementation is understood.

## Wakeup object

After a manual power-on, `getWakeup()` returned:

```text
[Mode=0, Src=11, Value=-200542456]
```

with fields:

```text
Mode = 0
Src = 11
Value = -200542456
```

The object exposes:

```text
SetWakeupMode(int)
SetWakeupSource(int)
SetWakeupValue(int)
getWakeupMode()
getWakeupSource()
getWakeupValue()
```

`Mode=0` matches the integer value of `WAKEUP_IR`, which is consistent with the projector having been powered on manually by remote during testing. The meanings of `Src=11` and the negative `Value` have not been established and should not be guessed.

## Apple TV wake experiment

The Apple TV was configured to control TVs/receivers and was connected through the normal HDMI path.

Android framework CEC auto-wakeup settings were temporarily enabled, then the projector was powered off normally. Waking the Apple TV did **not** power the projector back on.

The important interpretation is now:

1. Android framework CEC never acquired a local logical address, so its auto-wakeup setting was not a reliable path.
2. The proprietary CEC middleware was functioning while the projector was on.
3. The product power mode is `shutdown`.
4. The system-level CEC wake source is `false`.
5. The TIF CEC wake option is independently `true`.
6. `WAKEUP_HDMI` is already `true`, yet HDMI activity did not wake the projector from the normal shutdown path.

This strongly suggests that enabled wake-source flags are not sufficient while the product is configured for full shutdown.

## Device-disconnect incident during CEC-option probing

A later Frida session disconnected while beginning an idempotent `setTifCecOption()` probe.

No successful setter result was captured before the disconnect, so the cause is unproven. It may have been a Frida/ADB transport issue, process failure, or a device reboot.

Until that event is characterized, avoid further writes through `setTifCecOption()`.

## Replacement UI implications

The replacement UI should:

- leave Android framework `HdmiControlService` disabled unless a future investigation proves it can coexist cleanly
- use the proprietary `HdmiCECImpl` stack for device discovery and CEC-aware UI
- show discovered OSD names such as `Apple TV`
- map user-facing HDMI labels through runtime TIF/source/CEC information instead of hardcoding source numbers
- treat power/standby as a separate subsystem from HDMI switching
- expose no low-level standby-mode switch until recovery behavior is well understood
- preserve stock power services during early replacement-UI testing
- avoid restarting `hwtvmw`

A safe initial UI can consume read-only CEC state without changing power policy.

## Current pause point / next investigations

Power/CEC experimentation is intentionally paused here.

If resumed, the highest-value next steps are:

1. determine whether the last Frida disconnect was only transport/process loss or a real reboot
2. trace the stock POWER-button path and determine whether it calls `SystemSettingImpl.shutdown()`, AP standby, or another vendor service
3. statically inspect the implementations of `setSrcWakeupEnable()`, `enableAPStandby()`, and `shutdown()`
4. understand whether `persist.sys.suspend.mode=str` can be tested safely on this exact board
5. only after recovery planning, test STR/light-sleep behavior
6. test whether existing `WAKEUP_HDMI=true` can resume from a non-shutdown standby state
7. only then revisit CEC wake and `WAKEUP_ETH`

Do not change the persistent suspend mode or perform additional CEC setter experiments casually.
