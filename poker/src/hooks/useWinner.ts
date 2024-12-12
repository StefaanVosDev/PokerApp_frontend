import {useQuery} from "@tanstack/react-query";
import {getWinner} from "../services/dataService.ts";

export function useWinner(winnerId: string | undefined) {
    const {isLoading, isError, data: winner} = useQuery(
        {
            queryKey: ['winner', winnerId],
            queryFn: () => getWinner(winnerId),
        })

    return {
        isLoading,
        isError,
        winner
    }
}