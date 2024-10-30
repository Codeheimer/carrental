package com.thesis.carrental.dtos.chat;

import java.util.List;

public record ConversationResponse(
    long conversationId,
    String sendToId,
    Long vehicleId,
    String conversationTitle,
    String senderLastMessage,
    boolean unread,
    List<MessageResponse> messages,
    boolean online
) {
}
