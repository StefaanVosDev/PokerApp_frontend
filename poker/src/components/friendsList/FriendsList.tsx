import {useContext, useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    List,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import SecurityContext from "../../context/SecurityContext.ts";
import {useAddFriend, useFriends} from "../../hooks/useAccount.ts";
import FriendCard from "./FriendCard";
import {useFriendRequests, useProcessFriendRequest} from "../../hooks/useNotification.ts";
import Loader from "../loader/Loader.tsx";
import {PersonAdd, PersonRemove} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import FriendRequestNotification from "../navbar/FriendRequestNotification.tsx";
import FriendRequestDto from "../../model/dto/FriendRequestDto.ts";
import {AxiosError} from "axios";

export default function FriendsList() {
    const { username } = useContext(SecurityContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0); // 0 for Overview, 1 for Requests
    const [newFriendRequest, setNewFriendRequest] = useState<FriendRequestDto | null>(null);
    const navigate = useNavigate();

    const { isLoading, isError, friends } = useFriends(username);
    const { triggerAddFriend, isPending } = useAddFriend();
    const { friendRequests, isLoadingFriendRequests, isErrorLoadingFriendRequests } = useFriendRequests(username);
    const { isProcessingRequest, isErrorProcessingRequest, processRequest} = useProcessFriendRequest(username);

    useEffect(() => {
        if (friendRequests && friendRequests.length > 0) {
            const tenSecondsAgo = new Date();
            tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);

            const lastRequest = friendRequests.filter((request) => new Date(request.timestamp) > tenSecondsAgo);
            if (lastRequest && lastRequest.length > 0)
                setNewFriendRequest(friendRequests[0]);
        }
    }, [friendRequests]);

    if (isLoadingFriendRequests) return <Loader>loading friend requests...</Loader>
    if (isErrorLoadingFriendRequests) return <Alert severity="error" variant="filled">Error loading friend requests!</Alert>
    if (isProcessingRequest) return <Loader>processing friend request...</Loader>
    if (isErrorProcessingRequest) return <Alert severity="error" variant="filled">Error processing friend request!</Alert>

    function toggleDrawer() {
        setIsOpen((prev) => !prev);
    }

    function handleOpenDialog() {
        setIsDialogOpen(true);
    }

    function handleCloseDialog() {
        setIsDialogOpen(false);
        setFriendUsername("");
        setErrorMessage(null);
    }

    function handleCloseConfirmationDialog() {
        setIsConfirmationDialogOpen(false);
    }

    function handleAddFriend() {
        if (username && friendUsername) {
            triggerAddFriend(
                { username, friendUsername },
                {
                    onError: (error: unknown) => {
                        if (error as AxiosError !== undefined) {
                            let errorMessage: string
                            switch ((error as AxiosError).status) {
                                case 404: errorMessage = "Could not find requested user!"; break;
                                case 400: errorMessage = "You are already friends!"; break;
                                case 500: errorMessage = "Oops something went wrong! No worries it's nothing you did"; break;
                                case 409: errorMessage = "You have already sent a friend request to this person!"; break;
                                case 429: errorMessage = "This person has already sent you a friend request!"; break;
                                case 451: errorMessage = "Cannot add yourself as friend!"; break;
                                default: errorMessage = "An unknown error has been detected!"; break;
                            }
                            setErrorMessage(errorMessage)
                        }
                    },
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setFriendUsername("");
                        setErrorMessage(null);
                        setIsConfirmationDialogOpen(true);
                    },
                }
            );
        }
    }

    function handleTabChange() {
        if (activeTab === 0) setActiveTab(1);
        else if (activeTab === 1) setActiveTab(0);
    }

    function handleAcceptRequest(requestId: string) {
        processRequest({accept: true, id: requestId})
    }

    function handleDeclineRequest(requestId: string) {
        processRequest({accept: false, id: requestId})
    }

    function handleCloseNotification() {
        setNewFriendRequest(null);
    }

    return (
        <>
            <IconButton onClick={toggleDrawer} color="inherit" sx={{ ml: 2, color: "white" }}>
                <GroupIcon />
                <Typography sx={{ marginLeft: 1, fontFamily: "Kalam" }}>Friends</Typography>
            </IconButton>

            <Drawer
                anchor="right"
                open={isOpen}
                onClose={toggleDrawer}
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.6)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        color: "white",
                        width: 330,
                        fontFamily: "Kalam, sans-serif",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Kalam, sans-serif",
                        }}
                    >
                        Your Friends
                    </Typography>
                    <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)", color: "white" }}
                >
                    <Tab label="Overview" sx={{ fontFamily: "Kalam, sans-serif", color: "white" }} />
                    <Tab label="Requests" sx={{ fontFamily: "Kalam, sans-serif", color: "white" }} />
                </Tabs>

                {activeTab === 0 && (
                    <Box sx={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
                        {isLoading ? (
                            <Typography>Loading...</Typography>
                        ) : isError ? (
                            <Typography color="error">Failed to fetch friends.</Typography>
                        ) : !friends || friends.length === 0 ? (
                            <Typography sx={{ textAlign: "center", opacity: 0.7 }}>
                                You have no friends, maybe you should find some :)
                            </Typography>
                        ) : (
                            <List>
                                {friends.map((friend, index) => (
                                    <FriendCard key={index} friend={friend} />
                                ))}
                            </List>
                        )}
                    </Box>
                )}

                {activeTab === 1 && (
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
                )}

                <Box sx={{ padding: "1rem", textAlign: "center" }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            backgroundColor: "rgba(59, 130, 246, 0.8)",
                            "&:hover": { backgroundColor: "rgba(59, 130, 246, 1)" },
                        }}
                        onClick={handleOpenDialog}
                    >
                        Add Friend
                    </Button>
                </Box>
            </Drawer>

            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        color: "white",
                        fontFamily: "Kalam, sans-serif",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "Kalam, sans-serif",
                        color: "white",
                    }}
                >
                    Add a New Friend
                </DialogTitle>
                <DialogContent>
                    {errorMessage && (
                        <Alert
                            severity="error"
                            sx={{
                                marginBottom: "1rem",
                                fontFamily: "Kalam, sans-serif",
                                color: "white",
                                backgroundColor: "rgba(255, 0, 0, 0.2)",
                            }}
                        >
                            {errorMessage}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Friend's Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={friendUsername}
                        onChange={(e) => setFriendUsername(e.target.value)}
                        sx={{
                            input: { color: "white" },
                            label: { color: "rgba(255, 255, 255, 0.7)" },
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "10px",
                                "& fieldset": {
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "white",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddFriend}
                        disabled={isPending}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            backgroundColor: "rgba(34, 197, 94, 0.8)",
                            color: "white",
                            "&:hover": { backgroundColor: "rgba(34, 197, 94, 1)" },
                        }}
                    >
                        Add Friend
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isConfirmationDialogOpen}
                onClose={handleCloseConfirmationDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        color: "white",
                        fontFamily: "Kalam, sans-serif",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "Kalam, sans-serif",
                        color: "white",
                    }}
                >
                    Friend Request Sent
                </DialogTitle>
                <DialogContent>
                    <Typography
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        Your friend request has been sent and is waiting for the other player to accept it.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseConfirmationDialog}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            {newFriendRequest && (
                <FriendRequestNotification
                    friendRequest={newFriendRequest}
                    onClose={handleCloseNotification}
                />
            )}
        </>
    );
}