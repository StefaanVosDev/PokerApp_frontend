import {useQuery} from "@tanstack/react-query";
import {getCommunityCards} from "../services/dataService.ts"

export function useCommunityCards(gameId: string) {
    const {isLoading, isError, data: communityCards} = useQuery({
        queryKey: ['communityCards', gameId],
        queryFn: () => getCommunityCards(gameId),
        refetchInterval: 1000
    })

    return {
        isLoading,
        isError,
        communityCards,
    }
}