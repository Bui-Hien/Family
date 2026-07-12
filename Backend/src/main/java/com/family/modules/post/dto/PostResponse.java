package com.family.modules.post.dto;

import com.family.common.enums.StatusEnum;
import com.family.modules.post.entity.Post;
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
public class PostResponse {
    private UUID id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String featuredImage;
    private Boolean featured;
    private Integer views;
    private StatusEnum status;
    private UUID authorId;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse fromEntity(Post post) {
        if (post == null) {
            return null;
        }
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .summary(post.getSummary())
                .content(post.getContent())
                .featuredImage(post.getFeaturedImage())
                .featured(post.getFeatured())
                .views(post.getViews())
                .status(post.getStatus())
                .authorId(post.getAuthorId())
                .category(post.getCategory())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
