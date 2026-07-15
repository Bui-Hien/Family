package com.family.service.impl;

import com.family.common.dto.PagingRequest;
import com.family.common.exception.ResourceNotFoundException;
import com.family.dto.request.EventRequest;
import com.family.entity.Event;
import com.family.repository.EventRepository;
import com.family.service.EventService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public Event getById(UUID id) {
        return eventRepository.findById(id)
                .filter(e -> !e.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getAll() {
        return eventRepository.findByDeletedFalse();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> getPaged(PagingRequest request) {
        Specification<Event> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));
            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String likePattern = "%" + request.getKeyword().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), likePattern),
                        cb.like(cb.lower(root.get("location")), likePattern)
                ));
            }
            if (request.getStatus() != null && !request.getStatus().trim().isEmpty() && !"ALL".equalsIgnoreCase(request.getStatus())) {
                try {
                    com.family.common.enums.StatusEnum statusEnum = com.family.common.enums.StatusEnum.valueOf(request.getStatus());
                    predicates.add(cb.equal(root.get("status"), statusEnum));
                } catch (IllegalArgumentException e) {
                    // Ignore invalid status
                }
            }
            if (request.getAnnual() != null && !request.getAnnual().trim().isEmpty() && !"ALL".equalsIgnoreCase(request.getAnnual())) {
                boolean isAnnual = "YES".equalsIgnoreCase(request.getAnnual()) || "TRUE".equalsIgnoreCase(request.getAnnual());
                predicates.add(cb.equal(root.get("annual"), isAnnual));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return eventRepository.findAll(spec, request.toPageable());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfterAndDeletedFalseOrderByEventDateAsc(LocalDateTime.now());
    }

    @Override
    @Transactional
    public Event create(EventRequest request) {
        Event event = new Event();
        copyProperties(request, event);
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event update(UUID id, EventRequest request) {
        Event event = getById(id);
        copyProperties(request, event);
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Event event = getById(id);
        event.setDeleted(true);
        eventRepository.save(event);
    }

    private void copyProperties(EventRequest request, Event event) {
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setEndDate(request.getEndDate());
        event.setLocation(request.getLocation());
        event.setAnnual(request.getAnnual());
        event.setStatus(request.getStatus());
    }
}
