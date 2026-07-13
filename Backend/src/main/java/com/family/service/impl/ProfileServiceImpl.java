package com.family.service.impl;

import com.family.common.dto.PagingRequest;
import com.family.common.exception.ResourceNotFoundException;
import com.family.dto.request.ProfileRequest;
import com.family.entity.Profile;
import com.family.repository.ProfileRepository;
import com.family.service.ProfileService;
import jakarta.persistence.criteria.Predicate;
import com.family.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.family.dto.response.ProfileLookupResponse;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "profiles", key = "#id")
    public Profile getById(UUID id) {
        return profileRepository.findById(id)
                .filter(p -> !p.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Profile> getAll() {
        return profileRepository.findByDeletedFalse();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "profilesLookup", key = "#currentId != null ? #currentId : 'all'")
    public List<ProfileLookupResponse> getLookup(UUID currentId) {
        if (currentId != null) {
            return profileRepository.findLookupByMemberAndSpouse(currentId);
        }
        return profileRepository.findProjectedByDeletedFalse();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Profile> getPaged(PagingRequest request) {
        Specification<Profile> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));
            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String likePattern = "%" + request.getKeyword().toLowerCase() + "%";
                predicates.add(cb.or(
                         cb.like(cb.lower(root.get("fullName")), likePattern),
                         cb.like(cb.lower(root.get("occupation")), likePattern),
                         cb.like(cb.lower(root.get("branchCode")), likePattern)
                ));
            }
            if (request.getGender() != null && !request.getGender().trim().isEmpty() && !"ALL".equalsIgnoreCase(request.getGender())) {
                predicates.add(cb.equal(root.get("gender"), request.getGender()));
            }
            if (request.getGeneration() != null && !request.getGeneration().trim().isEmpty() && !"ALL".equalsIgnoreCase(request.getGeneration())) {
                try {
                    Integer gen = Integer.parseInt(request.getGeneration().trim());
                    predicates.add(cb.equal(root.get("generation"), gen));
                } catch (NumberFormatException e) {
                    // Ignore invalid format
                }
            }
            if (request.getStatus() != null && !request.getStatus().trim().isEmpty() && !"ALL".equalsIgnoreCase(request.getStatus())) {
                if ("ALIVE".equalsIgnoreCase(request.getStatus())) {
                    predicates.add(cb.isNull(root.get("deathDate")));
                } else if ("DECEASED".equalsIgnoreCase(request.getStatus())) {
                    predicates.add(cb.isNotNull(root.get("deathDate")));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return profileRepository.findAll(spec, request.toPageable());
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "familyTree", allEntries = true),
        @CacheEvict(value = "profilesLookup", allEntries = true)
    })
    public Profile create(ProfileRequest request) {
        Profile profile = new Profile();
        copyProperties(request, profile);
        profile = profileRepository.save(profile);
        auditLogService.logChange(null, profile);
        return profile;
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "profiles", key = "#id"),
        @CacheEvict(value = "familyTree", allEntries = true),
        @CacheEvict(value = "profilesLookup", allEntries = true)
    })
    public Profile update(UUID id, ProfileRequest request) {
        Profile profile = getById(id);
        Profile profileOld = auditLogService.cloneObject(profile, Profile.class);
        copyProperties(request, profile);
        profile = profileRepository.save(profile);
        auditLogService.logChange(profileOld, profile);
        return profile;
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "profiles", key = "#id"),
        @CacheEvict(value = "familyTree", allEntries = true),
        @CacheEvict(value = "profilesLookup", allEntries = true)
    })
    public void delete(UUID id) {
        Profile profile = getById(id);
        Profile profileOld = auditLogService.cloneObject(profile, Profile.class);
        profile.setDeleted(true);
        profile = profileRepository.save(profile);
        auditLogService.logChange(profileOld, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Profile> search(String keyword) {
        Specification<Profile> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));
            if (keyword != null && !keyword.trim().isEmpty()) {
                String likePattern = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("fullName")), likePattern),
                        cb.like(cb.lower(root.get("occupation")), likePattern)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return profileRepository.findAll(spec);
    }

    private void copyProperties(ProfileRequest request, Profile profile) {
        profile.setFullName(request.getFullName());
        profile.setGender(request.getGender());
        profile.setBirthDate(request.getBirthDate());
        profile.setDeathDate(request.getDeathDate());
        profile.setGeneration(request.getGeneration());
        profile.setBranchCode(request.getBranchCode());
        profile.setOccupation(request.getOccupation());
        profile.setBiography(request.getBiography());
        profile.setAchievements(request.getAchievements());
        
        profile.setFatherId(request.getFatherId());
        profile.setMotherId(request.getMotherId());

        // Sync parentId for family tree hierarchy traversal
        if (request.getFatherId() != null) {
            profile.setParentId(request.getFatherId());
        } else if (request.getMotherId() != null) {
            profile.setParentId(request.getMotherId());
        } else {
            profile.setParentId(request.getParentId());
        }

        profile.setSpouseId(request.getSpouseId());
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setAdditionalInfo(request.getAdditionalInfo());
    }
}
