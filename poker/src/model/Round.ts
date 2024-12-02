import {Turn} from "./Turn.ts";

export type Round = {
    id: string;
    phase: Phase;
    dealerIndex: number;
    turns: Turn[];
    // communityCards: Card[];
    // deck: Card[];
    // game: Game;
    createdAt: string;
};

export enum Phase {
    PREFLOP = "PREFLOP",
    FLOP = "FLOP",
    TURN = "TURN",
    RIVER = "RIVER",
    FINISHED = "FINISHED",
}
