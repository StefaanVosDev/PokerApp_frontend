import axios from "axios";
import DirectMessageDto from "../model/DirectMessageDto.ts";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export async function markAsRead(receiver: string, sender: string) {
    await axios.put(`/api/directMessages/${receiver}/${sender}`);
}

export async function getMessages(sender: string, receiver: string) {
    const {data} = await axios.get<DirectMessageDto[]>(`/api/directMessages/${sender}/${receiver}`);
    return data;
}


export async function sendMessage(directMessage: DirectMessageDto) {
    await axios.post('/api/directMessages', {
        sender: directMessage.sender,
        receiver: directMessage.receiver,
        message: directMessage.message
    });
}
