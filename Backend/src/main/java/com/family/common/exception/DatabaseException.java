package com.family.common.exception;

import lombok.Getter;

@Getter
public class DatabaseException extends BusinessException {
    public DatabaseException(String message) {
        super("DATABASE_ERROR", message);
    }

    public DatabaseException(String message, Throwable cause) {
        super("DATABASE_ERROR", message);
        initCause(cause);
    }
}
