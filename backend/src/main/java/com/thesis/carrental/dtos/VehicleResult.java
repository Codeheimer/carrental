package com.thesis.carrental.dtos;

public record VehicleResult(
    long id,
    String make,
    String model,
    String year,
    String engineDisplacement,
    int seater,
    String title,
    String description,
    String plateNumber,
    String ownerId,
    String owner,
    String age,
    String status
) {
}
