package com.thesis.carrental.dtos;

import java.time.Instant;
import java.util.List;

public record ConversationResponse(
    long id,
    long recipientId,
    String recipientName,
    String lastMessage,
    Instant lastMessageDate,

    boolean unread,
    List<MessageResponse> messages
) {
}
