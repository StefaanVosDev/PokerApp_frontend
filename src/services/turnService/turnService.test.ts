import {expect, test} from "vitest";
import {PlayerStatus, Turn} from "../../model/Turn.ts";
import {Phase, Round} from "../../model/Round.ts";
import Player from '../../model/Player.ts';
import {calculateCurrentTurnDetails, calculateLastBet, getMinimumRaise} from "./turnService.ts";

const players: Player[] = [
    {
        id: 'player1',
        money: 1100,
        username: 'Alice',
        position: 1,
        isWinner: false,
    },
    {
        id: 'player2',
        money: 950,
        username: 'Bob',
        position: 2,
        isWinner: false,
    },
    {
        id: 'player3',
        money: 950,
        username: 'Charlie',
        position: 3,
        isWinner: false
    },
];

const lastBetTurns: Turn[] = [
    {
        id: 'turn1',
        player: players[0],
        moveMade: PlayerStatus.CALL,
        moneyGambled: 50,
        round: {id: 'round1', phase: Phase.PREFLOP, dealerIndex: 0, turns: [], createdAt: '2025-01-01T10:00:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:01:00Z'),
    },
    {
        id: 'turn2',
        player: players[1],
        moveMade: PlayerStatus.RAISE,
        moneyGambled: 100,
        round: {id: 'round1', phase: Phase.PREFLOP, dealerIndex: 0, turns: [], createdAt: '2025-01-01T10:00:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:02:00Z'),
    },
];

const lastBetRound: Round = {
    id: 'round1',
    phase: Phase.PREFLOP,
    dealerIndex: 0,
    turns: lastBetTurns,
    createdAt: '2025-01-01T10:00:00Z',
};

const turnDetailsTurns: Turn[] = [
    {
        id: 'turn3',
        player: players[0],
        moveMade: PlayerStatus.SMALL_BLIND,
        moneyGambled: 10,
        round: {id: 'round3', phase: Phase.PREFLOP, dealerIndex: 2, turns: [], createdAt: '2025-01-01T10:20:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:20:10Z'),
    },
    {
        id: 'turn4',
        player: players[1],
        moveMade: PlayerStatus.BIG_BLIND,
        moneyGambled: 20,
        round: {id: 'round3', phase: Phase.PREFLOP, dealerIndex: 2, turns: [], createdAt: '2025-01-01T10:20:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:20:20Z'),
    },
    {
        id: 'turn5',
        player: players[2],
        moveMade: PlayerStatus.RAISE,
        moneyGambled: 50,
        round: {id: 'round3', phase: Phase.PREFLOP, dealerIndex: 2, turns: [], createdAt: '2025-01-01T10:20:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:20:30Z'),
    },
    {
        id: 'turn6',
        player: players[0],
        moveMade: PlayerStatus.CALL,
        moneyGambled: 50,
        round: {id: 'round3', phase: Phase.PREFLOP, dealerIndex: 2, turns: [], createdAt: '2025-01-01T10:20:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:22:40Z'),
    },
    {
        id: 'turn7',
        player: players[1],
        moveMade: PlayerStatus.ON_MOVE,
        moneyGambled: 0,
        round: {id: 'round3', phase: Phase.PREFLOP, dealerIndex: 2, turns: [], createdAt: '2025-01-01T10:20:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:23:20Z'),
    },
];

const turnDetailsRound: Round = {
    id: 'round3',
    phase: Phase.PREFLOP,
    dealerIndex: 2,
    turns: turnDetailsTurns,
    createdAt: '2025-01-01T10:20:00Z',
};


test("calculateLastBet", () => {
    expect(calculateLastBet(lastBetTurns, lastBetRound)).toBe(100);
})

test("calculateLastBet - less money gambled last turn", () => {
    const turn: Turn = {
        id: 'no-money-raise',
        player: players[0],
        moveMade: PlayerStatus.CALL,
        moneyGambled: 50,
        round: {id: 'round1', phase: Phase.PREFLOP, dealerIndex: 0, turns: [], createdAt: '2025-01-01T10:00:00Z'},
        madeInPhase: Phase.PREFLOP,
        createdAt: new Date('2025-01-01T10:02:00Z'),
    }
    expect(calculateLastBet([lastBetTurns[0], lastBetTurns[1], turn], lastBetRound)).toBe(100);
})

