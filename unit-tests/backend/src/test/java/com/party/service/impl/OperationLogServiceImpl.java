package com.party.service.impl;

import com.party.entity.OperationLog;
import com.party.repository.OperationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * 操作日志服务实现类 - 测试用简化版本
 */
@Service
public class OperationLogServiceImpl {
    
    @Autowired
    private OperationLogRepository operationLogRepository;
    
    public List<OperationLog> findAll() {
        return operationLogRepository.findAll();
    }

    public Page<OperationLog> findAll(Pageable pageable) {
        return operationLogRepository.findAll(pageable);
    }
    
    public Optional<OperationLog> findById(Long id) {
        return operationLogRepository.findById(id);
    }
    
    public List<OperationLog> findByUserId(Long userId) {
        return operationLogRepository.findByUserId(userId);
    }
    
    public List<OperationLog> findByOperationType(String operationType) {
        return operationLogRepository.findByOperationType(operationType);
    }
    
    public List<OperationLog> findByOperationModule(String operationModule) {
        return operationLogRepository.findByOperationModule(operationModule);
    }
    
    public List<OperationLog> findByDateRange(LocalDateTime startTime, LocalDateTime endTime) {
        return operationLogRepository.findByCreatedAtBetween(startTime, endTime);
    }
    
    public List<OperationLog> findByIpAddress(String ipAddress) {
        return operationLogRepository.findByIpAddress(ipAddress);
    }
    
    public List<OperationLog> findByUsername(String username) {
        return operationLogRepository.findByUsername(username);
    }
    
    public OperationLog save(OperationLog operationLog) {
        if (operationLog.getCreatedAt() == null) {
            operationLog.setCreatedAt(LocalDateTime.now());
        }
        return operationLogRepository.save(operationLog);
    }
    
    @Async
    public CompletableFuture<OperationLog> saveAsync(OperationLog operationLog) {
        OperationLog saved = save(operationLog);
        return CompletableFuture.completedFuture(saved);
    }
    
    public void deleteById(Long id) {
        if (operationLogRepository.existsById(id)) {
            operationLogRepository.deleteById(id);
        }
    }
    
    public void deleteByUserId(Long userId) {
        List<OperationLog> userLogs = operationLogRepository.findByUserId(userId);
        operationLogRepository.deleteAll(userLogs);
    }
    
    public void deleteOldLogs(LocalDateTime beforeDate) {
        List<OperationLog> oldLogs = operationLogRepository.findByCreatedAtBetween(
            LocalDateTime.of(1970, 1, 1, 0, 0), beforeDate);
        operationLogRepository.deleteAll(oldLogs);
    }
    
    public Long deleteByDateRange(LocalDateTime startTime, LocalDateTime endTime) {
        return operationLogRepository.deleteByCreatedAtBetween(startTime, endTime);
    }
    
    public List<OperationLog> findByResponseStatusGreaterThanEqual(Integer status) {
        return operationLogRepository.findByResponseStatusGreaterThanEqual(status);
    }
    
    public List<OperationLog> findByExecutionTimeGreaterThan(Long time) {
        return operationLogRepository.findByExecutionTimeGreaterThan(time);
    }
    
    public List<OperationLog> findRecentLogs(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return operationLogRepository.findRecentLogs(pageable);
    }
    
    public long countByOperationType(String operationType) {
        return operationLogRepository.countByOperationType(operationType);
    }

    public long countByOperationModule(String operationModule) {
        return operationLogRepository.countByOperationModule(operationModule);
    }

    public long countByUserId(Long userId) {
        return operationLogRepository.countByUserId(userId);
    }
    
    public void logOperation(Long userId, String username, String operationType, 
                           String operationModule, String description, 
                           String requestMethod, String requestUrl, 
                           String requestParams, Integer responseStatus, 
                           Long executionTime, String ipAddress, String userAgent) {
        OperationLog log = new OperationLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setOperationType(operationType);
        log.setOperationModule(operationModule);
        log.setOperationDescription(description);
        log.setRequestMethod(requestMethod);
        log.setRequestUrl(requestUrl);
        log.setRequestParams(requestParams);
        log.setResponseStatus(responseStatus);
        log.setExecutionTime(executionTime);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setCreatedAt(LocalDateTime.now());
        
        save(log);
    }
    
    public List<Object[]> findTopOperationsByUser(Long userId, int limit) {
        return operationLogRepository.findTopOperationsByUserId(userId, PageRequest.of(0, limit));
    }
}