import type { GameState, Seat } from "../types.js";
import { sortHand } from "../sortHand.js";

export function applyPickupKitty(state: GameState, seat: Seat): GameState {
    if (state.phase !== "KITTY_PICKUP") {
        throw new Error("PICKUP_KITTY only allowed in KITTY_PICKUP");
    }
    if (state.roundLeader === undefined) {
        throw new Error("roundLeader must be set before picking up kitty");
    }
    if (seat !== state.roundLeader) {
        throw new Error("only roundLeader can pick up kitty");
    }
    if (state.kitty.length !== state.config.kittySize) {
        throw new Error("kitty must be full before pickup");
    }

    const leaderHand = state.hands[seat];

    const nextHand = sortHand([...leaderHand, ...state.kitty], state);

    return {
        ...state,
        phase: "BURY",
        hands: {
            ...state.hands,
            [seat]: nextHand,
        },
        kitty: [],
    };
}
