import { GameConfig, GameState, Rank, Seat } from "./types.js";
import { makeDoubleDeck, makeRng, shuffle } from "./deck.js";

export function initialState(seed: number): GameState {
    const config: GameConfig = { kittySize: 8 };

    const { cards, cardsById } = makeDoubleDeck();
    const rng = makeRng(seed);

    const deck = shuffle(cards.map((c) => c.id), rng);

    const levelRank: Rank = "2";
    const roundLeader: Seat = 0;

    const hands: Record<Seat, string[]> = { 0: [], 1: [], 2: [], 3: [] };

    return {
        config,
        cardsById,

        phase: "DEAL",

        levelRank,
        roundLeader,

        trumpSuit: undefined,
        trumpLocked: false,

        deck,
        dealIndex: 0,
        dealTo: roundLeader,

        hands: hands as Record<Seat, string[]>,
        kitty: [],
        buried: [],

        pointsDefenders: 0,
    };
}
