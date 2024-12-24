import "./Navbar.scss";
import {useContext} from "react";
import SecurityContext from "../../context/SecurityContext.ts";
import {CircleDollarSign} from 'lucide-react';
import FriendsList from "../friendsList/FriendsList.tsx";


export default function Navbar() {
    const {login, logout, isAuthenticated, loggedInUser} = useContext(SecurityContext)


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
                {isAuthenticated() && <FriendsList />}
                {!isAuthenticated() ? (
                    <button className="button" onClick={login}>
                        LOGIN
                    </button>
                ) : (
                    <div className="logout">
                        <p className="welcomeUser" >Welcome, {loggedInUser}</p>
                        <button className="button" onClick={logout}>
                            LOGOUT
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
