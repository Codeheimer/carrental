package com.thesis.carrental.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message extends PersistentEntity {

    @Column(name = "conversation_id")
    private long conversationId;

    private String message;

    @Column(name = "sender_id")
    private long senderId;

    @Column(name = "receiver_id")
    private long receiverId;

    private Message() {
    }

    public Message(
        final long senderId,
        final long receiverId,
        final long conversationId,
        final String message
    ) {
        this.conversationId = conversationId;
        this.message = message;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    public long getConversationId() {
        return conversationId;
    }

    public void setConversationId(final long conversationId) {
        this.conversationId = conversationId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public long getSenderId() {
        return senderId;
    }

    public void setSenderId(final long senderId) {
        this.senderId = senderId;
    }

    public long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(final long receiverId) {
        this.receiverId = receiverId;
    }
}
