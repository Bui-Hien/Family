package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.common.enums.FileVisibility;
import com.family.entity.Media;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MediaResponse extends BaseResponse {
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
