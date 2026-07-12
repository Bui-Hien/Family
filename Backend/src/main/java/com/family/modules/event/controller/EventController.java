package com.family.modules.event.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.modules.event.dto.EventRequest;
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
    public ResponseEntity<ApiResponse<List<Event>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getAll()));
    }

    @PostMapping("/page")
    @PreAuthorize("hasAuthority('EVENT_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<Event>>> getPaged(@Valid @RequestBody PagingRequest request) {
        Page<Event> page = eventService.getPaged(request);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(page)));
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasAuthority('EVENT_VIEW')")
    public ResponseEntity<ApiResponse<List<Event>>> getUpcomingEvents() {
        return ResponseEntity.ok(ApiResponse.success(familyTreeEventsFallback()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_VIEW')")
    public ResponseEntity<ApiResponse<Event>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('EVENT_CREATE')")
    public ResponseEntity<ApiResponse<Event>> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", eventService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EVENT_EDIT')")
    public ResponseEntity<ApiResponse<Event>> update(@PathVariable UUID id, @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", eventService.update(id, request)));
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
