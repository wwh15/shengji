import { describe, it, expect } from "vitest";
import { baseState, makeNormal } from "./fixtures.js";
import { applyPickupKitty } from "../src/engine/reducer/pickupKitty.js";

describe("applyPickupKitty", () => {
    it("moves kitty into leader hand, clears kitty, advances to BURY", () => {
        // 8 distinct kitty cards
        const k0 = makeNormal("k0", "S", "A");
        const k1 = makeNormal("k1", "H", "K");
        const k2 = makeNormal("k2", "D", "Q");
        const k3 = makeNormal("k3", "C", "J");
        const k4 = makeNormal("k4", "S", "10");
        const k5 = makeNormal("k5", "H", "9");
        const k6 = makeNormal("k6", "D", "8");
        const k7 = makeNormal("k7", "C", "7");

        const state = baseState({
            phase: "KITTY_PICKUP",
            roundLeader: 0,
            hands: { 0: [], 1: [], 2: [], 3: [] },
            kitty: ["k0", "k1", "k2", "k3", "k4", "k5", "k6", "k7"],
            cardsById: { k0, k1, k2, k3, k4, k5, k6, k7 },
        });

        const next = applyPickupKitty(state, 0);

        expect(next.phase).toBe("BURY");
        expect(next.kitty).toEqual([]);
        expect(next.hands[0].length).toBe(8);

        // same cards moved into hand (order may be sorted)
        expect(new Set(next.hands[0])).toEqual(new Set(state.kitty));
    });

    it("throws if non-leader tries to pick up", () => {
        const k0 = makeNormal("k0", "S", "A");

        const state = baseState({
            phase: "KITTY_PICKUP",
            roundLeader: 0,
            hands: { 0: [], 1: [], 2: [], 3: [] },
            kitty: ["k0", "k0", "k0", "k0", "k0", "k0", "k0", "k0"],
            cardsById: { k0 },
        });

        expect(() => applyPickupKitty(state, 1)).toThrow();
    });

    it("throws if kitty is not full", () => {
        const k0 = makeNormal("k0", "S", "A");

        const state = baseState({
            phase: "KITTY_PICKUP",
            roundLeader: 0,
            kitty: ["k0"],
            cardsById: { k0 },
        });

        expect(() => applyPickupKitty(state, 0)).toThrow();
    });
});
