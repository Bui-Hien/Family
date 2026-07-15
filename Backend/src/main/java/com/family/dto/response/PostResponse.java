package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.common.enums.StatusEnum;
import com.family.entity.Post;
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
public class PostResponse extends BaseResponse {
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
