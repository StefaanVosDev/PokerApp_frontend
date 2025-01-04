import {ReactNode, useContext} from 'react'
import SecurityContext from "../../context/SecurityContext.ts";
import "./RouteGuard.scss"


export interface RouteGuardProps {
    children: ReactNode
}

export function RouteGuard({children}: RouteGuardProps) {
    const {isAuthenticated, login} = useContext(SecurityContext)

    if (isAuthenticated()) {
        return children
    } else {
        return <div className="login-div">
            <img src="https://storage.googleapis.com/poker_stacks/others/401.svg" alt="401 error image" className="login-image" />
            <p className="login-text">In order to visit this page you need to be authorized</p>
            <button className="login-button" onClick={login}>Login</button>
        </div>
    }
}