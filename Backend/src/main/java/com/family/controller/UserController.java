package com.family.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.common.enums.RoleEnum;
import com.family.dto.request.UserRequest;
import com.family.dto.response.UserResponse;
import com.family.entity.User;
import com.family.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;



    @PostMapping("/page")
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<UserResponse>>> getPaged(@Valid @RequestBody PagingRequest request) {
        Page<User> page = userService.getPaged(request);
        Page<UserResponse> dtoPage = page.map(UserResponse::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(dtoPage)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<UserResponse>> getById(@PathVariable UUID id) {
        User user = userService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(UserResponse.fromEntity(user)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<ApiResponse<UserResponse>> create(@Valid @RequestBody UserRequest request) {
        User user = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", UserResponse.fromEntity(user)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_EDIT')")
    public ResponseEntity<ApiResponse<UserResponse>> update(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
        User user = userService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", UserResponse.fromEntity(user)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('USER_ROLE')")
    public ResponseEntity<ApiResponse<UserResponse>> changeRole(@PathVariable UUID id, @RequestParam RoleEnum role) {
        User user = userService.changeRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", UserResponse.fromEntity(user)));
    }
}
