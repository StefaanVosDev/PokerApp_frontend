import {useEffect, useState} from "react";
import "./Timer.scss"
import {FaRegClock} from 'react-icons/fa';
import {useTurn} from '../../hooks/useTurn.ts'
import Loader from "../loader/Loader.tsx";
import {Alert, Box} from "@mui/material";
import { toZonedTime } from 'date-fns-tz';

interface TimerProps {
    duration: number;
    onExpire: () => void;
    turnId: string;
}

function Timer({duration, onExpire, turnId}: TimerProps) {
    const {isLoadingTurn, isErrorLoadingTurn, turn} = useTurn(turnId);

    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const isUrgent = timeLeft && timeLeft <= 5;

    useEffect(() => {
        if (isLoadingTurn || !turn) return;

        const now = Date.now();
        console.log(now);
        const timeZone = "Europe/Brussels";

        const zonedDate = toZonedTime(now, timeZone);

        const startTime = new Date(turn.startTime).getTime();
        const elapsedTime = (zonedDate.getTime() - startTime) / 1000

        setTimeLeft((Math.floor(Math.max(duration - elapsedTime, 0))))

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
    }, [duration, isLoadingTurn, onExpire, timeLeft, turn])

    if (isLoadingTurn) return <Loader>Loading current turn...</Loader>
    if (isErrorLoadingTurn || !turn) return <Alert severity="error" variant="filled">Error loading turn!</Alert>

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