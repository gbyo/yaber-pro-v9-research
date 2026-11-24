Java.perform(function () {
    const HitvManager = Java.use("com.hisilicon.android.tvapi.HitvManager");

    const manager = HitvManager.getInstance();
    const picture = manager.getPicture();

    console.log("Game mode before: " + picture.isGameModeEnable());

    const result = picture.enableGameMode(true);
    console.log("enableGameMode(true) returned: " + result);

    console.log("Game mode after: " + picture.isGameModeEnable());
});
