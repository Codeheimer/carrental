package com.thesis.carrental.filters;

public record VehicleFilter(
    String make,
    String model,
    String year,
    String engineDisplacement,
    Integer seater
) {}
