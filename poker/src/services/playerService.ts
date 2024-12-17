import axios from "axios";
import PlayersHand from "../model/PlayersHand.ts";
import {Winner} from "../model/Winner.ts";

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