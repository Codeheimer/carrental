package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c " +
        "JOIN c.participants p WHERE  p.participant.id = :participantId ")
    List<Conversation> findParticipantIncludedIn(@Param("participantId") final Long participantId);

    @Query("SELECT p.participant.id FROM Conversation c " +
        "JOIN c.participants p WHERE p.participant.id != :participantId " +
        "AND c IN (SELECT cp.conversation FROM ConversationParticipant cp WHERE cp.participant.id = :participantId)")
    List<Long> findOtherParticipantsThatIsInConversationWith(@Param("participantId") final Long participantId);
}
