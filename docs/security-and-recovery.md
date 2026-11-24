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
