package com.family.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private UUID userId;
    private String username;
    private String fullName;
    private String role;
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
}
