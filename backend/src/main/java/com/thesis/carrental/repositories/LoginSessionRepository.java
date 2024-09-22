package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.LoginSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginSessionRepository extends JpaRepository<LoginSession, Long> {

    @Query("SELECT ls FROM LoginSession ls WHERE ls.participantId = :participantId ")
    Optional<LoginSession> findByParticipantId(@Param("participantId") long participantId);
}
