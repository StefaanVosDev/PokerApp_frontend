import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './App.css';
import HelloWorld from './components/helloworld/HelloWorld.tsx';
import {cyan} from "@mui/material/colors";
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar/Navbar.tsx";
import Home from "./components/home/Home.tsx";
import Game from "./components/game/Game.tsx";
import GameList from "./components/game/GameList";
import CreateGame from "./components/game/CreateGame";
import SecurityContextProvider from "./context/SecurityContextProvider.tsx";
import {RouteGuard} from "./components/routeguard/RouteGuard.tsx";

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
                                <Route path="/hello" element={<HelloWorld/>}/>
                                <Route path="/home" element={<Home/>}/>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/game/:id" element={<RouteGuard><Game/></RouteGuard>}/>
                                <Route path="/games" element={<GameList/>}/>
                                <Route path="/create-game" element={<CreateGame/>}/>
                            </Routes>
                    </BrowserRouter>
                </SecurityContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App;
