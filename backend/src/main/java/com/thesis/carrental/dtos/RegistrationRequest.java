package com.thesis.carrental.dtos;

import com.thesis.carrental.entities.Participant;

import java.time.Instant;

public record RegistrationRequest(
    String firstName,
    String lastName,
    Instant birthdate,
    String gender,
    String region,
    String province,
    String municipality,
    String barangay,
    String address,
    String phoneNumber,
    String email,

    String password,

    String passwordAgain,
    boolean businessOwner
) {

    public Participant toParticipant() {
        final Participant participant = new Participant();
        participant.setFirstName(this.firstName);
        participant.setLastName(this.lastName);
        participant.setBirthdate(this.birthdate);
        participant.setGender(this.gender);
        participant.setAddress(this.address);
        participant.setPhoneNumber(this.phoneNumber);
        participant.setEmail(this.email);
        participant.setPassword(this.password);
        return participant;
    }
}
