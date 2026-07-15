package com.family.dto.request;

import com.family.common.enums.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class UserRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String password; // Optional if updating, required if creating

    @NotNull(message = "Role is required")
    private RoleEnum role;

    private UUID profileId;
}
