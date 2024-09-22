'use client';

import useAuthStore from "@/app/stores/authStore";
import useChatStore, { ConversationImpl } from "@/app/stores/chatStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { useCallback, useEffect } from "react";
import { ChatMessage } from "../chatModule/components/message";
import useSound from "use-sound";

export default function ClientAuthenticationInitializer() {
    const { session, login, logout } = useAuthStore()
    const { setCurrentConversation, setConversations, onReceiveMessage, setClient, client } = useChatStore()
    const { chatService, authenticationService } = useGlobalServiceStore()
    const [play] = useSound("/sfx/chat-receive.mp3", { volume: 0.5, playbackRate: 1.5 });

    const intializeLoggedInUser = async () => {
        try {
            const response = await authenticationService.verifyToken();
            if (response.isValid) {
                if (!session.isLoggedIn()) {
                    login(authenticationService.getToken(), session.getUserId() as string);
                }
            } else {
                if (session.isLoggedIn()) {
                    logout();
                }
            }
        } catch (error) {
            console.error("Failed to verify token: ", error)
            logout();
        }
    }

    const loadConversations = useCallback(async () => {
        try {
            const response = await chatService.fetchConversations(session.getToken() as string);
            setConversations(response)
        } catch (error) {
            console.log("Error occured while fetching conversations, reason: ", error);
        }
    }, [chatService, session, setConversations]);

    const connectChat = useCallback(async () => {
        if (session.isLoggedIn() && !client) {
            try {
                console.log("connecting to stomp")
                const handleReceiveMessage = (chatMessage: ChatMessage) => {
                    play();
                    onReceiveMessage(chatMessage);
                }
                const stompClient = await chatService.connect(session.getToken(), session.getUserId() as string, handleReceiveMessage);
                setClient(stompClient);
                await loadConversations();
            } catch (error) {
                console.error("Error in stomp client, ", error)
            }
        }

    }, [session.isLoggedIn()])

    useEffect(() => {
        intializeLoggedInUser();
    });

    const handleLoginStateChange = useCallback(() => {
        if (session.isLoggedIn()) {
            connectChat();
        } else if (client) {
            chatService.disconnect(client);
            setClient(null);
        }
    }, [session.isLoggedIn()]);


    useEffect(() => {
        handleLoginStateChange();
    }, [handleLoginStateChange])

    const handleBeforeUnload = useCallback(() => {
        if (client) {
            chatService.disconnect(client);
            setClient(null);
        }
    }, [client]);


    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleBeforeUnload();
        };
    }, [handleBeforeUnload])


    return null
}