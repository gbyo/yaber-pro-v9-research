# Condensed facts

## Device / build

```text
Model family: Yaber Pro V9
Android model/product/device: NL5H00X
Android: 9 / SDK 28
Build type: userdebug / dev-keys
SELinux: permissive
SoC family: HiSilicon bigfish
ABI: armeabi-v7a
RAM: 1 GB
GPU: Mali-450 MP
Display: 1920×1080 ~60 Hz
```

## Yaber/Newlink firmware

```text
ro.zhiying.model=RG_5H045_886_DC
ro.zhiying.version=V1.0.1.0
ro.zhiying.date=2023-05-29
ro.zhiying.cusname=newlink
```

## Important apps/services

```text
com.newlink.hisilauncher
com.newlink.nlsource
com.newlink.nlprovision
com.newlink.service
com.hisilicon.tv.service
com.hisilicon.tvinput.external
com.zhiying.sourceui

vendor.hisilicon.hardware.hwtvmw@1.0-service
```

## HDMI

```text
HDMI1 source ID = 11
HDMI2 source ID = 10
```

## Hidden Game Mode

```text
SET command = 0x1030
GET command = 0x1031
```

1080p60 progressive runtime result:

```text
OFF: bBypassVpss=0, bGraphicMode=0, bInterlace=0
ON:  bBypassVpss=1, bGraphicMode=0, bInterlace=0
```

## Important native symbols

```text
HiPicture::SetGameModeEnable
HiPicture::SetGameModeEnableSub
HiVideoPlay::SetGameModeEnable
HiVideoPlay::SetGameModeEnableSub
HiHdmiPlayer::ConfigBypassVpss

HI_UNF_VO_QueryVideoDelay
HI_UNF_DISP_SetChnDelay
HI_UNF_DISP_GetChnDelay
HI_UNF_DISP_SetMemcEnable
HI_UNF_DISP_SetMemcLevel
```
