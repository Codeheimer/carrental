import useChatStore from "@/app/stores/chatStore";
import ChatWindow from "./chatWindow";
import ConversationList from "./conversationLists";

export default function ChatContainer() {
    const { currentConversation } = useChatStore();

    return (<div>
        {currentConversation === null ? (<ConversationList />) : <ChatWindow />}
    </div>)
}