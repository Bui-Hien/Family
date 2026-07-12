package com.family.common.exception;

import lombok.Getter;

@Getter
public class UnauthorizedException extends BusinessException {
    public UnauthorizedException(String message) {
        super("UNAUTHORIZED", message);
    }
}
