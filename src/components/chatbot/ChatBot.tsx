import {useState} from "react";
import {Box, CircularProgress, IconButton, TextField, Typography} from "@mui/material";
import AssistantIcon from '@mui/icons-material/Assistant';
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import {useChatBotContext} from "../../hooks/useChatBotContext.ts";
import {fetchChatBotResponse} from "../../services/ChatBotService.ts";

function ChatBot() {
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const { chatHistory, addMessage } = useChatBotContext();

    const handleSendMessage = async (): Promise<void> => {
        if (!message.trim()) return;

        addMessage({ sender: "user", text: message });

        setIsLoading(true);

        try {
            const botResponse = await fetchChatBotResponse(message);
            addMessage({ sender: "bot", text: botResponse });
            setMessage("");
        } catch (error) {
            console.error("Unexpected error:", error);
            addMessage({ sender: "bot", text: "I'm sorry, I couldn't process your request." });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = (): void => {
        setIsChatOpen((prev) => !prev);
    };

    return (
        <>
            <AssistantIcon
                aria-label="chat"
                onClick={toggleChat}
                sx={{
                    height: "70px",
                    width: "70px",
                    position: "fixed",
                    bottom: "16px",
                    left: "16px",
                    "&:hover": { transform: "scale(1.2)" },
                }}
            >
                <ChatIcon />
            </AssistantIcon>

            {isChatOpen && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: "80px",
                        left: "16px",
                        width: "400px",
                        maxHeight: "600px",
                        backgroundColor: "rgba(26, 32, 44, 0.6)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        fontFamily: "Kalam, sans-serif",
                        color: "white",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontFamily: "Kalam, sans-serif",
                            padding: "0.5rem",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                    >
                        Poker ChatBot
                    </Typography>
                    <Box
                        sx={{
                            flex: 1,
                            padding: "1rem",
                            overflowY: "auto",
                        }}
                    >
                        {chatHistory.map((chat, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        chat.sender === "user" ? "flex-end" : "flex-start",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <Box
                                    sx={{
                                        padding: "0.5rem 1rem",
                                        borderRadius: "8px",
                                        maxWidth: "70%",
                                        fontSize: "1.2rem",
                                        backgroundColor:
                                            chat.sender === "user"
                                                ? "rgb(49, 55, 66)"
                                                : "rgb(16, 185, 129)",
                                        color: "white",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    {chat.text}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            padding: "0.5rem",
                            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask me anything about poker..."
                            fullWidth
                            variant="outlined"
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            sx={{
                                marginRight: "0.5rem",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                input: {
                                    color: "white",
                                    fontFamily: "Kalam, sans-serif",
                                },
                            }}
                            slotProps={{
                                input: { sx: { color: "white" } },
                            }}
                        />
                        <IconButton
                            onClick={handleSendMessage}
                            disabled={isLoading}
                            sx={{
                                backgroundColor: "rgba(59, 130, 246, 0.8)",
                                color: "white",
                                "&:hover": { backgroundColor: "rgba(59, 130, 246, 1)" },
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <SendIcon />
                            )}
                        </IconButton>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default ChatBot;
