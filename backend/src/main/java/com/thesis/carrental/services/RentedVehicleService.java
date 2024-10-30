package com.thesis.carrental.services;

import com.thesis.carrental.controllers.WebsocketController;
import com.thesis.carrental.entities.RentedVehicle;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.enums.VehicleStatus;
import com.thesis.carrental.exceptions.RentVehicleException;
import com.thesis.carrental.repositories.ParticipantRepository;
import com.thesis.carrental.repositories.RentedVehicleRepository;
import com.thesis.carrental.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.thesis.carrental.enums.VehicleStatus.*;

@Service
public class RentedVehicleService {

    @Autowired
    private RentedVehicleRepository rentedVehicleRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private WebsocketController websocketController;

    public void save(final Long conversationId, final Long vehicleId, final Long renterId) {
        final RentedVehicle rentedVehicle = new RentedVehicle();
        final Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow();

        if(!vehicle.getStatus().equals(AVAILABLE)){
            throw new RentVehicleException("Vehicle is not available for rent.");
        }
        vehicle.setStatus(RENTED);
        rentedVehicle.setVehicle(vehicle);
        rentedVehicle.setParticipant(participantRepository.findById(renterId).orElseThrow());
        rentedVehicleRepository.save(rentedVehicle);

        if (rentedVehicle.getId() > 0) {
            websocketController.broadcastVehicleRent(conversationId, vehicle, vehicle.getOwner(), renterId);
        }
    }
}
