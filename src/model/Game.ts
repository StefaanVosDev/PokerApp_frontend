import Player from "./Player.ts";
import Configuration from "./Configuration.ts";

export type Game = {
    id: string;
    status: string;
    maxPlayers: number;
    players: Player[];
    name : string;
    winner : Player;
    settings: Configuration;
    currentPlayerOnMove: string
}