package com.thesis.carrental.dtos;

import com.thesis.carrental.dtos.chat.ConversationResponse;

import java.util.List;

public record RetrieveConversationResponse(List<ConversationResponse> conversations) {
}
