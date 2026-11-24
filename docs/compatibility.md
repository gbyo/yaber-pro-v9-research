# Compatibility and tested build

## Directly tested

The current findings were obtained from one Yaber Pro V9 unit reporting:

```text
Android device/product/model: NL5H00X
Android: 9 / SDK 28
Build type: userdebug / dev-keys
ro.hardware: bigfish
ro.board.platform: bigfish

ro.zhiying.model=RG_5H045_886_DC
ro.zhiying.version=V1.0.1.0
ro.zhiying.date=2023-05-29
ro.zhiying.cusname=newlink
```

Hardware observations for that unit include:

```text
ABI: armeabi-v7a
RAM: 1 GB
GPU: Mali-450 MP
Android display: 1920x1080 at about 60 Hz
```

## Found, but not flashed

An OTA manifest advertised a newer firmware:

```text
V1.0.2.1
```

The downloaded OTA did not match the manifest's MD5 value, so it was not
flashed and none of the findings in this repository should be assumed to
describe V1.0.2.1.

## Related hardware

Other devices and public projects use the `NL5H00X` name or closely related
HiSilicon platforms. That does not prove that their storage layout, panel,
calibration, boot chain, firmware image, or middleware build is identical.

In particular, do not copy partition images or offsets from another
`NL5H00X` device without independently verifying the target unit.

## Offset warning

Native offsets documented in this repository are build-specific. Match the
binary fingerprint before using an offset for dynamic instrumentation or
static analysis.
