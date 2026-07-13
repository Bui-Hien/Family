package com.family.service;

import com.family.dto.request.RelationshipUpdateRequest;
import com.family.dto.response.TreeNodeResponse;

import java.util.List;
import java.util.UUID;

public interface FamilyTreeService {
    TreeNodeResponse getFullTree();
    TreeNodeResponse getSubTree(UUID profileId);
    List<TreeNodeResponse> getAncestors(UUID profileId);
    void updateRelationship(RelationshipUpdateRequest request);
    byte[] exportTree();
}
