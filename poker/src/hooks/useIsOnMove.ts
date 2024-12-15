import {fetchIsOnMove} from "../services/dataService";
import {useQuery} from "@tanstack/react-query";

export function useIsOnMove(gameId: string | undefined) {
    const {isLoading, isError, data: isOnMove} = useQuery({
        queryKey: ['isOnMove', gameId],
        queryFn: () => fetchIsOnMove(gameId),
    });

    return {
        isLoading,
        isError,
        isOnMove,
    };
}