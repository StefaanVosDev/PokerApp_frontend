import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkAndMove} from "../services/dataService.ts";

export function useProcessMove(turnId: string | undefined, moveMade: string | null, gameId: string, roundId: string, playerId: string | undefined) {
    const queryClient = useQueryClient();

    const methodCall = async () => {
        if (moveMade === "CHECK") {
            await checkAndMove(turnId, gameId, roundId, playerId);
        }
    };

    const { mutate: processMove, isPending: isProcessingMove, isError: isErrorProcessingMove } = useMutation({
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
    };
}