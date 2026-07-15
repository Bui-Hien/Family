package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.common.enums.RoleEnum;
import com.family.entity.User;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserResponse extends BaseResponse {
    private String username;
    private String email;
    private String phoneNumber;
    private String fullName;
    private RoleEnum role;
    private Boolean enabled;
    private Boolean locked;
    private UUID profileId;

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .fullName(user.getFullName())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .locked(user.getLocked())
                .profileId(user.getProfileId())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
