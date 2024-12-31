import {KeyboardEvent, useEffect, useRef, useState} from "react";
import {useMessages, useSendMessage} from "../../hooks/useGame.ts";
import {Alert, Box, Button, IconButton, InputBase, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import MoodIcon from '@mui/icons-material/Mood';
import Loader from "../loader/Loader.tsx";

interface ChatLogProps {
    gameId: string;
    loggedInUserPosition: number;
}

function ChatLog({gameId, loggedInUserPosition}: ChatLogProps) {
    const [newMessage, setNewMessage] = useState("");
    const [activeScreen, setActiveScreen] = useState("chat");
    const [balloonText, setBalloonText] = useState("");
    const [balloonPosition, setBalloonPosition] = useState(0);
    const {sendMessage, isPending, isError} = useSendMessage(gameId);
    const {isLoading: isLoadingMessages, isError: isErrorMessages, messages} = useMessages(String(gameId));
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages, activeScreen]);

    useEffect(() => {
        if (messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (!predefinedEmojis.includes(lastMessage.content) || loggedInUserPosition === lastMessage.player.position) return;
            setBalloonText(lastMessage.content);
            setBalloonPosition(lastMessage.player.position);
            setTimeout(() => {
                setBalloonText("");
            }, 3000);
        }
    }, [messages]);

    if (isLoadingMessages) return <Loader>Loading messages...</Loader>;
    if (isErrorMessages) return <Alert severity="error">Error loading messages</Alert>;

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage("");
        }
    };

    const handleKeyPress = (e : KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleEmojiClick = (emoji: string) => {
        sendMessage(emoji);
        handleSendMessage();
        setBalloonText(emoji);
        setBalloonPosition(loggedInUserPosition)
        setTimeout(() => {
            setBalloonText("");
        }, 3000);
    };

    const predefinedEmojis = ["👍", "👎", "😂", "😢", "😡", "😲", "😍", "😎", "🤔", "🤣", "🤮", "🤯", "🤬", "🤭", "🤑", "🤡", "🤧", "🤩", "🤪", "🤫", "🤭"];

    return (
        <Box sx={{
            position: 'fixed',
            left: 0,
            top: 65,
            width: 250,
            height: 'calc(100% - 195px)',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(26, 32, 44, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            color: 'white',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: 1,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(34, 40, 49, 0.8)',
            }}>
                <IconButton onClick={() => setActiveScreen("chat")}><SendIcon sx={{color: '#fff'}}/></IconButton>
                <IconButton onClick={() => setActiveScreen("emoji")}><MoodIcon sx={{color: '#fff'}}/></IconButton>
            </Box>
            {activeScreen === "chat" && (
                <Box className="messages" sx={{flex: 1, maxHeight: '100%', overflowY: 'auto', marginTop: 1}}>
                    {messages && messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message, index) => (
                        <Typography key={index} sx={{marginBottom: 1, color: '#fff'}}>
                            [{new Date(message.timestamp).toLocaleString()}]-{message?.player?.username}: {message.content}
                        </Typography>
                    ))}
                    <div ref={messageEndRef}/>
                </Box>
            )}
            {activeScreen === "emoji" && (
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {predefinedEmojis.map((emoji, index) => (
                        <Button key={index} onClick={() => handleEmojiClick(emoji)} sx={{
                            color: '#fff',
                            fontSize: "2rem",
                            borderRadius: 1,
                            margin: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.2)'}
                        }}>
                            {emoji}
                        </Button>
                    ))}
                </Box>
            )}
            {activeScreen === "chat" && (
                <Box sx={{display: 'flex', marginTop: 1}}>
                    <InputBase
                        sx={{
                            flex: 1,
                            paddingLeft: 1,
                            borderRadius: 1,
                            backgroundColor: 'rgba(34, 40, 49, 0.8)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&::placeholder': {color: '#aaa'}
                        }}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <Button onClick={handleSendMessage} disabled={isPending} sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderRadius: 1,
                        marginLeft: 1,
                        color: '#fff',
                        '&:hover': {backgroundColor: 'rgba(59, 130, 246, 1)'}
                    }}>
                        Send
                    </Button>
                    {isError && <Alert severity="error">Error sending message</Alert>}
                </Box>
            )}
            {balloonText && <Box className={`balloon-text-${balloonPosition} fade-out`} sx={{
                fontSize: "3rem",
                color: 'white',
                zIndex: 10,
            }}>{balloonText}</Box>}
        </Box>
    );
}

export default ChatLog;
