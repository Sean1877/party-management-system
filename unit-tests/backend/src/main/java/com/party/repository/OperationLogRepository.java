package com.party.repository;

import com.party.entity.OperationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 操作日志Repository接口 - 测试用简化版本
 */
@Repository
public interface OperationLogRepository extends JpaRepository<OperationLog, Long> {
    
    List<OperationLog> findByUserId(Long userId);
    
    List<OperationLog> findByOperationType(String operationType);
    
    List<OperationLog> findByOperationModule(String operationModule);
    
    List<OperationLog> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    List<OperationLog> findByIpAddress(String ipAddress);
    
    List<OperationLog> findByUsername(String username);
    
    @Query("SELECT o FROM OperationLog o WHERE o.responseStatus >= :status")
    List<OperationLog> findByResponseStatusGreaterThanEqual(@Param("status") Integer status);
    
    @Query("SELECT o FROM OperationLog o WHERE o.executionTime > :time")
    List<OperationLog> findByExecutionTimeGreaterThan(@Param("time") Long time);
    
    @Query("SELECT o FROM OperationLog o ORDER BY o.createdAt DESC")
    List<OperationLog> findRecentLogs(org.springframework.data.domain.Pageable pageable);
    
    long countByOperationType(String operationType);
    
    long countByUserId(Long userId);
    
    long countByOperationModule(String operationModule);
    
    Long deleteByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    @Query("SELECT o.operationType, COUNT(o) FROM OperationLog o WHERE o.userId = :userId GROUP BY o.operationType ORDER BY COUNT(o) DESC")
    List<Object[]> findTopOperationsByUserId(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);
}