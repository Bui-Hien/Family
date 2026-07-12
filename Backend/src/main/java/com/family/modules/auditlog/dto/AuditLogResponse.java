package com.family.modules.auditlog.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AuditLogResponse {
    private UUID id;

    private UUID entityId;

    private String entityName;

    private LocalDateTime createdAt;

    private UUID createdBy;

    private Object data;
}
