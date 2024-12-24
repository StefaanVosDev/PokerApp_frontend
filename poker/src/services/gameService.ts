import axios from "axios";
import {Game} from "../model/Game.ts";
import {CreateGameFormInputs} from "../components/game/forminput/CreateGameFormInputs.ts";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getGame(id: string) {
    const {data: game} = await axios.get<Game>(`/api/games/${id}`);
    return game;
}

export async function getGames() {
    const {data: games} = await axios.get<Game[]>('/api/games');
    return games;
}

export async function createGame(gameData: CreateGameFormInputs) {
    if (gameData) {
        const response = await axios.post('/api/games', gameData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    return null;
}

export async function joinGame(gameId: string) {
    await axios.post(`/api/games/${gameId}/join`);
}

export async function getIsOnMove(gameId: string | undefined) {
        const response = await axios.get(`/api/games/${gameId}/isOnMove`);
        console.log('isOnMove response:', response.data);
        return response.data;
}

export const getStatusColor = (status: string): string => {
    switch (status) {
        case "IN_PROGRESS":
            return "green";
        case "FINISHED":
            return "gray";
        case "WAITING":
            return "yellow";
        default:
            return "white";  // Default color in case the status doesn't match any of the above
    }
};

export async function updateGameStatus(gameId : string | undefined) {
    const response = await axios.put(`/api/games/${gameId}/status`);
    return response.data;
}
