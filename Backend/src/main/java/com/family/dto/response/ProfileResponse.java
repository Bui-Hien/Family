package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.entity.Profile;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ProfileResponse extends BaseResponse {
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
