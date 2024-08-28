package com.thesis.carrental.services;

import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.repositories.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    @Autowired
    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public Participant addUser(final Participant participant){
        return participantRepository.save(participant);
    }

    public Participant findParticipantByLogin(final String login){
        return participantRepository.findByLogin(login).orElse(new Participant());
    }

}
