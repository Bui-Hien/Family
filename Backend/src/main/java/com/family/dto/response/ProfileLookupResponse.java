package com.family.dto.response;

import java.util.UUID;

public interface ProfileLookupResponse {
    UUID getId();
    String getFullName();
    String getGender();
    Integer getGeneration();
    UUID getParentId();
}
