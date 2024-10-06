package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.chat.ConversationResponse;
import com.thesis.carrental.services.ChatService;
import com.thesis.carrental.services.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController extends BaseController {

    private final JWTService jwtService;
    private final ChatService chatService;

    @Autowired

    public ChatController(JWTService jwtService, ChatService chatService) {
        this.jwtService = jwtService;
        this.chatService = chatService;
    }

    @GetMapping("/retrieveConversations")
    ResponseEntity<List<ConversationResponse>> retrieveConversations(final HttpServletRequest httpServletRequest) {
        return ResponseEntity.ok(chatService.fetchConversations(jwtService.extractLogin(getToken(httpServletRequest))));
    }
}
