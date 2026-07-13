package com.family.service.impl;

import com.family.common.dto.PagingRequest;
import com.family.common.enums.StatusEnum;
import com.family.common.exception.ResourceNotFoundException;
import com.family.common.util.SlugUtils;
import com.family.dto.request.PostRequest;
import com.family.entity.Post;
import com.family.repository.PostRepository;
import com.family.service.PostService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public Post getById(UUID id) {
        return postRepository.findById(id)
                .filter(p -> !p.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    @Override
    @Transactional
    public Post getBySlug(String slug) {
        Post post = postRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with slug: " + slug));
        
        // Increment view count
        post.setViews(post.getViews() + 1);
        return postRepository.save(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getFeaturedPosts() {
        return postRepository.findByFeaturedTrueAndStatusAndDeletedFalse(StatusEnum.PUBLISHED);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Post> getPaged(PagingRequest request) {
        Specification<Post> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));
            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String likePattern = "%" + request.getKeyword().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), likePattern),
                        cb.like(cb.lower(root.get("summary")), likePattern)
                ));
            }
            if (request.getCategory() != null && !request.getCategory().trim().isEmpty() && !"ALL".equalsIgnoreCase(request.getCategory())) {
                predicates.add(cb.equal(root.get("category"), request.getCategory()));
            }
            if (request.getStatus() != null && !request.getStatus().trim().isEmpty() && !"ALL".equalsIgnoreCase(request.getStatus())) {
                try {
                    com.family.common.enums.StatusEnum statusEnum = com.family.common.enums.StatusEnum.valueOf(request.getStatus());
                    predicates.add(cb.equal(root.get("status"), statusEnum));
                } catch (IllegalArgumentException e) {
                    // Ignore invalid status
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return postRepository.findAll(spec, request.toPageable());
    }

    @Override
    @Transactional
    public Post create(PostRequest request, UUID authorId) {
        Post post = new Post();
        copyProperties(request, post);
        post.setAuthorId(authorId);
        post.setSlug(generateUniqueSlug(request.getTitle()));
        return postRepository.save(post);
    }

    @Override
    @Transactional
    public Post update(UUID id, PostRequest request) {
        Post post = getById(id);
        
        // If title changed, update slug
        if (!post.getTitle().equals(request.getTitle())) {
            post.setSlug(generateUniqueSlug(request.getTitle()));
        }
        
        copyProperties(request, post);
        return postRepository.save(post);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Post post = getById(id);
        post.setDeleted(true);
        postRepository.save(post);
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = SlugUtils.toSlug(title);
        String slug = baseSlug;
        int count = 1;
        while (postRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }
        return slug;
    }

    private void copyProperties(PostRequest request, Post post) {
        post.setTitle(request.getTitle());
        post.setSummary(request.getSummary());
        post.setContent(request.getContent());
        post.setFeaturedImage(request.getFeaturedImage());
        post.setFeatured(request.getFeatured());
        post.setStatus(request.getStatus());
        post.setCategory(request.getCategory());
    }
}
