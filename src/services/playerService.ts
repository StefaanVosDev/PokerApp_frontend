import axios from "axios";
import PlayersHand from "../model/PlayersHand.ts";
import {Winner} from "../model/Winner.ts";
import Player from "../model/Player";
import PlayerGame from "../model/PlayerGame";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getPlayerHand(id: string | undefined) {
    if (id) {
        const {data: hand} = await axios.get<PlayersHand>(`/api/cards/player/${id}`);
        return hand;
    }
    return null;

}

export async function getWinner(winnerId: string | undefined) {
    if (winnerId) {
        const {data: winner} = await axios.get<Winner>(`/api/players/winner?winnerId=${winnerId}`);
        return winner;
    }
}

export async function getPlayerOnMove(gameId: string | undefined) {
    const {data: player} = await axios.get<Player>(`/api/players/${gameId}/playerOnMove`);
    return player;
}
export async function getPlayersOnMove() {
    const {data: players} = await axios.get<PlayerGame[]>(`/api/players/playersOnMove`);
    return players;
}

export function getHandType(score: number) {
    switch (score) {
        case 900:
            return "Royal Flush";
        case 800:
            return "Straight Flush";
        case 700:
            return "Four of a Kind";
        case 600:
            return "Full House";
        case 500:
            return "Flush";
        case 400:
            return "Straight";
        case 300:
            return "Three of a Kind";
        case 200:
            return "Two Pair";
        case 100:
            return "One Pair";
        default:
            return "High Card";
    }
}