test("calculateLastBet - no money gambled this phase", () => {
    const turn: Turn = {
        id: 'no-money-raise',
        player: players[0],
        moveMade: PlayerStatus.CHECK,
        moneyGambled: 0,
        round: {id: 'round2', phase: Phase.FLOP, dealerIndex: 0, turns: [], createdAt: '2025-01-01T10:05:00Z'},
        madeInPhase: Phase.FLOP,
        createdAt: new Date('2025-01-01T10:07:00Z'),
    }

    const round2: Round = {
        id: 'round2',
        phase: Phase.FLOP,
        dealerIndex: 1,
        turns: [],
        createdAt: '2025-01-01T10:05:00Z'
    }

    expect(calculateLastBet([turn], round2)).toBe(0);
})

test("calculateLastBet - no turnDetailsTurns", () => {
    expect(calculateLastBet([], lastBetRound)).toBe(0);
})

test("calculateLastBet - phases of turnDetailsTurns don't match that of round", () => {
    const round2: Round = {
        id: 'round2',
        phase: Phase.FLOP,
        dealerIndex: 1,
        turns: [],
        createdAt: '2025-01-01T10:05:00Z'
    }
    expect(calculateLastBet(lastBetTurns, round2)).toBe(0);
})

test("calculateCurrentTurnDetails", () => {
    const expectedResult = {
        shouldShowCheckButton: false,
        amountToCall: 30,
    }

    expect(calculateCurrentTurnDetails(turnDetailsTurns, turnDetailsRound, 50)).toEqual(expectedResult);
})

test("calculateCurrentTurnDetails - no one on move", () => {
    const expectedResult = {
        shouldShowCheckButton: false,
        amountToCall: 0
    }

    expect(calculateCurrentTurnDetails([turnDetailsTurns[0], turnDetailsTurns[1], turnDetailsTurns[2], turnDetailsTurns[3]], turnDetailsRound, 50)).toEqual(expectedResult);
})

test("calculateCurrentTurnDetails - no turns", () => {
    const expectedResult = {
        shouldShowCheckButton: false,
        amountToCall: 0
    }

    expect(calculateCurrentTurnDetails([], turnDetailsRound, 50)).toEqual(expectedResult);
})

test("calculateCurrentTurnDetails - no turns of this phase", () => {
    const anotherRound: Round = {
        id: 'round4',
        phase: Phase.FLOP,
        dealerIndex: 0,
        turns: [],
        createdAt: '2025-01-01T10:30:00Z'
    }

    const expectedResult = {
        shouldShowCheckButton: false,
        amountToCall: 0
    }

    expect(calculateCurrentTurnDetails(turnDetailsTurns, anotherRound, 50)).toEqual(expectedResult)
})

test("calculateCurrentTurnDetails - first turn of current player in this phase", () => {
    const anotherRound: Round = {
        id: 'round4',
        phase: Phase.FLOP,
        dealerIndex: 0,
        turns: [],
        createdAt: '2025-01-01T10:30:00Z'
    }

    const newPhaseTurns: Turn[] = [
        {
            id: 'turn8',
            player: players[1],
            moveMade: PlayerStatus.RAISE,
            moneyGambled: 100,
            round: anotherRound,
            madeInPhase: Phase.FLOP,
            createdAt: new Date('2025-01-01T10:30:10Z'),
        },
        {
            id: 'turn9',
            player: players[2],
            moveMade: PlayerStatus.ON_MOVE,
            moneyGambled: 0,
            round: anotherRound,
            madeInPhase: Phase.FLOP,
            createdAt: new Date('2025-01-01T10:32:20Z'),
        }
    ]

    const expectedResult = {
        shouldShowCheckButton: false,
        amountToCall: 100,
    }

    expect(calculateCurrentTurnDetails(newPhaseTurns, anotherRound, 100)).toEqual(expectedResult)
})

test("getMinimumRaise", () => {
    expect(getMinimumRaise(0, 1000, 20)).toBe(20)
})

test("getMinimumRaise - last bet exceeds half of big blind", () => {
    expect(getMinimumRaise(15, 1000, 20)).toBe(30)
})

test("getMinimumRaise - double of last bet exceeds my money", () => {
    expect(getMinimumRaise(600, 1000, 20)).toBe(1000)
})

test("getMinimumRaise - big blind exceeds my money", () => {
    expect(getMinimumRaise(0, 10, 20)).toBe(10)
})