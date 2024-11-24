import "./Home.scss";
//import {Button} from "@mui/material";



export default function Home() {
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
                        Experience the thrill of professional poker from the comfort of your home. Join thousands of players in
                        high-stakes tournaments and casual games.
                    </p>
                    {//<Button href="/game" className="primary-button">PLAY NOW</Button>
                    }
                </div>
            </div>
        </div>
    );
}
