package com.family.service.impl;

import com.family.common.enums.FileVisibility;
import com.family.common.exception.BusinessException;
import com.family.common.exception.FileOperationException;
import com.family.common.exception.ResourceNotFoundException;
import com.family.common.util.FileUtils;
import com.family.common.util.ImageUtils;
import com.family.entity.Gallery;
import com.family.entity.Media;
import com.family.repository.GalleryRepository;
import com.family.repository.MediaRepository;
import com.family.service.GalleryService;
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
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;
    private final MediaRepository mediaRepository;

    @Value("${app.upload.dir.public}")
    private String publicUploadDir;

    @Value("${app.upload.dir.private}")
    private String privateUploadDir;

    @Override
    @Transactional(readOnly = true)
    public Gallery getById(UUID id) {
        return galleryRepository.findById(id)
                .filter(g -> !g.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Gallery not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Gallery> getAll() {
        return galleryRepository.findByDeletedFalseOrderBySortOrderAsc();
    }

    @Override
    @Transactional
    public Gallery create(Gallery gallery) {
        return galleryRepository.save(gallery);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Gallery gallery = getById(id);
        gallery.setDeleted(true);
        galleryRepository.save(gallery);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Media> getMediaByGalleryId(UUID galleryId) {
        // Verify gallery exists
        getById(galleryId);
        return mediaRepository.findByGalleryIdAndDeletedFalseOrderBySortOrderAsc(galleryId);
    }

    @Override
    @Transactional
    public Media uploadMedia(UUID galleryId, MultipartFile file) {
        Gallery gallery = getById(galleryId);

        if (file.isEmpty()) {
            throw new FileOperationException("Uploaded file is empty");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            originalName = "unnamed";
        }
        
        String uniqueName = FileUtils.generateUniqueFileName(originalName);
        FileVisibility visibility = gallery.getVisibility();
        
        // Base directory based on visibility
        String baseDir = (visibility == FileVisibility.PUBLIC) ? publicUploadDir : privateUploadDir;
        Path originalPath = Paths.get(baseDir, "images", "original", uniqueName);

        try {
            // Ensure directories exist
            Files.createDirectories(originalPath.toAbsolutePath().getParent());
            
            // Save original file using absolute path to avoid container-relative resolution
            file.transferTo(originalPath.toAbsolutePath().toFile());
            
            Media media = new Media();
            media.setGalleryId(galleryId);
            media.setFileName(originalName);
            media.setFilePath(originalPath.toString());
            media.setFileType(file.getContentType());
            media.setFileSize(file.getSize());
            media.setVisibility(visibility);

            // Default URLs to original path
            String baseWebUrl = (visibility == FileVisibility.PUBLIC) ? "/uploads/public" : "/uploads/private";
            String originalUrl = baseWebUrl + "/images/original/" + uniqueName;
            
            media.setLargeUrl(originalUrl);
            media.setMediumUrl(originalUrl);
            media.setSmallUrl(originalUrl);

            // If it is an image, generate 3 versions (Large: 1920x1080, Medium: 1024x768, Small: 480x320)
            if (FileUtils.isImage(originalName)) {
                try {
                    Path largePath = Paths.get(baseDir, "images", "large", uniqueName);
                    Path mediumPath = Paths.get(baseDir, "images", "medium", uniqueName);
                    Path smallPath = Paths.get(baseDir, "images", "small", uniqueName);

                    Files.createDirectories(largePath.toAbsolutePath().getParent());
                    Files.createDirectories(mediumPath.toAbsolutePath().getParent());
                    Files.createDirectories(smallPath.toAbsolutePath().getParent());

                    ImageUtils.resize(originalPath.toAbsolutePath().toFile(), largePath.toAbsolutePath().toFile(), 1920, 1080);
                    ImageUtils.resize(originalPath.toAbsolutePath().toFile(), mediumPath.toAbsolutePath().toFile(), 1024, 768);
                    ImageUtils.resize(originalPath.toAbsolutePath().toFile(), smallPath.toAbsolutePath().toFile(), 480, 320);

                    media.setLargeUrl(baseWebUrl + "/images/large/" + uniqueName);
                    media.setMediumUrl(baseWebUrl + "/images/medium/" + uniqueName);
                    media.setSmallUrl(baseWebUrl + "/images/small/" + uniqueName);
                } catch (Exception resizeEx) {
                    log.error("Failed to resize uploaded image: {}. Fallback to original URL.", resizeEx.getMessage());
                }
            }

            return mediaRepository.save(media);
        } catch (IOException e) {
            log.error("Failed to store file: {}", e.getMessage());
            throw new FileOperationException("Failed to store file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteMedia(UUID mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .filter(m -> !m.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        media.setDeleted(true);
        mediaRepository.save(media);
    }
}
