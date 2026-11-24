# Process snapshot

A representative boot/runtime process snapshot included:

```text
root    vendor.hisilicon.hardware.hwsysmanager@1.0-service
root    vendor.hisilicon.hardware.hwandroidmediahal@2.0-service
root    vendor.hisilicon.hardware.hwtvmw@1.0-service
system  vendor.hisilicon.hardware.hwaudio@1.0-service
root    vendor.hisilicon.hardware.hwdlnaservice@1.0-service
system  vendor.hisilicon.hardware.hwgraphics@1.0-service

system  com.hisilicon.tv.service
system  com.newlink.nlprovision
system  com.newlink.hisilauncher
system  com.newlink.nlsource
system  com.newlink.service

app     com.hisilicon.tvinput.external
```

A separate process:

```text
com.zhiying.sourceui
```

was also observed through Frida process enumeration.

`pqserver` exists on the system but was observed stopped during investigation.
