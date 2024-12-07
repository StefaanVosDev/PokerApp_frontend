import { createContext } from 'react'

export interface ISecurityContext {
    isAuthenticated: () => boolean
    loggedInUser: string | undefined
    login: () => void
    logout: () => void
}

export default createContext<ISecurityContext>({
    isAuthenticated: () => false,
    loggedInUser: undefined,
    login: () => {},
    logout: () => {},
})
