import { initialState } from "./engine/state.js";
import { applyAction } from "./engine/reducer.js";

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    let s = initialState(12345);

    while (s.phase === "DEAL") {
        s = applyAction(s, { type: "DEAL_ONE" });
        console.log(`dealt card ${s.dealIndex}/100 to seat ${((s.dealTo + 3) % 4) as 0|1|2|3}`);
        await sleep(150);
    }

    console.log("done dealing");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

