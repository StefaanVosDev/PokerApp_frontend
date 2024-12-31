import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './App.scss';
import {cyan} from "@mui/material/colors";
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar/Navbar.tsx";
import Home from "./components/home/Home.tsx";
import Game from "./components/game/Game.tsx";
import GameList from "./components/gameList/GameList.tsx";
import CreateGame from "./components/createGame/CreateGame.tsx";
import SecurityContextProvider from "./context/SecurityContextProvider.tsx";
import {RouteGuard} from "./components/routeguard/RouteGuard.tsx";
import EndGame from "./components/game/EndGame.tsx";
import AccountPage from "./components/account/AccountPage.tsx";
import Shop from "./components/shop/Shop.tsx";

const theme = createTheme({
    palette: {
        primary: cyan,
        secondary: {
            main: 'rgba(241, 248, 253, 1)',
        },
    },
    typography: {
        fontFamily: ['handwritten', 'Verdana', 'sans-serif'].join(','),
        fontSize: 16,
    },
})



function App() {
    const queryClient = new QueryClient()
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <SecurityContextProvider>
                    <BrowserRouter>
                        <Navbar/>
                            <Routes>
                                <Route path="/home" element={<Home/>}/>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/game/:id" element={<RouteGuard><Game/></RouteGuard>}/>
                                <Route path="/games" element={<RouteGuard><GameList/></RouteGuard>}/>
                                <Route path="/create-game" element={<RouteGuard><CreateGame/></RouteGuard>}/>
                                <Route path="/end-game/:winnerId" element={<RouteGuard><EndGame/></RouteGuard>}/>
                                <Route path="/shop" element={<RouteGuard><Shop/></RouteGuard>}/>
                                <Route path="/account/:username" element={<RouteGuard><AccountPage/></RouteGuard>}/>
                            </Routes>
                    </BrowserRouter>
                </SecurityContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App;
