package com.party.common.exception;

/**
 * 资源已存在异常
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public class ResourceAlreadyExistsException extends BusinessException {
    
    public ResourceAlreadyExistsException(String message) {
        super(409, message);
    }

    public ResourceAlreadyExistsException(String resource, String value) {
        super(409, String.format("%s 已存在: %s", resource, value));
    }
}