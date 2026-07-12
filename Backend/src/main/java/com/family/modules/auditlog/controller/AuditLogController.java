package com.family.modules.auditlog.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.modules.auditlog.dto.AuditLogResponse;
import com.family.modules.auditlog.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/{entityName}/{entityId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getEntityLogs(
            @PathVariable String entityName,
            @PathVariable UUID entityId
    ) {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getLogsByEntity(entityName, entityId)));
    }

    @PostMapping("/{entityName}/{entityId}/page")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PagingResponse<AuditLogResponse>>> getEntityLogsPaged(
            @PathVariable String entityName,
            @PathVariable UUID entityId,
            @RequestBody PagingRequest request
    ) {
        Page<AuditLogResponse> page = auditLogService.getLogsByEntityPaged(entityName, entityId, request);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(page)));
    }
}
