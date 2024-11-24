package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.FileUpload;
import com.thesis.carrental.enums.FileUploadType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {

    @Query(" SELECT fu FROM FileUpload fu WHERE fu.ownerId IN (:ids) and fu.type IN (:types) ")
    List<FileUpload> findByOwnerIds(
        @Param("ids") final List<Long> ids,
        @Param("types") final List<FileUploadType> types
    );
}
