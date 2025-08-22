package com.party.common.exception;

/**
 * 资源不存在异常
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public class ResourceNotFoundException extends BusinessException {
    
    public ResourceNotFoundException(String message) {
        super(404, message);
    }

    public ResourceNotFoundException(String resource, String id) {
        super(404, String.format("%s 不存在: %s", resource, id));
    }
}