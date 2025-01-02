import {Game} from "../Game.ts";

export default interface GameNotificationDto {
    id: string;
    game: Game;
    message: string;
    accountUsername: string
    timestamp: Date;
}
