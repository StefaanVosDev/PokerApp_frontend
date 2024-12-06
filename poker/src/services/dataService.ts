import {PlayingCard} from "../model/PlayingCard.ts";
import {Game} from "../model/Game.ts";
import axios from 'axios';
import PlayersHand from "../model/PlayersHand.ts";
import {Round} from "../model/Round.ts";
import {Turn} from "../model/Turn.ts";


axios.defaults.baseURL = "http://localhost:8081";

export async function checkAndMove (turnId: string | undefined, gameId: string, roundId: string) {
        await axios.put(`http://localhost:8081/api/turns/${turnId}/checkAndMove`, null, {
            params: {
                gameId: gameId,
                roundId: roundId,
            }
        });
}

export async function foldAndMove (turnId: string | undefined, gameId: string, roundId: string) {
    await axios.put(`http://localhost:8081/api/turns/${turnId}/foldAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
        }
    });
}

export async function callAndMove (turnId: string | undefined, gameId: string, roundId: string, amount: number) {
    await axios.put(`/api/turns/${turnId}/callAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
            amount: amount
        }
    });
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

export async function createNewRound(gameId: string) {
    if (gameId) {
        const response = await fetch(`http://localhost:8081/api/rounds?gameId=${gameId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }
    return null;
}

export async function createNewTurn(gameId: string) {
    if (gameId) {
        const response = await fetch(`http://localhost:8081/api/turns?gameId=${gameId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
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
export async function getCurrentRound(gameId: string) {
    if (gameId) {
        const {data: round} = await axios.get<Round>(`/api/rounds/current?gameId=${gameId}`);
        return round;
    }
    return null;
}

export async function getTurns(roundId: string | undefined) {
    if (roundId) {
        const {data: turns} = await axios.get<Turn[]>(`/api/turns/round?roundId=${roundId}`);
        return turns;
    }
    return null;
}

export async function dividePot(roundId: string | undefined) {
    if (roundId) {
        const {data: winnings} = await axios.put<Map<string, number>>(`/api/rounds/${roundId}/dividePot`)
        return winnings; //the strings are the UUIDs of the players
    }
}