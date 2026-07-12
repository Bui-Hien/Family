package com.family.modules.tree.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.family.common.exception.FileOperationException;
import com.family.common.exception.ResourceNotFoundException;
import com.family.modules.profile.entity.Profile;
import com.family.modules.profile.repository.ProfileRepository;
import com.family.modules.tree.dto.RelationshipUpdateRequest;
import com.family.modules.tree.dto.TreeNodeDto;
import com.family.modules.tree.service.FamilyTreeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public TreeNodeDto getFullTree() {
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
    public TreeNodeDto getSubTree(UUID profileId) {
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
    public List<TreeNodeDto> getAncestors(UUID profileId) {
        List<TreeNodeDto> ancestors = new ArrayList<>();
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
            TreeNodeDto parentDto = convertToDto(parent, profileMap);
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
            TreeNodeDto fullTree = getFullTree();
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(fullTree);
        } catch (Exception e) {
            log.error("Failed to export family tree: {}", e.getMessage());
            throw new FileOperationException("Failed to serialize family tree: " + e.getMessage(), e);
        }
    }

    private TreeNodeDto buildNode(Profile profile, Map<UUID, List<Profile>> childrenMap, Map<UUID, Profile> profileMap) {
        TreeNodeDto node = convertToDto(profile, profileMap);
        
        if (profile.getSpouseId() != null) {
            Profile spouseProfile = profileMap.get(profile.getSpouseId());
            if (spouseProfile != null) {
                node.setSpouse(convertToDto(spouseProfile, profileMap));
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

    private TreeNodeDto convertToDto(Profile profile, Map<UUID, Profile> profileMap) {
        TreeNodeDto dto = TreeNodeDto.builder()
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
