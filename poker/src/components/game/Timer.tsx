import {useEffect, useState} from "react";
import "./Timer.scss"
import {FaRegClock} from 'react-icons/fa';
import {useTurn} from '../../hooks/useTurn.ts'
import Loader from "../loader/Loader.tsx";
import {Alert} from "@mui/material";

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
        
        if (!isLoadingTurn && turn) {
            const startTime = new Date(turn.startTime).getTime();
            const elapsedTime = (Date.now() - startTime) / 1000

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
        }
        
    }, [duration, isLoadingTurn, onExpire, timeLeft, turn])

    if (isLoadingTurn) return <Loader>Loading current turn...</Loader>
    if (isErrorLoadingTurn || !turn) return <Alert severity="error" variant="filled">Error loading turn!</Alert>

    return (
        <div className="timer">
            <div className={`timer-content ${isUrgent ? 'timer-text-urgent' : 'timer-text'}`}>
                <FaRegClock className={`clock-icon ${isUrgent ? 'clock-pulse-urgent' : 'clock-pulse'}`} />
                <span className="time-text">Time left: {timeLeft}s</span>
            </div>
        </div>
    );
}

export default Timer;