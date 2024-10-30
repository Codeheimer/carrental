package com.thesis.carrental.dtos.chat;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thesis.carrental.enums.ChatMessageType;
import com.thesis.carrental.enums.MessageType;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record VehicleRent(
    MessageType type,
    ChatMessageType chatMessageType,
    Long vehicleId,
    String message,
    Long conversationId
) {
}
