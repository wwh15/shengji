import { describe, it, expect } from "vitest";
import { sortHand } from "../src/engine/sortHand.js";
import { baseState, makeNormal, makeJoker } from "./fixtures.js";

describe("sortHand (shengji order)", () => {
    it("orders trump correctly: BJ, SJ, trump-suit level, off-suit levels, other trump-suit, then non-trumps", () => {
        // level rank is 2, trump suit is hearts
        const BJ = makeJoker("BJ", "BJ");
        const SJ = makeJoker("SJ", "SJ");

        const h2 = makeNormal("h2", "H", "2"); // trump-suit level
        const s2 = makeNormal("s2", "S", "2"); // off-suit level
        const d2 = makeNormal("d2", "D", "2"); // off-suit level
        const c2 = makeNormal("c2", "C", "2"); // off-suit level

        const hA = makeNormal("hA", "H", "A"); // other trump-suit
        const hK = makeNormal("hK", "H", "K"); // other trump-suit

        const sA = makeNormal("sA", "S", "A"); // non-trump
        const dA = makeNormal("dA", "D", "A"); // non-trump

        const state = baseState({
            levelRank: "2",
            trumpSuit: "H",
            trumpDeclared: true,
            trumpLocked: true,
            cardsById: { BJ, SJ, h2, s2, d2, c2, hA, hK, sA, dA },
        });

        const input = ["sA", "hK", "d2", "SJ", "hA", "c2", "h2", "dA", "BJ", "s2"];
        const output = sortHand(input, state);

        // expected:
        // 1) BJ, SJ
        // 2) trump-suit level (h2)
        // 3) other level cards (ordered by suitOrder S,H,D,C in our implementation)
        // 4) other trump suit cards (A then K since rankHighToLow is A,K,...)
        // 5) non-trumps (by suit then rank)
        expect(output).toEqual([
            "BJ",
            "SJ",
            "h2",
            "s2",
            "d2",
            "c2",
            "hA",
            "hK",
            "sA",
            "dA",
        ]);
    });

    it("treats joker-only trump correctly: trump = jokers + all level cards (no suit trumps)", () => {
        // level rank is 2, trumpSuit is undefined (joker-only trump)
        const BJ = makeJoker("BJ", "BJ");
        const SJ = makeJoker("SJ", "SJ");

        const h2 = makeNormal("h2", "H", "2");
        const s2 = makeNormal("s2", "S", "2");

        const hA = makeNormal("hA", "H", "A"); // NOT trump in joker-only mode
        const sA = makeNormal("sA", "S", "A"); // NOT trump in joker-only mode

        const state = baseState({
            levelRank: "2",
            trumpSuit: undefined,
            trumpDeclared: true,
            trumpLocked: true,
            cardsById: { BJ, SJ, h2, s2, hA, sA },
        });

        const input = ["hA", "s2", "SJ", "sA", "BJ", "h2"];
        const output = sortHand(input, state);

        // expected:
        // 1) BJ, SJ
        // 2) all level cards (s2 before h2 due to suitOrder S,H,D,C)
        // 3) non-trumps (sA before hA due to suitOrder)
        expect(output).toEqual(["BJ", "SJ", "s2", "h2", "sA", "hA"]);
    });

    it("is stable for identical cards (does not crash, preserves a valid permutation)", () => {
        const sA = makeNormal("sA", "S", "A");
        const dA = makeNormal("dA", "D", "A");

        const state = baseState({
            levelRank: "2",
            trumpSuit: "H",
            trumpDeclared: true,
            trumpLocked: true,
            cardsById: { sA, dA },
        });

        const input = ["dA", "sA"];
        const output = sortHand(input, state);

        expect(output.sort()).toEqual(input.sort());
    });
});
