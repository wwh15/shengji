import { GameConfig, GameState, Rank, Seat } from "./types.js";
import { makeDoubleDeck, makeRng, shuffle } from "./deck.js";

export function initialState(seed: number): GameState {
    const config: GameConfig = { kittySize: 8 };

    const { cards, cardsById } = makeDoubleDeck();
    const rng = makeRng(seed);

    const deck = shuffle(cards.map((c) => c.id), rng);

    const levelRank: Rank = "2";

    const hands: Record<Seat, string[]> = { 0: [], 1: [], 2: [], 3: [] };

    return {
        config,
        cardsById,

        phase: "DEAL",

        levelRank,

        trumpSuit: undefined,
        trumpDeclared: false,
        trumpLocked: false,

        deck,
        dealIndex: 0,
        dealTo: 0,

        hands: hands as Record<Seat, string[]>,
        kitty: [],
        buried: [],

        pointsDefenders: 0,
    };
}
