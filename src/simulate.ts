import { applyAction } from "./engine/reducer.js";
import type { GameState } from "./engine/types.js";
import { initialState } from "./engine/state.js";

async function main() {
    let state: GameState = initialState(2);

    console.log("starting deal");

    while (state.phase === "DEAL") {
        // peek before deal
        const seat = state.dealTo;
        const cardId = state.deck[state.dealIndex];

        state = applyAction(state, { type: "DEAL_ONE" });

        const card = state.cardsById[cardId];
        const canDeclare =
            !state.trumpLocked &&
            card?.kind === "normal" &&
            card.rank === state.levelRank;

        if (canDeclare) {
            state = applyAction(state, {
                type: "DECLARE_TRUMP",
                seat,
                cardId,
            });

            console.log(
                `trump declared: ${state.trumpSuit} by seat ${seat} with ${cardId}`
            );
        }
    }

    console.log("final state snapshot:");
    console.log({
        phase: state.phase,
        trumpSuit: state.trumpSuit,
        trumpLocked: state.trumpLocked,
        dealIndex: state.dealIndex,
    });
    console.log("round leader is: " + state.roundLeader);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
