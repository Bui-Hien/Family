package com.family.modules.profile.repository;

import com.family.modules.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID>, JpaSpecificationExecutor<Profile> {
    
    List<Profile> findByParentIdAndDeletedFalse(UUID parentId);
    
    List<Profile> findBySpouseIdAndDeletedFalse(UUID spouseId);
    
    List<Profile> findByDeletedFalse();
}
