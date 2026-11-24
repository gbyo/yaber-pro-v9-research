# Backup status

Before deeper experimentation, a local backup of the tested projector was created.

The backup included:

- `boot.img`
- app backup material
- a full system/device image
- `system.img`
- package lists
- build properties
- partition information
- restore helper scripts
- checksums

Approximate sizes observed:

```text
boot.img: ~8 MB
full device/system image: ~3.90 GB
system.img: ~1.2 GB
```

SHA-256 verification was performed after backup creation.

The backup is intentionally **not** included here because it may contain private data, device-specific calibration, credentials, proprietary binaries, and other sensitive material.

A related public `NL5H00X` backup/tooling project was used as a reference, but the tested projector's storage layout/size did not exactly match that related hardware. Therefore no blind flashing or partition assumptions should be made from another device's layout.
