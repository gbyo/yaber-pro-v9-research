# Binary fingerprints

Native offsets in this repository are meaningful only when matched to the
exact binaries from which they were recovered.

The proprietary binaries themselves are intentionally not stored here.

## Known file identities / paths

| Artifact | Device path | Approximate size / note |
| --- | --- | --- |
| RGTPLauncher.apk | /system/app/RGTPLauncher/RGTPLauncher.apk | 11,102,083 bytes observed |
| NLSourcePlayer.apk | /system/app/NLSourcePlayer/NLSourcePlayer.apk | 633,345 bytes observed |
| NLProvision.apk | /system/priv-app/NLProvision/NLProvision.apk | 3,146,569 bytes observed |
| HiTvService.apk | /system/app/HiTvService/HiTvService.apk | 97,213 bytes observed |
| HiExternalTvInput.apk | /system/app/HiExternalTvInput/HiExternalTvInput.apk | 9,115,345 bytes observed |
| libhitvservice.so | /vendor/lib/libhitvservice.so | fingerprint locally before using offsets |
| libhitvclient.so | /system/lib/libhitvclient.so | fingerprint locally |
| libhitvsupport.so | /system/lib/libhitvsupport.so | fingerprint locally |
| hwtvmw implementation | /vendor/lib/hw/vendor.hisilicon.hardware.hwtvmw@1.0-impl.so | fingerprint locally |

## Generate SHA-256 fingerprints

Run:

```sh
./scripts/hash-research-inputs.sh /path/to/local/research-tree
```

or hash an individual file:

```sh
shasum -a 256 /path/to/file
```

Do not add the proprietary binary itself to the public repository.

## TODO

Populate exact SHA-256 values from the local Mac copies in a future commit.
The current chat environment cannot read those private local binary files, so
hash values are intentionally not guessed.
