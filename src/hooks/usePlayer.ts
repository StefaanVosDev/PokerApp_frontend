import {useQuery} from "@tanstack/react-query";
import {getPlayerHand, getPlayerOnMove, getPlayersOnMove, getWinner} from "../services/playerService.ts";
import Card from "../model/Card.ts";

export function usePlayersHand(playerIds: string[], isGameInProgress: boolean) {
    const {isLoading, isError, data} = useQuery({
        queryKey: ['playersHand', playerIds],
        queryFn: async () => {
            const hands = await Promise.all(playerIds.map((id) => getPlayerHand(id)));

            return playerIds.reduce((acc, playerId, index) => {
                acc[playerId] = {
                    hand: hands[index]!.hand,
                    score: hands[index]!.score
                }; // Store hand by playerId
                return acc;
            }, {} as Record<string, { hand: Card[], score: number}>);
        },
        enabled: playerIds.length > 0 && isGameInProgress, // Enable only if there are playerIds
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
            enabled: Boolean(winnerId),
            refetchInterval: 1000
        })

    return {
        isLoading,
        isError,
        winner
    }
}
export function usePlayerOnMove(gameId: string | undefined) {
    const {isLoading, isError, data: player} = useQuery(
        {
            queryKey: ['currentPlayerOnMove', gameId],
            queryFn: () => getPlayerOnMove(gameId),
            refetchInterval: 1000
        })

    return {
        isLoading,
        isError,
        player
    }
}


export function usePlayersOnMove() {
    const {isLoading, isError, data: playersOnMove} = useQuery(
        {
            queryKey: ['currentPlayersOnMove'],
            queryFn: () => getPlayersOnMove(),
            refetchInterval: 10000
        })

    return {
        isLoading,
        isError,
        playersOnMove
    }
}