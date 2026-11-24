const mods = Process.enumerateModules();

for (const m of mods) {
    const lower = m.name.toLowerCase();

    if (
        lower.includes("hitv") ||
        lower.includes("tvmw") ||
        lower.includes("pq")
    ) {
        console.log("\n=== " + m.name + " @ " + m.base + " ===");

        try {
            const exports = m.enumerateExports();

            for (const e of exports) {
                const n = e.name.toLowerCase();

                if (
                    n.includes("game") ||
                    n.includes("pq") ||
                    n.includes("picture") ||
                    n.includes("memc") ||
                    n.includes("delay") ||
                    n.includes("bypass")
                ) {
                    console.log(e.type + " " + e.address + " " + e.name);
                }
            }
        } catch (e) {
            console.log("ERROR: " + e);
        }
    }
}
