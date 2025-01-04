import axios from "axios";
import DirectMessageDto from "../model/DirectMessageDto.ts";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



export async function getMessages(sender: string, receiver: string) {
    const {data} = await axios.get<DirectMessageDto[]>(`/api/directMessages/${sender}/${receiver}`);
    return data;
}


export async function sendMessage(directMessage: DirectMessageDto) {
    const {data} = await axios.post<DirectMessageDto>('/api/directMessages', {
        sender: directMessage.sender,
        receiver: directMessage.receiver,
        message: directMessage.message
    });
    return data;
}