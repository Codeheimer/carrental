import { create } from "zustand"
import { ChatMessage } from "../components/chatModule/components/message"
import { CompatClient } from "@stomp/stompjs"

interface Conversation {
    id: string,
    recipientId: string
    recipientName: string
    isOnline: boolean
    lastMessage: string
    lastMessageDate: string | null
    messages: ChatMessage[]
    unread: boolean
}

export class ConversationImpl implements Conversation {
    constructor(
        public id: string = "",
        public recipientId: string = "",
        public recipientName: string = "",
        public isOnline: boolean = false,
        public lastMessage: string = "",
        public lastMessageDate: string | null,
        public messages: ChatMessage[] = [],
        public unread: boolean = false) { }
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

const useChatStore = create<ChatStore>((set, get) => ({
    client: null,
    setClient: (client: CompatClient | null) => set({ client: client }),
    chatOpen: false,
    conversations: [] as ConversationImpl[],
    currentConversation: null,
    notificationCount: 0,
    toggleChat: () => {
        set((state) => ({ chatOpen: !state.chatOpen }));
    },
    setCurrentConversation: (conversation: ConversationImpl | null) => set({ currentConversation: conversation }),
    setConversations: (conversations: ConversationImpl[]) => {
        set({ conversations: conversations })
        const notificationCout = conversations.filter((conversation) => conversation.unread).length;
        console.log(`current count ${notificationCout}`)
        //lastly upate the chat bubble notification count
        set({ notificationCount: notificationCout })
    },
    onReceiveMessage: (message: ChatMessage) => {
        if (message.conversationId) {
            const { currentConversation, conversations } = get();
            let updatedConversations = [...conversations];

            // Update current conversation if it matches the incoming message's conversationId
            if (currentConversation && Number(currentConversation.id) === Number(message.conversationId)) {
                const updatedCurrentConversation = {
                    ...currentConversation,
                    messages: [...currentConversation.messages, message],
                    lastMessage: message.message,
                    lastMessageDate: message.timestamp,
                    unread: false // Since receiver is viewing this conversation, mark as read
                };
                set({ currentConversation: updatedCurrentConversation });
            }

            // Find conversation in the list and update it
            const conversationIndex = updatedConversations.findIndex(
                conv => Number(conv.id) === Number(message.conversationId)
            );

            if (conversationIndex !== -1) {
                const updatedConversation = {
                    ...updatedConversations[conversationIndex],
                    messages: [...updatedConversations[conversationIndex].messages, message],
                    lastMessage: message.message,
                    lastMessageDate: message.timestamp,
                    unread: currentConversation && Number(currentConversation.id) === Number(message.conversationId)
                        ? false // Mark as read if it's the active conversation
                        : true  // Otherwise mark it as unread
                };
                updatedConversations[conversationIndex] = updatedConversation;
            } else {
                // If conversation is not in the list, create a new one
                let newConversation = message.conversation;
                if (newConversation) {
                    newConversation = {
                        ...newConversation,
                        messages: [message],
                        lastMessage: message.message,
                        lastMessageDate: message.timestamp,
                        unread: true // New conversation should be marked as unread by default
                    };
                    updatedConversations = [newConversation, ...updatedConversations];
                }
            }

            // Update the conversations state
            set({ conversations: updatedConversations });

            // Calculate unread notifications count
            const notificationCount = updatedConversations.filter(
                conversation => conversation.unread
            ).length;
            console.log(`current count: ${notificationCount}`);

            // Update the notification count in the state
            set({ notificationCount: notificationCount });
        }
    }
}));

export default useChatStore;