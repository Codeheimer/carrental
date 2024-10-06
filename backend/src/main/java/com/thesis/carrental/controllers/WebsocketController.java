package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.chat.ChatMessage;
import com.thesis.carrental.services.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import static com.thesis.carrental.enums.MessageType.WS_RESPONSE;

@Controller
public class WebsocketController extends BaseController {

    private static final Logger LOG = LoggerFactory.getLogger(WebsocketController.class);

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    @Autowired
    public WebsocketController(
        final SimpMessagingTemplate simpMessagingTemplate, ChatService chatService
    ) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/private-message")
    void sendMessage(
        @Payload final ChatMessage chatMessage
    ) {
        LOG.info("Received message {}", chatMessage.toString());
        final long currentConversationId = Long.parseLong(chatMessage.conversationId());
        final ChatMessage savedChatMessage = chatService.processChat(chatMessage);
        simpMessagingTemplate.convertAndSendToUser(
            savedChatMessage.recipientId(),
            "/private-messages",
            savedChatMessage
        );
        if (currentConversationId == 0) {
            LOG.info("NEW CONVO INITIATED");
            simpMessagingTemplate.convertAndSendToUser(
                savedChatMessage.senderId(),
                "/private-messages",
                new ChatMessage(savedChatMessage.conversation(), WS_RESPONSE)
            );
        }
    }

}
