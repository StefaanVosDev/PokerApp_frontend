import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkAndMove} from "../services/dataService.ts";

export function useProcessMove(turnId: string | undefined, gameId: string, roundId: string, playerId: string | undefined) {
    const queryClient = useQueryClient();

    const methodCall = async (moveMade: string) => {
        if (moveMade === "CHECK") {
            await checkAndMove(turnId, gameId, roundId, playerId);
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