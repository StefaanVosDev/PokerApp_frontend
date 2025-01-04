import Notification from './Notification.tsx';
import {useContext} from 'react';
import {useProcessFriendRequest} from '../../hooks/useNotification.ts';
import SecurityContext from "../../context/SecurityContext.ts";
import {Button} from '@mui/material';

interface NotificationProps {
    friendRequest: { id: string, requestingFriendUsername: string };
    onClose: () => void;
}

function FriendRequestNotification({friendRequest, onClose}: NotificationProps) {
    const {username} = useContext(SecurityContext);
    const {processRequest} = useProcessFriendRequest(username);

    const handleAcceptRequest = () => {
        processRequest({accept: true, id: friendRequest.id});
        onClose();
    };

    return (
        <Notification
            message={`${friendRequest.requestingFriendUsername} sent you a friend request.`}
            action={
                <Button
                    color="inherit"
                    size="small"
                    onClick={handleAcceptRequest}
                    sx={{
                        color: '#3b82f6',
                        fontFamily: 'Kalam, sans-serif',
                        '&:hover': {textDecoration: 'underline'},
                    }}
                >
                    Accept
                </Button>
            }
            onClose={onClose}
        />
    );
}

export default FriendRequestNotification;
