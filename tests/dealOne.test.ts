import { describe, it, expect } from "vitest";
import { applyDealOne } from "../src/engine/reducer/dealOne.js";
import { baseState, makeNormal } from "./fixtures.js";

describe("applyDealOne", () => {
    it("deals one card to dealTo and advances dealIndex/dealTo", () => {
        const c0 = makeNormal("c0", "H", "A");
        const c1 = makeNormal("c1", "S", "K");

        const s0 = baseState({
            cardsById: { c0, c1 },
            deck: ["c0", "c1", "c2", "c3", "c4", "c2", "c3", "c4", "c2", "c3", "c4"] as any,
            dealIndex: 0,
            dealTo: 2,
            hands: { 0: [], 1: [], 2: [], 3: [] },
        });

        const s1 = applyDealOne(s0);

        expect(s1.hands[2]).toEqual(["c0"]);
        expect(s1.dealIndex).toBe(1);
        expect(s1.dealTo).toBe(3);
        expect(s0.hands[2]).toEqual([]);
    });

    it("moves to KITTY_PICKUP and exposes kitty when deal completes", () => {
        const c0 = makeNormal("c0", "H", "A");
        const c1 = makeNormal("c1", "S", "K");
        const k0 = makeNormal("k0", "D", "Q");
        const k1 = makeNormal("k1", "C", "J");
        const k2 = makeNormal("k2", "H", "10");
        const k3 = makeNormal("k3", "S", "9");
        const k4 = makeNormal("k4", "D", "8");
        const k5 = makeNormal("k5", "C", "7");
        const k6 = makeNormal("k6", "H", "6");
        const k7 = makeNormal("k7", "S", "5");

        const s0 = baseState({
            cardsById: { c0, c1, k0, k1, k2, k3, k4, k5, k6, k7 },
            deck: ["c0", "c1", "k0","k1","k2","k3","k4","k5","k6","k7"],
            dealIndex: 1,
            dealTo: 0,
        });

        const s1 = applyDealOne(s0);

        expect(s1.phase).toBe("KITTY_PICKUP");
        expect(s1.kitty).toEqual(["k0","k1","k2","k3","k4","k5","k6","k7"]);
    });
});
