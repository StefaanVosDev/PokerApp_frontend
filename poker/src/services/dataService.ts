import {PlayingCard} from "../model/PlayingCard.ts";

export async function checkTurn(turnId: string | undefined) {
    if (turnId) {
        const response = await fetch(`http://localhost:8081/api/turns/${turnId}/check`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }
    return null;
}


type StringWrapper = {
    content: string;
}

export async function getCurrentTurnId(gameId: string) {
    if (gameId) {
        const response = await fetch(`http://localhost:8081/api/turns/current?gameId=${gameId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as Promise<StringWrapper>
    }
    return null;
}


export async function getCommunityCards(id: string) {
    if (id) {
        const response = await fetch(`http://localhost:8081/api/rounds/communityCards?gameId=${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json() as Promise<PlayingCard[]>;
    }
    return null;
}
