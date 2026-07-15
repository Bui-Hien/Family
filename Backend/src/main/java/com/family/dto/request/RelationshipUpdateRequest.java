package com.family.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class RelationshipUpdateRequest {

    @NotNull(message = "Profile ID is required")
    private UUID profileId;

    private UUID parentId;
    private UUID spouseId;
    private Integer generation;
    private String branchCode;
}
