package com.family.modules.user.entity;

import com.family.common.base.BaseEntity;
import com.family.common.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.javers.core.metamodel.annotation.DiffIgnore;
import com.family.modules.profile.entity.Profile;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private RoleEnum role;

    @Column(name = "is_enabled", nullable = false)
    private Boolean enabled = true;

    @Column(name = "is_locked", nullable = false)
    private Boolean locked = false;

    @Column(name = "profile_id")
    private UUID profileId;

    @JsonIgnore
    @DiffIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", insertable = false, updatable = false)
    private Profile profile;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "refresh_token_expiry")
    private LocalDateTime refreshTokenExpiry;
}
