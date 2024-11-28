export type Round = {
    id: string;
    phase: Phase;
    dealerIndex: number;
    // turns: Turn[];
    // communityCards: Card[];
    // deck: Card[];
    // game: Game;
    createdAt: string;
};

enum Phase {
    PREFLOP = "PREFLOP",
    FLOP = "FLOP",
    TURN = "TURN",
    RIVER = "RIVER",
    FINISHED = "FINISHED",
}
