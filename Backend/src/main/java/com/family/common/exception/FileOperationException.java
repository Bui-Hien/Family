package com.family.common.exception;

import lombok.Getter;

@Getter
public class FileOperationException extends BusinessException {
    public FileOperationException(String message) {
        super("FILE_OPERATION_FAILED", message);
    }

    public FileOperationException(String message, Throwable cause) {
        super("FILE_OPERATION_FAILED", message);
        initCause(cause);
    }
}
