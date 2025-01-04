import {IconButton} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import {useNavigate} from 'react-router-dom';
import Notification from "./Notification.tsx";
import {useContext} from "react";
import SecurityContext from "../../context/SecurityContext";

interface NotificationProps {
    achievementName: string
    onClose: () => void;
}

function AchievementNotification({achievementName, onClose}: NotificationProps) {
    const navigate = useNavigate();
    const {username} = useContext(SecurityContext);
    const goToAchievement = () => {
        navigate(`/account/${username}`);
        onClose();
    };

    return (
        <Notification
            message={`You unlocked achievement: ${achievementName}, good job!`}
            action={
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={goToAchievement}
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

export default AchievementNotification;
