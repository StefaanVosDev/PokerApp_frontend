import {useMutation, useQuery} from "@tanstack/react-query";
import {createNewRoundIfFinished, dividePot, getCommunityCards, getCurrentRound} from "../services/roundService.ts";

export function useCommunityCards(gameId: string, roundStarted: boolean) {
    const {isLoading, isError, data: communityCards} = useQuery({
        queryKey: ['communityCards', gameId],
        queryFn: () => getCommunityCards(gameId),
        refetchInterval: 1000,
        enabled: roundStarted
    })

    return {
        isLoading,
        isError,
        communityCards,
    }
}

export function useCreateNewRoundIfFinished(gameId: string, roundId: string) {

    const {mutate, isPending, isError, isSuccess} = useMutation({
        mutationFn: async () => await createNewRoundIfFinished(gameId, roundId)
    });

    return {
        triggerNewRound: mutate,
        isPending,
        isError,
        isSuccessCreatingNewRound: isSuccess
    };
}

export function useCurrentRound(gameId: string, isEndOfRound: boolean,isInProgress: boolean) {
    const {
        isLoading: isLoadingRound,
        isError: isErrorLoadingRound,
        data: round,
    } = useQuery({
        queryKey: ['round', gameId],
        queryFn: () => getCurrentRound(gameId),
        enabled: !isEndOfRound && isInProgress,
        refetchInterval: 1000
    })

    return {
        isLoadingRound,
        isErrorLoadingRound,
        round
    }
}

export function useDividePot(roundId: string | undefined) {

    const mutationFn = async () => {
        return await dividePot(roundId);
    };

    const {
        mutate: triggerDividePot,
        isPending: isDividingPot,
        isError: isErrorDividingPot,
        data: winnings,
        isSuccess
    } = useMutation({
        mutationFn: mutationFn
    });

    return {
        triggerDividePot,
        isDividingPot,
        isErrorDividingPot,
        winnings,
        isSuccessDividingPot: isSuccess
    };
}