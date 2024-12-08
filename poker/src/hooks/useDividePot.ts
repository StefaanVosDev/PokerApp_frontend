import {useMutation, useQueryClient} from "@tanstack/react-query";
import {dividePot} from "../services/dataService.ts";

export function useDividePot(roundId: string | undefined, gameId: string) {
    const queryClient = useQueryClient();

    const mutationFn = async () => {
        await dividePot(roundId);
    };

    const { mutate: triggerDividePot, isPending: isDividingPot, isError: isErrorDividingPot, data: winnings } = useMutation({
        mutationFn: mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['round', gameId] });
            queryClient.invalidateQueries({ queryKey: ['turn', gameId] });
        }
    });

    return {
        triggerDividePot,
        isDividingPot,
        isErrorDividingPot,
        winnings
    };
}