import {Action, GameState, Seat} from "./types.js";

export function applyAction(state: GameState, action: Action): GameState {
    switch (action.type) {

        case "DEAL_ONE": {
            if (state.phase !== "DEAL") {
                throw new Error(`cannot deal in phase ${state.phase}`);
            }

            const dealLimit = state.deck.length - state.config.kittySize; // 108 - 8 = 100
            if (state.dealIndex >= dealLimit) {
                throw new Error("deal is already complete");
            }

            const cardId = state.deck[state.dealIndex];
            if (!cardId) {
                throw new Error("no card available to deal");
            }

            const seat = state.dealTo;

            const nextHands: GameState["hands"] = {
                ...state.hands,
                [seat]: [...state.hands[seat], cardId],
            };

            const nextDealIndex = state.dealIndex + 1;
            const nextDealTo = ((seat + 1) % 4) as Seat;

            // when dealing is done, expose kitty and move to kitty pickup
            if (nextDealIndex === dealLimit) {
                const kitty = state.deck.slice(dealLimit);

                return {
                    ...state,
                    hands: nextHands,
                    dealIndex: nextDealIndex,
                    dealTo: nextDealTo,
                    kitty,
                    phase: "KITTY_PICKUP",
                };
            }

            return {
                ...state,
                hands: nextHands,
                dealIndex: nextDealIndex,
                dealTo: nextDealTo,
            };
        }

        case "DECLARE_TRUMP": {
            if (state.phase !== "DEAL") {
                throw new Error(`cannot declare trump in phase ${state.phase}`);
            }
            if (state.trumpLocked || state.trumpDeclared) {
                throw new Error("cannot declare trump: trump is established already");
            }

            const { seat, cardId } = action;

            const card = state.cardsById[cardId];
            if (!card) {
                throw new Error(`cannot declare trump: unknown cardId ${cardId}`);
            }

            const hand = state.hands[seat];
            if (!hand.includes(cardId)) {
                throw new Error("cannot declare trump: card is not in seat hand");
            }

            if (card.kind !== "normal") {
                throw new Error("cannot declare trump: must declare with a suited level card");
            }

            if (card.rank !== state.levelRank) {
                throw new Error(
                    `cannot declare trump: must declare with level rank ${state.levelRank}`
                );
            }

            const nextRoundLeader = state.roundLeader ?? action.seat;

            return {
                ...state,
                trumpSuit: card.suit,
                trumpDeclared: true,
                // if declarer should become round leader, uncomment:
                roundLeader: nextRoundLeader,
            };
        }

        case "OVERRIDE_TRUMP":
            // implement next
            return state;

        case "PICKUP_KITTY":
            // implement later
            return state;

        case "BURY":
            // implement later
            return state;

        default: {
            return action;
        }
    }
}
