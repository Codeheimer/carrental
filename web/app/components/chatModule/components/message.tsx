'use client';
import useAuthStore from "@/app/stores/authStore";
import OtherMessage from "./otherMessage"
import YouMessage from "./youMessage"
import { ConversationImpl } from "@/app/stores/chatStore";
import NotificationMessage from "./notificationMessage";

export interface WSPayloads {
    type: MessageType,
    chatMessageType: ChatMessageType
}

export interface ChatMessage extends WSPayloads {
    conversationId: string | null
    recipientId: string
    senderId: string
    vehicleId: number
    message: string
    timestamp: string
    conversation?: ConversationImpl | null
    chatTitle: string
}

export interface ConversationResponse extends WSPayloads {
    recipientId: string,
    senderId: string,
    vehicleId: number,
    conversationId: string | null
}

export interface LoginUpdate extends WSPayloads {
    participantId: number,
    state: string
}

export interface VehicleRent extends WSPayloads {
    vehicleId: number,
    message: string,
    conversationId: number
}

type ChatMessageType = "CHAT" | "NOTIFICATION";

type MessageType = "CHAT" | "WS_RESPONSE" | "LOGIN_STATE" | "VEHICLE_RENT";

export class ChatMessageImpl implements ChatMessage {
    constructor(
        public conversationId: string | null = null,
        public recipientId: string = "",
        public senderId: string = "",
        public vehicleId: number = 0,
        public message: string = "",
        public timestamp: string = "",
        public conversation: ConversationImpl | null = null,
        public type: MessageType = "CHAT",
        public chatTitle: string = "Anonymous",
        public chatMessageType:ChatMessageType = "CHAT"
    ) { }
}

export default function Message(chat: ChatMessage) {
    const { session } = useAuthStore();

    return (<>
        {chat.chatMessageType === "NOTIFICATION" ? <NotificationMessage {...chat} /> :
            (Number(chat.senderId) === Number(session.userId) ?
                <YouMessage {...chat} /> :
                <OtherMessage {...chat} />)}
    </>
    )
}