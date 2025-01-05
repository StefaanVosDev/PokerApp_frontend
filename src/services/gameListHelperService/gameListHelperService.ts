import {Game} from "../../model/Game.ts";

export function calculateTotalPages(games: Game[] | undefined, gamesPerPage: number) {
    return Math.ceil((Array.isArray(games) ? games.length : 0) / gamesPerPage);
}

export function filterDisplayedGames(games: Game[] | undefined, gamesPerPage: number, currentPage: number) {
    return Array.isArray(games) ? games.slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage) : [];
}