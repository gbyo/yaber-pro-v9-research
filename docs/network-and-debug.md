# Network and debugging observations

The private LAN address and MAC address of the tested projector are intentionally omitted.

## Exposed services

Observed during LAN scanning:

```text
TCP 80   open  HTTP
TCP 5555 open  ADB
```

Common alternative service ports tested and found closed included:

```text
21 22 23 443 8000 8080 8888
```

The HTTP server identified itself as:

```text
Boa/0.94.13
```

Observed HTTP paths included:

```text
/itag/
/log/error_log
```

At the time checked, `/itag/` was empty and `/log/error_log` had no useful content.

## ADB property

Observed:

```text
persist.adb.tcp.port=5555
```

ADB-over-TCP plus root-capable `userdebug` firmware is extremely useful for research but should be restricted to a trusted network.
