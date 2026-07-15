package com.family.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.enums.FileVisibility;
import com.family.dto.response.FileResponse;
import com.family.entity.FileDescription;
import com.family.service.FileService;
import com.family.entity.User;
import com.family.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('FILE_UPLOAD_PUBLIC')")
    public ResponseEntity<ApiResponse<FileResponse>> uploadPublic(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) UUID entityId
    ) {
        UUID userId = SecurityUtils.getCurrentUserId().orElse(null);
        FileDescription upload = fileService.uploadFile(file, FileVisibility.PUBLIC, userId, entityType, entityId);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", FileResponse.fromEntity(upload)));
    }

    @PostMapping("/upload/private")
    @PreAuthorize("hasAuthority('FILE_UPLOAD_PRIVATE')")
    public ResponseEntity<ApiResponse<FileResponse>> uploadPrivate(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) UUID entityId
    ) {
        UUID userId = SecurityUtils.getCurrentUserId().orElse(null);
        FileDescription upload = fileService.uploadFile(file, FileVisibility.PRIVATE, userId, entityType, entityId);
        return ResponseEntity.ok(ApiResponse.success("Private file uploaded successfully", FileResponse.fromEntity(upload)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable UUID id) {
        User currentUser = SecurityUtils.getCurrentUser().orElse(null);
        FileDescription metadata = fileService.getMetadata(id);
        byte[] data = fileService.downloadFile(id, currentUser);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
                .body(data);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<byte[]> downloadFilePublic(@PathVariable UUID id) {
        FileDescription metadata = fileService.getMetadata(id);
        // Direct download without authentication check
        byte[] data = fileService.downloadFile(id, null);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
                .body(data);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('FILE_DELETE')")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable UUID id) {
        fileService.deleteFile(id);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", null));
    }
}
