import { create } from "zustand"
import { ChatMessage, ChatMessageImpl } from "../components/chatModule/components/message"
import { CompatClient } from "@stomp/stompjs"
import useAuthStore from "./authStore"
import useSound from "use-sound"

export interface ChatParticipant {
    participantId: string,
    displayName: string
}
export interface Conversation {
    conversationId: string
    sendToId: string
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
    onReceiveMessage: (message: ChatMessage) => void;
}

const useChatStore = create<ChatStore>((set, get) => {
    const getConversationNoIdThatContainsParticipants = (conversations: ConversationImpl[], userId: string, recipientId: string, senderId: string): number => {
        return conversations.findIndex(c => {
            //c.sendToId , session.userId , senderId , recipientId  53 54 53 54
            //console.log("c.sendToId , session.userId , senderId , recipientId ", c.sendToId, userId, senderId, recipientId)
            //console.log(Number(c.sendToId) === Number(senderId), Number(userId) === Number(recipientId), Number(c.conversationId) === 0)
            return Number(c.sendToId) === Number(senderId) &&
                Number(userId) === Number(recipientId) && Number(c.conversationId) === 0
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
                const newlyCreatedConvoNoId: number = getConversationNoIdThatContainsParticipants(conversations, session.userId as string, message.recipientId, message.senderId);
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

    const processWSResponse = (message: ChatMessage) => {
        const { session } = useAuthStore.getState();
        const { conversations, currentConversation } = get();
        const convoIndex: number = getConversationNoIdThatContainsParticipants(conversations, session.userId as string, message.recipientId, message.senderId);
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
        onReceiveMessage: (message: ChatMessage) => {
            switch (message.type) {
                case "CHAT":
                    processMessage(message);
                    break;
                case "WS_RESPONSE":
                    processWSResponse(message);
                    break;
                default:
                    break;
            }
        }
    };
});

export default useChatStore;