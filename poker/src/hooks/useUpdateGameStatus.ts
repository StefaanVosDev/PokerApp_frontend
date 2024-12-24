import { updateGameStatus } from "../services/gameService";
import { useMutation } from "@tanstack/react-query";

export function useUpdateGameStatus() {
    const { mutate: updateStatus,isPending, isError, isSuccess, error } = useMutation({
        mutationFn: (gameId: string) => updateGameStatus(gameId),
    });

    return {
        updateStatus,
        isPending,
        isError,
        isSuccess,
        error,
    };
}
