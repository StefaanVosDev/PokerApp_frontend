import Card from "../model/Card.ts";

export function mapCardToImage(card: Card): string {
    const SuitLabels: Record<string, string> = {
        SPADES: "spades",
        CLUBS: "clubs",
        HEARTS: "hearts",
        DIAMONDS: "diamonds",
    };

    return `https://storage.googleapis.com/poker_stacks/cards/${SuitLabels[card.suit]}_${card.rank}.png`;
}
