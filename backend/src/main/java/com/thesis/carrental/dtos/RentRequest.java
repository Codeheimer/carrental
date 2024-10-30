package com.thesis.carrental.dtos;

public record RentRequest(
    Long vehicle,
    Long renter,
    Long conversationId
) {
}
