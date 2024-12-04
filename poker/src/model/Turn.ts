import Player from "./Player.ts";
import {Phase} from "./Round.ts";

export type Turn = {
    id: string;
    player: Player;
    moveMade: PlayerStatus;
    moneyGambled: number;
    roundId: string;
    madeInPhase: Phase;
}

enum PlayerStatus {
    ON_MOVE,
    RAISE,
    CALL,
    FOLD,
    ALL_IN,
    CHECK,
    SMALL_BLIND,
    BIG_BLIND
}
