package com.family.service;

import com.family.common.dto.PagingRequest;
import com.family.dto.request.ProfileRequest;
import com.family.entity.Profile;
import com.family.dto.response.ProfileLookupResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ProfileService {
    Profile getById(UUID id);
    List<Profile> getAll();
    List<ProfileLookupResponse> getLookup(UUID currentId);
    Page<Profile> getPaged(PagingRequest request);
    Profile create(ProfileRequest request);
    Profile update(UUID id, ProfileRequest request);
    void delete(UUID id);
    List<Profile> search(String keyword);
}
