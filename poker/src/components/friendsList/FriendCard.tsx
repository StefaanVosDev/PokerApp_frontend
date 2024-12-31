import {Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItem, ListItemAvatar, ListItemText, Badge,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteFriend } from "../../hooks/useAccount.ts";
import SecurityContext from "../../context/SecurityContext.ts";
import DirectMessage from "./DirectMessage"; // Import the updated DM component
import { useGetMessages } from "../../hooks/useDirectMessages.ts";

interface FriendCardProps {
    friend: {
        username: string;
        image?: string;
    };
}

function FriendCard({ friend }: FriendCardProps) {
    const { username } = useContext(SecurityContext);
    const { triggerDeleteFriend, isPending } = useDeleteFriend();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isDMOpen, setDMOpen] = useState(false);
    const [lastOpened, setLastOpened] = useState<Date | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const { messages } = useGetMessages(friend.username, username || "");

    useEffect(() => {
        if (!isDMOpen && messages && messages.length > 0) {
            let unreadMessages = messages.filter((msg) => {
                const messageTimestamp = new Date(msg.timestamp || 0).getTime();
                const lastOpenedTimestamp = lastOpened ? lastOpened.getTime() : 0;
                return messageTimestamp > lastOpenedTimestamp;
            });
            unreadMessages = unreadMessages.filter((msg) => {
                return msg.sender === friend.username;
            })
            setUnreadCount(unreadMessages.length);
        } else {
            setUnreadCount(0);
        }
    }, [messages, isDMOpen, lastOpened]);

    useEffect(() => {
        const savedLastOpened = localStorage.getItem(`lastOpened_${friend.username}`);
        if (savedLastOpened) {
            setLastOpened(new Date(savedLastOpened));
        }
    }, [friend.username]);


    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirmDelete = () => {
        if (!isPending && username) {
            triggerDeleteFriend({ username, friendUsername: friend.username });
        }
        setDialogOpen(false);
    };

    const toggleDM = () => {
        setDMOpen((prev) => !prev);
        if (!isDMOpen) {
            const now = new Date();
            setLastOpened(now);
            localStorage.setItem(`lastOpened_${friend.username}`, now.toISOString()); // Save to local storage
        }
    };

    const navigateToProfile = () => {
        navigate(`/account/${friend.username}`);
    };

    return (
        <>
            <ListItem
                sx={{
                    padding: "0.75rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        cursor: "pointer",
                    },
                }}
            >
                <ListItemAvatar>
                    <Avatar
                        src={friend.image || undefined}
                        sx={{
                            backgroundColor: !friend.image ? "#3b82f6" : undefined,
                            color: !friend.image ? "white" : undefined,
                            fontFamily: "Kalam, sans-serif",
                        }}
                    >
                        {!friend.image && friend.username.charAt(0).toUpperCase()}
                    </Avatar>
                </ListItemAvatar>

                <ListItemText
                    primary={friend.username}
                    primaryTypographyProps={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "white",
                        fontFamily: "Kalam, sans-serif",
                    }}
                />

                <IconButton
                    onClick={navigateToProfile}
                    aria-label="view profile"
                    sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        marginRight: "8px",
                        "&:hover": {
                            color: "#3b82f6",
                        },
                    }}
                >
                    <AccountCircleIcon />
                </IconButton>

                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{
                        "& .MuiBadge-badge": {
                            right: 8,
                            top: 13,
                            border: `2px solid white`,
                            padding: "0 4px",
                        },
                    }}
                >
                    <IconButton
                        onClick={toggleDM}
                        aria-label="direct message"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            marginRight: "8px",
                            "&:hover": {
                                color: "#3b82f6",
                            },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Badge>

                <IconButton
                    onClick={handleOpenDialog}
                    aria-label="delete friend"
                    sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                            color: "red",
                        },
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </ListItem>

            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="confirm-delete-dialog-title"
                aria-describedby="confirm-delete-dialog-description"
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        color: "white",
                        fontFamily: "Kalam, sans-serif",
                    },
                }}
            >
                <DialogTitle
                    id="confirm-delete-dialog-title"
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "Kalam, sans-serif",
                        color: "white",
                    }}
                >
                    Remove Friend
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="confirm-delete-dialog-description"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "Kalam, sans-serif",
                        }}
                    >
                        Are you sure you want to remove <strong>{friend.username}</strong> from your friends list? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        disabled={isPending || !username}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "red",
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <DirectMessage
                open={isDMOpen}
                onClose={toggleDM}
                sender={username || ""}
                receiver={friend.username}
            />
        </>
    );
}

export default FriendCard;
