import {ReactNode, useEffect, useState} from 'react';
import {Alert, Box} from '@mui/material';

interface NotificationProps {
    message: string;
    action: ReactNode;
    onClose: () => void;
}

function Notification({message, action, onClose}: NotificationProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isHovered) {
                setIsVisible(false);
                setTimeout(onClose, 500); // Wait for the slide-out animation to complete
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isHovered, onClose]);

    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 1000,
                backgroundColor: 'rgba(26, 32, 44, 0.9)',
                padding: '1rem',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                color: 'white',
                fontFamily: 'Kalam, sans-serif',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: `${isVisible ? 'slideIn' : 'slideOut'} 0.5s forwards`,
                '@keyframes slideIn': {
                    from: {transform: 'translateX(100%)'},
                    to: {transform: 'translateX(0)'},
                },
                '@keyframes slideOut': {
                    from: {transform: 'translateX(0)'},
                    to: {transform: 'translateX(100%)'},
                },
            }}
        >
            <Alert
                severity="info"
                action={
                    action
                }
                sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: 'white',
                    fontFamily: 'Kalam, sans-serif',
                }}
            >
                {message}
            </Alert>
        </Box>
    );
}

export default Notification;