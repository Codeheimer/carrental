import { create } from "zustand"
import { ChatMessage, ChatMessageImpl, ConversationResponse, LoginUpdate, VehicleRent, WSPayloads } from "../components/chatModule/components/message"
import { CompatClient } from "@stomp/stompjs"
import useAuthStore from "./authStore"

export interface ChatParticipant {
    participantId: string,
    displayName: string
}
export interface Conversation {
    conversationId: string
    sendToId: string
    vehicleId: number,
    conversationTitle: string
    online: boolean
    senderLastMessage: string
    lastMessageDate: string | null
    messages: ChatMessage[]
    unread: boolean
}

export class ConversationImpl implements Conversation {
    constructor(
        public conversationId: string = "",
        public sendToId: string = "",
        public vehicleId: number,
        public conversationTitle: string = "Anonymous",
        public online: boolean = false,
        public senderLastMessage: string = "",
        public lastMessageDate: string | null = null,
        public messages: ChatMessage[] = [],
        public unread: boolean = false) {
    }

    public equalsBySender = (obj: any): boolean => {
        if (!(obj instanceof ConversationImpl)) {
            return false;
        }
        const that = obj as ConversationImpl;
        return Number(this.sendToId) === Number(that.sendToId);
    }
}

interface ChatStore {
    client: CompatClient | null;
    setClient: (client: CompatClient | null) => void;
    chatOpen: boolean;
    conversations: ConversationImpl[];
    currentConversation: ConversationImpl | null;
    notificationCount: number;
    toggleChat: () => void;
    setCurrentConversation: (conversation: ConversationImpl | null) => void;
    setConversations: (conversations: ConversationImpl[]) => void;
    onReceiveMessage: (message: WSPayloads) => void;
}

