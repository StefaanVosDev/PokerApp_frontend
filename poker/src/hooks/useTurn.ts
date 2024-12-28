import {useMutation, useQuery} from "@tanstack/react-query";
import {
    allinAndMove,
    callAndMove,
    checkAndMove,
    foldAndMove,
    getCurrentTurnId,
    getTurns,
    raiseAndMove,
    getTurn
} from "../services/turnService.ts";

export function useTurn(turnId: string) {
    const {isLoading: isLoadingTurn, isError: isErrorLoadingTurn, data: turn} = useQuery({
        queryKey: ['turn', turnId],
        queryFn: () => getTurn(turnId),
        refetchInterval: 900
    })

    return {
        isLoadingTurn,
        isErrorLoadingTurn,
        turn,
    }
}


export function useCurrentTurn(gameId: string, isEndOfRound: boolean, isProcessingMove: boolean, isInProgress: boolean) {
    const {isLoading: isLoadingTurn, isError: isErrorLoadingTurn, data: turn} = useQuery({
        queryKey: ['turn', gameId],
        queryFn: () => getCurrentTurnId(gameId),
        enabled: !isEndOfRound && !isProcessingMove && isInProgress,
        refetchInterval: 1000
    })

    return {
        isLoadingTurn,
        isErrorLoadingTurn,
        turn,
    }
}

export function useProcessMove(turnId: string | undefined, gameId: string, roundId: string) {

    const methodCall = async ({moveMade, amount}: { moveMade: string, amount?: number }) => {
        switch (moveMade) {
            case "CHECK":
                await checkAndMove(turnId, gameId, roundId);
                break;
            case "FOLD":
                await foldAndMove(turnId, gameId, roundId);
                break;
            case "CALL":
                if (amount) await callAndMove(turnId, gameId, roundId, amount);
                break;
            case "RAISE":
                if (amount) await raiseAndMove(turnId, gameId, roundId, amount);
                break;
            case "ALL_IN":
                await allinAndMove(turnId, gameId, roundId);
                break;
        }
    };

    const {mutate: processMove, isPending: isProcessingMove, isError: isErrorProcessingMove, isSuccess} = useMutation({
        mutationFn: methodCall,
    });

    return {
        processMove,
        isProcessingMove,
        isErrorProcessingMove,
        isSuccessProcessingMove: isSuccess
    };
}


export function useTurns(roundId: string | undefined,isInProgress: boolean) {
    const {isLoading: isLoadingTurns, isError: isErrorLoadingTurns, data: turns} = useQuery(
        {
            queryKey: ['turns', roundId],
            queryFn: () => getTurns(roundId),
            enabled: isInProgress,
            refetchInterval: 1000
        })

    return {
        isLoadingTurns,
        isErrorLoadingTurns,
        turns,
    }
}