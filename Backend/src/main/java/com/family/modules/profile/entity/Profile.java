package com.family.modules.profile.entity;

import com.family.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.family.modules.user.entity.User;

@Getter
@Setter
@Entity
@Table(name = "profiles")
public class Profile extends BaseEntity {

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "gender", length = 1)
    private String gender; // M = Male, F = Female

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "death_date")
    private LocalDate deathDate;

    @Column(name = "generation")
    private Integer generation;

    @Column(name = "family_id")
    private UUID familyId;

    @Column(name = "branch_code")
    private String branchCode;

    @Column(name = "occupation")
    private String occupation;

    @Lob
    @Column(name = "biography", columnDefinition = "TEXT")
    private String biography;

    @Lob
    @Column(name = "achievements", columnDefinition = "TEXT")
    private String achievements;

    @Column(name = "father_id")
    private UUID fatherId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "father_id", insertable = false, updatable = false)
    private Profile father;

    @Column(name = "mother_id")
    private UUID motherId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mother_id", insertable = false, updatable = false)
    private Profile mother;

    @Column(name = "parent_id")
    private UUID parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Profile parent;

    @Column(name = "spouse_id")
    private UUID spouseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spouse_id", insertable = false, updatable = false)
    private Profile spouse;

    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_info", columnDefinition = "json")
    private Map<String, Object> additionalInfo;
}
