# Stock UI performance baseline

A short `dumpsys gfxinfo` sample of the stock Newlink launcher was preserved
under `research/local-sanitized/baseline/launcher-framestats.txt`.

Observed in that capture:

```text
Total frames rendered: 95
Janky frames: 32 (33.68%)

50th percentile: 6 ms
90th percentile: 30 ms
95th percentile: 109 ms
99th percentile: 250 ms

Missed Vsync: 4
High input latency: 43
Slow UI thread: 12
Slow bitmap uploads: 5
Slow issue draw commands: 8
Frame deadline missed: 16
```

The same capture reported about 43.85 MB of graphics-cache memory in use.

This is only a small observational sample, not a benchmark suite. It does,
however, support the practical observation that the stock launcher can
produce long UI frames and noticeable input latency.

Additional captured baselines are stored under:

```text
research/local-sanitized/baseline/launcher-meminfo.txt
research/local-sanitized/baseline/source-meminfo.txt
research/local-sanitized/baseline/top.txt
```
