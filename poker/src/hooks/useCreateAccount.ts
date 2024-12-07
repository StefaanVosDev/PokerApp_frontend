import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "../services/dataService.ts";
import Account from "../model/Account.ts";


export function useCreateAccount() {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, isSuccess, error } = useMutation({
        mutationFn: async (account: Account) => await createAccount(account),
        onSuccess: () => {
            // Invalidate or refetch relevant queries to ensure updated data
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
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
