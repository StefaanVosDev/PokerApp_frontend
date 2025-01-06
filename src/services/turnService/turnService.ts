import {Turn} from "../../model/Turn.ts";
import {Round} from "../../model/Round.ts";
import axios from "axios";
import CurrentTurnDto from "../../model/dto/CurrentTurnDto.ts";


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

export async function getCurrentTurnId(gameId: string) {
    if (gameId) {
        const {data} = await axios.get<CurrentTurnDto>(`/api/turns/current?gameId=${gameId}`);
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

export function calculateLastBet(turns: Turn[], round: Round | undefined | null) {
    const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round?.phase);
    return currentPhaseTurns.reduce((max, turn) => Math.max(max, turn.moneyGambled), 0);
}

export function getMinimumRaise(lastBet: number, currentPlayerMoney: number, bigBlind: number): number {
    const doubleLastBet = lastBet * 2;
    if (doubleLastBet > currentPlayerMoney) return currentPlayerMoney;
    if (doubleLastBet > bigBlind) return doubleLastBet;
    if (bigBlind > currentPlayerMoney) return currentPlayerMoney;
    return bigBlind;
}

export function calculateCurrentTurnDetails(turns: Turn[], round: Round, lastBet: number) {
    const currentTurn = turns.find(turn => turn.moveMade.toString() === "ON_MOVE");
    if (!currentTurn) return {shouldShowCheckButton: false, amountToCall: 0};

    const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
    if (!currentPhaseTurns || currentPhaseTurns.length === 0) return {shouldShowCheckButton: false, amountToCall: 0};
    const totalGambled = currentPhaseTurns
        .filter(turn => turn.player.id === currentTurn.player.id)
        .reduce((sum, turn) => sum + turn.moneyGambled, 0);

    return {
        shouldShowCheckButton: totalGambled === lastBet,
        amountToCall: lastBet - totalGambled
    };
}

export async function getTimeRemaining(turnId: string) {
    const {data} = await axios.get<number>(`/api/turns/${turnId}/timeRemaining`);
    return data;
}