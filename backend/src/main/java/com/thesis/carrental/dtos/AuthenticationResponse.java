package com.thesis.carrental.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthenticationResponse(
    String id,
    String token,
    String message
) {
}
