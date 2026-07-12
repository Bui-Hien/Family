package com.family.modules.event.service;

import com.family.common.dto.PagingRequest;
import com.family.modules.event.dto.EventRequest;
import com.family.modules.event.entity.Event;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface EventService {
    Event getById(UUID id);
    List<Event> getAll();
    Page<Event> getPaged(PagingRequest request);
    List<Event> getUpcomingEvents();
    Event create(EventRequest request);
    Event update(UUID id, EventRequest request);
    void delete(UUID id);
}
