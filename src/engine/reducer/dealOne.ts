import type { GameState, Seat } from "../types.js";

export function applyDealOne(state: GameState): GameState {
    if (state.phase !== "DEAL") {
        throw new Error(`cannot deal in phase ${state.phase}`);
    }

    const dealLimit = state.deck.length - state.config.kittySize;
    if (state.dealIndex >= dealLimit) {
        throw new Error("deal is already complete");
    }

    const cardId = state.deck[state.dealIndex];
    if (!cardId) {
        throw new Error("no card available to deal");
    }

    const seat = state.dealTo;

    const nextHands: GameState["hands"] = {
        ...state.hands,
        [seat]: [...state.hands[seat], cardId],
    };

    const nextDealIndex = state.dealIndex + 1;
    const nextDealTo = ((seat + 1) % 4) as Seat;

    if (nextDealIndex === dealLimit) {
        const kitty = state.deck.slice(dealLimit);

        return {
            ...state,
            hands: nextHands,
            dealIndex: nextDealIndex,
            dealTo: nextDealTo,
            kitty,
            phase: "KITTY_PICKUP",
        };
    }

    return {
        ...state,
        hands: nextHands,
        dealIndex: nextDealIndex,
        dealTo: nextDealTo,
    };
}
