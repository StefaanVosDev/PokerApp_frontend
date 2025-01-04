export interface PlayingCard {
    id: string,
    suit: Suit,
    rank: number
}

export enum Suit {
    SPADES, DIAMONDS, HEARTS, CLUBS
}