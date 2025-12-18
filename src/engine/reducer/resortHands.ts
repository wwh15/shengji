import type { GameState, Seat, CardId } from "../types.js";
import { sortHand } from "../sortHand.js";

export function resortHands(state: GameState): Record<Seat, CardId[]> {
    return {
        0: sortHand(state.hands[0], state),
        1: sortHand(state.hands[1], state),
        2: sortHand(state.hands[2], state),
        3: sortHand(state.hands[3], state),
    };
}
