import {Turn} from "../model/Turn.ts";
import {Round} from "../model/Round.ts";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function checkAndMove(turnId: string | undefined, gameId: string, roundId: string) {
    await axios.put(`/api/turns/${turnId}/checkAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
        }
    });
}

export async function foldAndMove(turnId: string | undefined, gameId: string, roundId: string) {
    await axios.put(`/api/turns/${turnId}/foldAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
        }
    });
}

export async function callAndMove(turnId: string | undefined, gameId: string, roundId: string, amount: number) {
    await axios.put(`/api/turns/${turnId}/callAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
            amount: amount
        }
    });
}

export async function raiseAndMove(turnId: string | undefined, gameId: string, roundId: string, amount: number) {
    await axios.put(`/api/turns/${turnId}/raiseAndMove`, null, {
        params: {
            gameId: gameId,
            roundId: roundId,
            amount: amount
        }
    });
}

export async function allinAndMove(turnId: string | undefined, gameId: string, roundId: string) {
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

export async function getTurns(roundId: string | undefined) {
    if (roundId) {
        const {data: turns} = await axios.get<Turn[]>(`/api/turns/round?roundId=${roundId}`);
        return turns;
    }
    return null;
}

export function calculateLastBet(turns: Turn[], round: Round) {
    const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
    return currentPhaseTurns.reduce((max, turn) => Math.max(max, turn.moneyGambled), 0);
}

export function calculateCurrentTurnDetails(turns: Turn[], round: Round, lastBet: number, bigBlind: number) {
    const currentTurn = turns.find(turn => turn.moveMade.toString() === "ON_MOVE");
    if (!currentTurn) return {shouldShowCheckButton: false, amountToCall: 0, raiseAmount: 0};

    const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
    const totalGambled = currentPhaseTurns
        .filter(turn => turn.player.id === currentTurn.player.id)
        .reduce((sum, turn) => sum + turn.moneyGambled, 0);

    return {
        shouldShowCheckButton: totalGambled === lastBet,
        amountToCall: lastBet - totalGambled,
        raiseAmount: getMinimumRaise(lastBet, currentTurn.player.money, bigBlind),
    };
}

export function getMinimumRaise(lastBet: number, currentPlayerMoney: number, bigBlind: number): number {
    if (lastBet * 2 > currentPlayerMoney) return currentPlayerMoney;
    if (lastBet > bigBlind) return lastBet * 2
    return bigBlind;
}