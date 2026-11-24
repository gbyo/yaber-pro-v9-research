# HDMI and TV-input behavior

## Source IDs

Observed Newlink source IDs:

```text
HDMI1 = 11
HDMI2 = 10
```

The Android TV-input layer enumerates three physical HDMI TV-input endpoints even though the product UI presents fewer user-facing HDMI choices.

## Current-source behavior

The source app can be started directly with:

```sh
adb shell am start -n com.newlink.nlsource/.MainActivity
```

The source app has a MAIN/default intent but no normal LAUNCHER category, so `monkey`-based launcher invocation is not reliable.

## HDMI2 observations

On a live HDMI2 signal, logs showed:

- source ID 10
- 1920×1080 timing
- SDR
- supported/stable signal
- LPCM audio
- 48 kHz
- 2 channels
- 16-bit
- CEC physical address `0x2000`

CEC device discovery identified the connected playback device as an Apple TV during testing.

## TV-input mapping

Observed service:

```text
com.hisilicon.tvinput.external/.HiHdmiTvInputService
```

TV-input sessions included HDMI endpoints resembling:

```text
HDMI0000C1
HDMI0000C2
HDMI0000C3
```

On the tested unit, C2 corresponded to the active HDMI2 path during the investigation.

## "Searching HDMI signal" incident

At one point the stock UI displayed a "Searching HDMI signal" state even though middleware logs showed a stable 1080p signal.

The evidence suggested a source/UI/surface synchronization problem rather than loss of HDMI lock.

Restarting low-level TV middleware was not a reliable fix; rebooting restored normal presentation. This is one reason a replacement shell should avoid casually restarting `hwtvmw`.

## CEC

CEC handling is implemented in the HiSilicon middleware. Repeated discovery/ping and OSD-name traffic was observed from the `hwtvmw` service.

A replacement UI should reuse the existing CEC middleware rather than implement its own HDMI-CEC stack.


## Runtime source/TIF/CEC mapping caveat

A later boot/session trace showed the following low-level mapping for one source selection:

```text
TV input: HDMI0000C3
TIF port: 3
HiSilicon source: [11] HDMI3
CEC physical path: 0x3000
```

The Newlink provisioning layer later reported the saved product-facing property:

```text
zysys.source.hdmi1
```

This proves that user-facing HDMI labels, TIF endpoint numbers, HiSilicon source IDs, and CEC physical paths are not safe to treat as the same numbering scheme.

A replacement UI should discover/map these layers at runtime.

## CEC device discovery

`HitvManager.getHdmiCEC()` returns the proprietary `HdmiCECImpl` implementation.

During testing, `getDeviceList()` returned:

```text
HdmiCecDeviceInfo [
  iHdmiDevPort: 10,
  iLogicAddr: 4,
  iDevVendID: 4346,
  strOsdName: Apple TV
]
```

This means the replacement UI can potentially show a connected device's real CEC OSD name instead of only a generic HDMI label.

The exact meaning of `iHdmiDevPort=10` remains to be mapped.

## Android framework CEC vs HiSilicon CEC

Android's `HdmiControlService` was temporarily enabled for investigation, but failed to allocate a TV logical address:

```text
sendping Src:0, Dst:0, SndRslt:0
sendping Src:14, Dst:14, SndRslt:0
Failed to allocate address:[device_type:0]
```

At the same time, the proprietary middleware was observed sending real CEC traffic as logical address `0x0` (TV), including Routing Change, Set Stream Path, and Active Source.

The working stack should therefore be treated as the proprietary HiSilicon implementation. Android framework CEC was returned to its original disabled state after testing.

See `docs/power-and-cec.md` for the full wake/standby investigation.
