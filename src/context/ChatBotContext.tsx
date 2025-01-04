import React, {createContext, useEffect, useState} from "react";

interface ChatMessage {
    sender: "user" | "bot";
    text: string;
}

interface ChatBotContextType {
    chatHistory: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    clearChatHistory: () => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const ChatBotProvider = ({ children }: { children: React.ReactNode }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
        const savedHistory = localStorage.getItem("chatHistory");
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    useEffect(() => {
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }, [chatHistory]);

    const addMessage = (message: ChatMessage) => {
        setChatHistory((prev) => [...prev, message]);
    };

    const clearChatHistory = () => {
        setChatHistory([]);
        localStorage.removeItem("chatHistory");
    };

    return (
        <ChatBotContext.Provider value={{ chatHistory, addMessage, clearChatHistory }}>
            {children}
        </ChatBotContext.Provider>
    );
};

export default ChatBotContext;

