import "./Navbar.scss";
import {useContext, useEffect, useState} from "react";
import SecurityContext from "../../context/SecurityContext.ts";
import {CircleDollarSign} from 'lucide-react';
import FriendsList from "../friendsList/FriendsList.tsx";
import {Alert, Avatar} from "@mui/material";
import {useLoggedInAvatar} from "../../hooks/useAccount.ts";
import Loader from "../loader/Loader.tsx";
import {useGameNotifications} from "../../hooks/useNotification.ts";
import GameNotificationDto from "../../model/dto/GameNotificationDto.ts";
import GameNotification from "../notification/GameNotification.tsx";

export default function Navbar() {
    const {login, logout, isAuthenticated, loggedInUser} = useContext(SecurityContext)
    const {isLoadingAvatar, isErrorLoadingAvatar, avatar} = useLoggedInAvatar(isAuthenticated);

    const {
        isLoadingGameNotifications,
        isErrorLoadingGameNotifications,
        gameNotifications
    } = useGameNotifications(loggedInUser);
    const [newGameNotification, setNewGameNotification] = useState<GameNotificationDto | null>(null);

    useEffect(() => {
        if (gameNotifications && gameNotifications.length > 0) {
            const tenSecondsAgo = new Date();
            tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);

            const lastGameNotification = gameNotifications.filter((notification) => new Date(notification.timestamp) > tenSecondsAgo);
            if (lastGameNotification && lastGameNotification.length > 0) {
                const notification = lastGameNotification[0];
                if (window.location.pathname !== '/game/' + notification.game.id) {
                    setNewGameNotification(notification);
                }
            }
        }
    }, [gameNotifications]);


    if (isLoadingAvatar) return <Loader>loading profile pic...</Loader>
    if (isErrorLoadingAvatar) return <Alert severity="error" variant="filled">error loading profile pic</Alert>
    if (isLoadingGameNotifications) return <Loader>loading game notifications...</Loader>
    if (isErrorLoadingGameNotifications)
        return <Alert severity="error" variant="filled">error loading game notifications</Alert>

    function handleCloseNotification() {
        setNewGameNotification(null);
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
                            <p className="welcomeUser">Welcome, {loggedInUser}</p>
                            {
                                avatar && (
                                    <a href={`/account/${avatar.username}`}>
                                        <Avatar
                                            alt="Profile pic"
                                            src={avatar.image}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                border: '2px solid #ffd700',
                                                left: -15,
                                            }}
                                        />
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
                    onClose={handleCloseNotification}
                />
            )}
        </>
    );
}
