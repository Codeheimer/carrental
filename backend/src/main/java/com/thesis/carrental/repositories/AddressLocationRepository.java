package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.AddressLocation;
import com.thesis.carrental.enums.AddressLocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressLocationRepository extends JpaRepository<AddressLocation, Long> {

    @Query("SELECT al FROM AddressLocation al WHERE al.type = :type ")
    List<AddressLocation> fetchByType(@Param("type") final AddressLocationType type);

    @Query(
        "SELECT al FROM AddressLocation al WHERE al.parent.name = :name AND al.parent.type = " +
            ":parentType AND al.type = :type ")
    List<AddressLocation> fetchByParentTypeParentNameAndType(
        @Param("type") final AddressLocationType type,
        @Param("parentType") final AddressLocationType parentType,
        @Param("name") final String name
    );

    @Query("SELECT al FROM AddressLocation al WHERE al.name = :name AND (:parent is NULL AND al.parent IS NULL OR al.parent = :parent) ")
    AddressLocation findByNameAndParent(
        @Param("name") final String name,
        @Param("parent") final AddressLocation parent
    );
}
