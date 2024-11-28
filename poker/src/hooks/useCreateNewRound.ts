import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createNewRound} from "../services/dataService.ts";

export function useCreateNewRound(gameId: string) {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: async () => await createNewRound(gameId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['round', gameId] });
            queryClient.invalidateQueries({ queryKey: ['communityCards', gameId] });
        }
    });

    return {
        triggerNewRound: mutate,
        isPending,
        isError,
        isSuccess
    };
}