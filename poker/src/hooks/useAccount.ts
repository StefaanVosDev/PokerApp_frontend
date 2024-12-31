import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Account from "../model/Account.ts";
import {
    addFriend,
    buyAvatar,
    createAccount,
    deleteFriend,
    getAccount,
    getAvatars,
    getFriends,
    getLoggedInAvatar,
    getPokerPoints,
    selectAvatar
} from "../services/accountService.ts";
import {Avatar} from "../model/Avatar.ts";


export function useSelectAvatar(username: string, avatarId: string | null) {
    const {mutate: triggerSelectAvatar, isPending: isSelectingAvatar, isError: isErrorSelectingAvatar, isSuccess: isSuccessSelectingAvatar} = useMutation({
        mutationFn: async () => {
            await selectAvatar(username, avatarId);
        },
    });

    return {
        triggerSelectAvatar,
        isSelectingAvatar,
        isErrorSelectingAvatar,
        isSuccessSelectingAvatar
    };
}

export function useAddFriend() {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, isSuccess, error } = useMutation({
        mutationFn: async ({ username, friendUsername }: { username: string, friendUsername: string }) => {
            await addFriend(username, friendUsername);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] });
        },
    });

    return {
        triggerAddFriend: mutate,
        isPending,
        isError,
        isSuccess,
        error,
    };
}


export function useDeleteFriend() {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, isSuccess, error } = useMutation({
        mutationFn: async ({ username, friendUsername }: { username: string, friendUsername: string }) => await deleteFriend(username, friendUsername),
        onSuccess: () => {
            // Invalidate or refetch relevant queries to ensure updated data
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        }
    });

    return {
        triggerDeleteFriend: mutate,
        isPending,
        isError,
        isSuccess,
        error,
    };
}

export function useCreateAccount() {
    const queryClient = useQueryClient();

    const {mutate, isPending, isError, isSuccess, error} = useMutation({
        mutationFn: async (account: Account) => await createAccount(account),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['accounts']});
        }
    });

    return {
        triggerCreateAccount: mutate,
        isPending,
        isError,
        isSuccess,
        error, // To provide error details if needed
    };
}

export function useAvatars() {
    const {isLoading, isError, data: avatars, refetch} = useQuery({
        queryKey: ['avatars'],
        queryFn: getAvatars,
        refetchInterval: 10000
    });

    return {
        isLoadingAvatars: isLoading,
        isErrorAvatars: isError,
        avatars,
        refetchAvatars: refetch,
    };
}

export function useBuyAvatar() {
    const queryClient = useQueryClient();

    const {mutate, isPending, isError, isSuccess, error} = useMutation({
        mutationFn: async (avatar: Avatar) => await buyAvatar(avatar),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['avatars']});
        }
    });

    return {
        triggerBuyAvatar: mutate,
        isPendingBuyAvatar: isPending,
        isErrorBuyAvatar: isError,
        isSuccessBuyAvatar: isSuccess,
        errorBuyAvatar: error,
    };
}

export function usePokerPoints() {
    const {isLoading, isError, data: pokerPoints, refetch} = useQuery({
        queryKey: ['pokerPoints'],
        queryFn: getPokerPoints,
        refetchInterval: 10000
    });

    return {
        isLoadingPokerPoints: isLoading,
        isErrorPokerPoints: isError,
        pokerPoints,
        refetchPokerPoints: refetch
    }

}


export function useFriends(username: string | undefined | null) {
    const { isLoading, isError, data: friends } = useQuery({
        queryKey: ['friends', username],
        queryFn: () => getFriends(username),
        enabled: !!username, // Ensure the query only runs when username is truthy
        refetchInterval: 5000
    });

    return {
        isLoading,
        isError,
        friends,
    };
}

export function useLoggedInAvatar(isAuthenticated: () => boolean) {
    const {
        isLoading: isLoadingAvatar,
        isError: isErrorLoadingAvatar,
        data: avatar,
    } = useQuery({
        queryKey: ['avatar'],
        queryFn: () => getLoggedInAvatar(isAuthenticated),
        refetchInterval: 3000
    })

    return {
        isLoadingAvatar,
        isErrorLoadingAvatar,
        avatar
    }
}

export function useAccount(username: string | undefined) {
    const {
        isLoading,
        isError,
        data: account,
    } = useQuery({
        queryKey: ['account', username],
        queryFn: () => getAccount(username),
        refetchInterval: 1000
    })

    return {
        isLoading,
        isError,
        account
    }
}
