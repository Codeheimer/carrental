package com.thesis.carrental.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "login_sessions")
public class LoginSession extends PersistentEntity {

    private long participantId;
    private String token;

    public LoginSession() {
    }

    public LoginSession(final long participantId, final String token) {
        this.participantId = participantId;
        this.token = token;
    }

    public long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(final long participantId) {
        this.participantId = participantId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(final String token) {
        this.token = token;
    }
}
