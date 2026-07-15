package com.family.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.family.common.exception.FileOperationException;
import com.family.common.exception.ResourceNotFoundException;
import com.family.entity.Profile;
import com.family.repository.ProfileRepository;
import com.family.dto.request.RelationshipUpdateRequest;
import com.family.dto.response.TreeNodeResponse;
import com.family.service.FamilyTreeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FamilyTreeServiceImpl implements FamilyTreeService {

    private final ProfileRepository profileRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "familyTree", key = "'full'")
    public TreeNodeResponse getFullTree() {
        List<Profile> allProfiles = profileRepository.findByDeletedFalse();
        if (allProfiles.isEmpty()) {
            return null;
        }

        // Find the root ancestor(s)
        // A root has no parent, and typically has generation = 1 or minimum generation.
        Profile rootProfile = allProfiles.stream()
                .filter(p -> p.getParentId() == null)
                .min(Comparator.comparingInt(p -> p.getGeneration() != null ? p.getGeneration() : 999))
                .orElse(allProfiles.get(0));

        Map<UUID, List<Profile>> childrenMap = new HashMap<>();
        Map<UUID, Profile> profileMap = new HashMap<>();

        for (Profile p : allProfiles) {
            profileMap.put(p.getId(), p);
            if (p.getParentId() != null) {
                childrenMap.computeIfAbsent(p.getParentId(), k -> new ArrayList<>()).add(p);
            }
        }

        // Sort children by birthDate or sorting criteria
        for (List<Profile> children : childrenMap.values()) {
            children.sort(Comparator.comparing(
                    p -> p.getBirthDate() != null ? p.getBirthDate() : java.time.LocalDate.MAX
            ));
        }

        return buildNode(rootProfile, childrenMap, profileMap);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "familyTree", key = "'sub_' + #profileId")
    public TreeNodeResponse getSubTree(UUID profileId) {
        List<Profile> allProfiles = profileRepository.findByDeletedFalse();
        Profile rootProfile = allProfiles.stream()
                .filter(p -> p.getId().equals(profileId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));

        Map<UUID, List<Profile>> childrenMap = new HashMap<>();
        Map<UUID, Profile> profileMap = new HashMap<>();

        for (Profile p : allProfiles) {
            profileMap.put(p.getId(), p);
            if (p.getParentId() != null) {
                childrenMap.computeIfAbsent(p.getParentId(), k -> new ArrayList<>()).add(p);
            }
        }

        // Sort children
        for (List<Profile> children : childrenMap.values()) {
            children.sort(Comparator.comparing(
                    p -> p.getBirthDate() != null ? p.getBirthDate() : java.time.LocalDate.MAX
            ));
        }

        return buildNode(rootProfile, childrenMap, profileMap);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "familyTree", key = "'ancestors_' + #profileId")
    public List<TreeNodeResponse> getAncestors(UUID profileId) {
        List<TreeNodeResponse> ancestors = new ArrayList<>();
        UUID currentParentId = profileId;

        // Load all profiles once for fast lookup
        Map<UUID, Profile> profileMap = profileRepository.findByDeletedFalse().stream()
                .collect(Collectors.toMap(Profile::getId, p -> p));

        Profile current = profileMap.get(currentParentId);
        if (current == null) {
            throw new ResourceNotFoundException("Profile not found with id: " + profileId);
        }

        // Climb up the parent hierarchy
        currentParentId = current.getParentId();
        while (currentParentId != null) {
            Profile parent = profileMap.get(currentParentId);
            if (parent == null) {
                break;
            }
            TreeNodeResponse parentDto = convertToDto(parent, profileMap);
            // Attach parent spouse if available
            if (parent.getSpouseId() != null) {
                Profile spouse = profileMap.get(parent.getSpouseId());
                if (spouse != null) {
                    parentDto.setSpouse(convertToDto(spouse, profileMap));
                }
            }
            ancestors.add(parentDto);
            currentParentId = parent.getParentId();
        }

        Collections.reverse(ancestors);
        return ancestors;
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "familyTree", allEntries = true),
        @CacheEvict(value = "profilesLookup", allEntries = true),
        @CacheEvict(value = "profiles", key = "#request.profileId"),
        @CacheEvict(value = "profiles", key = "#request.spouseId", condition = "#request.spouseId != null")
    })
    public void updateRelationship(RelationshipUpdateRequest request) {
        Profile profile = profileRepository.findById(request.getProfileId())
                .filter(p -> !p.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + request.getProfileId()));

        if (request.getParentId() != null) {
            // Verify parent exists
            profileRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found"));
            profile.setParentId(request.getParentId());
        } else {
            profile.setParentId(null);
        }

        if (request.getSpouseId() != null) {
            // Verify spouse exists
            Profile spouse = profileRepository.findById(request.getSpouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Spouse profile not found"));
            profile.setSpouseId(request.getSpouseId());
            // Double link spouse relationship
            spouse.setSpouseId(profile.getId());
            profileRepository.save(spouse);
        } else {
            profile.setSpouseId(null);
        }

        if (request.getGeneration() != null) {
            profile.setGeneration(request.getGeneration());
        }
        if (request.getBranchCode() != null) {
            profile.setBranchCode(request.getBranchCode());
        }

        profileRepository.save(profile);
    }

    @Override
    public byte[] exportTree() {
        try {
            TreeNodeResponse fullTree = getFullTree();
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(fullTree);
        } catch (Exception e) {
            log.error("Failed to export family tree: {}", e.getMessage());
            throw new FileOperationException("Failed to serialize family tree: " + e.getMessage(), e);
        }
    }

    private TreeNodeResponse buildNode(Profile profile, Map<UUID, List<Profile>> childrenMap, Map<UUID, Profile> profileMap) {
        TreeNodeResponse node = convertToDto(profile, profileMap);
        
        if (profile.getSpouseId() != null) {
            Profile spouseProfile = profileMap.get(profile.getSpouseId());
            if (spouseProfile != null) {
                node.setSpouse(convertToDto(spouseProfile, profileMap));
            }
        } else {
            // Tự động suy luận quan hệ vợ/chồng từ cha/mẹ của các con (Inferred Spouse)
            List<Profile> children = childrenMap.get(profile.getId());
            if (children != null && !children.isEmpty()) {
                UUID impliedSpouseId = null;
                if ("M".equals(profile.getGender()) || "MALE".equalsIgnoreCase(profile.getGender())) {
                    // Nếu main member là Nam, tìm motherId của các con
                    impliedSpouseId = children.stream()
                            .map(Profile::getMotherId)
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(null);
                } else {
                    // Nếu main member là Nữ, tìm fatherId của các con
                    impliedSpouseId = children.stream()
                            .map(Profile::getFatherId)
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(null);
                }
                
                if (impliedSpouseId != null) {
                    Profile spouseProfile = profileMap.get(impliedSpouseId);
                    if (spouseProfile != null) {
                        node.setSpouse(convertToDto(spouseProfile, profileMap));
                    }
                }
            }
        }

        List<Profile> children = childrenMap.get(profile.getId());
        if (children != null) {
            for (Profile child : children) {
                node.getChildren().add(buildNode(child, childrenMap, profileMap));
            }
        }

        return node;
    }

    private TreeNodeResponse convertToDto(Profile profile, Map<UUID, Profile> profileMap) {
        TreeNodeResponse dto = TreeNodeResponse.builder()
                .id(profile.getId())
                .fullName(profile.getFullName())
                .gender(profile.getGender())
                .birthDate(profile.getBirthDate())
                .deathDate(profile.getDeathDate())
                .generation(profile.getGeneration())
                .avatarUrl(profile.getAvatarUrl())
                .fatherId(profile.getFatherId())
                .motherId(profile.getMotherId())
                .build();

        if (profile.getFatherId() != null && profileMap != null) {
            Profile father = profileMap.get(profile.getFatherId());
            if (father != null) {
                dto.setFatherName(father.getFullName());
            }
        }

        if (profile.getMotherId() != null && profileMap != null) {
            Profile mother = profileMap.get(profile.getMotherId());
            if (mother != null) {
                dto.setMotherName(mother.getFullName());
            }
        }

        return dto;
    }
}
