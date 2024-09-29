'use client';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Message, { ChatMessage, ChatMessageImpl } from "./components/message";
import useChatStore from "@/app/stores/chatStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import useAuthStore from "@/app/stores/authStore";

export default function ChatWindow() {
    const { currentConversation, setCurrentConversation, setConversations, conversations } = useChatStore();
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [draft, setDraft] = useState<string>('');
    const { chatService } = useGlobalServiceStore();
    const { session } = useAuthStore();
    const { client } = useChatStore();

    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [currentConversation?.messages]);

    const send = (event: React.FormEvent | KeyboardEvent<HTMLInputElement>) => {
        if (currentConversation) {
            const message = new ChatMessageImpl(currentConversation.id, currentConversation.recipientId.toString(), session.userId as string, draft, new Date().toISOString());
            if (event.type === 'keydown') {
                const keyboardEvent = event as KeyboardEvent<HTMLInputElement>;
                if (keyboardEvent.key === 'Enter') {
                    if (draft.length > 0) {
                        addToMessages(message);
                        setDraft('');
                    }
                    keyboardEvent.preventDefault();
                }
            } else {
                if (draft.length > 0) {
                    addToMessages(message);
                    setDraft('');
                }
                event.preventDefault();
            }
        }
    }

    const exitConvesation = (): void => {
        setCurrentConversation(null);
    }

    const addToMessages = (chat: ChatMessage): void => {
        if (currentConversation && client) {
            chatService.sendMessage(client, chat);
            const updateMessages = [...currentConversation.messages, chat]
            const updatedConversation = {
                ...currentConversation,
                messages: updateMessages,
                lastMessage: chat.message,
                lastMessageDate: new Date().toISOString(),
                unread: false

            }
            setCurrentConversation(updatedConversation)
            const updatedConversations = conversations.map((conversation) =>
                conversation.id === updatedConversation.id ? updatedConversation : conversation
            );
            setConversations(updatedConversations)
        }
    }

    const updateDraft = (event: ChangeEvent<HTMLInputElement>) => {
        setDraft(event.target.value)
    }

    return (<div style={{ boxShadow: "0 0 0 #0000, 0 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
        className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[620px]">

        <div className="flex flex-row justify-start space-y-1.5 rounded-lg">
            <div className="mt-2 mx-1" onClick={exitConvesation}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-left" width="28" height="28" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                    <path d="M5 12l6 6" />
                    <path d="M5 12l6 -6" />
                </svg>
            </div>
            <div className="flex items-center justify-center p-1 m-1">
                <div className="mx-1">{currentConversation?.recipientName}</div>
                <div className={`mx-1 w-4 h-4 ${currentConversation?.isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
            </div>
        </div>

        <div ref={messageContainerRef} className="pr-4 h-[474px] my-2 p-2 overflow-y-auto" style={{ minWidth: '100%' }}>
            {currentConversation?.messages.map((message, key) => (
                <Message key={key} {...message} />
            ))}
        </div>
        <div className="flex items-center pt-0">
            <form className="flex items-center justify-center w-full space-x-2">
                <input value={draft} onChange={updateDraft} onKeyDown={send}
                    className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                    placeholder="Type your message">
                </input>
                <button onClick={send}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2">
                    Send</button>
            </form>
        </div>

    </div>)
}