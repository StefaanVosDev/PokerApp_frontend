import {useQuery} from "@tanstack/react-query";
import {getCurrentRound} from "../services/dataService.ts";

export function useCurrentRound(gameId: string) {
    const {isLoading: isLoadingRound, isError: isErrorLoadingRound, data: round} = useQuery({queryKey: ['round', gameId], queryFn: () => getCurrentRound(gameId)})

    return {
        isLoadingRound,
        isErrorLoadingRound,
        round,
    }
}