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
    ON_MOVE,
    RAISE,
    CALL,
    FOLD,
    ALL_IN,
    CHECK,
    SMALL_BLIND,
    BIG_BLIND
}
