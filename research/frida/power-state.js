// Read-only HiSilicon power/wakeup inspection helper.
// This script intentionally performs no setter calls.

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
        const H =
            Java.use("com.hisilicon.android.tvapi.HitvManager");

        const manager = H.getInstance();
        const sys = manager.getSystemSetting();
        const cec = manager.getHdmiCEC();

        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumWakeupMode"
        );
        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumStandbyMode"
        );
        dumpStaticFields(
            "com.hisilicon.android.tvapi.constant.EnumTifCecOption"
        );

        out("");
        out("=== SYSTEM ===");

        try {
            out("isAPStandbyEnable = " + sys.isAPStandbyEnable());
        } catch (e) {
            out("isAPStandbyEnable ERROR: " + e);
        }

        try {
            out("getPowerSaveMode = " + sys.getPowerSaveMode());
        } catch (e) {
            out("getPowerSaveMode ERROR: " + e);
        }

        try {
            out(
                "isPowerOnPanelEnable = " +
                sys.isPowerOnPanelEnable()
            );
        } catch (e) {
            out("isPowerOnPanelEnable ERROR: " + e);
        }

        const wakeNames = [
            "IR",
            "KEYLED",
            "TIMEOUT",
            "ETH",
            "USB",
            "GPIO",
            "LSADC",
            "CEC",
            "UART",
            "VGA",
            "HDMI",
            "SCART",
            "TIMEOUT_BG"
        ];

        out("");
        out("=== WAKE SOURCES ===");

        for (let i = 0; i < wakeNames.length; i++) {
            try {
                out(
                    i + " " +
                    wakeNames[i] + " = " +
                    sys.getSrcWakeupEnable(i)
                );
            } catch (e) {
                out(i + " " + wakeNames[i] + " ERROR: " + e);
            }
        }

        const cecNames = [
            "WAKEUP",
            "ENABLE_CEC",
            "SYSTEM_CEC_CONTROL",
            "STANDBY",
            "MENUCTRL"
        ];

        out("");
        out("=== CEC OPTIONS ===");

        for (let i = 0; i < cecNames.length; i++) {
            try {
                out(
                    i + " " +
                    cecNames[i] + " = " +
                    cec.getTifCecOption(i)
                );
            } catch (e) {
                out(i + " " + cecNames[i] + " ERROR: " + e);
            }
        }

        out("");
        out("=== WAKEUP OBJECT ===");

        try {
            const w = sys.getWakeup();

            if (w === null) {
                out("getWakeup() = null");
            } else {
                out("class = " + w.getClass().getName());
                out("toString = " + w.toString());

                const fields = w.getClass().getDeclaredFields();

                for (let i = 0; i < fields.length; i++) {
                    try {
                        const f = fields[i];
                        f.setAccessible(true);
                        out(f.getName() + " = " + f.get(w));
                    } catch (e) {
                        out("FIELD ERROR: " + e);
                    }
                }
            }
        } catch (e) {
            out("getWakeup ERROR: " + e);
        }

    } catch (e) {
        out("TOP LEVEL ERROR: " + e);
    }
});
