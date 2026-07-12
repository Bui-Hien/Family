package com.family.modules.post.service;

import com.family.common.dto.PagingRequest;
import com.family.modules.post.dto.PostRequest;
import com.family.modules.post.entity.Post;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface PostService {
    Post getById(UUID id);
    Post getBySlug(String slug);
    List<Post> getFeaturedPosts();
    Page<Post> getPaged(PagingRequest request);
    Post create(PostRequest request, UUID authorId);
    Post update(UUID id, PostRequest request);
    void delete(UUID id);
}
