import "./Navbar.scss";
import {useContext, useEffect, useState} from "react";
import SecurityContext from "../../context/SecurityContext.ts";
import {CircleDollarSign} from 'lucide-react';
import FriendsList from "../friendsList/FriendsList.tsx";
import {Alert} from "@mui/material";
import {useLoggedInAvatar} from "../../hooks/useAccount.ts";
import Loader from "../loader/Loader.tsx";
import ProfilePic from "../profilePic/ProfilePic.tsx";

import {
    useAchievementNotifications,
    useFriendRequestsNotifications,
    useGameNotifications,
    useInviteNotifications
} from "../../hooks/useNotification.ts";
import GameNotificationDto from "../../model/dto/GameNotificationDto.ts";
import GameNotification from "../notification/GameNotification.tsx";
import InviteNotificationDto from "../../model/dto/InviteNotificationDto.ts";
import InviteNotification from "../notification/InviteNotification.tsx";
import AchievementNotificationDto from "../../model/dto/AchievementNotificationDto";
import AchievementNotification from "../notification/AchievementNotification";
import FriendRequestNotification from "../notification/FriendRequestNotification.tsx";
import FriendRequestDto from "../../model/dto/FriendRequestDto.ts";

export default function Navbar() {
    const {login, logout, isAuthenticated, username} = useContext(SecurityContext)
    const {isLoadingAvatar, isErrorLoadingAvatar, avatar} = useLoggedInAvatar(isAuthenticated);

    const {
        isLoadingGameNotifications,
        isErrorLoadingGameNotifications,
        gameNotifications
    } = useGameNotifications(username);
    const [newGameNotification, setNewGameNotification] = useState<GameNotificationDto | null>(null);
    const {isLoadingInviteNotifications, isErrorInviteNotifications, inviteNotifications} = useInviteNotifications(username);
    const [newInviteNotification, setNewInviteNotification] = useState<InviteNotificationDto | null>(null);


    const {
        isLoadingAchievementNotifications,
        isErrorLoadingAchievementNotifications,
        achievementNotifications
    } = useAchievementNotifications(username);
    const [newAchievementNotification, setNewAchievementNotification] = useState<AchievementNotificationDto | null>(null);

    const {
        isLoadingFriendRequestsNotifications,
        isErrorLoadingFriendRequestsNotifications,
        friendRequestsNotifications
    } = useFriendRequestsNotifications(username);
    const [newFriendRequestNotification, setNewFriendRequestNotification] = useState<FriendRequestDto | null>(null);



    useEffect(() => {
        if (gameNotifications && gameNotifications.length > 0) {
            const notification = gameNotifications[0];
            if (window.location.pathname !== '/game/' + notification.game.id) {
                setNewGameNotification(notification);
            }
        }
    }, [gameNotifications]);

    useEffect(() => {
        if (inviteNotifications && inviteNotifications.length > 0) {
            const notification = inviteNotifications[0];
            if (window.location.pathname !== '/game/' + notification.game.id) {
                setNewInviteNotification(notification);
            }
        }
    }, [inviteNotifications]);

    useEffect(() => {
        if (achievementNotifications && achievementNotifications.length > 0) {
            const notification = achievementNotifications[0];
            setNewAchievementNotification(notification);
        }
    }, [achievementNotifications]);

    useEffect(() => {
        if (friendRequestsNotifications && friendRequestsNotifications.length > 0) {
            const notification = friendRequestsNotifications[0];
            setNewFriendRequestNotification(notification);
        }
    }, [friendRequestsNotifications]);


    if (isLoadingAvatar) return <Loader>loading profile pic...</Loader>
    if (isErrorLoadingAvatar) return <Alert severity="error" variant="filled">error loading profile pic</Alert>
    if (isLoadingGameNotifications) return <Loader>loading game notifications...</Loader>
    if (isErrorLoadingGameNotifications)
        return <Alert severity="error" variant="filled">error loading game notifications</Alert>
    if (isLoadingInviteNotifications) return <Loader>loading invite notifications...</Loader>
    if (isErrorInviteNotifications)
        return <Alert severity="error" variant="filled">error loading invite notifications</Alert>
    if (isLoadingAchievementNotifications) return <Loader>loading achievement notifications...</Loader>
    if (isErrorLoadingAchievementNotifications)
        return <Alert severity="error" variant="filled">error loading achievement notifications</Alert>
    if (isLoadingFriendRequestsNotifications) return <Loader>loading friend requests...</Loader>
    if (isErrorLoadingFriendRequestsNotifications)
        return <Alert severity="error" variant="filled">error loading friend requests</Alert>

    function handleCloseGameNotification() {
        setNewGameNotification(null);
    }

    function handleCloseAchievementNotification() {
        setNewAchievementNotification(null);
    }

    function handleCloseInviteNotification() {
        setNewInviteNotification(null);
    }

    function handleCloseFriendRequestNotification() {
        setNewFriendRequestNotification(null);
    }

    return (
        <>
            <nav className="custom-navbar">
                <div className="brand-container">
                    <CircleDollarSign className="icon"/>
                    <a href="/home" className="brand">
                        Stacks
                    </a>
                </div>

                <div className="nav-links">
                    <a href="/home" className="link">
                        HOME
                    </a>
                    <a href="/games" className="link">
                        GAMES
                    </a>
                    <a href="/shop" className="link">
                        SHOP
                    </a>
                </div>
                <div className="buttons">
                    {isAuthenticated() && <FriendsList/>}
                    {!isAuthenticated() ? (
                        <button className="button" onClick={login}>
                            LOGIN
                        </button>
                    ) : (
                        <div className="logout">
                            <p className="welcomeUser">Welcome, {username}</p>
                            {
                                avatar && (
                                    <a href={`/account/${avatar.username}`}>
                                        <ProfilePic isActive={false} left={-15} image={avatar.image}/>
                                    </a>
                                )
                            }
                            <button className="button" onClick={logout}>
                                LOGOUT
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            {newGameNotification && (
                <GameNotification
                    game={newGameNotification.game}
                    onClose={handleCloseGameNotification}
                />
            )}
            {newAchievementNotification && (
                <AchievementNotification
                    achievementName={newAchievementNotification.achievementName}
                    onClose={handleCloseAchievementNotification}
                />
            )}
            {newInviteNotification && (
                <InviteNotification
                    game={newInviteNotification.game}
                    onClose={handleCloseInviteNotification}
                    sender={newInviteNotification.friendUsername}
                />
            )}
            {newFriendRequestNotification && (
                <FriendRequestNotification
                    friendRequest={newFriendRequestNotification}
                    onClose={handleCloseFriendRequestNotification}
                />
            )}
        </>
    );
}
