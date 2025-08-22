package com.party.common.exception;

/**
 * 业务异常类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public class BusinessException extends RuntimeException {
    
    private final int code;
    private final String message;

    public BusinessException(String message) {
        this(500, message);
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}