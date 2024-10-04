package com.thesis.carrental.services;

import com.thesis.carrental.dtos.chat.ChatMessage;
import com.thesis.carrental.dtos.chat.ConversationResponse;
import com.thesis.carrental.dtos.chat.MessageResponse;
import com.thesis.carrental.entities.Conversation;
import com.thesis.carrental.entities.ConversationParticipant;
import com.thesis.carrental.entities.Message;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.repositories.ConversationRepository;
import com.thesis.carrental.repositories.ParticipantRepository;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;

    private final ParticipantRepository participantRepository;

    @Autowired
    public ChatService(
        ConversationRepository conversationRepository,
        ParticipantRepository participantRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
    }

    public List<ConversationResponse> fetchConversations(final String email) {
        final Participant participant = participantRepository.findByLogin(email).orElseThrow();
        return conversationRepository.findParticipantIncludedIn(participant.getId())
            .stream()
            .map(toConversationResponse(participant.getId()))
            .toList();
    }

    private Function<Conversation,ConversationResponse> toConversationResponse(final long recipientId){
        return c -> {
            final Optional<Participant> otherParticipant = c.getParticipants()
                .stream()
                .filter(p -> p.getParticipant().getId() != recipientId)
                .findFirst()
                .map(ConversationParticipant::getParticipant);
            otherParticipant.orElseThrow();
            final Participant sendTo = otherParticipant.get();
            final String displayName = sendTo.getDisplayName();
            final List<MessageResponse> messages = c.getMessages()
                .stream()
                .map(m -> new MessageResponse(
                    String.valueOf(m.getSender().getId()),
                    m.getContent()
                ))
                .toList();
            final Message lastMessage = c.getMessages().getLast();
            return new ConversationResponse(
                c.getId(),
                String.valueOf(sendTo.getId()),
                displayName,
                lastMessage.getContent(),
                false,
                messages
            );
        };
    }

    @Transactional
    public ChatMessage processChat(final ChatMessage chatMessage) {
        final long recipientId = Long.parseLong(chatMessage.recipientId());
        final long senderId = Long.parseLong(chatMessage.senderId());
        final long conversationId =
            Long.parseLong(StringUtils.defaultIfEmpty(
                chatMessage.conversationId(),
                "0"
            ));
        boolean passConversation = false;

        final Participant recipient = participantRepository.findById(recipientId).orElseThrow();
        final Participant sender = participantRepository.findById(senderId).orElseThrow();

        final Conversation conversation = conversationRepository.findById(conversationId)
            .orElse(new Conversation());
        final String content = HtmlUtils.htmlEscape(chatMessage.message());
        if (conversationId == 0) {
            conversation.getParticipants()
                .add(new ConversationParticipant(conversation, recipient));
            conversation.getParticipants().add(new ConversationParticipant(conversation, sender));
            conversation.getMessages().add(new Message(conversation, sender, content));
            passConversation = true;
        } else {
            conversation.getMessages().add(new Message(conversation, sender, content));
        }
        conversationRepository.save(conversation);

        return new ChatMessage(
            content,
            chatMessage.timestamp(),
            chatMessage.recipientId(),
            chatMessage.senderId(),
            String.valueOf(conversation.getId()),
            passConversation ? toConversationResponse(recipientId).apply(conversation) : null
        );
    }
}
