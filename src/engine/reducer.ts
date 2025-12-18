import {Action, GameState} from "./types.js";
import {applyDealOne} from "./reducer/dealOne";
import {applyDeclareTrump} from "./reducer/declareTrump";
import {applyOverrideTrump} from "./reducer/overrideTrump";

export function applyAction(state: GameState, action: Action): GameState {
    switch (action.type) {

        case "DEAL_ONE":
            return applyDealOne(state);

        case "DECLARE_TRUMP":
           return applyDeclareTrump(state, action)

        case "OVERRIDE_TRUMP":
            return applyOverrideTrump(state, action)

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
