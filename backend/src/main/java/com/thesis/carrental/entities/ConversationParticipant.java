package com.thesis.carrental.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "conversation_participants")
public class ConversationParticipant extends PersistentEntity {

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false, updatable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "participant_id", nullable = false, updatable = false)
    private Participant participant;

    private ConversationParticipant() {
    }

    public ConversationParticipant(final Conversation conversation, final Participant participant){
        this.conversation = conversation;
        this.participant = participant;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(final Conversation conversation) {
        this.conversation = conversation;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(final Participant participant) {
        this.participant = participant;
    }

}
