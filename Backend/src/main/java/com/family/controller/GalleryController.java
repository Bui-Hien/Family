package com.family.controller;

import com.family.common.dto.ApiResponse;
import com.family.dto.response.GalleryResponse;
import com.family.dto.response.MediaResponse;
import com.family.entity.Gallery;
import com.family.entity.Media;
import com.family.service.GalleryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping("/galleries")
    @PreAuthorize("hasAuthority('GALLERY_VIEW')")
    public ResponseEntity<ApiResponse<List<GalleryResponse>>> getAll() {
        List<GalleryResponse> galleries = galleryService.getAll().stream()
                .map(GalleryResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(galleries));
    }

    @GetMapping("/galleries/{id}")
    @PreAuthorize("hasAuthority('GALLERY_VIEW')")
    public ResponseEntity<ApiResponse<GalleryResponse>> getById(@PathVariable UUID id) {
        Gallery gallery = galleryService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(GalleryResponse.fromEntity(gallery)));
    }

    @GetMapping("/galleries/{id}/media")
    @PreAuthorize("hasAuthority('GALLERY_VIEW')")
    public ResponseEntity<ApiResponse<List<MediaResponse>>> getMedia(@PathVariable UUID id) {
        List<MediaResponse> mediaList = galleryService.getMediaByGalleryId(id).stream()
                .map(MediaResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(mediaList));
    }

    @PostMapping("/galleries")
    @PreAuthorize("hasAuthority('GALLERY_CREATE')")
    public ResponseEntity<ApiResponse<GalleryResponse>> create(@Valid @RequestBody Gallery gallery) {
        Gallery created = galleryService.create(gallery);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Gallery created successfully", GalleryResponse.fromEntity(created)));
    }

    @PostMapping(value = "/galleries/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('GALLERY_UPLOAD')")
    public ResponseEntity<ApiResponse<MediaResponse>> uploadMedia(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file
    ) {
        Media uploaded = galleryService.uploadMedia(id, file);
        return ResponseEntity.ok(ApiResponse.success("Media uploaded successfully", MediaResponse.fromEntity(uploaded)));
    }

    @DeleteMapping("/media/{id}")
    @PreAuthorize("hasAuthority('GALLERY_DELETE')")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(@PathVariable UUID id) {
        galleryService.deleteMedia(id);
        return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
    }
}
