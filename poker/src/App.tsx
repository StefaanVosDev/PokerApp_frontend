import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './App.css';
import HelloWorld from './components/helloworld/HelloWorld.tsx';
import {cyan} from "@mui/material/colors";
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PokerTable from "./components/pokertable/PokerTable.tsx";
import Navbar from "./components/navbar/Navbar.tsx";
import Home from "./components/home/Home.tsx";

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

const players = [
    {
        id: 'player1',
        name: 'John',
        money: 800,
        avatar: '/src/assets/player1.png',
        cards: ['/src/assets/card1.png', '/src/assets/card2.png'],
    },
    {
        id: 'player2',
        name: 'Jane',
        money: 800,
        avatar: '/src/assets/player2.png',
        cards: ['/src/assets/card3.png', '/src/assets/card4.png'],
    },
    {
        id: 'player3',
        name: 'Alice',
        money: 800,
        avatar: '/src/assets/player3.png',
        cards: ['/src/assets/card5.png', '/src/assets/card6.png'],
    },
    {
        id: 'player4',
        name: 'Bob',
        money: 800,
        avatar: '/src/assets/player4.png',
        cards: ['/src/assets/card7.png', '/src/assets/card8.png'],
    },
    {
        id: 'player5',
        name: 'Charlie',
        money: 800,
        avatar: '/src/assets/player5.png',
        cards: ['/src/assets/card9.png', '/src/assets/card10.png'],
    },
    {
        id: 'player6',
        name: 'Dave',
        money: 800,
        avatar: '/src/assets/player6.png',
        cards: ['/src/assets/card11.png', '/src/assets/card12.png'],
    },
];

const communityCards = [
    '/src/assets/card1.png',
    '/src/assets/card2.png',
    '/src/assets/card3.png',
    '/src/assets/card4.png',
    '/src/assets/card5.png',
];




function App() {
    const queryClient = new QueryClient()
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Navbar/>
                            <Routes>
                                <Route path="/" element={<Navigate to="/home"/>}/>
                                <Route path="/hello" element={<HelloWorld/>}/>
                                <Route path="/home" element={<Home/>}/>
                                <Route path="/game" element={<PokerTable players={players} communityCards={communityCards}/>}/>
                            </Routes>
                    </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App;
