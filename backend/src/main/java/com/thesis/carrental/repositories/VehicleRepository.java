package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v " +
        "WHERE :make = v.make " +
        "AND ( :model IS NULL OR :model = v.model) " +
        "AND ( :year IS NULL OR :year = v.year) " +
        "AND ( :engineDisplacement IS NULL OR :engineDisplacement = v.engineDisplacement) " +
        "AND ( :seater is NULL OR :seater = v.seater ) ")
    List<Vehicle> filter(
        @Param("make") final String make,
        @Param("model") final String model,
        @Param("year") final String year,
        @Param("engineDisplacement") final String engineDisplacement,
        @Param("seater") final Integer seater
    );

}
