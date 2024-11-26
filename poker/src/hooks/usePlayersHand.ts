import { useQuery } from '@tanstack/react-query';
import { getPlayerHand } from "../services/dataService.ts";
import Card from "../model/Card.ts";

export default interface PlayersHand {
    playerId: string;
    hand: Card[];
}

export function usePlayersHand(playerIds: string[]) {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['playersHand', playerIds],
        queryFn: async () => {
            const hands = await Promise.all(playerIds.map((id) => getPlayerHand(id)));
            return playerIds.reduce((acc, playerId, index) => {
                acc[playerId] = hands[index].hand; // Store hand by playerId
                return acc;
            }, {} as Record<string, Card[]>);
        },
        enabled: playerIds.length > 0, // Enable only if there are playerIds
    });

    return {
        isLoading,
        isError,
        playersHand: data || {}, // Default to an empty object
    };
}
