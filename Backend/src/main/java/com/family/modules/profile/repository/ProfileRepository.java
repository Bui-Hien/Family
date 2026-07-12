package com.family.modules.profile.repository;

import com.family.modules.profile.entity.Profile;
import com.family.modules.profile.dto.ProfileLookup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID>, JpaSpecificationExecutor<Profile> {
    
    List<ProfileLookup> findProjectedByDeletedFalse();
    
    @Query("SELECT p.id as id, p.fullName as fullName, p.gender as gender, p.generation as generation " +
           "FROM Profile p " +
           "WHERE p.deleted = false AND (p.id = :currentId OR p.id = (SELECT p2.spouseId FROM Profile p2 WHERE p2.id = :currentId))")
    List<ProfileLookup> findLookupByMemberAndSpouse(@Param("currentId") UUID currentId);
    
    List<Profile> findByParentIdAndDeletedFalse(UUID parentId);
    
    List<Profile> findBySpouseIdAndDeletedFalse(UUID spouseId);
    
    List<Profile> findByDeletedFalse();
}
