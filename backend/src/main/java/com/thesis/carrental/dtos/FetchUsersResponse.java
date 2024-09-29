package com.thesis.carrental.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record FetchUsersResponse(
    boolean success,
    String message,
    List<UserResponse> users) {
}
