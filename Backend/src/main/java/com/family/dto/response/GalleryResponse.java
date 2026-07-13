package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.common.enums.FileVisibility;
import com.family.entity.Gallery;
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
public class GalleryResponse extends BaseResponse {
    private String name;
    private String description;
    private String coverImage;
    private FileVisibility visibility;
    private UUID eventId;
    private Integer sortOrder;

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
