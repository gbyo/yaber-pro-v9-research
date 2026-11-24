Java.perform(function () {
    const HitvManager = Java.use("com.hisilicon.android.tvapi.HitvManager");
    const PictureImpl = Java.use("com.hisilicon.android.tvapi.impl.PictureImpl");

    function hookOverloads(clazz, name) {
        if (!clazz[name]) return;

        clazz[name].overloads.forEach(function (ov) {
            ov.implementation = function () {
                const args = [];
                for (let i = 0; i < arguments.length; i++) {
                    try {
                        args.push(String(arguments[i]));
                    } catch (e) {
                        args.push("<unprintable>");
                    }
                }

                console.log(
                    "[CALL] " + name +
                    "(" + args.join(", ") + ")"
                );

                const ret = ov.apply(this, arguments);

                console.log(
                    "[RET ] " + name +
                    " -> " + ret
                );

                return ret;
            };
        });
    }

    hookOverloads(HitvManager, "excuteCommandSet");
    hookOverloads(HitvManager, "excuteCommandGet");
    hookOverloads(HitvManager, "invoke");

    const gm = PictureImpl.enableGameMode.overload("boolean");

    gm.implementation = function (enabled) {
        console.log("===== enableGameMode(" + enabled + ") =====");

        const ret = gm.call(this, enabled);

        console.log("===== enableGameMode returned " + ret + " =====");
        return ret;
    };

    console.log("Game Mode trace hooks installed.");
});
