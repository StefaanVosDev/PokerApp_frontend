import {ReactNode, useEffect, useState} from 'react';
import SecurityContext from './SecurityContext';
import {addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader} from '../services/auth';
import {isExpired} from 'react-jwt';
import Cookies from 'js-cookie';
import Keycloak from 'keycloak-js';
import Account from '../model/Account.ts';
import {useCreateAccount} from "../hooks/useAccount.ts";

interface IWithChildren {
    children: ReactNode;
}

const keycloakConfig = {
    url: import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
};
const keycloak: Keycloak = new Keycloak(keycloakConfig);

export default function SecurityContextProvider({ children }: IWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined);
    const [isKeycloakInitialized, setIsKeycloakInitialized] = useState(false);
    const { triggerCreateAccount } = useCreateAccount();
    const [username, setUsername] = useState<string | undefined>(undefined);

    useEffect(() => {
        keycloak
            .init({ onLoad: 'check-sso' })
            .then((authenticated) => {
                if (authenticated) {
                    const newToken = keycloak.token;
                    if (newToken) {
                        Cookies.set('authToken', newToken, { secure: true, sameSite: 'Strict', expires: 1 });
                        Cookies.set('loggedInUser', keycloak.idTokenParsed?.given_name || '', { secure: true, sameSite: 'Strict', expires: 1 });
                        addAccessTokenToAuthHeader(newToken);
                        setLoggedInUser(keycloak.idTokenParsed?.given_name);
                        setUsername(keycloak.idTokenParsed?.preferred_username);
                        triggerCreateAccountFromKeycloak();
                    }
                }
                setIsKeycloakInitialized(true);
            })
            .catch((error) => {
                console.error("Keycloak initialization failed:", error);
            });
    }, []);


    function triggerCreateAccountFromKeycloak() {
        const account: Account = {
            username: keycloak.idTokenParsed?.preferred_username,
            email: keycloak.idTokenParsed?.email,
            name: keycloak.idTokenParsed?.name,
            age: keycloak.idTokenParsed?.age,
            city: keycloak.idTokenParsed?.city,
            gender: keycloak.idTokenParsed?.gender,
        };
        triggerCreateAccount(account);
    }

    function login() {
        keycloak.login();
    }

    function logout() {
        // Check if Keycloak is ready
        if (!keycloak || !keycloak.authenticated) {
            console.warn("Keycloak is not initialized or user is already logged out.");
            return;
        }

        // Clean up cookies and headers
        Cookies.remove('authToken');
        Cookies.remove('loggedInUser');
        removeAccessTokenFromAuthHeader();

        setLoggedInUser(undefined);

        // Force Keycloak logout
        const logoutOptions = { redirectUri: import.meta.env.VITE_REACT_APP_URL };
        keycloak.logout(logoutOptions).catch((error) => {
            console.error("Keycloak logout failed:", error);
        });
    }




    function isAuthenticated(): boolean {
        const token = Cookies.get('authToken');
        return token ? !isExpired(token) : false;
    }


    if (!isKeycloakInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <SecurityContext.Provider
            value={{
                isAuthenticated,
                loggedInUser,
                username,
                login,
                logout,
            }}
        >
            {children}
        </SecurityContext.Provider>
    );
}
