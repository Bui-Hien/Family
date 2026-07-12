package com.family.modules.auditlog.service;

import com.family.modules.auditlog.dto.AuditLogResponse;
import com.family.common.dto.PagingRequest;
import org.springframework.data.domain.Page;
import java.util.UUID;
import java.util.List;
import java.util.function.Function;

public interface AuditLogService {
    <T> void logChanges(List<T> oldEntities, List<T> newEntities);
    <T> void logChange(T oldEntity, T newEntity);
    <T> T cloneObject(T object, Class<T> clazz);
    List<AuditLogResponse> getLogsByEntity(String entityName, UUID entityId);
    Page<AuditLogResponse> getLogsByEntityPaged(String entityName, UUID entityId, PagingRequest request);
}
