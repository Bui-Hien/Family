package com.family.entity;

import com.family.common.util.UuidUtils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "tbl_audit_logs", indexes = {
        @Index(name = "idx_entity_id_created_at", columnList = "entity_id, created_at"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
public class AuditLog {
    @Id
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private UUID id;

    @Column(name = "entity_id", updatable = false)
    private UUID entityId;

    @Column(name = "entity_name", updatable = false)
    private String entityName;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private UUID createdBy;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "data", columnDefinition = "json")
    private Object data;

    @PrePersist
    protected void onCreateId() {
        if (this.id == null) {
            this.id = UuidUtils.generateUuidV7();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
