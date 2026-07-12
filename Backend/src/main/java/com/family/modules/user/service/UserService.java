package com.family.modules.user.service;

import com.family.common.dto.PagingRequest;
import com.family.common.enums.RoleEnum;
import com.family.modules.user.dto.UserRequest;
import com.family.modules.user.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getById(UUID id);
    List<User> getAll();
    Page<User> getPaged(PagingRequest request);
    User create(UserRequest request);
    User update(UUID id, UserRequest request);
    void delete(UUID id);
    User changeRole(UUID id, RoleEnum role);
}
