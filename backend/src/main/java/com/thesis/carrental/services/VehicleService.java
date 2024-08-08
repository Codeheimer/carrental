package com.thesis.carrental.services;

import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.filters.VehicleFilter;
import com.thesis.carrental.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> filter(final VehicleFilter filter) {
        return vehicleRepository.filter(
            filter.make(),
            filter.model(),
            filter.year(),
            filter.engineDisplacement(),
            filter.seater()
        );
    }

    public Vehicle save(final Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
}
