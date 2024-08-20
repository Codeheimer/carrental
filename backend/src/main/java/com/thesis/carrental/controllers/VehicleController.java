package com.thesis.carrental.controllers;

import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.filters.VehicleFilter;
import com.thesis.carrental.services.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(final VehicleService vehicleService){
        this.vehicleService = vehicleService;
    }

    @GetMapping("/")
    public ResponseEntity<?> fetch(final VehicleFilter vehicleFilter) {
        return ResponseEntity.ok(vehicleService.filter(vehicleFilter));
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody final Vehicle vehicle) {
        final Vehicle saved = vehicleService.save(vehicle);
        return ResponseEntity.ok(saved);
    }
}
