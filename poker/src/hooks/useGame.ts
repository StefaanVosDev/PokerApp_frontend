import {useQuery} from '@tanstack/react-query';
import {getGame} from "../services/dataService.ts";

export function useGame(gameId: string) {
    const {isLoading, isError, data: game} = useQuery({
        queryKey: ['game', gameId],
        queryFn: () => getGame(gameId),
        enabled: !!gameId,
        refetchInterval: 1000
    });

    return {
        isLoading,
        isError,
        game,
    };
}
