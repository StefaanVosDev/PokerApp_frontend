import {expect, test} from "vitest";
import {checkUserInGame} from "./pokerTableHelperService.ts";

const players = [
    {
        id: "player1-unique-id",
        money: 1500,
        username: "Liam",
        position: 1,
        isWinner: false,
    },
    {
        id: "player2-unique-id",
        money: 2000,
        username: "Olivia",
        position: 2,
        isWinner: false,
    },
];

test("checkUserInGame", () => {
    expect(checkUserInGame(players, "Liam")).toBe(true)
})

test("checkUserInGame - not in game", () => {
    expect(checkUserInGame(players, "Boris")).toBe(false)
})

test("checkUserInGame - no logged in user", () => {
    expect(checkUserInGame(players, undefined)).toBe(false)
})

test("checkUserInGame - no players", () => {
    expect(checkUserInGame([], "Liam")).toBe(false)
})