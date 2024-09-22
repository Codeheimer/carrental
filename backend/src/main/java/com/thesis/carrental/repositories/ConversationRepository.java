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

    @Query("SELECT c FROM Conversation c WHERE (c.owner = :ownerId) OR (c.other = :ownerId) ")
    List<Conversation> findConversationsOwnerIsIn(@Param("ownerId")final long ownerId);

    @Query("SELECT c FROM Conversation c WHERE " +
        "(c.owner = :ownerId and c.other = :otherId) OR " +
        "(c.other = :ownerId and c.owner = :otherId) ")
    Optional<Conversation> findByOwnerAndOther(@Param("ownerId")final long ownerId, final long otherId);
}
