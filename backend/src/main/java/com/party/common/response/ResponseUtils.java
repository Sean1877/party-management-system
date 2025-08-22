package com.party.common.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

/**
 * 统一响应工具类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public class ResponseUtils {

    /**
     * 成功响应
     */
    public static ResponseEntity<Map<String, Object>> success() {
        return success(null);
    }

    /**
     * 成功响应带数据
     */
    public static ResponseEntity<Map<String, Object>> success(Object data) {
        return success("操作成功", data);
    }

    /**
     * 成功响应带消息和数据
     */
    public static ResponseEntity<Map<String, Object>> success(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        return ResponseEntity.ok(response);
    }

    /**
     * 错误响应
     */
    public static ResponseEntity<Map<String, Object>> error(String message) {
        return error(message, null);
    }

    /**
     * 错误响应带数据
     */
    public static ResponseEntity<Map<String, Object>> error(String message, Object data) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, message, data);
    }

    /**
     * 错误响应带状态码
     */
    public static ResponseEntity<Map<String, Object>> error(HttpStatus status, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("data", data);
        return ResponseEntity.status(status).body(response);
    }

    /**
     * 错误响应带状态码和消息
     */
    public static ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return error(status, message, null);
    }

    /**
     * 参数验证错误响应
     */
    public static ResponseEntity<Map<String, Object>> badRequest(String message) {
        return error(HttpStatus.BAD_REQUEST, message);
    }

    /**
     * 未授权响应
     */
    public static ResponseEntity<Map<String, Object>> unauthorized(String message) {
        return error(HttpStatus.UNAUTHORIZED, message);
    }

    /**
     * 禁止访问响应
     */
    public static ResponseEntity<Map<String, Object>> forbidden(String message) {
        return error(HttpStatus.FORBIDDEN, message);
    }

    /**
     * 资源不存在响应
     */
    public static ResponseEntity<Map<String, Object>> notFound(String message) {
        return error(HttpStatus.NOT_FOUND, message);
    }
}