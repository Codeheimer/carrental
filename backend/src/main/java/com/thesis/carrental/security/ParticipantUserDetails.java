package com.thesis.carrental.security;

import com.thesis.carrental.entities.Participant;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ParticipantUserDetails implements UserDetails {

    private final String username;
    private final String password;

    private final boolean approved;

    private final boolean isDeactivated;
    private final List<GrantedAuthority> authorities;

    public ParticipantUserDetails(final Participant participant){
        this.username = participant.getEmail();
        this.password = participant.getPassword();
        this.isDeactivated = participant.isDeactived();
        this.approved = participant.isApproved();
        this.authorities = Stream.of(participant.getRoles().split(","))
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.isDeactivated;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return this.approved;
    }
}
