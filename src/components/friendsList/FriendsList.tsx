import {useContext, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import SecurityContext from "../../context/SecurityContext.ts";
import {useAddFriend} from "../../hooks/useAccount.ts";
import FriendRequestNotification from "../notification/FriendRequestNotification.tsx";
import FriendRequestDto from "../../model/dto/FriendRequestDto.ts";
import {AxiosError} from "axios";
import AddFriendDialog from "./AddFriendDialog.tsx";
import FriendListOverview from "./FriendListOverview.tsx";
import FriendRequestList from "./FriendRequestsList.tsx";

export default function FriendsList() {
    const { username } = useContext(SecurityContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0); // 0 for Overview, 1 for Requests
    const [newFriendRequest, setNewFriendRequest] = useState<FriendRequestDto | null>(null);

    const { triggerAddFriend, isPending } = useAddFriend();

    function toggleDrawer() {
        setIsOpen((prev) => !prev);
    }

    function handleOpenDialog() {
        setIsDialogOpen(true);
    }

    function handleCloseDialog() {
        setIsDialogOpen(false);
        setErrorMessage(null);
    }

    function handleCloseConfirmationDialog() {
        setIsConfirmationDialogOpen(false);
    }

    function handleAddFriend(friendUsername: string) {
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

    function handleCloseNotification() {
        setNewFriendRequest(null);
    }

    return (
        <>
            <IconButton onClick={toggleDrawer} color="inherit" sx={{ml: 2, color: "white"}}>
                <GroupIcon/>
                <Typography sx={{marginLeft: 1, fontFamily: "Kalam"}}>Friends</Typography>
            </IconButton>

            <Drawer
                anchor="right"
                open={isOpen}
                onClose={toggleDrawer}
                slotProps={{
                    backdrop: {invisible: true},
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
                    <IconButton onClick={toggleDrawer} sx={{color: "white"}}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{borderBottom: "1px solid rgba(255, 255, 255, 0.2)", color: "white"}}
                >
                    <Tab label="Overview" sx={{fontFamily: "Kalam, sans-serif", color: "white"}}/>
                    <Tab label="Requests" sx={{fontFamily: "Kalam, sans-serif", color: "white"}}/>
                </Tabs>

                {activeTab === 0 && (
                    <FriendListOverview username={username} setNewFriendRequest={setNewFriendRequest} />
                )}

                {activeTab === 1 && (
                    <FriendRequestList
                        username={username}
                    />
                )}

                <Box sx={{padding: "1rem", textAlign: "center"}}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            backgroundColor: "rgba(59, 130, 246, 0.8)",
                            "&:hover": {backgroundColor: "rgba(59, 130, 246, 1)"},
                        }}
                        onClick={handleOpenDialog}
                    >
                        Add Friend
                    </Button>
                </Box>
            </Drawer>

            <AddFriendDialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                errorMessage={errorMessage}
                onAddFriend={handleAddFriend}
                disabled={isPending}
            />

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
                            "&:hover": {textDecoration: "underline"},
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