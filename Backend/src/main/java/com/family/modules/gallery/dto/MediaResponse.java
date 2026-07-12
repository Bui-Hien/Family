package com.family.modules.gallery.dto;

import com.family.common.enums.FileVisibility;
import com.family.modules.gallery.entity.Media;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaResponse {
    private UUID id;
    private UUID galleryId;
    private String fileName;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private FileVisibility visibility;
    private String largeUrl;
    private String mediumUrl;
    private String smallUrl;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MediaResponse fromEntity(Media media) {
        if (media == null) {
            return null;
        }
        return MediaResponse.builder()
                .id(media.getId())
                .galleryId(media.getGalleryId())
                .fileName(media.getFileName())
                .filePath(media.getFilePath())
                .fileType(media.getFileType())
                .fileSize(media.getFileSize())
                .visibility(media.getVisibility())
                .largeUrl(media.getLargeUrl())
                .mediumUrl(media.getMediumUrl())
                .smallUrl(media.getSmallUrl())
                .sortOrder(media.getSortOrder())
                .createdAt(media.getCreatedAt())
                .updatedAt(media.getUpdatedAt())
                .build();
    }
}
