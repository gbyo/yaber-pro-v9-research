const names = [
    "HI_UNF_DISP_SetChnDelay",
    "HI_UNF_DISP_GetChnDelay",
    "HI_UNF_VO_QueryVideoDelay",
    "HI_UNF_DISP_SetMemcEnable",
    "HI_UNF_DISP_SetMemcLevel"
];

function hook(name) {
    let addr = null;

    for (const m of Process.enumerateModules()) {
        try {
            addr = m.findExportByName(name);
            if (addr) {
                console.log("[FOUND] " + name + " in " + m.name + " @ " + addr);
                break;
            }
        } catch (e) {}
    }

    if (!addr) {
        console.log("[MISS] " + name);
        return;
    }

    Interceptor.attach(addr, {
        onEnter(args) {
            this.args = [];
            for (let i = 0; i < 6; i++) {
                this.args.push(args[i]);
            }

            console.log(
                "[CALL] " + name +
                " args=" + this.args.join(",")
            );
        },

        onLeave(retval) {
            console.log(
                "[RET ] " + name +
                " -> " + retval
            );
        }
    });
}

for (const name of names) {
    hook(name);
}

console.log("Low-latency hooks installed.");
