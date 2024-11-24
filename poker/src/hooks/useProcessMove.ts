import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkTurn } from "../services/dataService.ts";

export function useProcessMove(turnId: string | undefined, moveMade: string | null, gameId: string) {
    const queryClient = useQueryClient();

    const methodCall = () => {
        switch (moveMade) {
            default:
                return checkTurn(turnId);
        }
    };

    // UseMutation setup
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
