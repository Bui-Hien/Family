package com.family.modules.auditlog.service;

import java.util.List;
import java.util.function.Function;

public interface AuditLogService {
    <T> void logChanges(List<T> oldEntities, List<T> newEntities);
    <T> void logChange(T oldEntity, T newEntity);
    <T> T cloneObject(T object, Class<T> clazz);
}
