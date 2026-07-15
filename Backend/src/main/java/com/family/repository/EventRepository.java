package com.family.repository;

import com.family.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID>, JpaSpecificationExecutor<Event> {

    List<Event> findByEventDateAfterAndDeletedFalseOrderByEventDateAsc(LocalDateTime dateTime);

    List<Event> findByDeletedFalse();
}
