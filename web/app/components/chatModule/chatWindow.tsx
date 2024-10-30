'use client';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Message, { ChatMessage, ChatMessageImpl } from "./components/message";
import useChatStore, { ConversationImpl } from "@/app/stores/chatStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import useAuthStore from "@/app/stores/authStore";
import GenericButton, { createButtonDetails } from "../fields/genericButton";
import { truncate } from "@/app/utilities/stringUtils";
import { DropdownMenu, DropdownMenuItem } from "../shadcn/dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../shadcn/button";
import { UserRoles } from "../enums/userRoles";
import Error from "next/error";

export default function ChatWindow() {
    const { currentConversation, setCurrentConversation, setConversations, conversations } = useChatStore();
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [draft, setDraft] = useState<string>('');
    const { chatService, vehicleService } = useGlobalServiceStore();
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
            if (event.type === 'keydown') {
                const keyboardEvent = event as KeyboardEvent<HTMLInputElement>;
                if (keyboardEvent.key === 'Enter') {
                    if (draft.length > 0) {
                        const message = newMessage(currentConversation);
                        if (message) {
                            addToMessages(message);
                            setDraft('');
                        }
                    }
                    keyboardEvent.preventDefault();
                }
            } else {
                if (draft.length > 0) {
                    const message = newMessage(currentConversation);
                    if (message) {
                        addToMessages(message);
                        setDraft('');
                    }
                }
                event.preventDefault();
            }
        }
    }

    const newMessage = (currentConversation: ConversationImpl): ChatMessageImpl | undefined => {
        const message = new ChatMessageImpl(currentConversation.conversationId, currentConversation.sendToId, session.userId as string, currentConversation.vehicleId, draft, new Date().toISOString());
        //console.log(`creating message ${JSON.stringify(message)}`)
        return message;
    }

    const exitConvesation = (): void => {
        setCurrentConversation(null);
    }

    const handleTagListingAsRent = async () => {
        if (currentConversation && currentConversation.vehicleId && currentConversation.sendToId && session.token) {
            const response = await vehicleService.rentVehicle(Number(currentConversation.conversationId), currentConversation.vehicleId, Number(currentConversation.sendToId), session.token);
        }

    }

    const addToMessages = (chat: ChatMessage): void => {
        if (currentConversation && client) {
            chatService.sendMessage(client, chat);
            const updateMessages: ChatMessage[] = [...currentConversation.messages, chat]
            const updatedConversation: ConversationImpl = {
                ...currentConversation,
                messages: updateMessages,
                senderLastMessage: chat.message,
                lastMessageDate: new Date().toISOString(),
                unread: false

            }
            setCurrentConversation(updatedConversation)
            const updatedConversations: ConversationImpl[] = conversations.map((conversation) =>
                Number(conversation.conversationId) === Number(updatedConversation.conversationId) ? updatedConversation : conversation
            );
            setConversations(updatedConversations)
        }
    }

    const updateDraft = (event: ChangeEvent<HTMLInputElement>) => {
        setDraft(event.target.value)
    }

    return (<div style={{ boxShadow: "0 0 0 #0000, 0 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
        className="bg-background text-foreground fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 p-6 rounded-lg border w-[440px] h-[620px]">

        <div className="flex flex-row justify-start space-y-1.5 rounded-lg">
            <div className="mt-2 mx-1" onClick={exitConvesation}>
                <svg xmlns="http://www.w3.org/2000/svg" className="text-foreground icon icon-tabler icon-tabler-arrow-left"
                    width="28" height="28" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                    <path d="M5 12l6 6" />
                    <path d="M5 12l6 -6" />
                </svg>
            </div>
            <div className="flex items-center justify-center p-1 m-1">
                <div className="mx-1">{truncate(currentConversation?.conversationTitle, 22)}</div>
                <div className={`mx-1 w-4 h-4 ${currentConversation?.online ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
            </div>
            {session.permissions.includes(UserRoles.ROLE_RENTER) &&
                <div className="z-50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}>Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-24 bg-background text-foreground border border-solid rounded-lg m-2">
                            <DropdownMenuItem onClick={handleTagListingAsRent} >Tag Rent</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            }
        </div>

        <div ref={messageContainerRef} className="pr-4 h-[474px] my-2 p-2 overflow-y-auto" style={{ minWidth: '100%' }}>
            {currentConversation?.messages.map((message, key) => (
                <Message key={key} {...message} />
            ))}
        </div>
        <div className="flex items-center pt-0">
            <form className="flex items-center justify-center w-full space-x-2">
                <input value={draft} onChange={updateDraft} onKeyDown={send}
                    className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-offset-2"
                    placeholder="Type your message">
                </input>
                <GenericButton {...createButtonDetails("Send", "button", send)} />
            </form>
        </div>

    </div>)
}