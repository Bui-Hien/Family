package com.family.service.impl;

import com.family.common.enums.FileVisibility;
import com.family.common.exception.BusinessException;
import com.family.common.exception.FileOperationException;
import com.family.common.exception.ForbiddenException;
import com.family.common.exception.ResourceNotFoundException;
import com.family.common.exception.UnauthorizedException;
import com.family.common.util.FileUtils;
import com.family.common.util.ImageUtils;
import com.family.entity.FileDescription;
import com.family.repository.FileDescriptionRepository;
import com.family.service.FileService;
import com.family.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileServiceImpl implements FileService {

    private final FileDescriptionRepository fileDescriptionRepository;

    @Value("${app.upload.dir.public}")
    private String publicUploadDir;

    @Value("${app.upload.dir.private}")
    private String privateUploadDir;

    @Override
    @Transactional
    public FileDescription uploadFile(MultipartFile file, FileVisibility visibility, UUID userId, String entityType, UUID entityId) {
        if (file.isEmpty()) {
            throw new FileOperationException("Uploaded file is empty");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            originalName = "unnamed";
        }

        String uniqueName = FileUtils.generateUniqueFileName(originalName);
        String baseDir = (visibility == FileVisibility.PUBLIC) ? publicUploadDir : privateUploadDir;
        
        boolean isImg = FileUtils.isImage(originalName);
        String subFolder = isImg ? "images/original" : "documents";
        Path targetPath = Paths.get(baseDir, subFolder, uniqueName);

        try {
            Files.createDirectories(targetPath.getParent());
            byte[] bytes = file.getBytes();
            boolean isCompressed = false;
            int originalLength = bytes.length;

            if (isImg) {
                // Save image original directly
                Files.write(targetPath, bytes);
            } else {
                // Non-image: Compress using LZ4
                bytes = FileUtils.compress(bytes);
                isCompressed = true;
                Files.write(targetPath, bytes);
            }

            FileDescription fileDesc = new FileDescription();
            fileDesc.setFileName(originalName);
            fileDesc.setFilePath(targetPath.toString());
            fileDesc.setFileType(file.getContentType());
            fileDesc.setFileSize((long) bytes.length);
            fileDesc.setVisibility(visibility);
            fileDesc.setUploadedBy(userId);
            fileDesc.setEntityType(entityType);
            fileDesc.setEntityId(entityId);
            fileDesc.setCompressed(isCompressed);
            fileDesc.setOriginalLength(originalLength);

            String baseWebUrl = (visibility == FileVisibility.PUBLIC) ? "/uploads/public" : "/uploads/private";
            String fileUrl = baseWebUrl + "/" + subFolder + "/" + uniqueName;
            fileDesc.setLargeUrl(fileUrl);
            fileDesc.setMediumUrl(fileUrl);
            fileDesc.setSmallUrl(fileUrl);

            // Generate thumbnails for images
            if (isImg) {
                try {
                    Path largePath = Paths.get(baseDir, "images", "large", uniqueName);
                    Path mediumPath = Paths.get(baseDir, "images", "medium", uniqueName);
                    Path smallPath = Paths.get(baseDir, "images", "small", uniqueName);

                    ImageUtils.resize(targetPath.toFile(), largePath.toFile(), 1920, 1080);
                    ImageUtils.resize(targetPath.toFile(), mediumPath.toFile(), 1024, 768);
                    ImageUtils.resize(targetPath.toFile(), smallPath.toFile(), 480, 320);

                    fileDesc.setLargeUrl(baseWebUrl + "/images/large/" + uniqueName);
                    fileDesc.setMediumUrl(baseWebUrl + "/images/medium/" + uniqueName);
                    fileDesc.setSmallUrl(baseWebUrl + "/images/small/" + uniqueName);
                } catch (Exception resizeEx) {
                    log.error("Failed to resize uploaded file image: {}", resizeEx.getMessage());
                }
            }

            return fileDescriptionRepository.save(fileDesc);

        } catch (IOException e) {
            log.error("Failed to write file to disk: {}", e.getMessage());
            throw new FileOperationException("Failed to store file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadFile(UUID id, User currentUser) {
        FileDescription fileDesc = fileDescriptionRepository.findById(id)
                .filter(f -> !f.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        // Enforce Access Control
        if (fileDesc.getVisibility() == FileVisibility.PROTECTED) {
            if (currentUser == null) {
                throw new UnauthorizedException("Login required to access protected files");
            }
        } else if (fileDesc.getVisibility() == FileVisibility.PRIVATE) {
            if (currentUser == null) {
                throw new UnauthorizedException("Login required to access private files");
            }
            boolean isOwner = currentUser.getId().equals(fileDesc.getUploadedBy());
            boolean isAdmin = "ROLE_SYSTEM_ADMIN".equals(currentUser.getRole().name()) 
                    || "ROLE_CLAN_LEADER".equals(currentUser.getRole().name());
            
            if (!isOwner && !isAdmin) {
                throw new ForbiddenException("You do not have access to this private file");
            }
        }

        try {
            byte[] fileBytes = Files.readAllBytes(Paths.get(fileDesc.getFilePath()));
            if (fileDesc.getCompressed()) {
                fileBytes = FileUtils.decompress(fileBytes, fileDesc.getOriginalLength());
            }
            return fileBytes;
        } catch (IOException e) {
            log.error("Failed to read file from disk: {}", e.getMessage());
            throw new FileOperationException("Failed to read file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FileDescription getMetadata(UUID id) {
        return fileDescriptionRepository.findById(id)
                .filter(f -> !f.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("File description not found"));
    }

    @Override
    @Transactional
    public void deleteFile(UUID id) {
        FileDescription fileDesc = getMetadata(id);
        fileDesc.setDeleted(true);
        fileDescriptionRepository.save(fileDesc);

        // Optional: Physically delete the files
        try {
            Files.deleteIfExists(Paths.get(fileDesc.getFilePath()));
            // If it had thumbnails, delete them too
            if (FileUtils.isImage(fileDesc.getFileName())) {
                String uniqueName = Paths.get(fileDesc.getFilePath()).getFileName().toString();
                String baseDir = (fileDesc.getVisibility() == FileVisibility.PUBLIC) ? publicUploadDir : privateUploadDir;
                Files.deleteIfExists(Paths.get(baseDir, "images", "large", uniqueName));
                Files.deleteIfExists(Paths.get(baseDir, "images", "medium", uniqueName));
                Files.deleteIfExists(Paths.get(baseDir, "images", "small", uniqueName));
            }
        } catch (IOException e) {
            log.warn("Failed to delete physical files from disk: {}", e.getMessage());
        }
    }
}
