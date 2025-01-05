import Player from "./Player.ts";
import {Phase, Round} from "./Round.ts";

export type Turn = {
    id: string;
    player: Player;
    moveMade: PlayerStatus;
    moneyGambled: number;
    round: Round;
    madeInPhase: Phase;
    createdAt: Date;
}

export enum PlayerStatus {
    ON_MOVE = "ON_MOVE",
    RAISE = "RAISE",
    CALL = "CALL",
    FOLD = "FOLD",
    ALL_IN = "ALL_IN",
    CHECK = "CHECK",
    SMALL_BLIND = "SMALL_BLIND",
    BIG_BLIND = "BIG_BLIND"
}
