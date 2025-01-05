import {ReactNode, useEffect, useState} from 'react';
import SecurityContext from './SecurityContext';
import {addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader} from '../services/auth';
import {isExpired, decodeToken} from 'react-jwt';
import Cookies from 'js-cookie';
import Keycloak from 'keycloak-js';
import {useCreateAccount} from "../hooks/useAccount.ts";
import Loader from "../components/loader/Loader.tsx";
import AccountDto from "../model/dto/AccountDto.ts";

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
    const { isSuccess, isPending: isCreatingAccount, triggerCreateAccount } = useCreateAccount();
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

                        // Start token expiration timer
                        scheduleLogoutOnTokenExpiry(newToken);
                    }
                }
                setIsKeycloakInitialized(true);
            })
            .catch((error) => {
                console.error("Keycloak initialization failed:", error);
            });
    }, []);

    function scheduleLogoutOnTokenExpiry(token: string) {
        const decodedToken = decodeToken<{ exp: number }>(token);
        if (decodedToken && decodedToken.exp) {
            const expirationTimeInMs = decodedToken.exp * 1000 - Date.now();
            if (expirationTimeInMs > 0) {
                setTimeout(() => {
                    console.warn("Token has expired. Logging out...");
                    logout();
                }, expirationTimeInMs);
            }
        }
    }

    function triggerCreateAccountFromKeycloak() {
        const account: AccountDto = {
            username: keycloak.idTokenParsed?.preferred_username,
            email: keycloak.idTokenParsed?.email,
            name: keycloak.idTokenParsed?.name,
            age: keycloak.idTokenParsed?.age,
            city: keycloak.idTokenParsed?.city,
            gender: keycloak.idTokenParsed?.gender,
            ownedAvatars: [],
            activeAvatar: null,
        };
        triggerCreateAccount(account);
    }

    function login() {
        keycloak.login();
    }

    function logout() {
        if (!keycloak || !keycloak.authenticated) {
            console.warn("Keycloak is not initialized or user is already logged out.");
            return;
        }

        Cookies.remove('authToken');
        Cookies.remove('loggedInUser');
        removeAccessTokenFromAuthHeader();

        setLoggedInUser(undefined);

        const logoutOptions = { redirectUri: import.meta.env.VITE_REACT_APP_URL };
        keycloak.logout(logoutOptions).catch((error) => {
            console.error("Keycloak logout failed:", error);
        });
    }

    function isAuthenticated(): boolean {
        const token = Cookies.get('authToken');
        return token ? !isExpired(token) && isSuccess : false;
    }

    if (!isKeycloakInitialized || isCreatingAccount) {
        return <Loader>Loading...</Loader>
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
