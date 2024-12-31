import axios from "axios";
import Account from "../model/Account.ts";
import FriendsListDto from "../model/FriendsListDto.ts";
import {Avatar} from "../model/Avatar.ts";


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
    const {data} = await axios.get<FriendsListDto[]>(`/api/friends/${username}`);
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
    await axios.delete(`/api/friends/${username}/${friendUsername}`);
}

export async function getLoggedInAvatar(isAuthenticated: () => boolean) {
    if (isAuthenticated()) {
        const {data} = await axios.get<Avatar>("/api/avatars/loggedIn")
        return data;
    }
    return null;
}

export async function getAccount(username : string | undefined) {
    if (username) {
        const {data} = await axios.get<Account>('/api/accounts/' + username);
        return data;
    }
    return null;
}

export async function addFriend(username: string, friendUsername: string) {
    const {data} = await axios.post(`/api/friends/${username}/${friendUsername}`);
    return data
}

export async function selectAvatar(username: string, avatarId: string | null) {
    if (!avatarId) return null;
    const {data} = await axios.put<string>(`/api/accounts/${username}/active-avatar?avatarId=${avatarId}`);
    return data;
}


