import {useMutation, useQuery} from "@tanstack/react-query";
import {createGame, fetchIsOnMove, getGame, getGames, joinGame} from "../services/gameService.ts";
import {CreateGameFormInputs} from "../components/game/forminput/CreateGameFormInputs.ts";

export function useGame(gameId: string) {
    const {isLoading, isError, data: game} = useQuery({
        queryKey: ['game', gameId],
        queryFn: () => getGame(gameId),
        enabled: !!gameId,
        refetchInterval: 1000
    });

    return {
        isLoading,
        isError,
        game
    };
}

export function useCreateGame() {
    return useMutation<CreateGameFormInputs, Error, CreateGameFormInputs>({
        mutationFn: createGame,
    });
}

export function useGames() {
    const {isLoading, isError, data: games} = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
        refetchInterval: 10000
    });

    return {
        isLoading,
        isError,
        games,
    };
}

export function useIsOnMove(gameId: string | undefined) {
    const {isLoading, isError, data: isOnMove} = useQuery({
        queryKey: ['isOnMove', gameId],
        queryFn: () => fetchIsOnMove(gameId),
    });

    return {
        isLoading,
        isError,
        isOnMove,
    };
}

export function useJoinGame(gameId: string) {
    const {mutate: join, isPending: isJoining, isError: isErrorJoining} = useMutation({
        mutationFn: async () => {
            await joinGame(gameId);
        },
    });

    return {
        join,
        isJoining,
        isErrorJoining,
    };
}