import {useEffect, useState} from "react";
import "./Timer.scss"
import {FaRegClock} from 'react-icons/fa';
import {useTimeRemaining} from '../../hooks/useTurn.ts'
import Loader from "../loader/Loader.tsx";
import {Alert, Box} from "@mui/material";

interface TimerProps {
    duration: number;
    onExpire: () => void;
    turnId: string;
}

function Timer({duration, onExpire, turnId}: TimerProps) {
    const {isLoadingTimer, isErrorLoadingTimer, timeRemaining} = useTimeRemaining(turnId)

    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const isUrgent = timeLeft && timeLeft <= 5;

    useEffect(() => {
        if (isLoadingTimer || isErrorLoadingTimer || !timeRemaining) return;

        setTimeLeft(timeRemaining)

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev! <= 1) {
                    clearInterval(interval)
                    if (onExpire) onExpire()
                    return 0
                }
                return prev! - 1
            });
        }, 1000)

        return () => clearInterval(interval)
    }, [duration, isLoadingTimer, isErrorLoadingTimer, onExpire, timeLeft, timeRemaining])

    if (isLoadingTimer) return <Loader>Loading timer...</Loader>
    if (isErrorLoadingTimer || !timeRemaining) return <Alert severity="error" variant="filled">Error loading timer!</Alert>

    return (
        <Box sx={{
            position: "absolute",
            top: "675px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            textAlign: "center",
            fontFamily: "Kalam, sans-serif",
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "white",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                boxShadow: "0 4px 6px aliceblue",
                color: isUrgent ? "red" : "black",
            }}>
                <FaRegClock className={`clock-icon ${isUrgent ? 'clock-pulse-urgent' : 'clock-pulse'}`}/>
                <span className="time-text">Time left: {timeLeft}s</span>
            </Box>
        </Box>
    );
}

export default Timer;