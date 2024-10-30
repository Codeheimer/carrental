import { ChatMessage } from "./message";


export default function NotificationMessage(chat: ChatMessage){
    return (
        <div className="flex w-full justify-center items-center">
            {chat.message}
        </div>
    )
}