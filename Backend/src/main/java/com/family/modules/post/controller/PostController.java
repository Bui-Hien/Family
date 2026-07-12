package com.family.modules.post.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.modules.post.dto.PostRequest;
import com.family.modules.post.entity.Post;
import com.family.modules.post.service.PostService;
import com.family.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    @PreAuthorize("hasAuthority('POST_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<Post>>> getPaged(@Valid PagingRequest request) {
        // Can call it with parameters or POST to /api/posts/page, let's also map page queries
        Page<Post> page = postService.getPaged(request);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(page)));
    }

    @PostMapping("/page")
    @PreAuthorize("hasAuthority('POST_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<Post>>> getPagedPost(@Valid @RequestBody PagingRequest request) {
        Page<Post> page = postService.getPaged(request);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(page)));
    }

    @GetMapping("/featured")
    @PreAuthorize("hasAuthority('POST_VIEW')")
    public ResponseEntity<ApiResponse<List<Post>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(postService.getFeaturedPosts()));
    }

    @GetMapping("/{slug}")
    @PreAuthorize("hasAuthority('POST_VIEW')")
    public ResponseEntity<ApiResponse<Post>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(postService.getBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('POST_CREATE')")
    public ResponseEntity<ApiResponse<Post>> create(@Valid @RequestBody PostRequest request) {
        UUID authorId = SecurityUtils.getCurrentUserId().orElse(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created successfully", postService.create(request, authorId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('POST_EDIT')")
    public ResponseEntity<ApiResponse<Post>> update(@PathVariable UUID id, @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", postService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('POST_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        postService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }
}
