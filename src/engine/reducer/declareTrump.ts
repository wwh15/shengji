import type { Action, GameState } from "../types.js";

type DeclareTrumpAction = Extract<Action, { type: "DECLARE_TRUMP" }>;

export function applyDeclareTrump(state: GameState, action: DeclareTrumpAction): GameState {
    if (state.phase !== "DEAL") {
        throw new Error(`cannot declare trump in phase ${state.phase}`);
    }
    if (state.trumpLocked || state.trumpDeclared) {
        throw new Error("cannot declare trump: trump is established already");
    }

    const { seat, cardId } = action;

    const card = state.cardsById[cardId];
    if (!card) throw new Error(`cannot declare trump: unknown cardId ${cardId}`);

    if (!state.hands[seat].includes(cardId)) {
        throw new Error("cannot declare trump: card is not in seat hand");
    }

    if (card.kind !== "normal") {
        throw new Error("cannot declare trump: must declare with a suited level card");
    }
    if (card.rank !== state.levelRank) {
        throw new Error(`cannot declare trump: must declare with level rank ${state.levelRank}`);
    }

    const nextRoundLeader = state.roundLeader ?? seat;

    return {
        ...state,
        trumpSuit: card.suit,
        trumpDeclared: true,
        roundLeader: nextRoundLeader,
    };
}
