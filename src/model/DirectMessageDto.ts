export default interface DirectMessageDto {
    sender: string
    receiver: string
    message: string
    timestamp?: Date
    gameId?: string
}