import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Alert, Box, CircularProgress, Drawer, IconButton, ListItem, TextField, Typography,} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import {useGetMessages, useSendMessage} from "../../hooks/useDirectMessages.ts";

interface ChatComponentProps {
    open: boolean;
    onClose: () => void;
    sender: string;
    receiver: string;
}

export default function DirectMessage({open, onClose, sender, receiver,}: ChatComponentProps) {
    const {messages, isLoading, isError, error} = useGetMessages(sender, receiver);
    const {triggerSendMessage, isPending} = useSendMessage();

    const [newMessage, setNewMessage] = useState<string>("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    const handleSendMessage = () => {
        if (newMessage.trim()) {
            triggerSendMessage({
                sender,
                receiver,
                message: newMessage.trim(),
            });
            setNewMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !isPending) {
            handleSendMessage();
        }
    };


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);


    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
    );

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop: {invisible: true},
            }}
            PaperProps={{
                sx: {
                    position: "absolute",
                    top: "59%",
                    left: "-365px",
                    zIndex: 10,
                    height: "40vh",
                    maxHeight: "400px",
                    width: "100%",
                    maxWidth: "400px",
                    margin: "0 1170px",
                    borderRadius: "10px 10px 0 0",
                    backgroundColor: "#1a202c",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                }}
            >
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography variant="h6" sx={{fontWeight: "bold"}}>
                        {receiver}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{color: "white"}}>
                    <CloseIcon/>
                </IconButton>
            </Box>


            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {isLoading && <CircularProgress sx={{color: "white", margin: "auto"}}/>}
                {isError && (
                    <Alert
                        severity="error"
                        sx={{backgroundColor: "rgba(255, 0, 0, 0.1)", color: "white"}}
                    >
                        {error?.message ?? "Failed to load messages."}
                    </Alert>
                )}
                {sortedMessages.map((message, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            justifyContent: message.sender === sender ? "flex-end" : "flex-start",
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: message.sender === sender ? "#3b82f6" : "rgba(255, 255, 255, 0.1)",
                                color: message.sender === sender ? "white" : "rgba(255, 255, 255, 0.8)",
                                borderRadius: "10px",
                                padding: "0.5rem 1rem",
                                maxWidth: "70%",
                            }}
                        >
                            <Typography variant="body2">
                                {
                                    message.gameId ? (
                                        <>
                                            {message.sender} invited you to join a game. Click <a href={`/game/${message.gameId}`} style={{ color: message.sender === sender ? "#292f3a" : "#3f5d93"}}>here</a> to join
                                        </>
                                        ) : (
                                            message.message
                                    )}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    textAlign: message.sender === sender ? "right" : "left",
                                    color: "rgba(255, 255, 255, 0.6)",
                                }}
                            >
                                {new Date(message.timestamp || "").toLocaleTimeString()}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}

                <div ref={messagesEndRef}></div>
            </Box>


            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: "0.5rem 1rem",
                }}
            >
                <TextField
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    fullWidth
                    disabled={isPending}
                    sx={{
                        input: {color: "white"},
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {border: "none"},
                        },
                    }}
                />
                <IconButton
                    onClick={handleSendMessage}
                    disabled={isPending}
                    sx={{color: "white", marginLeft: "0.5rem"}}
                >
                    <SendIcon/>
                </IconButton>
            </Box>
        </Drawer>
    );
}
