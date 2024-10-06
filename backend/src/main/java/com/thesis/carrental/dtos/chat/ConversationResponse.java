package com.thesis.carrental.dtos.chat;

import java.util.List;

public record ConversationResponse(
    long conversationId,
    String sendToId,
    String conversationTitle,
    String senderLastMessage,
    boolean unread,
    List<MessageResponse> messages
) {
}
