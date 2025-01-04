import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    acceptRequest,
    declineRequest,
    getAchievementNotifications,
    getFriendRequests,
    getGameNotifications,
    getInviteNotifications
} from "../services/notificationService.ts"

export function useProcessFriendRequest(username: string | undefined) {
    const queryClient = useQueryClient();

    const methodCall = async ({accept, id}: { accept: boolean, id: string }) => {
        if (accept) await acceptRequest(id)
        else await declineRequest(id)
    };

    const {mutate: processRequest, isPending: isProcessingRequest, isError: isErrorProcessingRequest, isSuccess: isSuccessProcessingRequest} = useMutation({
        mutationFn: methodCall,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['friends', username]})
            queryClient.invalidateQueries({queryKey: ['friendRequests', username]})
        }
    });

    return {
        processRequest,
        isProcessingRequest,
        isErrorProcessingRequest,
        isSuccessProcessingRequest
    };
}


export function useFriendRequests(username : string | undefined) {
    const {
        isLoading: isLoadingFriendRequests,
        isError: isErrorLoadingFriendRequests,
        data: friendRequests,
    } = useQuery({
        queryKey: ['friendRequests', username],
        queryFn: () => getFriendRequests(username),
        refetchInterval: 5000
    })

    return {
        isLoadingFriendRequests,
        isErrorLoadingFriendRequests,
        friendRequests
    }
}

export function useGameNotifications(username : string | undefined) {
    const {
        isLoading: isLoadingGameNotifications,
        isError: isErrorLoadingGameNotifications,
        data: gameNotifications,
    } = useQuery({
        queryKey: ['gameNotifications', username],
        queryFn: () => getGameNotifications(username),
        refetchInterval: 5000
    })

    return {
        isLoadingGameNotifications,
        isErrorLoadingGameNotifications,
        gameNotifications
    }
}

export function useInviteNotifications(username: string | undefined) {
    const {
        isLoading: isLoadingInviteNotifications,
        isError: isErrorInviteNotifications,
        data: inviteNotifications,
    } = useQuery({
        queryKey: ['inviteNotifications', username],
        queryFn: () => getInviteNotifications(username),
        refetchInterval: 5000
    })

    return {
        isLoadingInviteNotifications,
        isErrorInviteNotifications,
        inviteNotifications
    }
}

export function useAchievementNotifications(username : string | undefined) {
    const {
        isLoading: isLoadingAchievementNotifications,
        isError: isErrorLoadingAchievementNotifications,
        data: achievementNotifications,
    } = useQuery({
        queryKey: ['achievementNotifications', username],
        queryFn: () => getAchievementNotifications(username),
        refetchInterval: 5000
    })

    return {
        isLoadingAchievementNotifications,
        isErrorLoadingAchievementNotifications,
        achievementNotifications
    }
}