package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.chat.ChatMessage;
import com.thesis.carrental.dtos.chat.LoginUpdate;
import com.thesis.carrental.dtos.chat.VehicleRent;
import com.thesis.carrental.entities.Message;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.enums.LoginState;
import com.thesis.carrental.repositories.ConversationRepository;
import com.thesis.carrental.repositories.MessageRepository;
import com.thesis.carrental.repositories.ParticipantRepository;
import com.thesis.carrental.services.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

import static com.thesis.carrental.enums.ChatMessageType.NOTIFICATION;
import static com.thesis.carrental.enums.MessageType.*;

@Controller
public class WebsocketController extends BaseController {

    private static final Logger LOG = LoggerFactory.getLogger(WebsocketController.class);

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    private final MessageRepository messageRepository;

    private final ConversationRepository conversationRepository;

    private final ParticipantRepository participantRepository;

    private static final String PRIVATE_MESSAGES = "/private-messages";
    @Autowired
    public WebsocketController(
        final SimpMessagingTemplate simpMessagingTemplate,
        final ChatService chatService,
        final MessageRepository messageRepository,
        final ConversationRepository conversationRepository,
        final ParticipantRepository participantRepository
    ) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatService = chatService;
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
    }

    @MessageMapping("/private-message")
    void sendMessage(
        @Payload final ChatMessage chatMessage
    ) {
        LOG.info("Received message {}", chatMessage.toString());
        final long currentConversationId = Long.parseLong(chatMessage.conversationId());
        final ChatMessage savedChatMessage = chatService.processChat(chatMessage);
        simpMessagingTemplate.convertAndSendToUser(
            savedChatMessage.recipientId(),
            PRIVATE_MESSAGES,
            savedChatMessage
        );
        if (currentConversationId == 0) {
            LOG.info("NEW CONVO INITIATED");
            simpMessagingTemplate.convertAndSendToUser(
                savedChatMessage.senderId(),
                PRIVATE_MESSAGES,
                new ChatMessage(savedChatMessage.conversation(), WS_RESPONSE,savedChatMessage.chatTitle())
            );
        }
    }

    public void broadcastLoginState(final Participant participant, final LoginState state) {
        LOG.info("participantId: {} , login status: {}",participant.getId(),state);
        List<Long> idsToNotify = chatService.fetchConversationsParticipantIsIncludedIn(participant);
        final LoginUpdate loginUpdate = new LoginUpdate(LOGIN_STATE,participant.getId(),state);
        idsToNotify.forEach(id -> simpMessagingTemplate.convertAndSendToUser(String.valueOf(id),PRIVATE_MESSAGES,loginUpdate));
    }

    public void broadcastVehicleRent(final Long conversationId, final Vehicle vehicle, Long owner, Long renter) {
        final String message = vehicle.getMake() + " " + vehicle.getModel() + " " + vehicle.getYear() + " has been tagged as rented.";
        final VehicleRent vehicleRent = new VehicleRent(VEHICLE_RENT,NOTIFICATION,vehicle.getId(),message, conversationId);
        final Message newMessage = new Message(conversationRepository.findById(conversationId)
            .orElseThrow(),
            participantRepository.findById(owner).orElseThrow(),
            message,
            NOTIFICATION
        );

        messageRepository.save(newMessage);

        simpMessagingTemplate.convertAndSendToUser(String.valueOf(owner),PRIVATE_MESSAGES,vehicleRent);
        simpMessagingTemplate.convertAndSendToUser(String.valueOf(renter),PRIVATE_MESSAGES,vehicleRent);
    }
}
