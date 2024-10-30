package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.RentRequest;
import com.thesis.carrental.dtos.VehicleSaveResponse;
import com.thesis.carrental.dtos.VehicleUpdateRequest;
import com.thesis.carrental.dtos.VehicleUpdateResponse;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.filters.VehicleFilter;
import com.thesis.carrental.services.FileUploadService;
import com.thesis.carrental.services.JWTService;
import com.thesis.carrental.services.ParticipantService;
import com.thesis.carrental.services.RentedVehicleService;
import com.thesis.carrental.services.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

import static com.thesis.carrental.enums.FileUploadType.VEHICLE_PICTURE;

@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;

    private final JWTService jwtService;

    private final ParticipantService participantService;
    private final FileUploadService fileUploadService;

    private final RentedVehicleService rentedVehicleService;
    private final String VEHICLE_UPLOAD_PATH;

    @Autowired
    public VehicleController(
        final VehicleService vehicleService,
        final JWTService jwtService,
        final ParticipantService participantService,
        final FileUploadService fileUploadService,
        final RentedVehicleService rentedVehicleService,
        @Value("${fileupload.vehicles.dir}") final String path
    ) {
        this.vehicleService = vehicleService;
        this.jwtService = jwtService;
        this.participantService = participantService;
        this.fileUploadService = fileUploadService;
        this.rentedVehicleService = rentedVehicleService;
        this.VEHICLE_UPLOAD_PATH = path;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> fetch(@PathVariable("id") final String id) {
        try {
            return ResponseEntity.ok(vehicleService.find(Long.valueOf(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error in fetching vehicle, reason: " + e.getMessage());
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> filter(
        @RequestBody final VehicleFilter vehicleFilter,
        @RequestHeader(value = "Authorization", required = false) final String token
    ) {
        if (token != null) {
            final String login = jwtService.extractLogin(token.split(" ")[1]);
            return ResponseEntity.ok(vehicleService.filter(
                vehicleFilter,
                participantService.findParticipantByLogin(login)
            ));
        }
        return ResponseEntity.ok(vehicleService.filter(vehicleFilter));
    }

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VehicleSaveResponse> save(
        @RequestPart("vehicle") final Vehicle vehicle,
        @RequestPart("pictures") final MultipartFile[] pictures,
        @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            final String user = jwtService.extractLogin(authorizationHeader.split(" ")[1]);
            final Long id = participantService.findParticipantByLogin(user).getId();
            vehicleService.save(vehicle, id);
            if (vehicle.getId() > 0) {
                Arrays.stream(pictures)
                    .forEach(file -> fileUploadService.saveFile(vehicle.getId(), file, VEHICLE_PICTURE, VEHICLE_UPLOAD_PATH));
            }

            return ResponseEntity.ok(new VehicleSaveResponse("Vehicle saved successfully", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new VehicleSaveResponse(
                    "Failed to save vehicle, reason: " + e.getMessage(),
                    false
                ));
        }
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<VehicleUpdateResponse> updateStatus(
        @RequestBody final VehicleUpdateRequest request
    ) {
        try {
            vehicleService.updateStatus(request);
            return ResponseEntity.ok(new VehicleUpdateResponse(
                "Successfully updated status",
                true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new VehicleUpdateResponse("Failed to change status", false));
        }
    }

    @PostMapping("/rent")
    public ResponseEntity<?> rentVehicle(@RequestBody final RentRequest rentRequest){
        try{
            rentedVehicleService.save(rentRequest.conversationId(), rentRequest.vehicle(), rentRequest.renter());
            return ResponseEntity.ok(new VehicleSaveResponse("Vehicle successfully rented to user.",true));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new VehicleSaveResponse(e.getMessage(),false));
        }
    }
}
