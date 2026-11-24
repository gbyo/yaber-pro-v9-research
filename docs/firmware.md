# Firmware and build

## Yaber/Newlink identity

Observed:

```text
ro.zhiying.model=RG_5H045_886_DC
ro.zhiying.version=V1.0.1.0
ro.zhiying.date=2023-05-29
ro.zhiying.cusname=newlink
```

Android:

```text
Android 9
SDK 28
build: NL5H00X-userdebug 9 PPR1.180610.011 eng.hudson.20230822.012614 dev-keys
security patch: 2019-11-05
```

Build traits:

- `userdebug`
- `dev-keys`
- `ro.debuggable=1`
- `ro.secure=1`
- SELinux permissive
- system image is rooted / root-capable through ADB on the tested device
- ADB TCP support is present

## Fingerprint

Observed fingerprint:

```text
HiDPT/Hi3751V351_DMO/Hi3751V350:9/PPR1.180610.011/...:userdebug/dev-keys
```

The abbreviated build-specific portion is intentionally omitted here because it is not needed to reproduce the research.

## Vendor middleware

Notable services/processes include:

```text
vendor.hisilicon.hardware.hwtvmw@1.0-service
vendor.hisilicon.hardware.hwgraphics@1.0-service
vendor.hisilicon.hardware.hwaudio@1.0-service
com.hisilicon.tv.service
com.hisilicon.tvinput.external
com.newlink.hisilauncher
com.newlink.nlsource
com.newlink.nlprovision
com.newlink.service
com.zhiying.sourceui
```

The presence of `com.zhiying.sourceui` is interesting and remains under-investigated.

## ADB/root behavior

The tested build allows:

```sh
adb connect <PROJECTOR>:5555
adb root
```

After root restart, the shell runs with root privileges.

Do not expose ADB/TCP to the public Internet.
