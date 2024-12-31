import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../services/DirectMessagingService.ts";
import DirectMessageDto from "../model/DirectMessageDto.ts";


export function useGetMessages(sender: string, receiver: string) {
    const { data, isLoading, isError, isSuccess, error } = useQuery<DirectMessageDto[], Error>({
        queryKey: ["messages", sender, receiver],
        queryFn: async () => await getMessages(sender, receiver),
        enabled: !!sender && !!receiver,
        refetchInterval: 1000
    });

    return {
        messages: data ?? [],
        isLoading,
        isError,
        isSuccess,
        error,
    };
}


export function useSendMessage() {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, isSuccess, error } = useMutation({
        mutationFn: async (message: DirectMessageDto) => await sendMessage(message),
        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({ queryKey: ["messages", variables.sender, variables.receiver] });
        },
    });

    return {
        triggerSendMessage: mutate,
        isPending,
        isError,
        isSuccess,
        error,
    };
}
