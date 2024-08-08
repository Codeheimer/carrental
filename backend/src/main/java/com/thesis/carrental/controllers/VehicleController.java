package com.thesis.carrental.controllers;

import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.filters.VehicleFilter;
import com.thesis.carrental.services.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {

    private VehicleService vehicleService;

    @GetMapping("/")
    public ResponseEntity<?> fetch(final VehicleFilter vehicleFilter){
        return ResponseEntity.ok(vehicleService.filter(vehicleFilter));
    }

    @PostMapping("/")
    public ResponseEntity<?> save(final Vehicle vehicle){
        vehicleService.save(vehicle);
        return ResponseEntity.ok().build();
    }
}
