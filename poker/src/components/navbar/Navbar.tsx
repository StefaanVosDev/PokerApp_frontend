// src/components/Navbar.jsx

import "./Navbar.scss";

export default function Navbar() {
    return (
        <nav className="navbar">
            <a href="/" className="brand">
                Stacks
            </a>
            <div className="nav-links">
                <a href="/" className="link">
                    HOME
                </a>
                <a href="" className="link">
                    TOURNAMENT
                </a>
                {/*<a href="/game" className="link">
                    GAME
                </a>*/}
                <a href="" className="link">
                    POKER NEWS
                </a>
            </div>
            <div className="buttons">
                <button className="button">REGISTER</button>
                <button className="button">LOGIN</button>
            </div>
        </nav>
    );
}
