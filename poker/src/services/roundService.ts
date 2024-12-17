import axios from "axios";
import {PlayingCard} from "../model/PlayingCard.ts";
import {Round} from "../model/Round.ts";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getCommunityCards(id: string) {
    if (id) {
        const {data} = await axios.get<PlayingCard[]>(`/api/rounds/communityCards?gameId=${id}`);
        return data;
    }
    return null;
}

export async function createNewRound(gameId: string | undefined) {
    if (gameId) {
        const {data} = await axios.post(`/api/rounds?gameId=${gameId}`);
        return data;
    }
    return null;
}

export async function getCurrentRound(gameId: string) {
    if (gameId) {
        const {data: round} = await axios.get<Round>(`/api/rounds/current?gameId=${gameId}`);
        return round;
    }
    return null;
}


export async function dividePot(roundId: string | undefined) {
    if (roundId) {
        const {data: winners} = await axios.put<Map<string, number>>(`/api/rounds/${roundId}/dividePot`)
        return winners; //the strings are the UUIDs of the players
    }
}

export async function createNewRoundIfFinished(gameId: string, roundId: string | undefined) {
    if (gameId && roundId) {
        await axios.post(`/api/rounds/createNewRoundIfFinished`, null, {
            params: {
                gameId: gameId,
                roundId: roundId
            }
        });
    }
}
