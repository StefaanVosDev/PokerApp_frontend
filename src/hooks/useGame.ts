import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    createGame,
    getGame,
    getGames,
    getIsOnMove,
    getMessages,
    joinGame,
    sendMessage
} from "../services/gameService.ts";
import {CreateGameFormInputs} from "../components/createGame/forminput/CreateGameFormInputs.ts";

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
    const queryClient = useQueryClient();

    const {mutate, isPending, error} = useMutation({
        mutationFn: async (gameData: CreateGameFormInputs) => await createGame(gameData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['games']});
            return data;
        }
    });

    return {
        createGame: mutate,
        isPending,
        error
    };
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

export function useMessages(gameId: string) {
    const {isLoading, isError, data: messages} = useQuery({
        queryKey: ['messages'],
        queryFn: () => getMessages(gameId),
        refetchInterval: 1000
    });

    return {
        isLoading,
        isError,
        messages,
    };
}

export function useSendMessage(gameId: string) {
    const queryClient = useQueryClient();

    const {mutate, isPending, isError, isSuccess} = useMutation({
        mutationFn: async (message: string) => {
            await sendMessage(gameId, message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['messages']});

        }
    });
    return {
        isPending,
        isError,
        isSuccess,
        sendMessage: mutate,
    }
}
