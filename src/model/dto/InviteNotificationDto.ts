import {Game} from "../Game.ts";

export default interface InviteNotificationDto {
    id: string;
    game: Game;
    message: string;
    accountUsername: string
    friendUsername: string
    timestamp: Date;
}
