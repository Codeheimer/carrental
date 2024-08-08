package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.LookUp;
import com.thesis.carrental.enums.LookUpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LookUpRepository extends JpaRepository<LookUp, Long> {

    @Query("SELECT lu FROM LookUp lu WHERE lu.type IN :types")
    List<LookUp> byLookUpType(@Param("types") final List<LookUpType> types);

}
