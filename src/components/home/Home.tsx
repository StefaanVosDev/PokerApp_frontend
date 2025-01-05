import "./Home.scss";
import Features from "../features/Features.tsx";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import SecurityContext from "../../context/SecurityContext";


export default function Home() {

    const navigate = useNavigate();

    const {loggedInUser} = useContext(SecurityContext);

    const handleNavigate = () => {
        navigate("/games");
    };


    return (
        <>
            <div className="home">
                <div className="content">
                    <h2 className="subtitle">ONLINE POKER</h2>
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
                        <p className="description">
                            Experience the best online poker platform with features designed for both beginners and pros
                        </p>
                    </div>
                    {loggedInUser ? (
                    <button className="navigate-button" onClick={handleNavigate}>Play now!</button>
                    ) : null}
                    </div>
            </div>
            <Features/>
        </>
    );
}
