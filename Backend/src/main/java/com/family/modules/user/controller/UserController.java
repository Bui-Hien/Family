package com.family.modules.user.controller;

import com.family.common.dto.ApiResponse;
import com.family.common.dto.PagingRequest;
import com.family.common.dto.PagingResponse;
import com.family.common.enums.RoleEnum;
import com.family.modules.user.dto.UserRequest;
import com.family.modules.user.entity.User;
import com.family.modules.user.service.UserService;
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

    @GetMapping
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<List<User>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAll()));
    }

    @PostMapping("/page")
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<PagingResponse<User>>> getPaged(@Valid @RequestBody PagingRequest request) {
        Page<User> page = userService.getPaged(request);
        return ResponseEntity.ok(ApiResponse.success(PagingResponse.fromPage(page)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_VIEW')")
    public ResponseEntity<ApiResponse<User>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<ApiResponse<User>> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", userService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_EDIT')")
    public ResponseEntity<ApiResponse<User>> update(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", userService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('USER_ROLE')")
    public ResponseEntity<ApiResponse<User>> changeRole(@PathVariable UUID id, @RequestParam RoleEnum role) {
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", userService.changeRole(id, role)));
    }
}
