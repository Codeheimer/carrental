'use client';

import useChatStore, { ConversationImpl } from "@/app/stores/chatStore"
import { truncate } from "@/app/utilities/stringUtils";
import { useEffect } from "react";
export default function ConversationList() {
    const { conversations, setCurrentConversation } = useChatStore();

    const loadConversation = (convo: ConversationImpl): void => {
        console.log(`SETTING CURRENT CONVO `, JSON.stringify(convo))
        setCurrentConversation(convo);
    }

    useEffect(() => {
        console.log("rerendering conversations")
    }, [conversations])

    return (<div style={{ boxShadow: "0 0 0 #0000, 0 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
        className="bg-background text-foreground fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 shadow-md rounded-lg w-[440px] h-[620px]">
        <div className="py-3 sm:px-6 border-b">
            <h3 className="text-lg leading-6 font-medium">Chat Messages</h3>
        </div>
        {conversations.length === 0 ? <div className="flex h-full w-full justify-center items-center">No conversations.</div>
            : (<ul className="divide-y divide-gray-200 overflow-y-auto h-[568px]">
                {conversations.map((convo) =>
                    <li key={convo.conversationId} className="px-4 py-4 sm:px-6 " onClick={() => loadConversation(convo)}>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                                    {convo.conversationTitle.charAt(0)}
                                </div>
                            </div>
                            <div className={`flex flex-col justify-start w-full ${convo.unread && 'font-extrabold'}`}>
                                <div className="flex flex-row items-stretch justify-stretch">
                                    <div className="truncate">{convo.conversationTitle}</div>
                                    <div>
                                        <div className={`mx-1 mt-2 w-4 h-4 ${convo.online ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                                    </div>
                                </div>
                                <div className="text-sm">{truncate(convo.senderLastMessage, 50)}</div>
                            </div>
                        </div>
                    </li>)}
            </ul>)}
    </div>)
}