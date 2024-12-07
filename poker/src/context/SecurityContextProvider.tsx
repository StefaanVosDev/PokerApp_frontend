import {ReactNode, useEffect, useState} from 'react'
import SecurityContext from './SecurityContext'
import {addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader} from '../services/auth'
import {isExpired} from 'react-jwt'
import Keycloak from 'keycloak-js'
import Account from "../model/Account.ts";
import {useCreateAccount} from "../hooks/useCreateAccount.ts";

interface IWithChildren {
    children: ReactNode
}

const keycloakConfig = {
    url: import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
}
const keycloak: Keycloak = new Keycloak(keycloakConfig)

export default function SecurityContextProvider({children}: IWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined)
    const { triggerCreateAccount } = useCreateAccount()

    useEffect(() => {
        keycloak.init()
    }, [])

    keycloak.onAuthSuccess = () => {
        addAccessTokenToAuthHeader(keycloak.token)
        setLoggedInUser(keycloak.idTokenParsed?.given_name)

        const account: Account = {
            username: keycloak.idTokenParsed?.preferred_username,
            email: keycloak.idTokenParsed?.email,
            name: keycloak.idTokenParsed?.name,
            age: keycloak.idTokenParsed?.age,
            city: keycloak.idTokenParsed?.city,
            gender: keycloak.idTokenParsed?.gender
        }

        triggerCreateAccount(account)

    }

    keycloak.onAuthLogout = () => {
        removeAccessTokenFromAuthHeader()
    }

    keycloak.onAuthError = () => {
        removeAccessTokenFromAuthHeader()
    }

    keycloak.onTokenExpired = () => {
        keycloak.updateToken(-1).then(function () {
            addAccessTokenToAuthHeader(keycloak.token)
            setLoggedInUser(keycloak.idTokenParsed?.given_name)
        })
    }

    function login() {
        keycloak.login()
    }

    function logout() {
        const logoutOptions = {redirectUri: import.meta.env.VITE_REACT_APP_URL}
        keycloak.logout(logoutOptions)
    }

    function isAuthenticated() {
        if (keycloak.token) return !isExpired(keycloak.token)
        else return false
    }

    return (
        <SecurityContext.Provider
            value={{
                isAuthenticated,
                loggedInUser,
                login,
                logout,
            }}
        >
            {children}
        </SecurityContext.Provider>
    )
}
