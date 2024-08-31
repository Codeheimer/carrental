package com.thesis.carrental.dtos;

public record TokenVerifyResponse(
    boolean isValid,
    String message
) {
}
