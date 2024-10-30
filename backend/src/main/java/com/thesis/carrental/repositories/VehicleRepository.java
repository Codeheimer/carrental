package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("""
            SELECT v FROM Vehicle v 
            WHERE 1=1
            
            AND (:make IS NULL OR LOWER(v.make) LIKE LOWER(CONCAT(:make, '%')))
            
            AND (:model IS NULL OR LOWER(v.model) LIKE LOWER(CONCAT(:model, '%')))
            
            AND (:year IS NULL OR v.year = :year)
            
            AND (:engineDisplacement IS NULL OR v.engineDisplacement = :engineDisplacement)
            
            AND (:seater IS NULL OR v.seater = :seater)
            
            AND (v.status NOT IN ('MAINTENANCE', 'RENTED'))
            
            AND (:search IS NULL OR 
                LOWER(v.make) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(v.model) LIKE LOWER(CONCAT('%', :search, '%')) OR
                CAST(v.year AS string) LIKE CONCAT('%', :search, '%') OR
                CAST(v.engineDisplacement AS string) LIKE CONCAT('%', :search, '%') OR
                CAST(v.seater AS string) LIKE CONCAT('%', :search, '%')
            )
        """)
    Page<Vehicle> filter(
        @Param("search") final String search,
        @Param("make") final String make,
        @Param("model") final String model,
        @Param("year") final String year,
        @Param("engineDisplacement") final String engineDisplacement,
        @Param("seater") final Integer seater,
        Pageable pageable
    );

    @Query("SELECT v FROM Vehicle v WHERE :owner = v.owner ")
    Page<Vehicle> byOwner(@Param("owner") final Long owner, Pageable pageable);

    @Query("SELECT v FROM Vehicle v LEFT JOIN RentedVehicle rv ON rv.vehicle = v WHERE rv.participant.id = :renterId")
    Page<Vehicle> byRenter(@Param("renterId") final Long renterId, Pageable pageable);
}
