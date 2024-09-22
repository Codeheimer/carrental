package com.thesis.carrental.dtos;

public record MessageResponse(
    long conversationId,
    long recipientId,
    long senderId,
    String message,
    String timestamp
) {
}
