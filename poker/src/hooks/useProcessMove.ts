import {useMutation} from "@tanstack/react-query";
import {allinAndMove, callAndMove, checkAndMove, foldAndMove, raiseAndMove} from "../services/dataService.ts";

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