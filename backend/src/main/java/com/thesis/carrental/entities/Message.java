package com.thesis.carrental.entities;

import com.thesis.carrental.enums.ChatMessageType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message extends PersistentEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private Participant sender;

    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ChatMessageType chatMessageType;

    private Message(){}

    public Message(final Conversation conversation, final Participant sender, final String content,final ChatMessageType chatMessageType){
        this.conversation = conversation;
        this.sender = sender;
        this.content = content;
        this.chatMessageType = chatMessageType;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(final Conversation conversation) {
        this.conversation = conversation;
    }

    public Participant getSender() {
        return sender;
    }

    public void setSender(final Participant sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(final String content) {
        this.content = content;
    }

    public ChatMessageType getChatMessageType() {
        return chatMessageType;
    }

    public void setChatMessageType(final ChatMessageType chatMessageType) {
        this.chatMessageType = chatMessageType;
    }
}
