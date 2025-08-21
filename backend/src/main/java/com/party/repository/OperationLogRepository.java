package com.party.repository;

import com.party.entity.OperationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 操作日志数据访问接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Repository
public interface OperationLogRepository extends JpaRepository<OperationLog, Long> {

    /**
     * 根据用户ID查找操作日志
     */
    Page<OperationLog> findByUserId(Long userId, Pageable pageable);

    /**
     * 根据用户名查找操作日志
     */
    Page<OperationLog> findByUsername(String username, Pageable pageable);

    /**
     * 根据操作类型查找操作日志
     */
    Page<OperationLog> findByOperationType(String operationType, Pageable pageable);

    /**
     * 根据操作模块查找操作日志
     */
    Page<OperationLog> findByOperationModule(String operationModule, Pageable pageable);

    /**
     * 根据目标类型查找操作日志
     */
    Page<OperationLog> findByTargetType(String targetType, Pageable pageable);

    /**
     * 根据目标ID查找操作日志
     */
    Page<OperationLog> findByTargetId(Long targetId, Pageable pageable);

    /**
     * 根据成功状态查找操作日志
     */
    Page<OperationLog> findBySuccess(Boolean success, Pageable pageable);

    /**
     * 根据IP地址查找操作日志
     */
    Page<OperationLog> findByIpAddress(String ipAddress, Pageable pageable);

    /**
     * 根据时间范围查找操作日志
     */
    Page<OperationLog> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 根据用户ID和时间范围查找操作日志
     */
    Page<OperationLog> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 根据操作类型和时间范围查找操作日志
     */
    Page<OperationLog> findByOperationTypeAndCreatedAtBetween(String operationType, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 根据操作模块和时间范围查找操作日志
     */
    Page<OperationLog> findByOperationModuleAndCreatedAtBetween(String operationModule, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 多条件搜索操作日志
     */
    @Query("SELECT ol FROM OperationLog ol WHERE " +
           "(:userId IS NULL OR ol.userId = :userId) AND " +
           "(:username IS NULL OR ol.username LIKE %:username%) AND " +
           "(:operationType IS NULL OR ol.operationType = :operationType) AND " +
           "(:operationModule IS NULL OR ol.operationModule = :operationModule) AND " +
           "(:targetType IS NULL OR ol.targetType = :targetType) AND " +
           "(:success IS NULL OR ol.success = :success) AND " +
           "(:ipAddress IS NULL OR ol.ipAddress = :ipAddress) AND " +
           "(:startTime IS NULL OR ol.createdAt >= :startTime) AND " +
           "(:endTime IS NULL OR ol.createdAt <= :endTime) AND " +
           "(:keyword IS NULL OR ol.operationDescription LIKE %:keyword% OR ol.targetName LIKE %:keyword%)")
    Page<OperationLog> findByConditions(@Param("userId") Long userId,
                                       @Param("username") String username,
                                       @Param("operationType") String operationType,
                                       @Param("operationModule") String operationModule,
                                       @Param("targetType") String targetType,
                                       @Param("success") Boolean success,
                                       @Param("ipAddress") String ipAddress,
                                       @Param("startTime") LocalDateTime startTime,
                                       @Param("endTime") LocalDateTime endTime,
                                       @Param("keyword") String keyword,
                                       Pageable pageable);

    /**
     * 统计指定时间范围内的操作日志数量
     */
    @Query("SELECT COUNT(ol) FROM OperationLog ol WHERE ol.createdAt BETWEEN :startTime AND :endTime")
    Long countByCreatedAtBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 统计指定用户的操作日志数量
     */
    Long countByUserId(Long userId);

    /**
     * 统计指定操作类型的日志数量
     */
    Long countByOperationType(String operationType);

    /**
     * 统计指定操作模块的日志数量
     */
    Long countByOperationModule(String operationModule);

    /**
     * 统计成功/失败的操作数量
     */
    Long countBySuccess(Boolean success);

    /**
     * 获取所有操作类型
     */
    @Query("SELECT DISTINCT ol.operationType FROM OperationLog ol ORDER BY ol.operationType")
    List<String> findAllOperationTypes();

    /**
     * 获取所有操作模块
     */
    @Query("SELECT DISTINCT ol.operationModule FROM OperationLog ol ORDER BY ol.operationModule")
    List<String> findAllOperationModules();

    /**
     * 获取所有目标类型
     */
    @Query("SELECT DISTINCT ol.targetType FROM OperationLog ol ORDER BY ol.targetType")
    List<String> findAllTargetTypes();

    /**
     * 获取最近的操作日志
     */
    List<OperationLog> findTop10ByOrderByCreatedAtDesc();

    /**
     * 获取指定用户最近的操作日志
     */
    List<OperationLog> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * 删除指定时间之前的操作日志
     */
    void deleteByCreatedAtBefore(LocalDateTime dateTime);

    /**
     * 按操作类型统计日志数量
     */
    @Query("SELECT ol.operationType, COUNT(ol) FROM OperationLog ol " +
           "WHERE ol.createdAt BETWEEN :startTime AND :endTime " +
           "GROUP BY ol.operationType ORDER BY COUNT(ol) DESC")
    List<Object[]> countByOperationTypeGrouped(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 按操作模块统计日志数量
     */
    @Query("SELECT ol.operationModule, COUNT(ol) FROM OperationLog ol " +
           "WHERE ol.createdAt BETWEEN :startTime AND :endTime " +
           "GROUP BY ol.operationModule ORDER BY COUNT(ol) DESC")
    List<Object[]> countByOperationModuleGrouped(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 按用户统计操作日志数量
     */
    @Query("SELECT ol.username, COUNT(ol) FROM OperationLog ol " +
           "WHERE ol.createdAt BETWEEN :startTime AND :endTime " +
           "GROUP BY ol.username ORDER BY COUNT(ol) DESC")
    List<Object[]> countByUsernameGrouped(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 按日期统计操作日志数量
     */
    @Query("SELECT CAST(ol.createdAt AS date), COUNT(ol) FROM OperationLog ol " +
           "WHERE ol.createdAt BETWEEN :startTime AND :endTime " +
           "GROUP BY CAST(ol.createdAt AS date) ORDER BY CAST(ol.createdAt AS date)")
    List<Object[]> countByDateGrouped(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
}