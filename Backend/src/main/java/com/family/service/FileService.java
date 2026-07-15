package com.family.service;

import com.family.common.enums.FileVisibility;
import com.family.entity.FileDescription;
import com.family.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FileService {
    FileDescription uploadFile(MultipartFile file, FileVisibility visibility, UUID userId, String entityType, UUID entityId);
    byte[] downloadFile(UUID id, User currentUser);
    FileDescription getMetadata(UUID id);
    void deleteFile(UUID id);
}
