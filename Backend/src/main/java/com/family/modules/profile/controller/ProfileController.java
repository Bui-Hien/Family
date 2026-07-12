package com.family.modules.profile.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.modules.profile.dto.ProfileRequest;
import com.family.modules.profile.dto.ProfileResponse;
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
    public ResponseEntity<ApiResponse<List<ProfileResponse>>> getAll() {
        List<ProfileResponse> profiles = profileService.getAll().stream()
                .map(ProfileResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(profiles));
    }

    @PostMapping("/page")
    @PreAuthorize("hasAuthority('PROFILE_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<ProfileResponse>>> getPaged(@Valid @RequestBody PagingRequest request) {
        Page<Profile> page = profileService.getPaged(request);
        Page<ProfileResponse> dtoPage = page.map(ProfileResponse::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(dtoPage)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PROFILE_VIEW')")
    public ResponseEntity<ApiResponse<ProfileResponse>> getById(@PathVariable UUID id) {
        Profile profile = profileService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(ProfileResponse.fromEntity(profile)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PROFILE_CREATE')")
    public ResponseEntity<ApiResponse<ProfileResponse>> create(@Valid @RequestBody ProfileRequest request) {
        Profile profile = profileService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Profile created successfully", ProfileResponse.fromEntity(profile)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PROFILE_EDIT')")
    public ResponseEntity<ApiResponse<ProfileResponse>> update(@PathVariable UUID id, @Valid @RequestBody ProfileRequest request) {
        Profile profile = profileService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", ProfileResponse.fromEntity(profile)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PROFILE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        profileService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Profile deleted successfully", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PROFILE_VIEW')")
    public ResponseEntity<ApiResponse<List<ProfileResponse>>> search(@RequestParam String keyword) {
        List<ProfileResponse> profiles = profileService.search(keyword).stream()
                .map(ProfileResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(profiles));
    }
}
