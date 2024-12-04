import { useMutation, useQueryClient } from "@tanstack/react-query";
import {callAndMove, checkAndMove, foldAndMove} from "../services/dataService.ts";

export function useProcessMove(turnId: string | undefined, gameId: string, roundId: string) {
    const queryClient = useQueryClient();

    const methodCall = async ({moveMade, amount}: {moveMade: string, amount?: number}) => {
        if (moveMade === "CHECK") {
            await checkAndMove(turnId, gameId, roundId);
        } else if (moveMade === "FOLD") {
            await foldAndMove(turnId, gameId, roundId);
        } else if (moveMade === "CALL" && amount) {
            await callAndMove(turnId, gameId, roundId, amount);
        }
    };


    const { mutate: processMove, isPending: isProcessingMove, isError: isErrorProcessingMove, isSuccess } = useMutation({
        mutationFn: methodCall,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['turn', gameId] });
            queryClient.invalidateQueries({ queryKey: ['communityCards', gameId] });
        },
    });

    return {
        processMove,
        isProcessingMove,
        isErrorProcessingMove,
        isSuccessProcessingMove: isSuccess
    };
}