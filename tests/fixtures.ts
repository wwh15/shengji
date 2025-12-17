import type {Card, CardId, GameState, Rank, Seat, Suit} from "../src/engine/types.js";

export function makeNormal(id: CardId, suit: Suit, rank: Rank, deckIndex: 0 | 1 = 0): Card {
    return { id, kind: "normal", suit, rank, deckIndex };
}

export function makeJoker(id: CardId, joker: "BJ" | "SJ", deckIndex: 0 | 1 = 0): Card {
    return { id, kind: "joker", joker, deckIndex };
}

export function baseState(overrides: Partial<GameState> = {}): GameState {
    const emptyHands = { 0: [], 1: [], 2: [], 3: [] } as Record<Seat, CardId[]>;

    const state: GameState = {
        config: { kittySize: 8 },
        cardsById: {},
        phase: "DEAL",
        levelRank: "2",
        roundLeader: 0,
        trumpSuit: undefined,
        trumpLocked: false,
        deck: [],
        dealIndex: 0,
        dealTo: 0,
        hands: emptyHands,
        kitty: [],
        buried: [],
        pointsDefenders: 0,
        ...overrides,
    };

    return state;
}
