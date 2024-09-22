'use client';
import useAuthStore from "@/app/stores/authStore";
import OtherMessage from "./otherMessage"
import YouMessage from "./youMessage"
import { ConversationImpl } from "@/app/stores/chatStore";

export interface ChatMessage {
    conversationId: string | null
    recipientId: string
    senderId: string
    message: string
    timestamp: string
    conversation?: ConversationImpl | null
}

export class ChatMessageImpl implements ChatMessage {
    constructor(
        public conversationId: string | null,
        public recipientId: string,
        public senderId: string,
        public message: string,
        public timestamp: string,
        public conversation: ConversationImpl | null = null
    ) { }
}

export default function Message(chat: ChatMessage) {
    const { session } = useAuthStore();
    return (<>
        {Number(chat.senderId) === Number(session.getUserId()) ? <YouMessage {...chat} /> : <OtherMessage {...chat} />}
    </>
    )
}