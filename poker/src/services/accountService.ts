import axios from "axios";
import Account from "../model/Account.ts";
import {Avatar} from "../model/Avatar.ts";
import FriendsListDto from "../model/FriendsListDto.ts";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function createAccount(account: Account) {
    const {data} = await axios.post<Account>('/api/accounts', {
        username: account.username,
        email: account.email,
        name: account.name,
        age: account.age,
        city: account.city,
        gender: account.gender.toUpperCase(),
    });
    return data;
}

export async function getFriends(username: string | undefined | null) {
    const {data} = await axios.get<FriendsListDto[]>(`/api/accounts/friends/${username}`);
    return data;
}

export async function getAvatars() {
    const {data} = await axios.get<Avatar[]>('/api/avatars');
    return data;
}

export async function buyAvatar(avatar: Avatar) {
    const {data} = await axios.post<Avatar>('/api/avatars/buy?name=' + avatar.name);
    return data;
}

export async function getPokerPoints() {
    const {data} = await axios.get<number>('/api/accounts/poker-points');
    return data;
}
export async function deleteFriend(username: string, friendUsername: string) {
    await axios.delete(`/api/accounts/friends/${username}/${friendUsername}`);
}

export async function addFriend(username: string, friendUsername: string): Promise<void> {
    try {
        await axios.post(`/api/accounts/friends/${username}/${friendUsername}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {

            const { data } = error.response;
            throw new Error(typeof data === "string" ? data : "An error occurred");
        }

        throw new Error("Network error occurred. Please try again later.");
    }
}

