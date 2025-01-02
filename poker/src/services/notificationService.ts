import axios from "axios";
import FriendRequestDto from "../model/dto/FriendRequestDto.ts";
import GameNotificationDto from "../model/dto/GameNotificationDto.ts";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function getFriendRequests(username: string | undefined) {
    if (!username) return null;
    const {data} = await axios.get<FriendRequestDto[]>(`/api/friends/requests/${username}`);
    return data;
}

export async function acceptRequest(id: string) {
    const {data} = await axios.put<string>(`/api/friends/accept?friendRequestId=${id}`);
    return data
}

export async function declineRequest(id: string) {
    const {data} = await axios.delete<string>(`/api/friends/decline?friendRequestId=${id}`);
    return data
}

export async function getGameNotifications(username: string | undefined) {
    if (!username) return null;
    const {data} = await axios.get<GameNotificationDto[]>(`/api/notifications/game/${username}`);
    return data;
}