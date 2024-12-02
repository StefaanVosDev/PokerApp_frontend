import {useQuery} from "@tanstack/react-query";
import {getTurns} from "../services/dataService.ts";

export function useTurns(roundId: string) {
    const {isLoading: isLoadingTurns, isError: isErrorLoadingTurns, data: turns, refetch} = useQuery(
        {
            queryKey: ['turns', roundId],
            queryFn: () => getTurns(roundId),
        })

    return {
        isLoadingTurns,
        isErrorLoadingTurns,
        turns,
        refetchTurns: refetch
    }
}