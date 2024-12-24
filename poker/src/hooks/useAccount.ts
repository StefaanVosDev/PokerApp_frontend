import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Account from "../model/Account.ts";
import {createAccount, deleteFriend, getFriends} from "../services/accountService.ts";



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
        error, // To provide error details if needed
    };
}

export function useCreateAccount() {
    const queryClient = useQueryClient();

    const {mutate, isPending, isError, isSuccess, error} = useMutation({
        mutationFn: async (account: Account) => await createAccount(account),
        onSuccess: () => {
            // Invalidate or refetch relevant queries to ensure updated data
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



export function useFriends(username: string | undefined | null) {
    const { isLoading, isError, data: friends } = useQuery({
        queryKey: ['friends', username],
        queryFn: () => getFriends(username),
        enabled: !!username, // Ensure the query only runs when username is truthy
    });

    return {
        isLoading,
        isError,
        friends,
    };
}
