import {useQuery} from "@tanstack/react-query";
import {getAssignPlayerHand} from "../services/dataService.ts"

export function usePlayerHands(gameId: string) {
    const {isLoading, isError, data: playerHands} = useQuery({queryKey: ['playerHand'], queryFn: () => getAssignPlayerHand(gameId) })

    return {
        isLoading,
        isError,
        playerHands,
    }
}