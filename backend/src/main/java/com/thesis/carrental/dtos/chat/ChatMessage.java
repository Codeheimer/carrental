package com.thesis.carrental.dtos.chat;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thesis.carrental.enums.MessageType;

import java.time.Instant;

import static com.thesis.carrental.enums.MessageType.WS_RESPONSE;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ChatMessage(
    String message,
    Instant timestamp,
    String recipientId,
    String senderId,
    String conversationId,
    Long vehicleId,
    ConversationResponse conversation,
    MessageType type,

    String chatTitle
) {
    public ChatMessage(String message,
        Instant timestamp,
        String recipientId,
        String senderId,
        String conversationId,
        Long vehicleId,
        ConversationResponse conversation,
        MessageType type,
        String chatTitle){
        this.message = message;
        this.timestamp = timestamp;
        this.recipientId = recipientId;
        this.senderId = senderId;
        this.conversationId = conversationId;
        this.vehicleId = vehicleId;
        this.conversation = conversation;
        this.type = type;
        this.chatTitle = chatTitle;
    }

    public ChatMessage(ConversationResponse conversation, MessageType type, String chatTitle) {
        this(null, null, null, null,null, conversation.vehicleId(), conversation, type, chatTitle);
    }
}
