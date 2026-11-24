# Hardware and display

## Platform

Observed properties:

- Android device/product/model: `NL5H00X`
- SoC family: HiSilicon
- `ro.hardware=bigfish`
- `ro.board.platform=bigfish`
- vendor-reported chip name: `HS352`
- ABI: `armeabi-v7a`
- CPU: 4× ARMv7 cores
- RAM: 1024 MB
- kernel: `4.9.127_s5`
- OpenGL ES: 2.0
- GPU renderer: Mali-450 MP

The exact marketing CPU core name should not be inferred from this alone.

## Android display

Observed:

- Physical display size: 1920×1080
- Physical density: 240 dpi
- Approximate refresh rate: 60 Hz
- SurfaceFlinger frame period: ~16.666 ms
- `ro.config.low_ram=true`
- system buffers observed at 1920×1080 RGBA8888
- hardware compositor reports a 1920×1080 display

This means the Android UI is actually rendered at 1080p rather than merely scaled from a 720p logical framebuffer.

## Relevant graphics/system properties

Observed properties include:

```text
ro.sf.disable_triple_buffer=true
debug.sf.disable_backpressure=1
sys.config.dynamic.frame.rate=false
persist.hisi.keystone.enable=true
media.mc.output=overlay
persist.vendor.prop.resolution=1080
```

## Reversible UI-resolution experiment

A possible future performance experiment is to reduce Android UI raster resolution while preserving roughly the same logical size:

```sh
adb shell wm size 1280x720
adb shell wm density 160
```

Restore:

```sh
adb shell wm size reset
adb shell wm density reset
```

Do not perform this while investigating HDMI overlay alignment, keystone, focus, or source presentation, because changing Android display geometry may complicate those systems.
