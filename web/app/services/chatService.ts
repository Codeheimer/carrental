import SockJS from 'sockjs-client';
import { CompatClient, Message, Stomp } from '@stomp/stompjs';
import { ChatMessage } from '../components/chatModule/components/message';
import { BaseService } from './baseService';
import { ConversationImpl } from '../stores/chatStore';
import { AxiosRequestConfig } from 'axios';


export interface ChatService {
    connect: (token: string | null, userId: string, callbackFunction: (message: ChatMessage) => void) => Promise<CompatClient>
    sendMessage: (client: CompatClient, message: ChatMessage) => void
    fetchConversations: (token: string) => Promise<ConversationImpl[]>
    disconnect: (client: CompatClient) => void
}

export class ChatServiceImpl extends BaseService implements ChatService {

    public connect = (token: string | null, userId: string, callbackFunction: (message: ChatMessage) => void): Promise<CompatClient> => {
        const url = `/user/${userId}/private-messages`;
        //console.log(`CONNECTING with ${url}`)
        return new Promise((resolve, reject) => {
            const client = Stomp.over(new SockJS('http://localhost:8080/mywebsocket'));
            client.debug = f => f; // REMOVE THE LOGGING!
            client.connect({
                Authorization: `bearer ${token}`
            }, () => {
                client.subscribe(
                    url,
                    (message: Message) => {
                        const chatMessage: ChatMessage = JSON.parse(message.body);
                        console.log(`RAW BODY ${message.body}`)
                        callbackFunction(chatMessage)
                    },
                );
                resolve(client);
            },
                (error: any) => {
                    reject(error);
                })
        });
    }

    public sendMessage(client: CompatClient, message: ChatMessage): void {
        client.publish({
            destination: "/ws/private-message",
            body: JSON.stringify(message)
        });
    }

    public fetchConversations = async (token: string): Promise<ConversationImpl[]> => {
        try {
            const URL = `${this.getBaseURL()}${process.env.CHAT_RETRIEVE_CONVERSATIONS}`;
            const axiosConfig: AxiosRequestConfig = {
                method: 'GET',
                headers: this.getHeaders(token)
            }
            const response = await this.doRequest<ConversationImpl[]>(URL, axiosConfig);

            return response;
        } catch (error) {
            console.error('error:', error);
            throw error;
        }
    }

    public disconnect = (client: CompatClient): void => {
        if (client && client.connected) {
            client.disconnect(() => {
                //console.log('Disconnected from WebSocket.');
            });
        }
    }
}