import {useMutation} from "@tanstack/react-query";
import {dividePot} from "../services/dataService.ts";

export function useDividePot(roundId: string | undefined) {

    const mutationFn = async () => {
        await dividePot(roundId);
    };

    const {
        mutate: triggerDividePot,
        isPending: isDividingPot,
        isError: isErrorDividingPot,
        data: winnings,
        isSuccess
    } = useMutation({
        mutationFn: mutationFn
    });

    return {
        triggerDividePot,
        isDividingPot,
        isErrorDividingPot,
        winnings,
        isSuccessDividingPot: isSuccess
    };
}