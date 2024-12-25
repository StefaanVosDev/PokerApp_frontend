import "./Navbar.scss";
import {useContext} from "react";
import SecurityContext from "../../context/SecurityContext.ts";
import {CircleDollarSign} from 'lucide-react';
import FriendsList from "../friendsList/FriendsList.tsx";
import {Alert, Avatar} from "@mui/material";
import {useLoggedInAvatar} from "../../hooks/useAccount.ts";
import Loader from "../loader/Loader.tsx";


export default function Navbar() {
    const {login, logout, isAuthenticated, loggedInUser} = useContext(SecurityContext)
    const {isLoadingAvatar, isErrorLoadingAvatar, avatar} = useLoggedInAvatar(isAuthenticated);

    if (isLoadingAvatar) return <Loader>loading profile pic...</Loader>
    if (isErrorLoadingAvatar) return <Alert severity="error" variant="filled">error loading profile pic</Alert>

    return (
        <nav className="custom-navbar">
            <div>
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
    );
}
