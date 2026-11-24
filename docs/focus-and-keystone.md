# Focus and keystone

The projector exposes focus/keystone controls through HiSilicon/Newlink APIs rather than requiring direct motor/driver access from a replacement UI.

## Properties

Observed:

```text
persist.hisi.keystone.enable=true
```

## Auto keystone

During one capture, automatic keystone was disabled.

## Native/manual geometry

One observed native/manual keystone geometry was approximately:

```text
top-left:     35,1080
top-right:  1865,1080
bottom-left:  0,0
bottom-right: 1920,0
```

Treat these as device-state observations, not universal calibration values.

## Recovered focus APIs

See `docs/api.md` for the full list. Important capabilities include:

- query/set focus distance
- focus distance range
- focus motor stage/limits
- forward/backward/brake
- reset motor
- autofocus
- native keystone get/set
- automatic keystone calls

A replacement UI should use these APIs rather than writing motor driver state directly.
