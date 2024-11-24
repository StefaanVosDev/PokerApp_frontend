export default interface Player {
    id: string;
    name: string;
    money: number;
    avatar: string;
    cards: string[]; // Array of card image paths
}