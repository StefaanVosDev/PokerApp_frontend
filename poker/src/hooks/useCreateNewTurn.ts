import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createNewTurn} from "../services/dataService.ts";

export function useCreateNewTurn(gameId: string) {
    const queryClient = useQueryClient();

    const mutationFn = async () => {
        await createNewTurn(gameId);
    };

    const { mutate, isPending, isError } = useMutation({
        mutationFn: mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['round', gameId] });
            queryClient.invalidateQueries({ queryKey: ['turn', gameId] });
        }
    });

    return {
        triggerNewTurn: mutate,
        isPending,
        isError,
    };
}