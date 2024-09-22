package com.thesis.carrental.services;

import com.thesis.carrental.dtos.ChatMessage;
import com.thesis.carrental.dtos.ConversationResponse;
import com.thesis.carrental.dtos.MessageResponse;
import com.thesis.carrental.entities.Conversation;
import com.thesis.carrental.entities.Message;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.repositories.ConversationRepository;
import com.thesis.carrental.repositories.MessageRepository;
import com.thesis.carrental.repositories.ParticipantRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    private final ParticipantRepository participantRepository;

    @Autowired
    public ChatService(
        ConversationRepository conversationRepository,
        MessageRepository messageRepository, ParticipantRepository participantRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.participantRepository = participantRepository;
    }

    public List<ConversationResponse> fetchConversations(final String email) {
        if (StringUtils.isNotEmpty(email)) {
            final Participant participant = participantRepository.findByLogin(email).orElse(new Participant());

            if(participant.getId() > 0){
                return conversationRepository.findConversationsOwnerIsIn(participant.getId())
                    .stream()
                    .map(conversation -> {
                        if(conversation.getOther() == participant.getId()){
                            return toOtherResponse(conversation);
                        }
                        return toResponse(conversation);
                    })
                    .toList();
            }
        }
        return Collections.emptyList();
    }

    private void updateUnreadStatus(final long recipientId, final Conversation conversation){
        if(recipientId == conversation.getOther()){
            conversation.setOwnerUnread(false);
            conversation.setOtherUnread(true);
        }else if(recipientId == conversation.getOwner()){
            conversation.setOtherUnread(false);
            conversation.setOwnerUnread(true);
        }
    }

    public ChatMessage saveChat(final ChatMessage chatMessage) {
        final long recipientId = Long.parseLong(chatMessage.recipientId());
        final long senderId = Long.parseLong(chatMessage.senderId());
        final Conversation conversation = conversationRepository
            .findByOwnerAndOther(senderId, recipientId)
            .orElse(new Conversation(senderId, recipientId));
        boolean isNewConversation = conversation.getId() == 0;
        if(isNewConversation){
            conversation.setOtherUnread(true);
        }else{
            updateUnreadStatus(recipientId,conversation);
        }
        conversationRepository.save(conversation);

        messageRepository.save(new Message(
            senderId,
            recipientId,
            conversation.getId(),
            chatMessage.message()
        ));

        if(isNewConversation){
            return new ChatMessage(
                chatMessage.message(),
                chatMessage.timestamp(),
                chatMessage.recipientId(),
                chatMessage.senderId(),
                String.valueOf(conversation.getId()),
                toOtherResponse(conversation));
        }
        return new ChatMessage(
            chatMessage.message(),
            chatMessage.timestamp(),
            chatMessage.recipientId(),
            chatMessage.senderId(),
            String.valueOf(conversation.getId()),
            null);
    }

    private ConversationResponse toResponse(final Conversation conversation) {
        final Participant participant = participantRepository.findById(conversation.getOther())
            .orElse(new Participant());

        final Message lastMessage = fetchLastMessage(conversation);
        return new ConversationResponse(
            conversation.getId(),
            conversation.getOther(),
            participant.getDisplayName(),
            lastMessage.getMessage(),
            lastMessage.getCreationDate(),
            conversation.isOwnerUnread(),
            fetchMessages(conversation).stream().map(message -> toMessageResponse(message,conversation)).collect(Collectors.toList()));
    }

    private ConversationResponse toOtherResponse(final Conversation conversation){
        final Participant participant = participantRepository.findById(conversation.getOwner())
            .orElse(new Participant());
        final Message lastMessage = fetchLastMessage(conversation);

        return new ConversationResponse(
            conversation.getId(),
            conversation.getOwner(),
            participant.getDisplayName(),
            lastMessage.getMessage(),
            lastMessage.getCreationDate(),
            conversation.isOtherUnread(),
            fetchMessages(conversation).stream().map(message -> toMessageResponse(message,conversation)).collect(
                Collectors.toList()));
    }

    public Message fetchLastMessage(final Conversation conversation) {
        return messageRepository.findLastMessageByConversation(conversation.getId());
    }

    public List<Message> fetchMessages(final Conversation conversation) {
        return messageRepository.findMessagesByConversationId(conversation.getId());
    }

    private MessageResponse toMessageResponse(final Message message,final Conversation conversation) {
        return new MessageResponse(conversation.getId(),message.getReceiverId(),message.getSenderId(),message.getMessage(),
            new SimpleDateFormat("yyyy-MM-dd").format(Date.from(message.getCreationDate())));
    }
}
