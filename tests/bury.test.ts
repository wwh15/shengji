import { describe, it, expect } from "vitest";
import { baseState, makeNormal } from "./fixtures.js";
import { applyBury } from "../src/engine/reducer/bury.js";

describe("applyBury", () => {
    it("moves exactly kittySize cards from leader hand to buried and advances to TRICK_PLAY", () => {
        // leader has 10 cards
        const c0 = makeNormal("c0", "S", "A");
        const c1 = makeNormal("c1", "H", "K");
        const c2 = makeNormal("c2", "D", "Q");
        const c3 = makeNormal("c3", "C", "J");
        const c4 = makeNormal("c4", "S", "10");
        const c5 = makeNormal("c5", "H", "9");
        const c6 = makeNormal("c6", "D", "8");
        const c7 = makeNormal("c7", "C", "7");
        const c8 = makeNormal("c8", "S", "6");
        const c9 = makeNormal("c9", "H", "5");

        const state = baseState({
            phase: "BURY",
            roundLeader: 0,
            hands: { 0: ["c0","c1","c2","c3","c4","c5","c6","c7","c8","c9"], 1: [], 2: [], 3: [] },
            buried: [],
            cardsById: { c0,c1,c2,c3,c4,c5,c6,c7,c8,c9 },
        });

        const buryIds = ["c0","c1","c2","c3","c4","c5","c6","c7"];
        const next = applyBury(state, 0, buryIds);

        expect(next.phase).toBe("TRICK_PLAY");
        expect(next.buried).toEqual(buryIds);
        expect(next.hands[0].length).toBe(2);
        expect(new Set(next.hands[0])).toEqual(new Set(["c8", "c9"]));
    });

    it("throws if bury count is not kittySize", () => {
        const a = makeNormal("a", "S", "A");
        const b = makeNormal("b", "H", "K");

        const state = baseState({
            phase: "BURY",
            roundLeader: 0,
            hands: { 0: ["a", "b"], 1: [], 2: [], 3: [] },
            cardsById: { a, b },
        });

        expect(() => applyBury(state, 0, ["a"])).toThrow();
    });

    it("throws if any buried card is not in hand", () => {
        const a = makeNormal("a", "S", "A");
        const b = makeNormal("b", "H", "K");

        const state = baseState({
            phase: "BURY",
            roundLeader: 0,
            hands: { 0: ["a"], 1: [], 2: [], 3: [] },
            cardsById: { a, b },
        });

        const buryIds = ["a", "b", "a", "a", "a", "a", "a", "a"]; // wrong on purpose
        expect(() => applyBury(state, 0, buryIds)).toThrow();
    });

    it("throws if cardIds contain duplicates", () => {
        const cardsById: Record<string, any> = {};
        const hand: string[] = [];
        for (let i = 0; i < 8; i++) {
            const id = `c${i}`;
            const card = makeNormal(id, "S", "A");
            cardsById[id] = card;
            hand.push(id);
        }

        const state = baseState({
            phase: "BURY",
            roundLeader: 0,
            hands: { 0: hand, 1: [], 2: [], 3: [] },
            cardsById,
        });

        expect(() => applyBury(state, 0, ["c0","c0","c2","c3","c4","c5","c6","c7"])).toThrow();
    });
});
