'use client';
import useAuthStore from "@/app/stores/authStore";
import ChatBubble from "./chatBubble";
import useChatStore from "@/app/stores/chatStore";
import ChatContainer from "./chatContainer";

export default function ChatModule() {
    const chatOpen = useChatStore((state) => state.chatOpen);
    const session = useAuthStore((state) => state.session);

    return session.isLoggedIn() ? (
        <div className="z-50 fixed bottom-0 right-0">
            {chatOpen && <ChatContainer />}
            <ChatBubble />
        </div>) : null;
}