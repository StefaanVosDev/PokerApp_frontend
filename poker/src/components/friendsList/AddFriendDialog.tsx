import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {ChangeEvent, useState} from "react";

interface AddFriendDialogProps {
    open: boolean;
    onClose: () => void;
    errorMessage: string | null;
    onAddFriend: (friendUsername: string) => void;
    disabled: boolean;
}

function AddFriendDialog({
                             open,
                             onClose,
                             errorMessage,
                             onAddFriend,
                             disabled
                         }: AddFriendDialogProps) {
    const [friendUsername, setFriendUsername] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFriendUsername(e.target.value);
    };

    const handleClick = () => {
        onAddFriend(friendUsername);
        setFriendUsername("");
    };

    return <Dialog
        open={open}
        onClose={onClose}
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
                onChange={handleChange}
                sx={{
                    input: {color: "white"},
                    label: {color: "rgba(255, 255, 255, 0.7)"},
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
                onClick={onClose}
                sx={{
                    fontFamily: "Kalam, sans-serif",
                    color: "#3b82f6",
                    "&:hover": {textDecoration: "underline"},
                }}
            >
                Cancel
            </Button>
            <Button
                onClick={handleClick}
                disabled={disabled}
                sx={{
                    fontFamily: "Kalam, sans-serif",
                    backgroundColor: "rgba(34, 197, 94, 0.8)",
                    color: "white",
                    "&:hover": {backgroundColor: "rgba(34, 197, 94, 1)"},
                }}
            >
                Add Friend
            </Button>
        </DialogActions>
    </Dialog>;
}

export default AddFriendDialog;