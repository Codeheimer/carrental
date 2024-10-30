package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.RentedVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentedVehicleRepository extends JpaRepository<RentedVehicle,Long> {
}
