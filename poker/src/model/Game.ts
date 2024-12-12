import Player from "./Player.ts";

export type Game = {
    id: string;
    status: string;
    maxPlayers: number;
    players: Player []; // Array of players
    name : string;
    winner : Player;
}