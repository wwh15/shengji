import { describe, it, expect } from "vitest";
import { applyDeclareTrump } from "../src/engine/reducer/declareTrump.js";
import { baseState, makeNormal, makeJoker } from "./fixtures.js";

describe("applyDeclareTrump", () => {
    it("sets trumpSuit to the suit of a level-rank card in the seat's hand", () => {
        const d2 = makeNormal("d2", "D", "2");
        const hA = makeNormal("hA", "H", "A");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { d2, hA },
            hands: { 0: ["d2", "hA"], 1: [], 2: [], 3: [] },
            trumpSuit: undefined,
            trumpLocked: false,
            trumpDeclared: false,
            phase: "DEAL",
        });

        const s1 = applyDeclareTrump(s0, {
            type: "DECLARE_TRUMP",
            seat: 0,
            cardId: "d2",
        });

        expect(s1.trumpSuit).toBe("D");
        expect(s1.trumpDeclared).toBe(true);
    });

    it("throws if card is not the level rank", () => {
        const hA = makeNormal("hA", "H", "A");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { hA },
            hands: { 0: ["hA"], 1: [], 2: [], 3: [] },
            trumpDeclared: false,
            phase: "DEAL",
        });

        expect(() =>
            applyDeclareTrump(s0, { type: "DECLARE_TRUMP", seat: 0, cardId: "hA" })
        ).toThrow();
    });

    it("throws if trying to declare with a joker", () => {
        const bj = makeJoker("bj", "BJ");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { bj },
            hands: { 0: ["bj"], 1: [], 2: [], 3: [] },
            trumpDeclared: false,
            phase: "DEAL",
        });

        expect(() =>
            applyDeclareTrump(s0, { type: "DECLARE_TRUMP", seat: 0, cardId: "bj" })
        ).toThrow();
    });

    it("throws if trying to declare twice", () => {
        const s2 = makeNormal("s2", "S", "2");
        const h2 = makeNormal("h2", "H", "2");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { s2, h2 },
            hands: { 0: ["s2", "h2"], 1: [], 2: [], 3: [] },
            phase: "DEAL",
            trumpDeclared: false,
            trumpLocked: false,
        });

        const s1 = applyDeclareTrump(s0, {
            type: "DECLARE_TRUMP",
            seat: 0,
            cardId: "s2",
        });

        expect(s1.trumpSuit).toBe("S");
        expect(s1.trumpDeclared).toBe(true);

        expect(() =>
            applyDeclareTrump(s1, {
                type: "DECLARE_TRUMP",
                seat: 0,
                cardId: "h2",
            })
        ).toThrow();
    });

    it("sets round leader to declaring seat if first round", () => {
        const s2 = makeNormal("s2", "S", "2");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { s2 },
            hands: { 0: [], 1: [], 2: ["s2"], 3: [] },
            phase: "DEAL",
            trumpDeclared: false,
            trumpLocked: false,
            roundLeader: undefined,
        });

        const s1 = applyDeclareTrump(s0, {
            type: "DECLARE_TRUMP",
            seat: 2,
            cardId: "s2",
        });

        expect(s1.roundLeader).toBe(2);
    });
});
