package com.thesis.carrental.dtos.chat;

import com.thesis.carrental.enums.ChatMessageType;

public record MessageResponse(
    String senderId,
    String message,

    ChatMessageType chatMessageType
) {
}
