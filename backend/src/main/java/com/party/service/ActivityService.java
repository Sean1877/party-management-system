package com.party.service;

import com.party.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 活动服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface ActivityService {

    /**
     * 创建活动
     */
    Activity createActivity(Activity activity);

    /**
     * 更新活动
     */
    Activity updateActivity(Activity activity);

    /**
     * 删除活动
     */
    void deleteActivity(Long id);

    /**
     * 根据ID查找活动
     */
    Optional<Activity> findById(Long id);

    /**
     * 查找所有活动
     */
    Page<Activity> findAll(Pageable pageable);

    /**
     * 根据条件查找活动
     */
    Page<Activity> findByConditions(String title, Integer type, Integer status, 
                                   Long organizationId, LocalDateTime startTime, 
                                   LocalDateTime endTime, Pageable pageable);

    /**
     * 根据组织ID查找活动
     */
    List<Activity> findByOrganizationId(Long organizationId);

    /**
     * 根据组织者ID查找活动
     */
    List<Activity> findByOrganizerId(Long organizerId);

    /**
     * 查找即将开始的活动
     */
    List<Activity> findUpcomingActivities(int limit);

    /**
     * 查找最近的活动
     */
    List<Activity> findRecentActivities(int limit);

    /**
     * 统计组织的活动数量
     */
    Long countByOrganizationId(Long organizationId);

    /**
     * 统计指定状态的活动数量
     */
    Long countByStatus(Integer status);

    /**
     * 检查活动标题是否存在
     */
    boolean existsByTitle(String title);

    /**
     * 批量删除活动
     */
    void batchDeleteActivities(List<Long> ids);

    /**
     * 更新活动状态
     */
    void updateActivityStatus(Long id, Integer status);
}