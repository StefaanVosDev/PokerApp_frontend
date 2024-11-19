import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './App.css';
import HelloWorld from './components/HelloWorld.tsx';
import {cyan} from "@mui/material/colors";
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

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
                    <BrowserRouter>
                        <div className="pt-5">
                            <Routes>
                                <Route path="/" element={<Navigate to="/home"/>}/>
                                <Route path="/home" element={<HelloWorld/>}/>
                            </Routes>
                        </div>
                    </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App;
