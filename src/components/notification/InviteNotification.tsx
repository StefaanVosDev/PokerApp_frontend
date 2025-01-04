import {Game} from "../../model/Game.ts";
import {useNavigate} from "react-router-dom";
import {IconButton} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import Notification from "./Notification.tsx";

interface InviteNotificationProps {
    game: Game
    onClose: () => void;
    sender: string
}

function InviteNotification({game, onClose, sender}: InviteNotificationProps) {
    const navigate = useNavigate();

    const goToGame = () => {
        navigate(`/game/${game.id}`);
        onClose();
    };

    return (
        <Notification
            message={`${sender} invited you to play in game ${game.name}`}
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

export default InviteNotification;