import {expect, test} from "vitest";
import {Game} from "../../model/Game.ts";
import {calculateTotalPages, filterDisplayedGames} from "./gameListHelperService.ts";

const games: Game[] = [
    {
        id: "a1b2c3d4-e5f6-7890-ab12-cd34ef56gh78",
        status: "ongoing",
        maxPlayers: 6,
        name: "High Stakes Poker Night",
        currentPlayerOnMove: "player1-id",
        winner: {
            id: "player2-id",
            money: 1200,
            username: "JohnDoe",
            position: 2,
            isWinner: true,
        },
        players: [
            { id: "player1-id", money: 900, username: "Alice", position: 0, isWinner: false },
            { id: "player2-id", money: 1200, username: "JohnDoe", position: 2, isWinner: true },
            { id: "player3-id", money: 700, username: "Bob", position: 1, isWinner: false },
        ],
        settings: {
            smallBlind: 10,
            bigBlind: 20,
            timer: true,
            startingChips: 1000,
        },
    },
    {
        id: "b2c3d4e5-f6g7-8901-ab23-cd45ef67hi89",
        status: "completed",
        maxPlayers: 4,
        name: "Friendly Friday Game",
        currentPlayerOnMove: "player4-id",
        winner: {
            id: "player4-id",
            money: 1500,
            username: "Emma",
            position: 1,
            isWinner: true,
        },
        players: [
            { id: "player4-id", money: 1500, username: "Emma", position: 1, isWinner: true },
            { id: "player5-id", money: 500, username: "David", position: 0, isWinner: false },
        ],
        settings: {
            smallBlind: 5,
            bigBlind: 10,
            timer: false,
            startingChips: 500,
        },
    },
    {
        id: "c3d4e5f6-g7h8-9012-ab34-cd56ef78ij90",
        status: "waiting",
        maxPlayers: 8,
        name: "Weekend Tournament",
        currentPlayerOnMove: "",
        winner: {
            id: "",
            money: 0,
            username: "",
            position: -1,
            isWinner: false,
        },
        players: [],
        settings: {
            smallBlind: 15,
            bigBlind: 30,
            timer: true,
            startingChips: 2000,
        },
    },
    {
        id: "d4e5f6g7-h8i9-0123-ab45-cd67ef89jk01",
        status: "ongoing",
        maxPlayers: 5,
        name: "Late Night Fun",
        currentPlayerOnMove: "player6-id",
        winner: {
            id: "",
            money: 0,
            username: "",
            position: -1,
            isWinner: false,
        },
        players: [
            { id: "player6-id", money: 1200, username: "Charlie", position: 0, isWinner: false },
            { id: "player7-id", money: 800, username: "Sophia", position: 1, isWinner: false },
        ],
        settings: {
            smallBlind: 20,
            bigBlind: 40,
            timer: true,
            startingChips: 1500,
        },
    },
];

test("calculateTotalPages", () => {
    expect(calculateTotalPages(games, 3)).toBe(2)
});

test("calculateTotalPages - no games", () => {
    expect(calculateTotalPages(undefined, 3)).toBe(0)
});

test("filterDisplayedGames", () => {
    const displayedGames: Game[] = [];
    displayedGames.push(games[0]);
    displayedGames.push(games[1]);
    displayedGames.push(games[2]);

    expect(filterDisplayedGames(games, 3, 0)).toEqual(displayedGames);
    expect(filterDisplayedGames(games, 3, 1)).toEqual([games[3]]);
})

test("filterDisplayedGames - no games", () => {
    expect(filterDisplayedGames(undefined, 3, 0)).toEqual([]);
})