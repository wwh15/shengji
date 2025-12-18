import { describe, it, expect } from "vitest";
import { applyAction } from "../src/engine/reducer.js";
import { baseState, makeNormal, makeJoker } from "./fixtures.js";

describe("DECLARE_TRUMP", () => {
    it("sets trumpSuit to the suit of a level-rank card in the seat's hand", () => {
        const d2 = makeNormal("d2", "D", "2");
        const hA = makeNormal("hA", "H", "A");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { d2, hA },
            hands: { 0: ["d2", "hA"], 1: [], 2: [], 3: [] },
            trumpSuit: undefined,
            trumpLocked: false,
            phase: "DEAL",
        });

        const s1 = applyAction(s0, { type: "DECLARE_TRUMP", seat: 0, cardId: "d2" });

        expect(s1.trumpSuit).toBe("D");
    });

    it("throws if card is not the level rank", () => {
        const hA = makeNormal("hA", "H", "A");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { hA },
            hands: { 0: ["hA"], 1: [], 2: [], 3: [] },
            phase: "DEAL",
        });

        expect(() =>
            applyAction(s0, { type: "DECLARE_TRUMP", seat: 0, cardId: "hA" })
        ).toThrow();
    });

    it("throws if trying to declare with a joker", () => {
        const bj = makeJoker("bj", "BJ");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { bj },
            hands: { 0: ["bj"], 1: [], 2: [], 3: [] },
            phase: "DEAL",
        });

        expect(() =>
            applyAction(s0, { type: "DECLARE_TRUMP", seat: 0, cardId: "bj" })
        ).toThrow();
    });

    it("throws if trying to declare twice", () => {
        const s2 = makeNormal("s2", "S", "2");
        const h2 = makeNormal("h2", "H", "2");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { s2, h2 },
            hands: {
                0: ["s2", "h2"],
                1: [],
                2: [],
                3: [],
            },
            phase: "DEAL",
            trumpSuit: undefined,
            trumpLocked: false,
        });

        // first declaration succeeds
        const s1 = applyAction(s0, {
            type: "DECLARE_TRUMP",
            seat: 0,
            cardId: "s2",
        });

        expect(s1.trumpSuit).toBe("S");

        // simulate trump being locked after declaration
        const s1Locked = {
            ...s1,
            trumpLocked: true,
        };

        // second declaration should throw
        expect(() =>
            applyAction(s1Locked, {
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
            hands: {
                0: [],
                1: [],
                2: ["s2"],
                3: [],
            },
            phase: "DEAL",
            trumpSuit: undefined,
            roundLeader: undefined,
            trumpLocked: false
        });

        const s1 = applyAction(s0, {
            type: "DECLARE_TRUMP",
            seat: 2,
            cardId: "s2",
        });

        expect(s1.roundLeader).toBe(2);
    });

});
