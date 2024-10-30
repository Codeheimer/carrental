package com.thesis.carrental.services;

import com.thesis.carrental.dtos.chat.ChatMessage;
import com.thesis.carrental.dtos.chat.ConversationResponse;
import com.thesis.carrental.dtos.chat.MessageResponse;
import com.thesis.carrental.entities.Conversation;
import com.thesis.carrental.entities.ConversationParticipant;
import com.thesis.carrental.entities.Message;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.enums.ChatMessageType;
import com.thesis.carrental.repositories.ConversationRepository;
import com.thesis.carrental.repositories.ParticipantRepository;
import com.thesis.carrental.repositories.VehicleRepository;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

import static com.thesis.carrental.enums.MessageType.CHAT;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;

    private final ParticipantRepository participantRepository;

    private final VehicleRepository vehicleRepository;

    private final LoginSessionService loginSessionService;

    @Autowired
    public ChatService(
        final ConversationRepository conversationRepository,
        final ParticipantRepository participantRepository,
        final VehicleRepository vehicleRepository,
        final LoginSessionService loginSessionService
    ) {
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
        this.vehicleRepository = vehicleRepository;
        this.loginSessionService = loginSessionService;
    }

    public List<Long> fetchConversationsParticipantIsIncludedIn(final Participant participant){
        return conversationRepository.findOtherParticipantsThatIsInConversationWith(participant.getId());
    }

    public List<ConversationResponse> fetchConversations(final String email) {
        final Participant participant = participantRepository.findByLogin(email).orElseThrow();
        return conversationRepository.findParticipantIncludedIn(participant.getId())
            .stream()
            .map(c-> toConversationResponse(participant.getId(), c.getVehicle()).apply(c))
            .toList();
    }

    private Participant getOtherParticipant(final Conversation c, final long theParticipantId){
        return c.getParticipants()
            .stream()
            .filter(p -> p.getParticipant().getId() != theParticipantId)
            .findFirst()
            .map(ConversationParticipant::getParticipant)
            .orElse(new Participant());
    }

    private Function<Conversation,ConversationResponse> toConversationResponse(final long recipientId, final Vehicle vehicle){
        return c -> {
            final Participant sendTo = getOtherParticipant(c,recipientId);
            final String displayName = sendTo.getDisplayName();
            final List<MessageResponse> messages = c.getMessages()
                .stream()
                .map(m -> new MessageResponse(
                    String.valueOf(m.getSender().getId()),
                    m.getContent(),
                    m.getChatMessageType()
                ))
                .toList();
            final Message lastMessage = c.getMessages().getLast();
            return new ConversationResponse(
                c.getId(),
                String.valueOf(sendTo.getId()),
                vehicle.getId(),
                displayName + " - "+vehicle.getTitle(),
                lastMessage.getContent(),
                false,
                messages,
                loginSessionService.isOnline(sendTo.getId())
            );
        };
    }

    @Transactional
    public ChatMessage processChat(final ChatMessage chatMessage) {
        final long recipientId = Long.parseLong(chatMessage.recipientId());
        final long senderId = Long.parseLong(chatMessage.senderId());
        final long vehicleId = chatMessage.vehicleId();
        final long conversationId =
            Long.parseLong(StringUtils.defaultIfEmpty(
                chatMessage.conversationId(),
                "0"
            ));
        boolean passConversation = false;

        final Participant recipient = participantRepository.findById(recipientId).orElseThrow();
        final Participant sender = participantRepository.findById(senderId).orElseThrow();
        final Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow();

        final Conversation conversation = conversationRepository.findById(conversationId)
            .orElse(new Conversation());
        final String content = chatMessage.message();
        if (conversationId == 0) {
            conversation.getParticipants()
                .add(new ConversationParticipant(conversation, recipient));
            conversation.getParticipants().add(new ConversationParticipant(conversation, sender));
            conversation.getMessages().add(new Message(conversation, sender, content, ChatMessageType.CHAT));
            conversation.setVehicle(vehicle);
            passConversation = true;
        } else {
            conversation.getMessages().add(new Message(conversation, sender, content,ChatMessageType.CHAT));
        }
        conversationRepository.save(conversation);

        final Participant otherParticipant = getOtherParticipant(conversation,recipientId);

        return new ChatMessage(
            content,
            chatMessage.timestamp(),
            chatMessage.recipientId(),
            chatMessage.senderId(),
            String.valueOf(conversation.getId()),
            conversation.getVehicle().getId(),
            passConversation ? toConversationResponse(recipientId,conversation.getVehicle()).apply(conversation) : null,
            CHAT,
            otherParticipant.getDisplayName()
        );
    }
}
