import Card from "../../model/Card.ts";
import Player from "../../model/Player.ts";

export function mapCardToImage(card: Card): string {
    const SuitLabels: Record<string, string> = {
        SPADES: "spades",
        CLUBS: "clubs",
        HEARTS: "hearts",
        DIAMONDS: "diamonds",
    };

    return `https://storage.googleapis.com/poker_stacks/cards/${SuitLabels[card.suit]}_${card.rank}.png`;
}

export function mapPlayersWithCards(players: Player[], playersHand: Record<string, {hand: Card[], score: number}>) {
    return players.map((player) => ({
        ...player,
        cards: (playersHand[player.id]?.hand || []).map(mapCardToImage), // Map cards to images
        score: playersHand[player.id]?.score || 0,
    }));
}
