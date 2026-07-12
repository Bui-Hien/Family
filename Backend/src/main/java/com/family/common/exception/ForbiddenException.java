package com.family.common.exception;

import lombok.Getter;

@Getter
public class ForbiddenException extends BusinessException {
    public ForbiddenException(String message) {
        super("FORBIDDEN_ACCESS", message);
    }
}
