package com.thesis.carrental.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thesis.carrental.enums.ParticipantRoles;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TokenVerifyResponse(
    boolean isValid,
    Long id,
    String message,
    boolean admin,

    List<ParticipantRoles> roles,

    String displayName
) {
}
