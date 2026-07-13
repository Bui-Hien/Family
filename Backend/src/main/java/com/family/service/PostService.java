package com.family.service;

import com.family.common.dto.PagingRequest;
import com.family.dto.request.PostRequest;
import com.family.entity.Post;
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
