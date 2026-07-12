package com.family.modules.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Data
public class ProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Pattern(regexp = "^[MF]$", message = "Gender must be either M (Male) or F (Female)")
    private String gender;

    private LocalDate birthDate;
    private LocalDate deathDate;
    private Integer generation;
    private String branchCode;
    private String occupation;
    private String biography;
    private String achievements;
    private UUID fatherId;
    private UUID motherId;
    private UUID parentId;
    private UUID spouseId;
    private String avatarUrl;
    private Map<String, Object> additionalInfo;
}
