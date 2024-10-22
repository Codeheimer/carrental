package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.ParticipantResponse;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.services.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.thesis.carrental.utils.DisplayUtil.formatDate;

@RestController
@RequestMapping("/user")
public class ParticipantController extends BaseController {

    private final ParticipantService participantService;

    @Autowired
    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> fetchParticipant(@PathVariable("userId") final Long userId){
        return ResponseEntity.ok(toResponse(participantService.findById(userId)));
    }

    private ParticipantResponse toResponse(final Participant participant){
        return new ParticipantResponse(
            String.valueOf(participant.getId()),
            participant.getFirstName(),
            participant.getLastName(),
            formatDate(participant.getBirthdate()),
            participant.getGender(),
            participant.getAddress(),
            participant.getPhoneNumber(),
            participant.getEmail());
    }
}
