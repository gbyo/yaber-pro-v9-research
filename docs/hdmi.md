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
