import {useContext, useState} from "react";
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
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import SecurityContext from "../../context/SecurityContext.ts";
import {useAddFriend, useFriends} from "../../hooks/useAccount.ts";
import FriendCard from "./FriendCard";

export default function FriendsList() {
    const { username } = useContext(SecurityContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
    const { isLoading, isError, friends } = useFriends(username);
    const { triggerAddFriend, isPending } = useAddFriend();

    const toggleDrawer = () => {
        setIsOpen((prev) => !prev);
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setFriendUsername("");
        setErrorMessage(null);
    };

    const handleAddFriend = () => {
        if (username && friendUsername) {
            triggerAddFriend(
                { username, friendUsername },
                {
                    onError: (error: unknown) => {
                        if (error instanceof Error) {
                            setErrorMessage(error.message);
                        } else {
                            setErrorMessage("An unexpected error occurred. Please try again.");
                        }
                    },
                    onSuccess: () => {
                        setIsDialogOpen(false);
                        setFriendUsername("");
                        setErrorMessage(null);
                    },
                }
            );
        }
    };


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
        </>
    );
}
