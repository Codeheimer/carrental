package com.thesis.carrental.services;

import com.thesis.carrental.entities.LoginSession;
import com.thesis.carrental.repositories.LoginSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginSessionService {

    private final LoginSessionRepository loginSessionRepository;

    @Autowired
    public LoginSessionService(LoginSessionRepository loginSessionRepository) {
        this.loginSessionRepository = loginSessionRepository;
    }

    public void saveSession(final long participantId, final String token) {
        if (!isOnline(participantId)) {
            loginSessionRepository.save(new LoginSession(participantId, token));
        }
    }

    public void deleteSession(final long participantId) {
        final LoginSession loginSession = loginSessionRepository.findByParticipantId(participantId)
            .orElse(new LoginSession());
        if (loginSession.getId() > 0) {
            loginSessionRepository.delete(loginSession);
        }
    }

    public boolean isOnline(final long participantId) {
        return loginSessionRepository.findByParticipantId(participantId).isPresent();
    }

    public void evictAll() {
        loginSessionRepository.findAll().forEach(loginSessionRepository::delete);
    }
}
