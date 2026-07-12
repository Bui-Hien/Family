package com.family.modules.profile.dto;

import java.util.UUID;

public interface ProfileLookup {
    UUID getId();
    String getFullName();
    String getGender();
    Integer getGeneration();
}
