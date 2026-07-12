package com.family.modules.tree.service;

import com.family.modules.tree.dto.RelationshipUpdateRequest;
import com.family.modules.tree.dto.TreeNodeDto;

import java.util.List;
import java.util.UUID;

public interface FamilyTreeService {
    TreeNodeDto getFullTree();
    TreeNodeDto getSubTree(UUID profileId);
    List<TreeNodeDto> getAncestors(UUID profileId);
    void updateRelationship(RelationshipUpdateRequest request);
    byte[] exportTree();
}
