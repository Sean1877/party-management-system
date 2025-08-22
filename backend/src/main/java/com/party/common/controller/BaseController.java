package com.party.common.controller;

import com.party.common.response.ResponseUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 基础控制器类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public class BaseController {

    /**
     * 成功响应
     */
    protected ResponseEntity<Map<String, Object>> success() {
        return ResponseUtils.success();
    }

    /**
     * 成功响应带数据
     */
    protected ResponseEntity<Map<String, Object>> success(Object data) {
        return ResponseUtils.success(data);
    }

    /**
     * 成功响应带消息和数据
     */
    protected ResponseEntity<Map<String, Object>> success(String message, Object data) {
        return ResponseUtils.success(message, data);
    }

    /**
     * 错误响应
     */
    protected ResponseEntity<Map<String, Object>> error(String message) {
        return ResponseUtils.error(message);
    }

    /**
     * 错误响应带数据
     */
    protected ResponseEntity<Map<String, Object>> error(String message, Object data) {
        return ResponseUtils.error(message, data);
    }

    /**
     * 参数验证错误响应
     */
    protected ResponseEntity<Map<String, Object>> badRequest(String message) {
        return ResponseUtils.badRequest(message);
    }

    /**
     * 未授权响应
     */
    protected ResponseEntity<Map<String, Object>> unauthorized(String message) {
        return ResponseUtils.unauthorized(message);
    }

    /**
     * 禁止访问响应
     */
    protected ResponseEntity<Map<String, Object>> forbidden(String message) {
        return ResponseUtils.forbidden(message);
    }

    /**
     * 资源不存在响应
     */
    protected ResponseEntity<Map<String, Object>> notFound(String message) {
        return ResponseUtils.notFound(message);
    }
}