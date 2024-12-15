import {useQuery} from "@tanstack/react-query";
import {getTurns} from "../services/dataService.ts";

export function useTurns(roundId: string | undefined) {
    const {isLoading: isLoadingTurns, isError: isErrorLoadingTurns, data: turns} = useQuery(
        {
            queryKey: ['turns', roundId],
            queryFn: () => getTurns(roundId),
            refetchInterval: 1000
        })

    return {
        isLoadingTurns,
        isErrorLoadingTurns,
        turns,
    }
}