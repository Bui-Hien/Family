package com.family.service;

import com.family.entity.Gallery;
import com.family.entity.Media;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface GalleryService {
    Gallery getById(UUID id);
    List<Gallery> getAll();
    Gallery create(Gallery gallery);
    void delete(UUID id);
    List<Media> getMediaByGalleryId(UUID galleryId);
    Media uploadMedia(UUID galleryId, MultipartFile file);
    void deleteMedia(UUID mediaId);
}
