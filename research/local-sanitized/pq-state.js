Java.perform(function () {
    const HitvManager = Java.use("com.hisilicon.android.tvapi.HitvManager");
    const p = HitvManager.getInstance().getPicture();

    function read(name) {
        try {
            console.log(name + ": " + p[name]());
        } catch (e) {
            console.log(name + ": ERROR " + e);
        }
    }

    [
        "isGameModeEnable",
        "getPcMode",
        "getPictureMode",
        "getMEMCLevel",
        "getNR",
        "getSharpness",
        "getSRLevel",
        "isOverscanEnable",
        "isDynamicBLEnable",
        "isDCIEnable",
        "isGraphicsMode"
    ].forEach(read);
});
