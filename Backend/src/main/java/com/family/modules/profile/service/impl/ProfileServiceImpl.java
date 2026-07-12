package com.family.modules.profile.service.impl;

import com.family.common.dto.PagingRequest;
import com.family.common.exception.ResourceNotFoundException;
import com.family.modules.profile.dto.ProfileRequest;
import com.family.modules.profile.entity.Profile;
import com.family.modules.profile.repository.ProfileRepository;
import com.family.modules.profile.service.ProfileService;
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
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
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
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return profileRepository.findAll(spec, request.toPageable());
    }

    @Override
    @Transactional
    public Profile create(ProfileRequest request) {
        Profile profile = new Profile();
        copyProperties(request, profile);
        return profileRepository.save(profile);
    }

    @Override
    @Transactional
    public Profile update(UUID id, ProfileRequest request) {
        Profile profile = getById(id);
        copyProperties(request, profile);
        return profileRepository.save(profile);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Profile profile = getById(id);
        profile.setDeleted(true);
        profileRepository.save(profile);
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
