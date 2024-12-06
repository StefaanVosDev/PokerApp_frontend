import "./Home.scss";
import {Alert, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useCreateNewRound} from "../../hooks/useCreateNewRound.ts";
import Loader from "../loader/Loader.tsx";
import {useEffect} from "react";


export default function Home() {
    const navigate = useNavigate();
    const gameId = "7fabf988-a888-4dc6-8423-4cd9f620ff00";
    const {triggerNewRound, isPending: isLoading, isError, isSuccess} = useCreateNewRound(gameId);

    useEffect(() => {
        if (isSuccess) navigate(`/game/${gameId}`);
    }, [isSuccess]);

    if (isLoading) return <Loader>Initializing new round...</Loader>
    if (isError) return <Alert severity="error" variant="filled">Error initializing new round</Alert>
    

    function handlePlayNow() {
        triggerNewRound();
    }

    return (
        <div className="home">
            <div className="content">
                <h1 className="title">Stacks</h1>
                <div className="card-display">
                    <div className="background-blur"></div>
                    <div className="cards">
                        {[...Array(13)].map((_, i) => (
                            <div
                                key={i}
                                className="card"
                                style={{
                                    transform: `rotate(${i * 2 - 13}deg) translateX(${i * 10 - 65}px)`,
                                    zIndex: i,
                                }}
                            >
                                <div className="card-value top-left">
                                    {["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"][i]}
                                </div>
                                <div className="card-value bottom-right">♠</div>
                            </div>
                        ))}
                    </div>
                    <div className="poker-chips">
                        <div className="chip red">100</div>
                        <div className="chip green">25</div>
                        <div className="chip blue">10</div>
                        <div className="chip dark-gray">5</div>
                        <div className="chip light-gray">1</div>
                    </div>
                </div>
                <div className="text-content">
                    <h2 className="subtitle">ONLINE POKER</h2>
                    <p className="description">
                        Experience the thrill of professional poker from the comfort of your home. Join thousands of
                        players in
                        high-stakes tournaments and casual games.
                    </p>
                </div>
            </div>
            <div>
                <Button onClick={handlePlayNow} className="primary-button">PLAY NOW</Button>
            </div>
        </div>
    );
}
