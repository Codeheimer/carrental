package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.RentedVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RentedVehicleRepository extends JpaRepository<RentedVehicle,Long> {

    @Query("SELECT rv FROM RentedVehicle rv WHERE rv.vehicle.id = :vehicleId ")
    RentedVehicle findByVehicle(@Param("vehicleId")final Long vehicleId);
}
