package com.family.modules.post.repository;

import com.family.common.enums.StatusEnum;
import com.family.modules.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID>, JpaSpecificationExecutor<Post> {

    Optional<Post> findBySlugAndDeletedFalse(String slug);

    List<Post> findByFeaturedTrueAndStatusAndDeletedFalse(StatusEnum status);

    boolean existsBySlug(String slug);
}
