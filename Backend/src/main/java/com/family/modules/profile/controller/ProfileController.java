package com.family.modules.profile.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.modules.profile.dto.ProfileRequest;
import com.family.modules.profile.entity.Profile;
import com.family.modules.profile.service.ProfileService;
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
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @PreAuthorize("hasAuthority('PROFILE_VIEW')")
    public ResponseEntity<ApiResponse<List<Profile>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(profileService.getAll()));
    }

    @PostMapping("/page")
    @PreAuthorize("hasAuthority('PROFILE_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<Profile>>> getPaged(@Valid @RequestBody PagingRequest request) {
        Page<Profile> page = profileService.getPaged(request);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(page)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PROFILE_VIEW')")
    public ResponseEntity<ApiResponse<Profile>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(profileService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PROFILE_CREATE')")
    public ResponseEntity<ApiResponse<Profile>> create(@Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Profile created successfully", profileService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PROFILE_EDIT')")
    public ResponseEntity<ApiResponse<Profile>> update(@PathVariable UUID id, @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profileService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PROFILE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        profileService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Profile deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PROFILE_VIEW')")
    public ResponseEntity<ApiResponse<List<Profile>>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(profileService.search(keyword)));
    }
}
