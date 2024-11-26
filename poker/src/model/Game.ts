import Player from "./Player.ts";

export default interface Game {
    id: string;
    status: string;
    maxPlayers: number;
    players: Player []; // Array of players
}