package com.family.modules.gallery.controller;

import com.family.common.dto.ApiResponse;
import com.family.modules.gallery.entity.Gallery;
import com.family.modules.gallery.entity.Media;
import com.family.modules.gallery.service.GalleryService;
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
    public ResponseEntity<ApiResponse<List<Gallery>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(galleryService.getAll()));
    }

    @GetMapping("/galleries/{id}")
    @PreAuthorize("hasAuthority('GALLERY_VIEW')")
    public ResponseEntity<ApiResponse<Gallery>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(galleryService.getById(id)));
    }

    @GetMapping("/galleries/{id}/media")
    @PreAuthorize("hasAuthority('GALLERY_VIEW')")
    public ResponseEntity<ApiResponse<List<Media>>> getMedia(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(galleryService.getMediaByGalleryId(id)));
    }

    @PostMapping("/galleries")
    @PreAuthorize("hasAuthority('GALLERY_CREATE')")
    public ResponseEntity<ApiResponse<Gallery>> create(@Valid @RequestBody Gallery gallery) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Gallery created successfully", galleryService.create(gallery)));
    }

    @PostMapping(value = "/galleries/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('GALLERY_UPLOAD')")
    public ResponseEntity<ApiResponse<Media>> uploadMedia(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(ApiResponse.success("Media uploaded successfully", galleryService.uploadMedia(id, file)));
    }

    @DeleteMapping("/media/{id}")
    @PreAuthorize("hasAuthority('GALLERY_DELETE')")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(@PathVariable UUID id) {
        galleryService.deleteMedia(id);
        return ResponseEntity.ok(ApiResponse.success("Media deleted successfully", null));
    }
}
