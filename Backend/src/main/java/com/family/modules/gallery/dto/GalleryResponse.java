package com.family.modules.gallery.dto;

import com.family.common.enums.FileVisibility;
import com.family.modules.gallery.entity.Gallery;
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
public class GalleryResponse {
    private UUID id;
    private String name;
    private String description;
    private String coverImage;
    private FileVisibility visibility;
    private UUID eventId;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static GalleryResponse fromEntity(Gallery gallery) {
        if (gallery == null) {
            return null;
        }
        return GalleryResponse.builder()
                .id(gallery.getId())
                .name(gallery.getName())
                .description(gallery.getDescription())
                .coverImage(gallery.getCoverImage())
                .visibility(gallery.getVisibility())
                .eventId(gallery.getEventId())
                .sortOrder(gallery.getSortOrder())
                .createdAt(gallery.getCreatedAt())
                .updatedAt(gallery.getUpdatedAt())
                .build();
    }
}
