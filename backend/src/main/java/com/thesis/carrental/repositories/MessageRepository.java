package com.thesis.carrental.repositories;

import com.thesis.carrental.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m where m.conversationId = :conversationId ORDER BY m.creationDate DESC LIMIT 1 ")
    Message findLastMessageByConversation(@Param("conversationId") final Long conversationId);

    @Query("SELECT m FROM Message m where m.conversationId = :conversationId ORDER BY m.creationDate ")
    List<Message> findMessagesByConversationId(@Param("conversationId") final Long conversationId);
}
