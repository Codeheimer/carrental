package com.thesis.carrental.dtos.chat;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thesis.carrental.enums.LoginState;
import com.thesis.carrental.enums.MessageType;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LoginUpdate(
    MessageType type,
    Long participantId,
    LoginState state
) {
}
