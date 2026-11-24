# Research method

## Tooling used

- ADB
- `dumpsys`
- `logcat`
- JADX
- apktool
- `oatdump`
- GNU binutils (`greadelf`, `gobjdump`, `gnm`, `gc++filt`)
- Frida 17.x
- `strings`
- standard Unix text tools

## Why OAT/VDEX inspection was necessary

Several framework/app JAR/APK files contain little or no ordinary DEX code because the firmware ships preoptimized ART artifacts.

Useful implementation details were recovered from OAT/VDEX/native binaries rather than from the APKs alone.

## Native libraries identified

Important libraries include:

```text
/system/lib/libhitvclient.so
/system/lib/libhitvsupport.so
/system/lib/vendor.hisilicon.hardware.hwtvmw@1.0.so

/vendor/lib/hw/vendor.hisilicon.hardware.hwtvmw@1.0-impl.so
/vendor/lib/libhitvservice.so
```

`libhitvservice.so` is loaded into the `hwtvmw` process and contains much of the interesting picture/video behavior.

## Frida workflow

Frida server must be running on the projector after reboot.

Example conceptually:

```sh
adb shell '/data/local/tmp/frida-server >/dev/null 2>&1 &'
```

Then attach to a Java process:

```sh
frida -U -n com.newlink.nlsource -l script.js
```

or to the middleware service PID:

```sh
frida -U -p <PID> -l native-script.js
```

Remember: the Frida prompt is a JavaScript REPL. Do not paste shell/ADB commands into it.

## Good reverse-engineering practice

Prefer this order:

1. query existing APIs
2. compare getters before/after a change
3. trace Java command IDs
4. map native symbol call chains
5. inspect live middleware logs
6. only then consider direct native mutation

That approach was enough to prove the Game Mode/VPSS behavior without patching firmware.
