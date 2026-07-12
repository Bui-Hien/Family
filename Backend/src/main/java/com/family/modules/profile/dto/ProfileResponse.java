package com.family.modules.profile.dto;

import com.family.modules.profile.entity.Profile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private UUID id;
    private String fullName;
    private String gender;
    private LocalDate birthDate;
    private LocalDate deathDate;
    private Integer generation;
    private UUID familyId;
    private String branchCode;
    private String occupation;
    private String biography;
    private String achievements;
    private UUID fatherId;
    private UUID motherId;
    private UUID parentId;
    private UUID spouseId;
    private UUID userId;
    private String avatarUrl;
    private Map<String, Object> additionalInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProfileResponse fromEntity(Profile profile) {
        if (profile == null) {
            return null;
        }
        return ProfileResponse.builder()
                .id(profile.getId())
                .fullName(profile.getFullName())
                .gender(profile.getGender())
                .birthDate(profile.getBirthDate())
                .deathDate(profile.getDeathDate())
                .generation(profile.getGeneration())
                .familyId(profile.getFamilyId())
                .branchCode(profile.getBranchCode())
                .occupation(profile.getOccupation())
                .biography(profile.getBiography())
                .achievements(profile.getAchievements())
                .fatherId(profile.getFatherId())
                .motherId(profile.getMotherId())
                .parentId(profile.getParentId())
                .spouseId(profile.getSpouseId())
                .userId(profile.getUserId())
                .avatarUrl(profile.getAvatarUrl())
                .additionalInfo(profile.getAdditionalInfo())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
