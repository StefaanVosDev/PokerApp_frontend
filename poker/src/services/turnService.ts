import {Turn} from "../model/Turn.ts";
import {Round} from "../model/Round.ts";

export function calculateLastBet(turns: Turn[], round: Round) {
    const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
    return currentPhaseTurns.reduce((max, turn) => Math.max(max, turn.moneyGambled), 0);
}

export function calculateCurrentTurnDetails(turns: Turn[], round: Round, lastBet: number) {
    const currentTurn = turns.find(turn => turn.moveMade.toString() === "ON_MOVE");
    if (!currentTurn) return {shouldShowCheckButton: false, amountToCall: 0, raiseAmount: 0};

    const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
    const totalGambled = currentPhaseTurns
        .filter(turn => turn.player.id === currentTurn.player.id)
        .reduce((sum, turn) => sum + turn.moneyGambled, 0);

    return {
        shouldShowCheckButton: totalGambled === lastBet,
        amountToCall: lastBet - totalGambled,
        raiseAmount: getMinimumRaise(lastBet, currentTurn.player.money),
    };
}

export function getMinimumRaise(lastBet: number, currentPlayerMoney: number): number {
    if (lastBet * 2 > currentPlayerMoney) return currentPlayerMoney;
    if (lastBet > 10) return lastBet * 2
    return 10;
}