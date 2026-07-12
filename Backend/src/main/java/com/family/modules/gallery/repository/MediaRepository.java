package com.family.modules.gallery.repository;

import com.family.modules.gallery.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaRepository extends JpaRepository<Media, UUID> {
    List<Media> findByGalleryIdAndDeletedFalseOrderBySortOrderAsc(UUID galleryId);
}
