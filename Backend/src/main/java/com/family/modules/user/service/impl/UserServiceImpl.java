package com.family.modules.user.service.impl;

import com.family.common.dto.PagingRequest;
import com.family.common.enums.RoleEnum;
import com.family.common.exception.BusinessException;
import com.family.common.exception.ResourceNotFoundException;
import com.family.modules.auditlog.service.AuditLogService;
import com.family.modules.user.dto.UserRequest;
import com.family.modules.user.entity.User;
import com.family.modules.user.repository.UserRepository;
import com.family.modules.user.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public User getById(UUID id) {
        return userRepository.findById(id)
                .filter(u -> !u.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAll().stream()
                .filter(u -> !u.getDeleted())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> getPaged(PagingRequest request) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));
            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String likePattern = "%" + request.getKeyword().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("username")), likePattern),
                        cb.like(cb.lower(root.get("email")), likePattern),
                        cb.like(cb.lower(root.get("fullName")), likePattern)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return userRepository.findAll(spec, request.toPageable());
    }

    @Override
    @Transactional
    public User create(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("USERNAME_EXISTS", "Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists");
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty() &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException("PHONE_EXISTS", "Phone number already exists");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new BusinessException("PASSWORD_REQUIRED", "Password is required when creating a new user");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setProfileId(request.getProfileId());

        user = userRepository.save(user);

        auditLogService.logChange(null, user);

        return user;
    }

    @Override
    @Transactional
    public User update(UUID id, UserRequest request) {
        User user = getById(id);
        User userOld = auditLogService.cloneObject(user, User.class);

        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("USERNAME_EXISTS", "Username already exists");
        }
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists");
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty() &&
                !request.getPhoneNumber().equals(user.getPhoneNumber()) &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException("PHONE_EXISTS", "Phone number already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setProfileId(request.getProfileId());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);

        auditLogService.logChange(userOld, user);

        return user;
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        User user = getById(id);
        User userOld = auditLogService.cloneObject(user, User.class);

        user.setDeleted(true);
        user = userRepository.save(user);
        auditLogService.logChange(userOld, user);
    }

    @Override
    @Transactional
    public User changeRole(UUID id, RoleEnum role) {
        User user = getById(id);
        User userOld = auditLogService.cloneObject(user, User.class);

        user.setRole(role);
        user = userRepository.save(user);
        auditLogService.logChange(userOld, user);

        return user;
    }
}
