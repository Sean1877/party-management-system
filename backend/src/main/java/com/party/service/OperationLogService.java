package com.party.service;

import com.party.entity.OperationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 操作日志服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface OperationLogService {

    // ==================== 基础CRUD操作 ====================

    /**
     * 保存操作日志
     */
    OperationLog save(OperationLog operationLog);

    /**
     * 根据ID查找操作日志
     */
    OperationLog findById(Long id);

    /**
     * 删除操作日志
     */
    void deleteById(Long id);

    /**
     * 批量删除操作日志
     */
    void deleteByIds(List<Long> ids);

    // ==================== 查询操作 ====================

    /**
     * 分页查询所有操作日志
     */
    Page<OperationLog> findAll(Pageable pageable);

    /**
     * 根据用户ID分页查询操作日志
     */
    Page<OperationLog> findByUserId(Long userId, Pageable pageable);

    /**
     * 根据用户名分页查询操作日志
     */
    Page<OperationLog> findByUsername(String username, Pageable pageable);

    /**
     * 根据操作类型分页查询操作日志
     */
    Page<OperationLog> findByOperationType(String operationType, Pageable pageable);

    /**
     * 根据操作模块分页查询操作日志
     */
    Page<OperationLog> findByOperationModule(String operationModule, Pageable pageable);

    /**
     * 根据时间范围分页查询操作日志
     */
    Page<OperationLog> findByDateRange(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 多条件搜索操作日志
     */
    Page<OperationLog> searchLogs(Long userId, String username, String operationType, 
                                 String operationModule, String targetType, Boolean success,
                                 String ipAddress, LocalDateTime startTime, LocalDateTime endTime,
                                 String keyword, Pageable pageable);

    // ==================== 日志记录操作 ====================

    /**
     * 记录操作日志
     */
    void log(String operationType, String operationModule, String operationDescription);

    /**
     * 记录操作日志（带目标信息）
     */
    void log(String operationType, String operationModule, String operationDescription,
             String targetType, Long targetId, String targetName);

    /**
     * 记录操作日志（带用户信息）
     */
    void log(Long userId, String username, String operationType, String operationModule, 
             String operationDescription);

    /**
     * 记录操作日志（完整信息）
     */
    void log(Long userId, String username, String operationType, String operationModule,
             String operationDescription, String targetType, Long targetId, String targetName,
             String requestMethod, String requestUrl, String requestParams,
             Integer responseStatus, String responseMessage, String ipAddress, String userAgent,
             Long executionTime, Boolean success, String errorMessage);

    /**
     * 记录成功操作
     */
    void logSuccess(String operationType, String operationModule, String operationDescription);

    /**
     * 记录失败操作
     */
    void logError(String operationType, String operationModule, String operationDescription, String errorMessage);

    /**
     * 记录用户登录
     */
    void logLogin(Long userId, String username, String ipAddress, String userAgent, Boolean success);

    /**
     * 记录用户登出
     */
    void logLogout(Long userId, String username, String ipAddress);

    // ==================== 统计分析操作 ====================

    /**
     * 统计指定时间范围内的操作日志数量
     */
    Long countByDateRange(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 统计指定用户的操作日志数量
     */
    Long countByUserId(Long userId);

    /**
     * 统计指定操作类型的日志数量
     */
    Long countByOperationType(String operationType);

    /**
     * 统计成功/失败的操作数量
     */
    Long countBySuccess(Boolean success);

    /**
     * 按操作类型统计日志数量
     */
    Map<String, Long> countByOperationTypeGrouped(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 按操作模块统计日志数量
     */
    Map<String, Long> countByOperationModuleGrouped(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 按用户统计操作日志数量
     */
    Map<String, Long> countByUsernameGrouped(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 按日期统计操作日志数量
     */
    Map<String, Long> countByDateGrouped(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取操作统计概览
     */
    Map<String, Object> getOperationStatistics(LocalDateTime startTime, LocalDateTime endTime);

    // ==================== 数据维护操作 ====================

    /**
     * 获取所有操作类型
     */
    List<String> getAllOperationTypes();

    /**
     * 获取所有操作模块
     */
    List<String> getAllOperationModules();

    /**
     * 获取所有目标类型
     */
    List<String> getAllTargetTypes();

    /**
     * 获取最近的操作日志
     */
    List<OperationLog> getRecentLogs(int limit);

    /**
     * 获取指定用户最近的操作日志
     */
    List<OperationLog> getRecentLogsByUser(Long userId, int limit);

    /**
     * 清理指定时间之前的操作日志
     */
    void cleanupOldLogs(LocalDateTime beforeTime);

    /**
     * 清理指定天数之前的操作日志
     */
    void cleanupOldLogs(int daysToKeep);

    // ==================== 导出操作 ====================

    /**
     * 导出操作日志到CSV
     */
    byte[] exportToCsv(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 导出操作日志到Excel
     */
    byte[] exportToExcel(LocalDateTime startTime, LocalDateTime endTime);
}