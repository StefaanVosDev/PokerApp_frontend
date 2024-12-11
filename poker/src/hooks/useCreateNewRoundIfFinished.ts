import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createNewRoundIfFinished} from "../services/dataService.ts";

export function useCreateNewRoundIfFinished(gameId: string, roundId: string) {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, isSuccess} = useMutation({
        mutationFn: async () => await createNewRoundIfFinished(gameId, roundId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['round', gameId] });
            queryClient.invalidateQueries({ queryKey: ['communityCards', gameId] });
        }
    });

    return {
        triggerNewRound: mutate,
        isPending,
        isError,
        isSuccessCreatingNewRound: isSuccess
    };
}