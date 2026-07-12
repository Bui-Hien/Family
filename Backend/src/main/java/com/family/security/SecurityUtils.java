package com.family.security;

import com.family.common.enums.PrivilegeEnum;
import com.family.common.enums.RoleEnum;
import com.family.modules.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

public class SecurityUtils {

    public static Optional<CustomUserDetails> getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return Optional.of((CustomUserDetails) principal);
        }
        return Optional.empty();
    }

    public static Optional<User> getCurrentUser() {
        return getCurrentUserDetails().map(CustomUserDetails::getUser);
    }

    public static Optional<UUID> getCurrentUserId() {
        return getCurrentUserDetails().map(CustomUserDetails::getId);
    }

    public static Optional<String> getCurrentUsername() {
        return getCurrentUserDetails().map(UserDetails::getUsername);
    }

    public static boolean hasRole(RoleEnum role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(role.name()));
    }

    public static boolean hasPrivilege(PrivilegeEnum privilege) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(privilege.name()));
    }
}
