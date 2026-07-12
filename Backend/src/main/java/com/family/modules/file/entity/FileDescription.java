package com.family.modules.file.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.FileVisibility;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
import com.family.modules.user.entity.User;

@Getter
@Setter
@Entity
@Table(name = "file_descriptions")
public class FileDescription extends BaseEntity {

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_type")
    private String fileType;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private FileVisibility visibility = FileVisibility.PUBLIC;

    @Column(name = "large_url")
    private String largeUrl;

    @Column(name = "medium_url")
    private String mediumUrl;

    @Column(name = "small_url")
    private String smallUrl;

    @Column(name = "uploaded_by")
    private UUID uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", insertable = false, updatable = false)
    private User uploader;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    @Column(name = "is_compressed", nullable = false)
    private Boolean compressed = false;

    @Column(name = "original_length")
    private Integer originalLength = 0;
}
