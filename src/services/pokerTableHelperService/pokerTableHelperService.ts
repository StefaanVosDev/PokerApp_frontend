import Player from "../../model/Player.ts";

export function checkUserInGame(players : Player[], loggedInUser: string | undefined) {
    return players.some((player) => player.username === loggedInUser?.toString());
}