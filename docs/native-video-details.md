# Native video / PQ details

## Important native library

Much of the useful implementation lives in:

```text
/vendor/lib/libhitvservice.so
```

It is loaded into:

```text
vendor.hisilicon.hardware.hwtvmw@1.0-service
```

## Useful exported/imported symbols

Observed symbols include:

```text
HiVideoPlay::SetGameModeEnable(HI_BOOL)
HiVideoPlay::SetGameModeEnableSub(HI_BOOL, hiMW_VIDEO_INFO_S&, hiMW_VI_ATTR_S&)
HiVideoPlay::getVideoDelay(unsigned int*)
HiVideoPlay::SetMemcDelay(hiMW_DISP_DELAY_S)
HiVideoPlay::GetMemcDelay(hiMW_DISP_DELAY_S*)
HiVideoPlay::setMemc(hiMW_MEMC_S const*)
HiVideoPlay::setMemcDemo(HI_BOOL)
HiVideoPlay::SetViPictureMode(HI_MW_VI_PICTURE_MODE_E)

HiHdmiPlayer::ConfigBypassVpss(hiMW_VIDEO_INFO_S&)
HiHdmiPlayer::SetPictureParam(HI_BOOL, HI_BOOL)
HiHdmiPlayer::SetParamPicPqData(HI_BOOL)

HI_UNF_VO_QueryVideoDelay
HI_UNF_DISP_SetChnDelay
HI_UNF_DISP_GetChnDelay
HI_UNF_DISP_SetMemcEnable
HI_UNF_DISP_SetMemcLevel
```

## Useful firmware strings

Observed:

```text
globalconfig:MemcSupport
globalconfig:ViLowLatencyMode
globalconfig:UHDVideoMode
```

Diagnostics include:

```text
create VI with enAccess:%d,bBypassVpss:%d,bGraphicMode:%d,bInterlace:%d,Width:%d,Height:%d,FrameRate:%d

InitVi bGraphicMode = %d ,bBypassVpss : %d

Set bGraphicMode:%d, bBypassVpss:%d, ret:0x%x

if bInterlace , force bGraphicMode = HI_FALSE , bBypassVpss = HI_FALSE
```

## UHD interaction

`HiHdmiPlayer::ConfigBypassVpss()` was observed to parse `globalconfig:UHDVideoMode` and check 3840/4096-wide modes.

This appears to gate or alter VPSS bypass behavior for UHD timings.

Do not conflate this with the separate `globalconfig:ViLowLatencyMode` key; the latter exists but its call sites still need mapping.
