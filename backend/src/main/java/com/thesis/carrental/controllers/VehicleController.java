package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.VehicleSaveResponse;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.filters.VehicleFilter;
import com.thesis.carrental.services.JWTService;
import com.thesis.carrental.services.ParticipantService;
import com.thesis.carrental.services.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;

    private final JWTService jwtService;

    private final ParticipantService participantService;

    @Autowired
    public VehicleController(final VehicleService vehicleService, JWTService jwtService,
        ParticipantService participantService
    ){
        this.vehicleService = vehicleService;
        this.jwtService = jwtService;
        this.participantService = participantService;
    }

    @GetMapping("/")
    public ResponseEntity<?> fetch(final VehicleFilter vehicleFilter) {
        return ResponseEntity.ok(vehicleService.filter(vehicleFilter));
    }

    @PostMapping("/save")
    public ResponseEntity<VehicleSaveResponse> save(@RequestBody final Vehicle vehicle, @RequestHeader("Authorization") String authorizationHeader) {
        try{
            final String user = jwtService.extractLogin(authorizationHeader.split(" ")[1]);
            final Long id = participantService.findParticipantByLogin(user).getId();
            vehicleService.save(vehicle,id);

            return ResponseEntity.ok(new VehicleSaveResponse("Vehicle saved successfully"));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new VehicleSaveResponse("Failed to save vehicle, reason: "+e.getMessage()));
        }
    }
}
