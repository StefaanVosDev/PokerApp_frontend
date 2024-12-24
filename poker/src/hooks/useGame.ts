import {useMutation, useQuery} from "@tanstack/react-query";
import {createGame, getGame, getGames, getIsOnMove, joinGame} from "../services/gameService.ts";
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
        game,
        isInProgress: game?.status === 'in_progress',
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

export function useIsOnMove(gameId: string, isInProgress: boolean) {
    const {isLoading, isError, data: isOnMove, refetch} = useQuery({
        queryKey: ['isOnMove', gameId],
        queryFn: () => getIsOnMove(gameId),
        enabled: !!gameId && isInProgress,
        refetchInterval: 1000
    });

    return {
        isLoading,
        isError,
        isOnMove,
        refetch,
    };
}

export function useJoinGame(gameId: string) {
    const {mutate: join, isPending: isJoining, isError: isErrorJoining,error} = useMutation({
        mutationFn: async () => {
            await joinGame(gameId);
        },
    });

    return {
        join,
        isJoining,
        isErrorJoining,
        error
    };
}