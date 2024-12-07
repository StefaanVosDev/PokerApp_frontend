import "./Navbar.scss";
import {useContext} from "react";
import SecurityContext from "../../context/SecurityContext.ts";

export default function Navbar() {
    const {login, logout, isAuthenticated, loggedInUser} = useContext(SecurityContext)


    return (
        <nav className="navbar">
            <a href="/home" className="brand">
                Stacks
            </a>
            <div className="nav-links">
                <a href="/home" className="link">
                    HOME
                </a>
                <a href="" className="link">
                    TOURNAMENT
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
