import { useQuery } from '@tanstack/react-query';
import { getGame } from "../services/dataService.ts";

export function useGame(gameId: string) {
    const { isLoading, isError, data: game, refetch } = useQuery({
        queryKey: ['game', gameId],
        queryFn: () => getGame(gameId),
        enabled: !!gameId,
    });

    return {
        isLoading,
        isError,
        game,
        refetchGame: refetch
    };
}
