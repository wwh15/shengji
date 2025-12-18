import { Card } from "./types.js";
import { makeCardId, RANKS, SUITS } from "./cards.js";

export function makeDoubleDeck(): { cards: Card[]; cardsById: Record<string, Card> } {
    const cards: Card[] = [];
    const cardsById: Record<string, Card> = {};

    for (const deckIndex of [0, 1] as const) {
        // normal cards
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                const id = makeCardId(deckIndex, "normal", suit, rank, cards.length);
                const c: Card = { id, kind: "normal", suit, rank, deckIndex };
                cards.push(c);
                cardsById[id] = c;
            }
        }
        // jokers
        for (const joker of ["BJ", "SJ"] as const) {
            const id = makeCardId(deckIndex, "joker", joker, undefined, cards.length);
            const c: Card = { id, kind: "joker", joker, deckIndex };
            cards.push(c);
            cardsById[id] = c;
        }
    }

    return { cards, cardsById };
}

// deterministic rng (mulberry32)
export function makeRng(seed: number): () => number {
    let t = seed >>> 0;
    return () => {
        t += 0x6D2B79F5;
        let x = Math.imul(t ^ (t >>> 15), 1 | t);
        x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = arr[i];
        arr[i] = arr[j]!;
        arr[j] = tmp!;
    }
    return arr;
}
