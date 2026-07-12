package com.family.modules.tree.controller;

import com.family.common.dto.ApiResponse;
import com.family.modules.tree.dto.RelationshipUpdateRequest;
import com.family.modules.tree.dto.TreeNodeDto;
import com.family.modules.tree.service.FamilyTreeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tree")
@RequiredArgsConstructor
public class FamilyTreeController {

    private final FamilyTreeService familyTreeService;

    @GetMapping
    @PreAuthorize("hasAuthority('TREE_VIEW')")
    public ResponseEntity<ApiResponse<TreeNodeDto>> getFullTree() {
        return ResponseEntity.ok(ApiResponse.success(familyTreeService.getFullTree()));
    }

    @GetMapping("/{profileId}")
    @PreAuthorize("hasAuthority('TREE_VIEW')")
    public ResponseEntity<ApiResponse<TreeNodeDto>> getSubTree(@PathVariable UUID profileId) {
        return ResponseEntity.ok(ApiResponse.success(familyTreeService.getSubTree(profileId)));
    }

    @GetMapping("/ancestors/{profileId}")
    @PreAuthorize("hasAuthority('TREE_VIEW')")
    public ResponseEntity<ApiResponse<List<TreeNodeDto>>> getAncestors(@PathVariable UUID profileId) {
        return ResponseEntity.ok(ApiResponse.success(familyTreeService.getAncestors(profileId)));
    }

    @PutMapping("/relationship")
    @PreAuthorize("hasAuthority('TREE_EDIT')")
    public ResponseEntity<ApiResponse<Void>> updateRelationship(@Valid @RequestBody RelationshipUpdateRequest request) {
        familyTreeService.updateRelationship(request);
        return ResponseEntity.ok(ApiResponse.success("Relationship updated successfully", null));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('TREE_EXPORT')")
    public ResponseEntity<byte[]> exportTree() {
        byte[] data = familyTreeService.exportTree();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=family-tree.json")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }
}
