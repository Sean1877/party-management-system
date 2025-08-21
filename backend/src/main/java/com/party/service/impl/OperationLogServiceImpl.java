package com.party.service.impl;

import com.party.entity.OperationLog;
import com.party.repository.OperationLogRepository;
import com.party.service.OperationLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 操作日志服务实现类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Service
@Transactional
public class OperationLogServiceImpl implements OperationLogService {

    private static final Logger logger = LoggerFactory.getLogger(OperationLogServiceImpl.class);

    @Autowired
    private OperationLogRepository operationLogRepository;

    // ==================== 基础CRUD操作 ====================

    @Override
    public OperationLog save(OperationLog operationLog) {
        try {
            return operationLogRepository.save(operationLog);
        } catch (Exception e) {
            logger.error("保存操作日志失败: {}", e.getMessage(), e);
            throw new RuntimeException("保存操作日志失败", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public OperationLog findById(Long id) {
        return operationLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("操作日志不存在: " + id));
    }

    @Override
    public void deleteById(Long id) {
        try {
            operationLogRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("删除操作日志失败: {}", e.getMessage(), e);
            throw new RuntimeException("删除操作日志失败", e);
        }
    }

    @Override
    public void deleteByIds(List<Long> ids) {
        try {
            operationLogRepository.deleteAllById(ids);
        } catch (Exception e) {
            logger.error("批量删除操作日志失败: {}", e.getMessage(), e);
            throw new RuntimeException("批量删除操作日志失败", e);
        }
    }

    // ==================== 查询操作 ====================

    @Override
    @Transactional(readOnly = true)
    public Page<OperationLog> findAll(Pageable pageable) {
        return operationLogRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OperationLog> findByUserId(Long userId, Pageable pageable) {
        return operationLogRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OperationLog> findByUsername(String username, Pageable pageable) {
        return operationLogRepository.findByUsername(username, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OperationLog> findByOperationType(String operationType, Pageable pageable) {
        return operationLogRepository.findByOperationType(operationType, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OperationLog> findByOperationModule(String operationModule, Pageable pageable) {
        return operationLogRepository.findByOperationModule(operationModule, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OperationLog> findByDateRange(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable) {
        return operationLogRepository.findByCreatedAtBetween(startTime, endTime, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OperationLog> searchLogs(Long userId, String username, String operationType,
                                        String operationModule, String targetType, Boolean success,
                                        String ipAddress, LocalDateTime startTime, LocalDateTime endTime,
                                        String keyword, Pageable pageable) {
        return operationLogRepository.findByConditions(userId, username, operationType, operationModule,
                targetType, success, ipAddress, startTime, endTime, keyword, pageable);
    }

    // ==================== 日志记录操作 ====================

    @Override
    public void log(String operationType, String operationModule, String operationDescription) {
        OperationLog log = new OperationLog(operationType, operationModule, operationDescription);
        enrichLogWithRequestInfo(log);
        save(log);
    }

    @Override
    public void log(String operationType, String operationModule, String operationDescription,
                   String targetType, Long targetId, String targetName) {
        OperationLog log = new OperationLog(operationType, operationModule, operationDescription);
        log.setTarget(targetType, targetId, targetName);
        enrichLogWithRequestInfo(log);
        save(log);
    }

    @Override
    public void log(Long userId, String username, String operationType, String operationModule,
                   String operationDescription) {
        OperationLog log = new OperationLog(operationType, operationModule, operationDescription);
        log.setUserInfo(userId, username);
        enrichLogWithRequestInfo(log);
        save(log);
    }

    @Override
    public void log(Long userId, String username, String operationType, String operationModule,
                   String operationDescription, String targetType, Long targetId, String targetName,
                   String requestMethod, String requestUrl, String requestParams,
                   Integer responseStatus, String responseMessage, String ipAddress, String userAgent,
                   Long executionTime, Boolean success, String errorMessage) {
        OperationLog log = new OperationLog(operationType, operationModule, operationDescription);
        log.setUserInfo(userId, username);
        log.setTarget(targetType, targetId, targetName);
        log.setRequestInfo(requestMethod, requestUrl, requestParams);
        log.setResponseInfo(responseStatus, responseMessage);
        log.setClientInfo(ipAddress, userAgent);
        log.setExecutionTime(executionTime);
        log.setSuccess(success);
        if (errorMessage != null) {
            log.setErrorMessage(errorMessage);
        }
        save(log);
    }

    @Override
    public void logSuccess(String operationType, String operationModule, String operationDescription) {
        OperationLog log = new OperationLog(operationType, operationModule, operationDescription);
        log.setSuccess(true);
        enrichLogWithRequestInfo(log);
        save(log);
    }

    @Override
    public void logError(String operationType, String operationModule, String operationDescription, String errorMessage) {
        OperationLog log = new OperationLog(operationType, operationModule, operationDescription);
        log.markAsFailed(errorMessage);
        enrichLogWithRequestInfo(log);
        save(log);
    }

    @Override
    public void logLogin(Long userId, String username, String ipAddress, String userAgent, Boolean success) {
        OperationLog log = new OperationLog("LOGIN", "认证管理", success ? "用户登录成功" : "用户登录失败");
        log.setUserInfo(userId, username);
        log.setClientInfo(ipAddress, userAgent);
        log.setSuccess(success);
        if (!success) {
            log.setErrorMessage("登录失败");
        }
        save(log);
    }

    @Override
    public void logLogout(Long userId, String username, String ipAddress) {
        OperationLog log = new OperationLog("LOGOUT", "认证管理", "用户登出");
        log.setUserInfo(userId, username);
        log.setIpAddress(ipAddress);
        log.setSuccess(true);
        save(log);
    }

    // ==================== 统计分析操作 ====================

    @Override
    @Transactional(readOnly = true)
    public Long countByDateRange(LocalDateTime startTime, LocalDateTime endTime) {
        return operationLogRepository.countByCreatedAtBetween(startTime, endTime);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByUserId(Long userId) {
        return operationLogRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByOperationType(String operationType) {
        return operationLogRepository.countByOperationType(operationType);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countBySuccess(Boolean success) {
        return operationLogRepository.countBySuccess(success);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> countByOperationTypeGrouped(LocalDateTime startTime, LocalDateTime endTime) {
        List<Object[]> results = operationLogRepository.countByOperationTypeGrouped(startTime, endTime);
        return results.stream().collect(Collectors.toMap(
                result -> (String) result[0],
                result -> (Long) result[1],
                (existing, replacement) -> existing,
                LinkedHashMap::new
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> countByOperationModuleGrouped(LocalDateTime startTime, LocalDateTime endTime) {
        List<Object[]> results = operationLogRepository.countByOperationModuleGrouped(startTime, endTime);
        return results.stream().collect(Collectors.toMap(
                result -> (String) result[0],
                result -> (Long) result[1],
                (existing, replacement) -> existing,
                LinkedHashMap::new
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> countByUsernameGrouped(LocalDateTime startTime, LocalDateTime endTime) {
        List<Object[]> results = operationLogRepository.countByUsernameGrouped(startTime, endTime);
        return results.stream().collect(Collectors.toMap(
                result -> (String) result[0],
                result -> (Long) result[1],
                (existing, replacement) -> existing,
                LinkedHashMap::new
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> countByDateGrouped(LocalDateTime startTime, LocalDateTime endTime) {
        List<Object[]> results = operationLogRepository.countByDateGrouped(startTime, endTime);
        return results.stream().collect(Collectors.toMap(
                result -> result[0].toString(),
                result -> (Long) result[1],
                (existing, replacement) -> existing,
                LinkedHashMap::new
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOperationStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总操作数
        Long totalOperations = countByDateRange(startTime, endTime);
        statistics.put("totalOperations", totalOperations);
        
        // 成功操作数
        Long successOperations = countBySuccess(true);
        statistics.put("successOperations", successOperations);
        
        // 失败操作数
        Long failedOperations = countBySuccess(false);
        statistics.put("failedOperations", failedOperations);
        
        // 成功率
        double successRate = totalOperations > 0 ? (double) successOperations / totalOperations * 100 : 0;
        statistics.put("successRate", Math.round(successRate * 100.0) / 100.0);
        
        // 按操作类型统计
        statistics.put("operationTypeStats", countByOperationTypeGrouped(startTime, endTime));
        
        // 按操作模块统计
        statistics.put("operationModuleStats", countByOperationModuleGrouped(startTime, endTime));
        
        // 按用户统计
        statistics.put("userStats", countByUsernameGrouped(startTime, endTime));
        
        // 按日期统计
        statistics.put("dateStats", countByDateGrouped(startTime, endTime));
        
        return statistics;
    }

    // ==================== 数据维护操作 ====================

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllOperationTypes() {
        return operationLogRepository.findAllOperationTypes();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllOperationModules() {
        return operationLogRepository.findAllOperationModules();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllTargetTypes() {
        return operationLogRepository.findAllTargetTypes();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OperationLog> getRecentLogs(int limit) {
        return operationLogRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OperationLog> getRecentLogsByUser(Long userId, int limit) {
        return operationLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public void cleanupOldLogs(LocalDateTime beforeTime) {
        try {
            operationLogRepository.deleteByCreatedAtBefore(beforeTime);
            logger.info("清理{}之前的操作日志完成", beforeTime);
        } catch (Exception e) {
            logger.error("清理操作日志失败: {}", e.getMessage(), e);
            throw new RuntimeException("清理操作日志失败", e);
        }
    }

    @Override
    public void cleanupOldLogs(int daysToKeep) {
        LocalDateTime beforeTime = LocalDateTime.now().minusDays(daysToKeep);
        cleanupOldLogs(beforeTime);
    }

    // ==================== 导出操作 ====================

    @Override
    @Transactional(readOnly = true)
    public byte[] exportToCsv(LocalDateTime startTime, LocalDateTime endTime) {
        try {
            List<OperationLog> logs = operationLogRepository.findByCreatedAtBetween(startTime, endTime, null).getContent();
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
            
            // 写入CSV头部
            writer.write("ID,用户ID,用户名,操作类型,操作模块,操作描述,目标类型,目标ID,目标名称,请求方法,请求URL,响应状态,IP地址,是否成功,错误信息,创建时间\n");
            
            // 写入数据
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            for (OperationLog log : logs) {
                writer.write(String.format("%d,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                        log.getId(),
                        log.getUserId() != null ? log.getUserId() : "",
                        log.getUsername() != null ? log.getUsername() : "",
                        log.getOperationType() != null ? log.getOperationType() : "",
                        log.getOperationModule() != null ? log.getOperationModule() : "",
                        log.getOperationDescription() != null ? log.getOperationDescription() : "",
                        log.getTargetType() != null ? log.getTargetType() : "",
                        log.getTargetId() != null ? log.getTargetId() : "",
                        log.getTargetName() != null ? log.getTargetName() : "",
                        log.getRequestMethod() != null ? log.getRequestMethod() : "",
                        log.getRequestUrl() != null ? log.getRequestUrl() : "",
                        log.getResponseStatus() != null ? log.getResponseStatus() : "",
                        log.getIpAddress() != null ? log.getIpAddress() : "",
                        log.getSuccess() != null ? (log.getSuccess() ? "成功" : "失败") : "",
                        log.getErrorMessage() != null ? log.getErrorMessage() : "",
                        log.getCreatedAt() != null ? log.getCreatedAt().format(formatter) : ""
                ));
            }
            
            writer.flush();
            writer.close();
            
            return baos.toByteArray();
        } catch (IOException e) {
            logger.error("导出CSV失败: {}", e.getMessage(), e);
            throw new RuntimeException("导出CSV失败", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportToExcel(LocalDateTime startTime, LocalDateTime endTime) {
        // 这里可以使用Apache POI来生成Excel文件
        // 为了简化，暂时返回CSV格式
        return exportToCsv(startTime, endTime);
    }

    // ==================== 私有辅助方法 ====================

    /**
     * 从当前请求中获取信息并丰富日志对象
     */
    private void enrichLogWithRequestInfo(OperationLog log) {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                
                // 设置请求信息
                log.setRequestMethod(request.getMethod());
                log.setRequestUrl(request.getRequestURL().toString());
                
                // 设置客户端信息
                log.setIpAddress(getClientIpAddress(request));
                log.setUserAgent(request.getHeader("User-Agent"));
            }
        } catch (Exception e) {
            // 忽略获取请求信息的异常
            logger.debug("获取请求信息失败: {}", e.getMessage());
        }
    }

    /**
     * 获取客户端真实IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String[] headers = {"X-Forwarded-For", "X-Real-IP", "Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR"};
        
        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }
        
        return request.getRemoteAddr();
    }
}