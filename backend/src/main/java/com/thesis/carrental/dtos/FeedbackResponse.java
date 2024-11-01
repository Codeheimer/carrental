package com.thesis.carrental.dtos;

public record FeedbackResponse(
    long id,
    int rate,
    String comment,
    String commenter
) {
}
