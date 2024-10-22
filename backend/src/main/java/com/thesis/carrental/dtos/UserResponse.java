package com.thesis.carrental.dtos;

import com.thesis.carrental.enums.ParticipantStatus;

public record UserResponse(
    long id,
    String name,
    ParticipantStatus status,
    String uploadedId,
    String uploadedBusinessPermit,
    String profilePicture,
    boolean deactivated
) {
}
