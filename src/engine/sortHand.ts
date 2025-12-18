import type { CardId, GameState, Suit, Rank } from "./types.js";

const suitOrder: Suit[] = ["S", "H", "D", "C"];
const rankHighToLow: Rank[] = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

function suitIndex(s: Suit): number {
    return suitOrder.indexOf(s);
}

function rankIndex(r: Rank): number {
    return rankHighToLow.indexOf(r);
}

function isLevel(card: { kind: "normal"; rank: Rank }, state: GameState): boolean {
    return card.rank === state.levelRank;
}

function isTrump(cardId: CardId, state: GameState): boolean {
    const c = state.cardsById[cardId];
    if (c.kind === "joker") return true;
    if (c.rank === state.levelRank) return true;
    if (state.trumpSuit !== undefined && c.suit === state.trumpSuit) return true;
    return false;
}

// returns a tuple; lexicographic ascending
// smaller key comes earlier in hand (stronger / more trump-forward)
function cardSortKey(cardId: CardId, state: GameState): number[] {
    const c = state.cardsById[cardId];

    // group 0: trump, group 1: non-trump
    const trumpGroup = isTrump(cardId, state) ? 0 : 1;

    if (c.kind === "joker") {
        // tier: 0 for bj, 1 for sj
        const jokerTier = c.joker === "BJ" ? 0 : 1;
        return [0, jokerTier, 0, 0];
    }

    if (trumpGroup === 0) {
        const hasTrumpSuit = state.trumpSuit !== undefined;

        const level = isLevel(c, state);
        const inTrumpSuit = hasTrumpSuit && c.suit === state.trumpSuit;

        // tier order within trump:
        // 0: (reserved for jokers above)
        // 1: trump-suit level card
        // 2: off-suit level cards (and all level cards if no trump suit)
        // 3: other trump-suit cards
        if (level && inTrumpSuit) {
            return [0, 1, 0, 0];
        }
        if (level) {
            return [0, 2, suitIndex(c.suit), 0];
        }
        // only possible if trumpSuit exists
        return [0, 3, 0, rankIndex(c.rank)];
    }

    // non-trumps: suit then rank
    return [1, suitIndex(c.suit), rankIndex(c.rank), 0];
}

export function sortHand(cardIds: CardId[], state: GameState): CardId[] {
    return [...cardIds].sort((a, b) => {
        const ka = cardSortKey(a, state);
        const kb = cardSortKey(b, state);

        for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
            const da = ka[i] ?? 0;
            const db = kb[i] ?? 0;
            if (da !== db) return da - db;
        }
        return 0;
    });
}
