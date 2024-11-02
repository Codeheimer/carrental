package com.thesis.carrental.dtos;

import com.thesis.carrental.enums.ParticipantRoles;

import java.util.List;

public class AuthenticationResponse extends AbstractResponse {

    private String id;
    private String token;
    private boolean admin;
    private List<ParticipantRoles> roles;
    private String displayName;

    public AuthenticationResponse(
        final String id,
        final String token,
        final boolean admin,
        final List<ParticipantRoles> roles,
        final String displayName,
        final boolean success,
        final String message
    ) {
        super(message, success);
        this.id = id;
        this.token = token;
        this.admin = admin;
        this.roles = roles;
        this.displayName = displayName;
    }

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(final String token) {
        this.token = token;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(final boolean admin) {
        this.admin = admin;
    }

    public List<ParticipantRoles> getRoles() {
        return roles;
    }

    public void setRoles(final List<ParticipantRoles> roles) {
        this.roles = roles;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(final String displayName) {
        this.displayName = displayName;
    }
}