const useChatStore = create<ChatStore>((set, get) => {
    const getConversationNoIdThatContainsParticipants = (conversations: ConversationImpl[], userId: string, recipientId: string, senderId: string, vehicleId: number): number => {
        return conversations.findIndex(c => {
            return (Number(c.sendToId) === Number(senderId)) &&
                (Number(userId) === Number(recipientId)) &&
                (c.vehicleId === vehicleId) &&
                Number(c.conversationId) === 0
        });
    }

    const processMessage = (message: ChatMessage) => {
        const { session } = useAuthStore.getState();
        if (message.conversationId) {
            const { currentConversation, conversations, chatOpen } = get();
            let updatedConversations = [...conversations];

            // Update current conversation if it matches the incoming message's conversationId
            if (currentConversation && Number(currentConversation.conversationId) === Number(message.conversationId)) {
                const updatedCurrentConversation: ConversationImpl = {
                    ...currentConversation,
                    messages: [...currentConversation.messages, message],
                    senderLastMessage: message.message,
                    lastMessageDate: message.timestamp,
                    unread: !chatOpen
                };
                set({ currentConversation: updatedCurrentConversation });
            }

            // Find conversation in the list and update it
            const conversationIndex = updatedConversations.findIndex(
                conv => Number(conv.conversationId) === Number(message.conversationId)
            );

            if (conversationIndex !== -1) {
                const updatedConversation: ConversationImpl = {
                    ...updatedConversations[conversationIndex],
                    messages: [...updatedConversations[conversationIndex].messages, message],
                    senderLastMessage: message.message,
                    lastMessageDate: message.timestamp,
                    unread: !chatOpen || currentConversation === null
                };
                updatedConversations[conversationIndex] = updatedConversation;
            } else {
                const newlyCreatedConvoNoId: number = getConversationNoIdThatContainsParticipants(
                    conversations,
                    session.userId as string,
                    message.recipientId,
                    message.senderId,
                    message.vehicleId);

                if (newlyCreatedConvoNoId > -1) {
                    let existingConversation = conversations[newlyCreatedConvoNoId];
                    existingConversation = {
                        ...existingConversation,
                        conversationId: message.conversationId,
                        messages: [...existingConversation.messages, message],
                        senderLastMessage: message.message,
                        lastMessageDate: message.timestamp,
                        unread: false
                    };
                    updatedConversations[newlyCreatedConvoNoId] = existingConversation;
                    if (currentConversation !== null) {
                        set({ currentConversation: existingConversation });
                    }
                } else {
                    // If conversation is not in the list, create a new one
                    let newConversation = message.conversation;
                    if (newConversation) {
                        newConversation = {
                            ...newConversation,
                            messages: [message],
                            senderLastMessage: message.message,
                            lastMessageDate: message.timestamp,
                            unread: true // New conversation should be marked as unread by default
                        };
                        updatedConversations = [newConversation, ...updatedConversations];
                    }
                }
            }
            // Update the conversations state
            set({ conversations: updatedConversations });

            const notificationCount = updatedConversations.filter(
                conversation => conversation.unread
            ).length;
            set({ notificationCount: notificationCount });
        }

    }

    const processWSResponse = (message: ConversationResponse) => {
        const { session } = useAuthStore.getState();
        const { conversations, currentConversation } = get();
        const convoIndex: number = getConversationNoIdThatContainsParticipants(
            conversations,
            session.userId as string,
            message.recipientId,
            message.senderId,
            message.vehicleId);
        const initiatedConvo = conversations[convoIndex];
        if (currentConversation && initiatedConvo.equalsBySender(currentConversation)) {
            const updatedCurrentConversation: ConversationImpl = {
                ...currentConversation,
                conversationId: message.conversationId as string
            };
            set({ currentConversation: updatedCurrentConversation });
        }
        const updatedConversations: ConversationImpl[] = conversations.map((c, idx) => {
            if (convoIndex === idx) {
                return {
                    ...currentConversation,
                    conversationId: message.conversationId as string
                } as ConversationImpl;
            }
            return c; // Return the original conversation if not updating
        });
        set({ conversations: updatedConversations })
    }



    const processLoginUpdate = (loginUpdate: LoginUpdate) => {
        //console.log(`RECEIVED LOGIN STATE CHANGE ${JSON.stringify(loginUpdate)}`)
        const { conversations, currentConversation } = get();
        if (currentConversation && Number(currentConversation.sendToId) === loginUpdate.participantId) {
            const updatedCurrentConversation = { ...currentConversation, online: (loginUpdate.state === 'LOGIN') }
            set({ currentConversation: updatedCurrentConversation });
        }
        const updatedConversations = conversations.map(c => Number(c.sendToId) === loginUpdate.participantId ? { ...c, online: (loginUpdate.state === 'LOGIN') } : c);
        set({ conversations: updatedConversations });
    }

    const processVehicleRent = (vehicleRent: VehicleRent) => {
        const { conversations, currentConversation } = get();
        if (currentConversation && Number(currentConversation.conversationId) === vehicleRent.conversationId) {
            const updatedCurrentConversation = {
                ...currentConversation, messages: [...currentConversation.messages,
                new ChatMessageImpl(
                    String(vehicleRent.conversationId),
                    undefined,
                    undefined,
                    vehicleRent.vehicleId,
                    vehicleRent.message,
                    undefined,
                    null,
                    vehicleRent.type,
                    undefined,
                    vehicleRent.chatMessageType)]
            }
            set({ currentConversation: updatedCurrentConversation });
        }
        const updatedConversations = conversations.map(c => Number(c.conversationId) === vehicleRent.conversationId ?
            {
                ...c, messages: [...c.messages,
                new ChatMessageImpl(
                    String(vehicleRent.conversationId),
                    undefined,
                    undefined,
                    vehicleRent.vehicleId,
                    vehicleRent.message,
                    undefined,
                    null,
                    vehicleRent.type,
                    undefined,
                    vehicleRent.chatMessageType)]
            } : c);
        set({ conversations: updatedConversations });
    }

    const isWSResponseChatMessage = (response: WSPayloads): response is ChatMessage => {
        return response.type === "CHAT";
    }

    const isWSResponseConversationResponse = (response: WSPayloads): response is ConversationResponse => {
        return response.type === "WS_RESPONSE";
    }

    const isWSResponseLoginUpdate = (response: WSPayloads): response is LoginUpdate => {
        return response.type === "LOGIN_STATE";
    }

    const isWSResponseVehicleRent = (response: WSPayloads): response is VehicleRent => {
        return response.type === "VEHICLE_RENT";
    }

    return {
        client: null,
        setClient: (client: CompatClient | null) => set({ client: client }),
        chatOpen: false,
        conversations: [] as ConversationImpl[],
        currentConversation: null,
        notificationCount: 0,
        toggleChat: () => {
            const { currentConversation, conversations } = get();
            set((state) => ({ chatOpen: !state.chatOpen }));
            if (currentConversation) {
                const updatedConversation = { ...currentConversation, unread: false }
                const updatedConversations = conversations;
                const conversationIndex = conversations.findIndex(
                    conv => Number(conv.conversationId) === Number(currentConversation.conversationId)
                );
                updatedConversations[conversationIndex] = updatedConversation;
                set({ conversations: updatedConversations });
                const notificationCount = updatedConversations.filter(
                    conversation => conversation.unread
                ).length;
                set({ notificationCount: notificationCount });

            }
        },
        setCurrentConversation: (conversation: ConversationImpl | null) => {
            set({ currentConversation: conversation })
            const { currentConversation, conversations } = get();
            if (currentConversation) {
                const updatedConversation = { ...currentConversation, unread: false }
                const updatedConversations = conversations;
                const conversationIndex = conversations.findIndex(
                    conv => Number(conv.conversationId) === Number(currentConversation.conversationId)
                );
                updatedConversations[conversationIndex] = updatedConversation;
                set({ conversations: updatedConversations });
                const notificationCount = updatedConversations.filter(
                    conversation => conversation.unread
                ).length;
                set({ notificationCount: notificationCount });

            }

        },
        setConversations: (conversations: ConversationImpl[]) => {
            set({ conversations: conversations })
            const notificationCout = conversations.filter((conversation) => conversation.unread).length;
            //.log(`current count ${notificationCout}`)
            //lastly upate the chat bubble notification count
            set({ notificationCount: notificationCout })
        },
        onReceiveMessage: (message: WSPayloads) => {
            if (isWSResponseChatMessage(message)) {
                processMessage(message);
            } else if (isWSResponseConversationResponse(message)) {
                processWSResponse(message);
            } else if (isWSResponseLoginUpdate(message)) {
                processLoginUpdate(message);
            } else if (isWSResponseVehicleRent(message)) {
                processVehicleRent(message);
            }
        }
    };
});

export default useChatStore;