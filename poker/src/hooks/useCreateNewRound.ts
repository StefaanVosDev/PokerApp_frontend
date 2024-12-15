import {useMutation} from "@tanstack/react-query";
import {createNewRound} from "../services/dataService.ts";

export function useCreateNewRound(gameId: string | null) {
    const {mutate, isPending, isError, isSuccess} = useMutation({
        mutationFn: async () => await createNewRound(gameId)
    });

    return {
        triggerNewRound: mutate,
        isPending,
        isError,
        isSuccess
    };
}