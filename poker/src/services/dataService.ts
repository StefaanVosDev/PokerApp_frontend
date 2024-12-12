import {PlayingCard} from "../model/PlayingCard.ts";
import {Game} from "../model/Game.ts";
import axios from 'axios';
import PlayersHand from "../model/PlayersHand.ts";
import {Round} from "../model/Round.ts";
import {Turn} from "../model/Turn.ts";
import Account from "../model/Account.ts";
import {CreateGameFormInputs} from "../components/game/forminput/CreateGameFormInputs";
import {Winner} from "../model/Winner.ts";


axios.defaults.baseURL = "http://localhost:8081";


export async function createAccount(account: Account) {
    const {data} = await axios.post<Account>('/api/accounts', {
        username: account.username,
        email: account.email,
        name: account.name,
        age: account.age,
        city: account.city,
        gender: account.gender.toUpperCase(),
    });
    return data;
}

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

export async function raiseAndMove (turnId: string | undefined, gameId: string, roundId: string, amount: number) {
    await axios.put(`/api/turns/${turnId}/raiseAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
            amount: amount
        }
    });
}

export async function allinAndMove (turnId: string | undefined, gameId: string, roundId: string) {
    await axios.put(`/api/turns/${turnId}/allinAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
        }
    });

}

type StringWrapper = {
    content: string;
}

export async function getCurrentTurnId(gameId: string) {
    if (gameId) {
        const {data} = await axios.get<StringWrapper>(`/api/turns/current?gameId=${gameId}`);
        return data;
    }
    return null;
}


export async function getCommunityCards(id: string) {
    if (id) {
        const {data} = await axios.get<PlayingCard[]>(`/api/rounds/communityCards?gameId=${id}`);
        return data;
    }
    return null;
}

export async function createNewRound(gameId: string | null) {
    if (gameId) {
        const {data} = await axios.post(`/api/rounds?gameId=${gameId}`);
        return data;
    }
    return null;
}

export async function createNewTurn(gameId: string) {
    if (gameId) {
        const {data} = await axios.post(`/api/turns?gameId=${gameId}`);
        return data;
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

export async function dividePot(roundId: string | undefined) {
    if (roundId) {
        const {data: winners} = await axios.put<Map<string, number>>(`/api/rounds/${roundId}/dividePot`)
        return winners; //the strings are the UUIDs of the players
    }
}

export async function createNewRoundIfFinished(gameId: string | undefined, roundId: string | undefined) {
    if (gameId && roundId) {
        await axios.post(`/api/rounds/createNewRoundIfFinished`, null, {
            params: {
                gameId: gameId,
                roundId: roundId
            }
        });
    }
}

export async function joinGame(gameId: string) {
    await axios.post(`/api/games/${gameId}/join`);
}

export async function fetchIsOnMove(gameId: string | undefined) {
    const response = await axios.get(`/api/games/${gameId}/isOnMove`);
    return response.data;
}

export async function getWinner(winnerId: string | undefined) {
    if (winnerId) {
        const {data: winner} = await axios.get<Winner>(`/api/players/winner?winnerId=${winnerId}`);
        return winner;
    }
}