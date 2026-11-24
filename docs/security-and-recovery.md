# Security and recovery

## Do not publish

Keep these out of a public repository:

- projector private LAN IP
- Wi-Fi MAC address
- device serial numbers
- full system/device backups
- boot/system/vendor images
- OTA ZIP/BIN files
- vendor APKs
- native vendor `.so` files
- OAT/VDEX blobs
- extracted proprietary firmware contents
- private keys
- signing keys that are not already public AOSP test keys
- Wi-Fi credentials
- tokens
- cookies
- SSH keys
- Cloudflare/API credentials
- unredacted logs containing personal device identifiers

## ADB security

The tested projector exposes ADB-over-TCP on a trusted LAN and supports root ADB.

That is powerful and unsafe on an untrusted network.

Do not port-forward ADB to the Internet.

## Existing backup

A complete local backup was created and checksum-verified before invasive experimentation.

The backup includes enough material to support investigation and some forms of recovery, but it is **not** proof that every possible bootloader/partition failure is recoverable.

Keep that backup private.

## Dangerous operations to avoid

Until a separate recovery path is validated, avoid:

- raw partition writes
- replacing bootloader components
- flashing unverified OTA images
- permanently changing low-level vendor properties
- deleting stock launcher/source apps
- disabling provisioning
- replacing TV middleware
- repeatedly restarting `hwtvmw` as a generic troubleshooting step

## Safer development approach

- install a parallel custom UI
- keep stock apps intact
- prefer public APIs over patching binaries
- use Frida for observation before mutation
- persist only changes that are understood and reversible


## Power-management experiments

The HiSilicon framework exposes `shutdown`, `str`, `lightsleep`, and `lowpower` modes plus AP-standby and wake-source controls.

The tested Yaber configuration currently uses:

```text
persist.sys.suspend.mode=shutdown
```

Do not permanently change the suspend mode until a recovery path for a failed resume is understood.

Additional cautions:

- do not assume a mode string present in the framework is safe on this exact board
- do not treat `setSrcWakeupEnable(...)` as a normal boolean preference setter; disabled sources returned `-1` in runtime tests
- avoid further `setTifCecOption(...)` writes until the cause of a Frida/device disconnect during a setter probe is known
- keep the stock power service intact during replacement-UI development
- record the original property/state before every power experiment
- change one power variable at a time and restore it before moving to another test
