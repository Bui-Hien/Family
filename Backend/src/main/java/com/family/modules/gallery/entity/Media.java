package com.family.modules.gallery.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.FileVisibility;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "media")
public class Media extends BaseEntity {

    @Column(name = "gallery_id", nullable = false)
    private UUID galleryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gallery_id", nullable = false, insertable = false, updatable = false)
    private Gallery gallery;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private FileVisibility visibility = FileVisibility.PUBLIC;

    @Column(name = "large_url")
    private String largeUrl;

    @Column(name = "medium_url")
    private String mediumUrl;

    @Column(name = "small_url")
    private String smallUrl;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}
