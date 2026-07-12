package com.family.common.exception;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String message) {
        super("RESOURCE_NOT_FOUND", message);
    }
}
