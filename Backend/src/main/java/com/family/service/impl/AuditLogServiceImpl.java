package com.family.service.impl;

import com.family.dto.response.AuditLogResponse;
import com.family.entity.AuditLog;
import com.family.repository.AuditLogRepository;
import com.family.service.AuditLogService;
import com.family.repository.UserRepository;
import com.family.security.SecurityUtils;
import com.family.common.dto.PagingRequest;
import org.springframework.data.domain.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Id;
import lombok.RequiredArgsConstructor;
import org.javers.core.Javers;
import org.javers.core.diff.Diff;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final ObjectMapper objectMapper;
    private final Javers javers;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Async
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public <T> void logChanges(List<T> oldEntities, List<T> newEntities) {
//        UUID userId = SecurityUtils.getCurrentUserId()
//                .orElseThrow(() -> new SecurityException("User not logged in"));
        UUID userId = UUID.fromString("019f37d7-5988-7183-a6d9-5c0b61f1b189");

        List<AuditLog> logsToSave = new ArrayList<>();

        for (int i = 0; i < newEntities.size(); i++) {
            T oldObj = oldEntities.get(i);
            T newObj = newEntities.get(i);

            Diff diff = javers.compare(oldObj, newObj);

            if (diff.hasChanges()) {
                AuditLog log = new AuditLog();
                log.setEntityId(extractId(newObj)); // Tự động lấy ID
                log.setEntityName(newObj.getClass().getSimpleName());
                log.setCreatedBy(userId);
                log.setData(javers.getJsonConverter().toJson(diff));
                logsToSave.add(log);
            }
        }

        if (!logsToSave.isEmpty()) {
            auditLogRepository.saveAll(logsToSave);
        }
    }

    @Override
    public <T> void logChange(T oldEntity, T newEntity) {
        UUID userId = UUID.fromString("019f37d7-5988-7183-a6d9-5c0b61f1b189");
//
//        UUID userId = SecurityUtils.getCurrentUserId()
//                .orElseThrow(() -> new SecurityException("User not logged in"));

        Diff diff = javers.compare(oldEntity, newEntity);

        if (diff.hasChanges()) {
            AuditLog log = new AuditLog();
            log.setEntityId(extractId(newEntity)); // Tự động lấy ID
            log.setEntityName(newEntity.getClass().getSimpleName());
            log.setCreatedBy(userId);
            log.setData(javers.getJsonConverter().toJson(diff));

            auditLogRepository.save(log);
        }
    }

    @Override
    public <T> T cloneObject(T object, Class<T> clazz) {
        if (object == null) return null;
        try {
            return objectMapper.readValue(objectMapper.writeValueAsString(object), clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to clone object for Audit Log", e);
        }
    }

    @Override
    public List<AuditLogResponse> getLogsByEntity(String entityName, UUID entityId) {
        List<AuditLog> logs = auditLogRepository.findByEntityNameAndEntityIdOrderByCreatedAtDesc(entityName, entityId);
        return logs.stream().map(log -> {
            AuditLogResponse resp = new AuditLogResponse();
            resp.setId(log.getId());
            resp.setEntityId(log.getEntityId());
            resp.setEntityName(log.getEntityName());
            resp.setCreatedAt(log.getCreatedAt());
            resp.setCreatedBy(log.getCreatedBy());
            resp.setData(log.getData());
            if (log.getCreatedBy() != null) {
                userRepository.findById(log.getCreatedBy())
                    .ifPresent(u -> resp.setCreatedByName(u.getFullName() != null ? u.getFullName() : u.getUsername()));
            }
            return resp;
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getLogsByEntityPaged(String entityName, UUID entityId, PagingRequest request) {
        if (request.getSortField() == null || request.getSortField().trim().isEmpty()) {
            request.setSortField("createdAt");
            request.setSortDirection("DESC");
        }
        Page<AuditLog> page = auditLogRepository.findByEntityNameAndEntityId(entityName, entityId, request.toPageable());
        return page.map(log -> {
            AuditLogResponse resp = new AuditLogResponse();
            resp.setId(log.getId());
            resp.setEntityId(log.getEntityId());
            resp.setEntityName(log.getEntityName());
            resp.setCreatedAt(log.getCreatedAt());
            resp.setCreatedBy(log.getCreatedBy());
            resp.setData(log.getData());
            if (log.getCreatedBy() != null) {
                userRepository.findById(log.getCreatedBy())
                    .ifPresent(u -> resp.setCreatedByName(u.getFullName() != null ? u.getFullName() : u.getUsername()));
            }
            return resp;
        });
    }

    private UUID extractId(Object entity) {
        // Tìm field có @Id (hỗ trợ cả class cha nếu cần)
        Class<?> clazz = entity.getClass();
        while (clazz != null) {
            for (Field field : clazz.getDeclaredFields()) {
                if (field.isAnnotationPresent(Id.class)) {
                    field.setAccessible(true);
                    try {
                        return (UUID) field.get(entity);
                    } catch (IllegalAccessException e) {
                        return null;
                    }
                }
            }
            clazz = clazz.getSuperclass();
        }
        return null;
    }
}