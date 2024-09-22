package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.ChatMessage;
import com.thesis.carrental.services.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

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
        @Payload final ChatMessage chatMessage) {
        LOG.info("Received message {}", chatMessage.toString());
        final ChatMessage savedChatMessage = chatService.saveChat(chatMessage);
        simpMessagingTemplate.convertAndSendToUser(
            savedChatMessage.recipientId(),
            "/private-messages",
            savedChatMessage
        );
    }

}
