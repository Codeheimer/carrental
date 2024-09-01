'use client';
import ChatBubble from "./chatBubble";
import ChatWindow from "./chatWindow";
import useChatStore from "@/app/stores/chatStore";

export default function ChatModule() {    
    const chatOpen = useChatStore((state) => state.chatOpen);

    return (<div className="z-50 fixed bottom-0 right-0">
        {chatOpen && <ChatWindow />}
        <ChatBubble />
    </div>)
}