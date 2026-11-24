# OTA findings

## OTA configuration

The tested firmware points at:

```text
http://www.newlinksz.com/zyftp/ZYUpdate/default_5hxx/
```

Observed manifest:

```text
http://www.newlinksz.com/zyftp/ZYUpdate/default_5hxx/netupdate/RG_5H045_886A_TP_DC_updateVer.xml
```

Despite the `.xml` suffix, the response was JSON-like.

Observed update metadata:

```text
oldver: V1.0.0.0
ver:    V1.0.2.1
```

Release note:

```text
1.修复下系统UI细节.
```

Approximate meaning:

```text
Fix some system UI details.
```

Observed OTA package URL:

```text
https://cdn.newlink-sz.com/qiniu/ZYUpdate/5HXXX/5H045/RG_5H045_886A_TP_DC/update.zip
```

## Checksum warning

The manifest advertised:

```text
965800c235f3a4a4fcfed72588a4b98a
```

The downloaded package produced:

```text
40b3f05ec3b72d04e2e5b6e6766dac32
```

Because of that mismatch, the update was **not flashed**.

## Package characteristics

The downloaded OTA was approximately 742 MB and appeared SignApk-signed.

Contents included items such as:

- ATF
- `boot.img`
- bootargs
- DTBO
- fastboot components
- panel data
- recovery
- slaveboot
- TCON data
- vendor update data/patches
- transfer lists
- updater metadata

Do not publish or redistribute the vendor OTA package in this repository.
