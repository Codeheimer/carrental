'use client';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Message, { ChatMessage } from "./components/message";

interface Conversation {
    sender: string
    messages: ChatMessage[]
    lastMessage: string
    lastMessageDate: Date
}

export default function ChatWindow() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [draft, setDraft] = useState<string>('');

    const [messages, setMessages] = useState<ChatMessage[]>([{sender:"Anonymous",message:"hi"},{sender:"You",message:"Yow?"}]);

    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const send = (event: React.FormEvent | KeyboardEvent<HTMLInputElement>) => {
        const message = { sender: "You", message: draft };
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

    const addToMessages = (chat: ChatMessage): void => {
        setMessages([...messages, chat]);
    }

    const updateDraft = (event: ChangeEvent<HTMLInputElement>) => {
        setDraft(event.target.value)
    }

    return (<div style={{ boxShadow: "0 0 0 #0000, 0 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
        className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[620px]">

        <div className="flex flex-row justify-between space-y-1.5 border-2 border-solid rounded-lg">
            <div className="flex items-center justify-center p-1 m-1">
                <div className="mx-1">Anonymous</div>
                <div className="mx-1 w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="mx-1 w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
        </div>

        <div ref={messageContainerRef} className="pr-4 h-[474px] my-2 p-2 overflow-y-auto" style={{ minWidth: '100%' }}>
            {messages.map((message, key) => (
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