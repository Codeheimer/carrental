import { create } from "zustand"

interface ChatStore {
    chatOpen: boolean;
    toggleChat: () => void;
}

const useChatStore = create<ChatStore>((set) => ({
    chatOpen: false,
    toggleChat: () => {
        set((state) => ({ chatOpen: !state.chatOpen }));
    }
}));

export default useChatStore;