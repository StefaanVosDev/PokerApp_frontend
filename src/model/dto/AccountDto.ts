import {Avatar} from "../Avatar.ts";

export default interface AccountDto {
    username: string,
    email: string,
    name: string,
    age: Date,
    city: string,
    gender: string,
    ownedAvatars: Avatar[],
    activeAvatar: Avatar | null
}