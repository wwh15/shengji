import { Card, CardId, Joker, Rank, Suit } from "./types.js";

export const SUITS: readonly Suit[] = ["S", "H", "D", "C"] as const;
export const RANKS: readonly Rank[] = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"] as const;

export function makeCardId(deckIndex: 0 | 1, kind: "normal" | "joker", suitOrJoker: string, rank?: string, serial?: number): CardId {
    // simple unique id; stable and readable
    // e.g. "d0-N-H-7-12" or "d1-J-BJ-0"
    if (kind === "joker") return `d${deckIndex}-J-${suitOrJoker}-${serial ?? 0}`;
    return `d${deckIndex}-N-${suitOrJoker}-${rank}-${serial ?? 0}`;
}

export function isRank(card: Card, r: Rank): boolean {
    return card.kind === "normal" && card.rank === r;
}

export function isSuit(card: Card, s: Suit): boolean {
    return card.kind === "normal" && card.suit === s;
}

export function isJoker(card: Card, j?: Joker): boolean {
    return card.kind === "joker" && (j ? card.joker === j : true);
}
