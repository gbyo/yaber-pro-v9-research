Java.perform(function () {
    const HitvManager = Java.use("com.hisilicon.android.tvapi.HitvManager");
    const p = HitvManager.getInstance().getPicture();

    console.log("Game mode before: " + p.isGameModeEnable());
    console.log("enableGameMode(false): " + p.enableGameMode(false));
    console.log("Game mode after: " + p.isGameModeEnable());
});
