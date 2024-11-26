import {PlayingCard} from "../model/PlayingCard.ts";
import axios from 'axios'
import Game from "../model/Game.ts";
import PlayersHand from "../model/PlayersHand.ts";


axios.defaults.baseURL = "http://localhost:8081";

export async function checkTurn(turnId: string | undefined) {
    if (turnId) {
        const response = await fetch(`http://localhost:8081/api/turns/${turnId}/check`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }
    return null;
}


type StringWrapper = {
    content: string;
}

export async function getCurrentTurnId(gameId: string) {
    if (gameId) {
        const response = await fetch(`http://localhost:8081/api/turns/current?gameId=${gameId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as Promise<StringWrapper>
    }
    return null;
}


export async function getCommunityCards(id: string) {
    if (id) {
        const response = await fetch(`http://localhost:8081/api/rounds/communityCards?gameId=${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as Promise<PlayingCard[]>;
    }
    return null;
}



// Get a Game

export async function getGame(id: string) {
    const {data: game} = await axios.get<Game>(`/api/games/${id}`);
    return game;
}

export async function getGames() {
    const {data: games} = await axios.get<Game[]>('/api/games');
    return games;
}


//get a player's hand
export async function getPlayerHand(id: string) {

    const {data: hand} = await axios.get<PlayersHand>(`/api/cards/player/${id}`);
    return hand;

}

