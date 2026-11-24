// Read-only HiSilicon CEC inspection helper.
// Attach to a process that already uses HitvShare, such as com.newlink.nlsource.

Java.perform(function () {
    function out(s) {
        console.log(String(s));
    }

    function dumpStaticFields(className) {
        try {
            const C = Java.use(className);
            const fields = C.class.getDeclaredFields();
            const Modifier = Java.use("java.lang.reflect.Modifier");

            out("");
            out("=== " + className + " ===");

            for (let i = 0; i < fields.length; i++) {
                try {
                    const f = fields[i];
                    f.setAccessible(true);

                    if (Modifier.isStatic(f.getModifiers())) {
                        out(
                            f.getType().getName() + " " +
                            f.getName() + " = " +
                            f.get(null)
                        );
                    }
                } catch (e) {
                    out("FIELD ERROR: " + e);
                }
            }
        } catch (e) {
            out("CLASS ERROR " + className + ": " + e);
        }
    }

    try {
        const HitvManager =
            Java.use("com.hisilicon.android.tvapi.HitvManager");

        const cec = HitvManager.getInstance().getHdmiCEC();

        out("=== CEC OBJECT ===");
        out("class = " + cec.getClass().getName());

        out("");
        out("=== CURRENT DEVICE LIST ===");

        const devices = cec.getDeviceList();

        if (devices === null) {
            out("device list = null");
        } else {
            out("count = " + devices.size());

            for (let i = 0; i < devices.size(); i++) {
                const d = devices.get(i);

                out("");
                out("DEVICE " + i);
                out("class = " + d.getClass().getName());
                out("toString = " + d.toString());

                const fields = d.getClass().getDeclaredFields();

                for (let j = 0; j < fields.length; j++) {
                    try {
                        const f = fields[j];
                        f.setAccessible(true);
                        out(f.getName() + " = " + f.get(d));
                    } catch (e) {
                        out("FIELD ERROR: " + e);
                    }
                }
            }
        }

        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumTifCecOption"
        );
        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumCecLogAddr"
        );
        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumCecHdmiPhyAddr"
        );
        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumCecUICommand"
        );
        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumCecMenu"
        );

    } catch (e) {
        out("TOP LEVEL ERROR: " + e);
    }
});
