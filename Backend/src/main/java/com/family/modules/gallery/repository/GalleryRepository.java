package com.family.modules.gallery.repository;

import com.family.modules.gallery.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, UUID>, JpaSpecificationExecutor<Gallery> {
    List<Gallery> findByDeletedFalseOrderBySortOrderAsc();
}
