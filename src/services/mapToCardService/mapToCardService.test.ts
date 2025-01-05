import {mapCardToImage, mapPlayersWithCards} from "./mapToCardService.ts";
import Player from "../../model/Player.ts";
import Card from "../../model/Card.ts";
import {expect, test} from "vitest";

test("mapCardToImage", () => {
    const card : Card = {
        id: 'b9ee588e-e07f-4d17-addc-74c135e3997b',
        suit: "HEARTS",
        rank: 14
    }

    expect(mapCardToImage(card)).toBe("https://storage.googleapis.com/poker_stacks/cards/hearts_14.png")
});

test("mapCardToImage - invalid card", () => {
    const card : Card = {
        id: "invalid-card-id",
        rank: NaN,
        suit: "INVALID_SUIT",
    }

    expect(mapCardToImage(card)).toBe("https://storage.googleapis.com/poker_stacks/cards/undefined_NaN.png")
});

test("mapPlayersWithCards", () => {
    const players: Player[] = [];
    const player1Cards: Card[] = [];
    const player2Cards: Card[] = [];

    const card1: Card = {
        id: "f4253f66-f2df-4efb-935c-c62c970ff67e",
        rank: 6,
        suit: "CLUBS"
    };

    const card2: Card = {
        id: "5741bd3a-561b-46ce-bc1b-e6dde7f8febf",
        rank: 9,
        suit: "SPADES"
    };

    const player1: Player = {
        username: "robbe",
        id: "e49ec7fb-d358-4800-b1ef-88112e640301",
        money: 1100,
        isWinner: false,
        position: 0,
    };

    player1Cards.push(card1);
    player1Cards.push(card2);

    const player2: Player = {
        username: "afi",
        id: "bacd0ea0-317c-4a77-92ae-02be0d0e7abc",
        money: 900,
        isWinner: true,
        position: 1,
    };

    const card3: Card = {
        id: "f4253f66-f2df-4efb-935c-c62c970ff67e",
        rank: 11,
        suit: "HEARTS"
    };

    const card4: Card = {
        id: "5741bd3a-561b-46ce-bc1b-e6dde7f8febf",
        rank: 2,
        suit: "DIAMONDS"
    };

    player2Cards.push(card3);
    player2Cards.push(card4);

    players.push(player1);
    players.push(player2);

    const playerHands = {
        [player1.id]: {hand: player1Cards, score: 0},
        [player2.id]: {hand: player2Cards, score: 0},
    };

    const cardBucketLinks1: string[] = ['https://storage.googleapis.com/poker_stacks/cards/clubs_6.png',
        'https://storage.googleapis.com/poker_stacks/cards/spades_9.png'];
    const cardBucketLinks2: string[] = ['https://storage.googleapis.com/poker_stacks/cards/hearts_11.png',
        'https://storage.googleapis.com/poker_stacks/cards/diamonds_2.png'];

    const expectedResult1 = {cards: cardBucketLinks1, score: 0, id: player1.id, money: player1.money, username: player1.username,
        position: player1.position, isWinner: player1.isWinner};

    const expectedResult2 = {cards: cardBucketLinks2, score: 0, id: player2.id, money: player2.money, username: player2.username,
        position: player2.position, isWinner: player2.isWinner};

    const expectedResults = [expectedResult1, expectedResult2];

    //toEqual for object comparison while toBe for primitive type comparison
    expect(mapPlayersWithCards(players, playerHands)).toEqual(expectedResults);
});

test("mapPlayersWithCards - player without cards in playersHand", () => {
    const players: Player[] = [
        {
            username: "robbe",
            id: "e49ec7fb-d358-4800-b1ef-88112e640301",
            money: 1100,
            isWinner: false,
            position: 0,
        },
    ];

    const player1Cards: Card[] = []

    const playersHand = {[players[0].id]: {hand: player1Cards, score: 0}};

    const expectedResults = [
        {
            username: "robbe",
            id: "e49ec7fb-d358-4800-b1ef-88112e640301",
            money: 1100,
            isWinner: false,
            position: 0,
            cards: [],
            score: 0
        },
    ];

    expect(mapPlayersWithCards(players, playersHand)).toEqual(expectedResults);
});

test("mapPlayersWithCards - invalid card in playersHand", () => {
    const players: Player[] = [
        {
            username: "robbe",
            id: "e49ec7fb-d358-4800-b1ef-88112e640301",
            money: 1100,
            isWinner: false,
            position: 0,
        },
    ];

    const playersHand = {
        "e49ec7fb-d358-4800-b1ef-88112e640301": {hand: [
            {
                id: "invalid-card-id",
                rank: NaN,
                suit: "INVALID_SUIT",
            },
        ],
            score: 0},
    };

    const expectedResults = [
        {
            username: "robbe",
            id: "e49ec7fb-d358-4800-b1ef-88112e640301",
            money: 1100,
            isWinner: false,
            position: 0,
            cards: ["https://storage.googleapis.com/poker_stacks/cards/undefined_NaN.png"],
            score: 0
        },
    ];

    expect(mapPlayersWithCards(players, playersHand)).toEqual(expectedResults);
});