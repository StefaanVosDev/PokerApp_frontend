import {useQuery} from "@tanstack/react-query";
import {getCurrentTurnId} from "../services/dataService.ts";

export function useCurrentTurn(gameId: string, isEndOfRound: boolean, isProcessingMove: boolean) {
    const {isLoading: isLoadingTurn, isError: isErrorLoadingTurn, data: turnId} = useQuery({
        queryKey: ['turn', gameId],
        queryFn: () => getCurrentTurnId(gameId),
        enabled: !isEndOfRound && !isProcessingMove,
        refetchInterval: 1000
    })

    return {
        isLoadingTurn,
        isErrorLoadingTurn,
        turnId,
    }
}