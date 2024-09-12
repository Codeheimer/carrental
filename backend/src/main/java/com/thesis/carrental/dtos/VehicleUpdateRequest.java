package com.thesis.carrental.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thesis.carrental.enums.VehicleStatus;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record VehicleUpdateRequest(
    Long vehicleId,

    VehicleStatus status
) {
}
