import {useMutation} from "@tanstack/react-query";
import {createNewRoundIfFinished} from "../services/dataService.ts";

export function useCreateNewRoundIfFinished(gameId: string, roundId: string) {

    const {mutate, isPending, isError, isSuccess} = useMutation({
        mutationFn: async () => await createNewRoundIfFinished(gameId, roundId)
    });

    return {
        triggerNewRound: mutate,
        isPending,
        isError,
        isSuccessCreatingNewRound: isSuccess
    };
}