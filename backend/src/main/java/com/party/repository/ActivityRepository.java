package com.party.repository;

import com.party.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 活动数据访问接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    /**
     * 根据组织ID查找活动
     */
    List<Activity> findByOrganizationId(Long organizationId);

    /**
     * 根据组织者ID查找活动
     */
    List<Activity> findByOrganizerId(Long organizerId);

    /**
     * 根据活动类型查找活动
     */
    List<Activity> findByType(Integer type);

    /**
     * 根据活动状态查找活动
     */
    List<Activity> findByStatus(Integer status);

    /**
     * 查找指定时间范围内的活动
     */
    @Query("SELECT a FROM Activity a WHERE a.startTime >= :startTime AND a.endTime <= :endTime")
    List<Activity> findByTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    /**
     * 查找即将开始的活动（未来7天内）
     */
    @Query("SELECT a FROM Activity a WHERE a.startTime BETWEEN :now AND :futureTime AND a.status = 1 ORDER BY a.startTime ASC")
    List<Activity> findUpcomingActivities(@Param("now") LocalDateTime now, @Param("futureTime") LocalDateTime futureTime);

    /**
     * 根据组织ID和状态查找活动
     */
    List<Activity> findByOrganizationIdAndStatus(Long organizationId, Integer status);

    /**
     * 根据标题模糊查询活动
     */
    List<Activity> findByTitleContaining(String title);

    /**
     * 查找必须参加的活动
     */
    List<Activity> findByIsRequiredTrue();

    /**
     * 统计组织的活动数量
     */
    @Query("SELECT COUNT(a) FROM Activity a WHERE a.organizationId = :organizationId")
    Long countByOrganizationId(@Param("organizationId") Long organizationId);

    /**
     * 统计指定状态的活动数量
     */
    Long countByStatus(Integer status);
}