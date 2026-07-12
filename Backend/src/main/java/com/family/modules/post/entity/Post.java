package com.family.modules.post.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
import com.family.modules.user.entity.User;

@Getter
@Setter
@Entity
@Table(name = "posts")
public class Post extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "slug", unique = true, nullable = false)
    private String slug;

    @Column(name = "summary")
    private String summary;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "featured_image")
    private String featuredImage;

    @Column(name = "is_featured", nullable = false)
    private Boolean featured = false;

    @Column(name = "views", nullable = false)
    private Integer views = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusEnum status = StatusEnum.DRAFT;

    @Column(name = "author_id")
    private UUID authorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", insertable = false, updatable = false)
    private User author;

    @Column(name = "category")
    private String category;
}
