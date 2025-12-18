export type Suit = "S" | "H" | "D" | "C";
export type Joker = "BJ" | "SJ";

export type Rank =
    | "A" | "K" | "Q" | "J" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

export type Seat = 0 | 1 | 2 | 3;
export type Team = 0 | 1;

export type CardId = string;

export type Card =
    | { id: CardId; kind: "normal"; suit: Suit; rank: Rank; deckIndex: 0 | 1 }
    | { id: CardId; kind: "joker"; joker: Joker; deckIndex: 0 | 1 };

export type Phase =
    | "DEAL"
    | "KITTY_PICKUP"
    | "BURY"
    | "TRICK_PLAY"
    | "ROUND_END";

export type TrumpSuit = Suit;

export type GameConfig = {
    kittySize: 8;
};

export type DealResult = {
    hands: Record<Seat, CardId[]>;
    kitty: CardId[];
};

export type Reveal =
    | { kind: "DECLARE"; seat: Seat; cardIds: [CardId] }
    | { kind: "OVERRIDE"; seat: Seat; cardIds: [CardId, CardId] };


export type GameState = {
    config: GameConfig;

    // cards live in a lookup table, state only stores CardId references
    cardsById: Record<CardId, Card>;

    phase: Phase;

    // round metadata
    levelRank: Rank; // your "trump #" / current level
    roundLeader?: Seat;

    // trump selection outcome
    trumpSuit?: TrumpSuit;
    trumpDeclared: boolean; // has a trump been declared
    trumpLocked: boolean; // no overriding allowed anymore

    reveal?: Reveal,

    // deal state
    deck: CardId[];        // shuffled 108 card ids
    dealIndex: number;     // next index to deal (0..99)
    dealTo: Seat;

    // piles
    hands: Record<Seat, CardId[]>;
    kitty: CardId[];
    buried: CardId[];

    // scoring placeholders for now
    pointsDefenders: number;
};

export type Action =
    | { type: "DEAL_ONE"}
    | { type: "DECLARE_TRUMP"; seat: Seat; cardId: CardId }
    | { type: "OVERRIDE_TRUMP"; seat: Seat; cardIds: [CardId, CardId] }
    | { type: "PICKUP_KITTY"; seat: Seat }
    | { type: "BURY"; seat: Seat; cardIds: CardId[] };
