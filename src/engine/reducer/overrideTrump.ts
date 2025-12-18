import type { Action, GameState } from "../types.js";

type OverrideTrumpAction = Extract<Action, { type: "OVERRIDE_TRUMP" }>;

export function applyOverrideTrump(state: GameState, action: OverrideTrumpAction): GameState {
    if (state.phase !== "DEAL") throw new Error(`cannot override trump in phase ${state.phase}`);
    if (state.trumpLocked) throw new Error("cannot override trump: trump is locked");

    const { seat, cardIds } = action;
    const [aId, bId] = cardIds;

    if (aId === bId) throw new Error("cannot override trump: must use two distinct cards");

    const hand = state.hands[seat];
    if (!hand.includes(aId) || !hand.includes(bId)) {
        throw new Error("cannot override trump: both cards must be in seat hand");
    }

    const a = state.cardsById[aId];
    const b = state.cardsById[bId];
    if (!a || !b) throw new Error("cannot override trump: unknown cardId");

    const nextRoundLeader = state.roundLeader ?? seat;

    // two matching jokers -> joker-only trump
    if (a.kind === "joker" && b.kind === "joker") {
        if (a.joker !== b.joker) {
            throw new Error("cannot override trump: jokers must match");
        }

        return {
            ...state,
            trumpDeclared: true,
            trumpSuit: undefined,
            trumpLocked: true,
            roundLeader: nextRoundLeader,
        };
    }

    // two level cards same suit -> suit trump
    if (a.kind !== "normal" || b.kind !== "normal") {
        throw new Error("cannot override trump: must use two level cards or two matching jokers");
    }
    if (a.rank !== state.levelRank || b.rank !== state.levelRank) {
        throw new Error(`cannot override trump: both cards must be level rank ${state.levelRank}`);
    }
    if (a.suit !== b.suit) {
        throw new Error("cannot override trump: level cards must be same suit");
    }

    return {
        ...state,
        trumpDeclared: true,
        trumpSuit: a.suit,
        trumpLocked: true,
        roundLeader: nextRoundLeader,
    };
}