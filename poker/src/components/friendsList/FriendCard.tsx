import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useContext, useState} from "react";
import {useDeleteFriend} from "../../hooks/useAccount.ts";
import SecurityContext from "../../context/SecurityContext.ts";

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

            {/* Confirmation Dialog */}
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
                        Are you sure you want to remove <strong>{friend.username}</strong> from your friends list? This action cannot be undone.
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
        </>
    );
}

export default FriendCard;
