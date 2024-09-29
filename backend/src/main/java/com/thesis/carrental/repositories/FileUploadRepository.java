package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.FileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {

    @Query(" SELECT fu FROM FileUpload fu WHERE fu.participantId IN (:ids) ")
    List<FileUpload> findByParticipantIds(@Param("ids") final List<Long> ids);
}
