import Player from "./Player.ts";

export type GameMessage = {
    content: string,
    player: Player
    timestamp: Date
}