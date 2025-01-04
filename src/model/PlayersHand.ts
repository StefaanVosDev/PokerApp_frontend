import Card from "./Card.ts";

export default interface PlayersHand {
    playerId: string;
    gameId: string;
    hand: Card[];
}