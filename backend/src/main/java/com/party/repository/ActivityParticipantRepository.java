package com.party.repository;

import com.party.entity.ActivityParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 活动参与者数据访问接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Repository
public interface ActivityParticipantRepository extends JpaRepository<ActivityParticipant, Long> {

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
     * 根据用户ID和状态查找参与记录
     */
    List<ActivityParticipant> findByUserIdAndStatus(Long userId, Integer status);

    /**
     * 统计活动的参与者数量
     */
    @Query("SELECT COUNT(ap) FROM ActivityParticipant ap WHERE ap.activityId = :activityId")
    Long countByActivityId(@Param("activityId") Long activityId);

    /**
     * 统计活动的已签到人数
     */
    @Query("SELECT COUNT(ap) FROM ActivityParticipant ap WHERE ap.activityId = :activityId AND ap.status = 2")
    Long countSignedInByActivityId(@Param("activityId") Long activityId);

    /**
     * 统计活动的缺席人数
     */
    @Query("SELECT COUNT(ap) FROM ActivityParticipant ap WHERE ap.activityId = :activityId AND ap.status = 4")
    Long countAbsentByActivityId(@Param("activityId") Long activityId);

    /**
     * 统计活动的请假人数
     */
    @Query("SELECT COUNT(ap) FROM ActivityParticipant ap WHERE ap.activityId = :activityId AND ap.status = 3")
    Long countOnLeaveByActivityId(@Param("activityId") Long activityId);

    /**
     * 检查用户是否已参与某活动
     */
    boolean existsByActivityIdAndUserId(Long activityId, Long userId);

    /**
     * 根据活动ID删除所有参与记录
     */
    void deleteByActivityId(Long activityId);

    /**
     * 根据用户ID删除所有参与记录
     */
    void deleteByUserId(Long userId);

    /**
     * 批量查询多个活动的参与者
     */
    @Query("SELECT ap FROM ActivityParticipant ap WHERE ap.activityId IN :activityIds")
    List<ActivityParticipant> findByActivityIdIn(@Param("activityIds") List<Long> activityIds);

    /**
     * 查询用户参与的活动数量
     */
    @Query("SELECT COUNT(ap) FROM ActivityParticipant ap WHERE ap.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);

    /**
     * 查询用户已签到的活动数量
     */
    @Query("SELECT COUNT(ap) FROM ActivityParticipant ap WHERE ap.userId = :userId AND ap.status = 2")
    Long countSignedInByUserId(@Param("userId") Long userId);
}