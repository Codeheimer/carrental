package com.thesis.carrental.dtos.chat;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ChatMessage(
    String message,
    Instant timestamp,
    String recipientId,
    String senderId,
    String conversationId,
    ConversationResponse conversation
) {
}
