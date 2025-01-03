import {Avatar} from "./Avatar.ts";
import Achievement from "./Achievement";

export default interface Account {
    id : string,
    username: string,
    email: string,
    name: string,
    age: Date,
    city: string,
    gender: string,
    ownedAvatars: Avatar[],
    activeAvatar: Avatar | null,
    pokerPoints: number,
    earnedAchievements: Achievement[],
    wins: number,
    playedGames: number,
    royalFlushes: number,
    flushes: number,
    straights: number,
}