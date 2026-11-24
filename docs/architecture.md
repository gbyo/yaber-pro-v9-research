# Software architecture

## High-level model

The projector is best treated as a HiSilicon television/video platform with a custom Android shell layered on top:

```text
Custom Android UI / source app
          |
com.hisilicon.android.tvapi
          |
HiSilicon TV middleware
          |
hwtvmw / video / PQ / HDMI services
          |
hardware
```

A replacement UI should preserve the proprietary middleware rather than attempting to replace HDMI, focus, keystone, audio, CEC, or video routing from scratch.

## Important packages

Observed packages:

### `com.newlink.hisilauncher`

- stock Newlink/Yaber launcher
- runs as a system-level package

### `com.newlink.nlsource`

- source-selection / source-presentation app
- activity: `com.newlink.nlsource/.MainActivity`
- MAIN action exists but no conventional LAUNCHER category
- runs with system UID on the tested build
- uses HiSilicon `HitvManager`, `SourceManager`, `Picture`, TV-input APIs, and system properties

### `com.newlink.nlprovision`

- provisioning/startup-related package
- should not be disabled casually

### `com.hisilicon.tvinput.external`

Provides external TV-input services including HDMI.

Relevant component:

```text
com.hisilicon.tvinput.external/.HiHdmiTvInputService
```

It also exposes TV-input services for VGA/CVBS/YPbPr.

### `com.hisilicon.tv.service`

System TV service used by the HiSilicon APIs.

### `com.zhiying.sourceui`

A projector-specific source UI process was observed. Its exact role remains to be mapped.

## System UID / signing

The stock Newlink source and launcher APKs were observed to use the public AOSP platform test certificate.

Observed certificate fingerprints:

```text
SHA-1:
27:19:6E:38:6B:87:5E:76:AD:F7:00:E7:EA:84:E4:C6:EE:E3:3D:FA

SHA-256:
C8:A2:E9:BC:CF:59:7C:2F:B6:DC:66:BE:E2:93:FC:13:F2:FC:47:EC:77:BC:6B:2B:0D:52:C1:1F:51:19:2A:B8
```

This is the public Android AOSP test platform certificate, not a secret vendor key.

A minimal replacement app signed with the matching public test key may therefore be able to request platform/signature privileges on this `userdebug/dev-keys` build. This should be tested with a small non-destructive app before relying on it.

## Shared libraries / dexpreopt

The device registers:

```text
com.hisilicon.android
com.hisilicon.android.tvapi
com.hisilicon.dtv
```

`com.hisilicon.android.tvapi` points to:

```text
/system/framework/HitvShare.jar
```

The JAR itself is essentially a manifest holder; implementation code is dexpreopted into OAT/VDEX files under `/system/framework/oat/arm/`.

This is why normal APK/JAR decompilation initially appears to contain almost no executable implementation.
