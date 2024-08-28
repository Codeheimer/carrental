package com.thesis.carrental.services;

import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.repositories.ParticipantRepository;
import com.thesis.carrental.security.ParticipantUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ParticipantUserDetailsService implements UserDetailsService {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Participant> participant = participantRepository.findByLogin(username);

        return participant.map(ParticipantUserDetails::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public String addUser(Participant participant) {
        participant.setPassword(encoder.encode(participant.getPassword()));
        participantRepository.save(participant);
        return "User Added Successfully";
    }
}
