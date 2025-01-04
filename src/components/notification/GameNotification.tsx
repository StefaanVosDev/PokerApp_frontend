import {IconButton} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import {useNavigate} from 'react-router-dom';
import {Game} from "../../model/Game.ts";
import Notification from "./Notification.tsx";

interface NotificationProps {
    game: Game
    onClose: () => void;
}

function GameNotification({game, onClose}: NotificationProps) {
    const navigate = useNavigate();

    const goToGame = () => {
        navigate(`/game/${game.id}`);
        onClose();
    };

    return (
        <Notification
            message={`It's your turn in game ${game.name}`}
            action={
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={goToGame}
                    sx={{
                        color: '#3b82f6',
                        fontFamily: 'Kalam, sans-serif',
                        '&:hover': {textDecoration: 'underline'},
                    }}
                >
                    <LaunchIcon/>
                </IconButton>
            }
            onClose={onClose}
        />
    );
}

export default GameNotification;
