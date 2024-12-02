import {useQuery} from "@tanstack/react-query";
import {getCurrentRound} from "../services/dataService.ts";

export function useCurrentRound(gameId: string) {
    const {isLoading: isLoadingRound, isError: isErrorLoadingRound, data: round, refetch} = useQuery({queryKey: ['round', gameId], queryFn: () => getCurrentRound(gameId)/*, refetchInterval: 10000*/})

    return {
        isLoadingRound,
        isErrorLoadingRound,
        round,
        refetch
    }
}