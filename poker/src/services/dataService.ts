import {PlayingCard} from "../model/PlayingCard.ts";


export async function getCommunityCards(id: string) {
    if (id) {
        const response = await fetch(`http://localhost:8081/api/round/communityCards?gameId=${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as Promise<PlayingCard[]>;
    }
    return null;
}
