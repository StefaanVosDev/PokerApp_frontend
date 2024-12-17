import {useQuery} from "@tanstack/react-query";
import {getPlayerHand, getWinner} from "../services/playerService.ts";
import Card from "../model/Card.ts";

export function usePlayersHand(playerIds: string[], isEndOfRound: boolean) {
    const {isLoading, isError, data} = useQuery({
        queryKey: ['playersHand', playerIds],
        queryFn: async () => {
            const hands = await Promise.all(playerIds.map((id) => getPlayerHand(id)));

            return playerIds.reduce((acc, playerId, index) => {
                acc[playerId] = hands[index].hand; // Store hand by playerId
                return acc;
            }, {} as Record<string, Card[]>);
        },
        enabled: playerIds.length > 0 && !isEndOfRound, // Enable only if there are playerIds
        refetchInterval: 1000
    });

    return {
        isLoading,
        isError,
        playersHand: data || {}, // Default to an empty object
    };
}

export function useWinner(winnerId: string | undefined) {
    const {isLoading, isError, data: winner} = useQuery(
        {
            queryKey: ['winner', winnerId],
            queryFn: () => getWinner(winnerId),
            refetchInterval: 1000
        })

    return {
        isLoading,
        isError,
        winner
    }
}