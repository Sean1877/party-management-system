package com.party.service;

import com.party.entity.ActivityParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 活动参与者服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface ActivityParticipantService {

    /**
     * 用户报名参加活动
     */
    ActivityParticipant signUpActivity(Long activityId, Long userId);

    /**
     * 取消报名
     */
    void cancelSignUp(Long activityId, Long userId);

    /**
     * 签到
     */
    void checkIn(Long activityId, Long userId);

    /**
     * 批量签到
     */
    void batchCheckIn(Long activityId, List<Long> userIds);

    /**
     * 请假
     */
    void requestLeave(Long activityId, Long userId, String reason);

    /**
     * 标记缺席
     */
    void markAbsent(Long activityId, Long userId);

    /**
     * 更新参与状态
     */
    void updateParticipantStatus(Long activityId, Long userId, Integer status);

    /**
     * 根据活动ID查找所有参与者
     */
    List<ActivityParticipant> findByActivityId(Long activityId);

    /**
     * 根据用户ID查找所有参与的活动
     */
    List<ActivityParticipant> findByUserId(Long userId);

    /**
     * 根据活动ID和用户ID查找参与记录
     */
    Optional<ActivityParticipant> findByActivityIdAndUserId(Long activityId, Long userId);

    /**
     * 根据活动ID和状态查找参与者
     */
    List<ActivityParticipant> findByActivityIdAndStatus(Long activityId, Integer status);

    /**
     * 分页查询活动参与者
     */
    Page<ActivityParticipant> findByActivityId(Long activityId, Pageable pageable);

    /**
     * 统计活动的参与者数量
     */
    Long countByActivityId(Long activityId);

    /**
     * 统计活动的已签到人数
     */
    Long countSignedInByActivityId(Long activityId);

    /**
     * 统计活动的缺席人数
     */
    Long countAbsentByActivityId(Long activityId);

    /**
     * 统计活动的请假人数
     */
    Long countOnLeaveByActivityId(Long activityId);

    /**
     * 检查用户是否已参与某活动
     */
    boolean isUserParticipant(Long activityId, Long userId);

    /**
     * 根据活动ID删除所有参与记录
     */
    void deleteByActivityId(Long activityId);

    /**
     * 根据用户ID删除所有参与记录
     */
    void deleteByUserId(Long userId);

    /**
     * 查询用户参与的活动数量
     */
    Long countByUserId(Long userId);

    /**
     * 查询用户已签到的活动数量
     */
    Long countSignedInByUserId(Long userId);

    /**
     * 获取活动参与统计信息
     */
    Object getActivityParticipantStatistics(Long activityId);

    /**
     * 获取用户参与统计信息
     */
    Object getUserParticipantStatistics(Long userId);
}