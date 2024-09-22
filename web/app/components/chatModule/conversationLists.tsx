'use client';

import useChatStore, { ConversationImpl } from "@/app/stores/chatStore"
import { truncate } from "@/app/utilities/stringUtils";
import { useEffect } from "react";
export default function ConversationList() {
    const { conversations, setCurrentConversation } = useChatStore();

    const loadConversation = (convo: ConversationImpl): void => {
        setCurrentConversation(convo);
    }

    useEffect(() => {
        console.log("rerendering conversations")
    }, [conversations])

    return (<div style={{ boxShadow: "0 0 0 #0000, 0 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
        className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white shadow-md rounded-lg border border-[#e5e7eb] w-[440px] h-[620px]">
        <div className="py-3 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Chat Messages</h3>
        </div>
        {conversations.length === 0 ? <div className="flex h-full w-full justify-center items-center">No conversations.</div>
            : (<ul className="divide-y divide-gray-200 overflow-y-auto h-[568px]">
                {conversations.map((convo) =>
                    <li key={convo.id} className="px-4 py-4 sm:px-6 " onClick={() => loadConversation(convo)}>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                                    {convo.recipientName.charAt(0)}
                                </div>
                            </div>
                            <div className={`flex-1 min-w-0 ${convo.unread && 'font-black'}`}>
                                <p className="flex flex-row text-sm text-gray-900 truncate">{convo.recipientName}</p>
                                <p className="text-sm text-gray-500">{truncate(convo.lastMessage, 50)}</p>
                            </div>
                        </div>
                    </li>)}
            </ul>)}
    </div>)
}