import "./Navbar.scss";
import {useContext} from "react";
import SecurityContext from "../../context/SecurityContext.ts";
import { CircleDollarSign} from 'lucide-react';


export default function Navbar() {
    const {login, logout, isAuthenticated, loggedInUser} = useContext(SecurityContext)


    return (
        <nav className="navbar">
            <a href="/home" className="brand">
                <CircleDollarSign className="icon" />
                Stacks
            </a>
            <div className="nav-links">
                <a href="/home" className="link">
                    HOME
                </a>
                <a href="/games" className="link">
                    GAMES
                </a>
                <a href="" className="link">
                    POKER NEWS
                </a>
            </div>
            <div className="buttons">
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
