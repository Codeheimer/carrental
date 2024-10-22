package com.thesis.carrental.dtos;

public record UserResponse(
    long id,
    String name,
    String status,
    String uploadedId,
    String uploadedBusinessPermit,
    String profilePicture
) {
}
