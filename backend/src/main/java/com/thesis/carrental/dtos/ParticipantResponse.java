package com.thesis.carrental.dtos;

public record ParticipantResponse(
    String id,
    String firstName,
    String lastName,
    String birthdate,
    String gender,
    String address,
    String phoneNumber,
    String email
) {
}
