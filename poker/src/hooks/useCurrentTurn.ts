import {useQuery} from "@tanstack/react-query";
import {getCurrentTurnId} from "../services/dataService.ts";

export function useCurrentTurn(gameId: string) {
    const {isLoading: isLoadingTurn, isError: isErrorLoadingTurn, data: turnId} = useQuery({queryKey: ['turn', gameId], queryFn: () => getCurrentTurnId(gameId)})

    return {
        isLoadingTurn,
        isErrorLoadingTurn,
        turnId,
    }
}