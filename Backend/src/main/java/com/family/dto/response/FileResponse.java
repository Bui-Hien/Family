package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.common.enums.FileVisibility;
import com.family.entity.FileDescription;
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
public class FileResponse extends BaseResponse {
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private FileVisibility visibility;
    private String largeUrl;
    private String mediumUrl;
    private String smallUrl;
    private UUID uploadedBy;
    private String entityType;
    private UUID entityId;
    private Boolean compressed;
    private Integer originalLength;

    public static FileResponse fromEntity(FileDescription fileDescription) {
        if (fileDescription == null) {
            return null;
        }
        return FileResponse.builder()
                .id(fileDescription.getId())
                .fileName(fileDescription.getFileName())
                .filePath(fileDescription.getFilePath())
                .fileSize(fileDescription.getFileSize())
                .fileType(fileDescription.getFileType())
                .visibility(fileDescription.getVisibility())
                .largeUrl(fileDescription.getLargeUrl())
                .mediumUrl(fileDescription.getMediumUrl())
                .smallUrl(fileDescription.getSmallUrl())
                .uploadedBy(fileDescription.getUploadedBy())
                .entityType(fileDescription.getEntityType())
                .entityId(fileDescription.getEntityId())
                .compressed(fileDescription.getCompressed())
                .originalLength(fileDescription.getOriginalLength())
                .createdAt(fileDescription.getCreatedAt())
                .updatedAt(fileDescription.getUpdatedAt())
                .build();
    }
}
