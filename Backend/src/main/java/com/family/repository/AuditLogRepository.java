package com.family.repository;

import com.family.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID>{
    List<AuditLog> findByEntityNameAndEntityIdOrderByCreatedAtDesc(String entityName, UUID entityId);
    Page<AuditLog> findByEntityNameAndEntityId(String entityName, UUID entityId, Pageable pageable);
}
