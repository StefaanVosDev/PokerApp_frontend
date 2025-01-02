import {Alert, Box, Button, IconButton, List, Typography} from "@mui/material";
import {PersonAdd, PersonRemove} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useFriendRequests, useProcessFriendRequest} from "../../hooks/useNotification.ts";
import Loader from "../loader/Loader.tsx";

interface FriendRequestListProps {
    username: string | undefined
}

function FriendRequestList({ username }: FriendRequestListProps) {
    const navigate = useNavigate();

    const { isProcessingRequest, isErrorProcessingRequest, processRequest} = useProcessFriendRequest(username);
    const { isLoadingFriendRequests, isErrorLoadingFriendRequests, friendRequests } = useFriendRequests(username);

    if (isProcessingRequest) return <Loader>processing friend request...</Loader>
    if (isErrorProcessingRequest) return <Alert severity="error" variant="filled">Error processing friend request!</Alert>
    if (isLoadingFriendRequests) return <Loader>loading friend requests...</Loader>
    if (isErrorLoadingFriendRequests) return <Alert severity="error" variant="filled">Error loading friend requests!</Alert>

    function handleAcceptRequest(requestId: string) {
        processRequest({accept: true, id: requestId})
    }

    function handleDeclineRequest(requestId: string) {
        processRequest({accept: false, id: requestId})
    }

    return (
        <Box sx={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
            {!friendRequests || friendRequests.length === 0 ? (
                <Typography sx={{ textAlign: "center", opacity: 0.7 }}>
                    No friend requests at the moment.
                </Typography>
            ) : (
                <List>
                    {friendRequests.map((request) => (
                        <Box
                            key={request.id}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "10px",
                                padding: "0.5rem 1rem",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <Button
                                onClick={() => navigate('/account/' + request.requestingFriendUsername)}
                                sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
                            >
                                <Typography sx={{ fontFamily: "Kalam, sans-serif" }}>
                                    {request.requestingFriendUsername}
                                </Typography>
                            </Button>
                            <Box>
                                <IconButton
                                    onClick={() => handleAcceptRequest(request.id)}
                                    sx={{ color: "#22c55e" }}
                                >
                                    <PersonAdd />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleDeclineRequest(request.id)}
                                    sx={{ color: "#ef4444" }}
                                >
                                    <PersonRemove />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default FriendRequestList;