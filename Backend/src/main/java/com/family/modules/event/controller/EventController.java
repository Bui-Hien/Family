package com.family.modules.event.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.modules.event.dto.EventRequest;
import com.family.modules.event.dto.EventResponse;
import com.family.modules.event.entity.Event;
import com.family.modules.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    @PreAuthorize("hasAuthority('EVENT_VIEW')")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAll() {
        List<EventResponse> events = eventService.getAll().stream()
                .map(EventResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @PostMapping("/page")
    @PreAuthorize("hasAuthority('EVENT_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<EventResponse>>> getPaged(@Valid @RequestBody PagingRequest request) {
        Page<Event> page = eventService.getPaged(request);
        Page<EventResponse> dtoPage = page.map(EventResponse::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(dtoPage)));
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasAuthority('EVENT_VIEW')")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getUpcomingEvents() {
        List<EventResponse> events = familyTreeEventsFallback().stream()
                .map(EventResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_VIEW')")
    public ResponseEntity<ApiResponse<EventResponse>> getById(@PathVariable UUID id) {
        Event event = eventService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(EventResponse.fromEntity(event)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('EVENT_CREATE')")
    public ResponseEntity<ApiResponse<EventResponse>> create(@Valid @RequestBody EventRequest request) {
        Event event = eventService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", EventResponse.fromEntity(event)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_EDIT')")
    public ResponseEntity<ApiResponse<EventResponse>> update(@PathVariable UUID id, @Valid @RequestBody EventRequest request) {
        Event event = eventService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", EventResponse.fromEntity(event)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        eventService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }

    private List<Event> familyTreeEventsFallback() {
        return eventService.getUpcomingEvents();
    }
}
