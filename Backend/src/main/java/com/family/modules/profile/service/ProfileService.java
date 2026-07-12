package com.family.modules.profile.service;

import com.family.common.dto.PagingRequest;
import com.family.modules.profile.dto.ProfileRequest;
import com.family.modules.profile.entity.Profile;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ProfileService {
    Profile getById(UUID id);
    List<Profile> getAll();
    Page<Profile> getPaged(PagingRequest request);
    Profile create(ProfileRequest request);
    Profile update(UUID id, ProfileRequest request);
    void delete(UUID id);
    List<Profile> search(String keyword);
}
