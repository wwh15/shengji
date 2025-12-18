import { describe, it, expect } from "vitest";
import { applyOverrideTrump } from "../src/engine/reducer/overrideTrump.js";
import { baseState, makeJoker, makeNormal } from "./fixtures.js";

describe("applyOverrideTrump", () => {
    it("locks trump to suit when overriding with two level cards of same suit", () => {
        const s2a = makeNormal("s2a", "S", "2");
        const s2b = makeNormal("s2b", "S", "2");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { s2a, s2b },
            hands: { 0: ["s2a", "s2b"], 1: [], 2: [], 3: [] },
            trumpDeclared: false,
            trumpLocked: false,
            trumpSuit: undefined,
            roundLeader: 1,
        });

        const s1 = applyOverrideTrump(s0, {
            type: "OVERRIDE_TRUMP",
            seat: 0,
            cardIds: ["s2a", "s2b"],
        });

        expect(s1.trumpDeclared).toBe(true);
        expect(s1.trumpLocked).toBe(true);
        expect(s1.trumpSuit).toBe("S");
        expect(s1.roundLeader).toBe(1); // already set, should not change
    });

    it("sets roundLeader to seat if roundLeader was unset", () => {
        const h2a = makeNormal("h2a", "H", "2");
        const h2b = makeNormal("h2b", "H", "2");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { h2a, h2b },
            hands: { 0: [], 1: [], 2: ["h2a", "h2b"], 3: [] },
            roundLeader: undefined,
        });

        const s1 = applyOverrideTrump(s0, {
            type: "OVERRIDE_TRUMP",
            seat: 2,
            cardIds: ["h2a", "h2b"],
        });

        expect(s1.roundLeader).toBe(2);
    });

    it("locks into joker-only trump when overriding with two matching jokers", () => {
        const bj1 = makeJoker("bj1", "BJ");
        const bj2 = makeJoker("bj2", "BJ");

        const s0 = baseState({
            cardsById: { bj1, bj2 },
            hands: { 0: [], 1: ["bj1", "bj2"], 2: [], 3: [] },
            trumpDeclared: false,
            trumpLocked: false,
            trumpSuit: "H", // should get cleared in joker-only mode
            roundLeader: undefined,
        });

        const s1 = applyOverrideTrump(s0, {
            type: "OVERRIDE_TRUMP",
            seat: 1,
            cardIds: ["bj1", "bj2"],
        });

        expect(s1.trumpDeclared).toBe(true);
        expect(s1.trumpLocked).toBe(true);
        expect(s1.trumpSuit).toBeUndefined();
        expect(s1.roundLeader).toBe(1);
    });

    it("throws if not in DEAL phase", () => {
        const s2a = makeNormal("s2a", "S", "2");
        const s2b = makeNormal("s2b", "S", "2");

        const s0 = baseState({
            phase: "KITTY_PICKUP",
            cardsById: { s2a, s2b },
            hands: { 0: ["s2a", "s2b"], 1: [], 2: [], 3: [] },
        });

        expect(() =>
            applyOverrideTrump(s0, {
                type: "OVERRIDE_TRUMP",
                seat: 0,
                cardIds: ["s2a", "s2b"],
            })
        ).toThrow();
    });

    it("throws if trump is locked", () => {
        const s2a = makeNormal("s2a", "S", "2");
        const s2b = makeNormal("s2b", "S", "2");

        const s0 = baseState({
            cardsById: { s2a, s2b },
            hands: { 0: ["s2a", "s2b"], 1: [], 2: [], 3: [] },
            trumpLocked: true,
        });

        expect(() =>
            applyOverrideTrump(s0, {
                type: "OVERRIDE_TRUMP",
                seat: 0,
                cardIds: ["s2a", "s2b"],
            })
        ).toThrow("trump is locked");
    });

    it("throws if cards are not both in seat hand", () => {
        const s2a = makeNormal("s2a", "S", "2");
        const s2b = makeNormal("s2b", "S", "2");

        const s0 = baseState({
            cardsById: { s2a, s2b },
            hands: { 0: ["s2a"], 1: [], 2: [], 3: [] }, // missing s2b
        });

        expect(() =>
            applyOverrideTrump(s0, {
                type: "OVERRIDE_TRUMP",
                seat: 0,
                cardIds: ["s2a", "s2b"],
            })
        ).toThrow();
    });

    it("throws if two different jokers are used", () => {
        const bj = makeJoker("bj", "BJ");
        const sj = makeJoker("sj", "SJ");

        const s0 = baseState({
            cardsById: { bj, sj },
            hands: { 0: ["bj", "sj"], 1: [], 2: [], 3: [] },
        });

        expect(() =>
            applyOverrideTrump(s0, {
                type: "OVERRIDE_TRUMP",
                seat: 0,
                cardIds: ["bj", "sj"],
            })
        ).toThrow("jokers must match");
    });

    it("throws if two level cards are not the same suit", () => {
        const s2 = makeNormal("s2", "S", "2");
        const h2 = makeNormal("h2", "H", "2");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { s2, h2 },
            hands: { 0: ["s2", "h2"], 1: [], 2: [], 3: [] },
        });

        expect(() =>
            applyOverrideTrump(s0, {
                type: "OVERRIDE_TRUMP",
                seat: 0,
                cardIds: ["s2", "h2"],
            })
        ).toThrow("same suit");
    });

    it("throws if both cards are normal but not the level rank", () => {
        const sA = makeNormal("sA", "S", "A");
        const sK = makeNormal("sK", "S", "K");

        const s0 = baseState({
            levelRank: "2",
            cardsById: { sA, sK },
            hands: { 3: ["sA", "sK"], 0: [], 1: [], 2: [] },
        });

        expect(() =>
            applyOverrideTrump(s0, {
                type: "OVERRIDE_TRUMP",
                seat: 3,
                cardIds: ["sA", "sK"],
            })
        ).toThrow("level rank");
    });

    it("throws if the same card id is provided twice", () => {
        const s2 = makeNormal("s2", "S", "2");

        const s0 = baseState({
            cardsById: { s2 },
            hands: { 0: ["s2"], 1: [], 2: [], 3: [] },
        });

        expect(() =>
            applyOverrideTrump(s0, {
                type: "OVERRIDE_TRUMP",
                seat: 0,
                cardIds: ["s2", "s2"],
            })
        ).toThrow("two distinct cards");
    });
});
