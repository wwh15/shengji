import type { CardId, GameState, Seat } from "../types.js";
import { sortHand } from "../sortHand.js";

function removeSelected(hand: CardId[], selected: Set<CardId>): CardId[] {
    return hand.filter((id) => !selected.has(id));
}

export function applyBury(state: GameState, seat: Seat, cardIds: CardId[]): GameState {
    if (state.phase !== "BURY") {
        throw new Error("BURY only allowed in BURY");
    }
    if (state.roundLeader === undefined) {
        throw new Error("roundLeader must be set before burying");
    }
    if (seat !== state.roundLeader) {
        throw new Error("only roundLeader can bury");
    }

    const expected = state.config.kittySize;

    if (cardIds.length !== expected) {
        throw new Error(`must bury exactly ${expected} cards`);
    }

    const uniq = new Set(cardIds);
    if (uniq.size !== cardIds.length) {
        throw new Error("bury cardIds must be unique");
    }

    const hand = state.hands[seat];
    const handSet = new Set(hand);

    for (const id of uniq) {
        if (!handSet.has(id)) {
            throw new Error("can only bury cards from your hand");
        }
    }

    const nextHand = sortHand(removeSelected(hand, uniq), state);

    return {
        ...state,
        phase: "TRICK_PLAY",
        hands: {
            ...state.hands,
            [seat]: nextHand,
        },
        buried: [...state.buried, ...cardIds],
    };
}
