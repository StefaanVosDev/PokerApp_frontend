import {useQuery} from "@tanstack/react-query";
import {getCurrentRound} from "../services/dataService.ts";

export function useCurrentRound(gameId: string, isEndOfRound: boolean) {
    const {
        isLoading: isLoadingRound,
        isError: isErrorLoadingRound,
        data: round,
    } = useQuery({
        queryKey: ['round', gameId],
        queryFn: () => getCurrentRound(gameId),
        enabled: !isEndOfRound,
        refetchInterval: 1000
    })

    return {
        isLoadingRound,
        isErrorLoadingRound,
        round
    }
}