# App and file inventory

## APKs investigated

Observed paths and approximate sizes:

```text
/system/app/RGTPLauncher/RGTPLauncher.apk
  ~11.1 MB

/system/app/NLSourcePlayer/NLSourcePlayer.apk
  ~633 KB

/system/priv-app/NLProvision/NLProvision.apk
  ~3.15 MB

/system/app/HiTvService/HiTvService.apk
  ~97 KB

/system/app/HiExternalTvInput/HiExternalTvInput.apk
  ~9.1 MB
```

## `com.newlink.nlsource`

Relevant activity:

```text
com.newlink.nlsource/.MainActivity
```

Intent behavior observed:

- action `MAIN`
- action `android.newlink.source`
- category `DEFAULT`
- no ordinary `LAUNCHER` category

The package runs as a privileged/system identity on the tested build.

The app reads source-related system properties including:

```text
zysys.source.hdmi1
zysys.source.hdmi2
zysys.source.hdmi3
```

It also references:

```text
com.hisilicon.tvinput.external/.HiHdmiTvInputService/HDMI0000C
```

and uses `TvSourceManager`, `HitvManager`, `Picture`, and `PictureInterface`.

## `com.hisilicon.tvinput.external`

Observed code path:

```text
/system/app/HiExternalTvInput
```

Relevant setup activity:

```text
HiexternalSetupActivity
```

Services include HDMI, YPbPr, CVBS, and VGA TV-input services.

Observed privileged/signature permission:

```text
com.hisilicon.tvinput.external.permission.EXTERNAL_TV_INPUT_SETUP
```

## Dexpreopt artifacts

Observed framework optimized files include:

```text
/system/framework/oat/arm/HiDtvShare.vdex
/system/framework/oat/arm/HiDtvShare.odex
/system/framework/oat/arm/HitvManager.vdex
/system/framework/oat/arm/HitvManager.odex
/system/framework/oat/arm/HitvShare.vdex
/system/framework/oat/arm/HitvShare.odex
```

Observed app optimized files include:

```text
/system/app/NLSourcePlayer/oat/arm/NLSourcePlayer.vdex
/system/app/NLSourcePlayer/oat/arm/NLSourcePlayer.odex

/system/app/RGTPLauncher/oat/arm/RGTPLauncher.vdex
/system/app/RGTPLauncher/oat/arm/RGTPLauncher.odex

/system/priv-app/NLProvision/oat/arm/NLProvision.vdex
/system/priv-app/NLProvision/oat/arm/NLProvision.odex
```

These artifacts are useful locally for reverse engineering but should not be redistributed in a public repository.
