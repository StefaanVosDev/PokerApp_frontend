import {useContext} from "react";
import ChatBotContext from "../context/ChatBotContext.tsx";


export const useChatBotContext = () => {
    const context = useContext(ChatBotContext);
    if (!context) {
        throw new Error("useChatBotContext must be used within a ChatBotProvider");
    }
    return context;
};
