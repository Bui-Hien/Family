package com.family.common.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ValidationException extends BusinessException {
    private Map<String, String> errors;

    public ValidationException(String message) {
        super("VALIDATION_FAILED", message);
    }

    public ValidationException(String message, Map<String, String> errors) {
        super("VALIDATION_FAILED", message);
        this.errors = errors;
    }
}
