package com.party.service.impl;

import com.party.entity.ActivityParticipant;
import com.party.repository.ActivityParticipantRepository;
import com.party.service.ActivityParticipantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 活动参与者服务实现类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Service
@Transactional
public class ActivityParticipantServiceImpl implements ActivityParticipantService {

    private static final Logger logger = LoggerFactory.getLogger(ActivityParticipantServiceImpl.class);

    @Autowired
    private ActivityParticipantRepository activityParticipantRepository;

    @Override
    public ActivityParticipant signUpActivity(Long activityId, Long userId) {
        logger.info("用户报名活动: activityId={}, userId={}", activityId, userId);
        
        // 检查是否已经报名
        if (activityParticipantRepository.existsByActivityIdAndUserId(activityId, userId)) {
            throw new RuntimeException("用户已经报名该活动");
        }
        
        ActivityParticipant participant = new ActivityParticipant();
        participant.setActivityId(activityId);
        participant.setUserId(userId);
        participant.setStatus(1); // 1-已报名
        
        return activityParticipantRepository.save(participant);
    }

    @Override
    public void cancelSignUp(Long activityId, Long userId) {
        logger.info("取消报名: activityId={}, userId={}", activityId, userId);
        
        Optional<ActivityParticipant> participantOpt = 
            activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
        
        if (!participantOpt.isPresent()) {
            throw new RuntimeException("未找到报名记录");
        }
        
        ActivityParticipant participant = participantOpt.get();
        if (participant.getStatus() == 2) {
            throw new RuntimeException("已签到，无法取消报名");
        }
        
        activityParticipantRepository.delete(participant);
    }

    @Override
    public void checkIn(Long activityId, Long userId) {
        logger.info("签到: activityId={}, userId={}", activityId, userId);
        
        Optional<ActivityParticipant> participantOpt = 
            activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
        
        if (!participantOpt.isPresent()) {
            throw new RuntimeException("未找到报名记录");
        }
        
        ActivityParticipant participant = participantOpt.get();
        participant.setStatus(2); // 2-已签到
        participant.setSignInTime(LocalDateTime.now());
        
        activityParticipantRepository.save(participant);
    }

    @Override
    public void batchCheckIn(Long activityId, List<Long> userIds) {
        logger.info("批量签到: activityId={}, userIds={}", activityId, userIds);
        
        for (Long userId : userIds) {
            try {
                checkIn(activityId, userId);
            } catch (Exception e) {
                logger.warn("用户签到失败: userId={}, error={}", userId, e.getMessage());
            }
        }
    }

    @Override
    public void requestLeave(Long activityId, Long userId, String reason) {
        logger.info("请假: activityId={}, userId={}, reason={}", activityId, userId, reason);
        
        Optional<ActivityParticipant> participantOpt = 
            activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
        
        if (!participantOpt.isPresent()) {
            throw new RuntimeException("未找到报名记录");
        }
        
        ActivityParticipant participant = participantOpt.get();
        participant.setStatus(3); // 3-请假
        participant.setNotes(reason);
        
        activityParticipantRepository.save(participant);
    }

    @Override
    public void markAbsent(Long activityId, Long userId) {
        logger.info("标记缺席: activityId={}, userId={}", activityId, userId);
        
        Optional<ActivityParticipant> participantOpt = 
            activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
        
        if (!participantOpt.isPresent()) {
            throw new RuntimeException("未找到报名记录");
        }
        
        ActivityParticipant participant = participantOpt.get();
        participant.setStatus(4); // 4-缺席
        
        activityParticipantRepository.save(participant);
    }

    @Override
    public void updateParticipantStatus(Long activityId, Long userId, Integer status) {
        logger.info("更新参与状态: activityId={}, userId={}, status={}", activityId, userId, status);
        
        Optional<ActivityParticipant> participantOpt = 
            activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
        
        if (!participantOpt.isPresent()) {
            throw new RuntimeException("未找到报名记录");
        }
        
        ActivityParticipant participant = participantOpt.get();
        participant.setStatus(status);
        
        // 根据状态设置相应的时间
        if (status == 2) {
            participant.setSignInTime(LocalDateTime.now());
        }
        
        activityParticipantRepository.save(participant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityParticipant> findByActivityId(Long activityId) {
        return activityParticipantRepository.findByActivityId(activityId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityParticipant> findByUserId(Long userId) {
        return activityParticipantRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ActivityParticipant> findByActivityIdAndUserId(Long activityId, Long userId) {
        return activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityParticipant> findByActivityIdAndStatus(Long activityId, Integer status) {
        return activityParticipantRepository.findByActivityIdAndStatus(activityId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActivityParticipant> findByActivityId(Long activityId, Pageable pageable) {
        List<ActivityParticipant> participants = activityParticipantRepository.findByActivityId(activityId);
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), participants.size());
        
        List<ActivityParticipant> pageContent = participants.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, participants.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByActivityId(Long activityId) {
        return activityParticipantRepository.countByActivityId(activityId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countSignedInByActivityId(Long activityId) {
        return activityParticipantRepository.countSignedInByActivityId(activityId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAbsentByActivityId(Long activityId) {
        return activityParticipantRepository.countAbsentByActivityId(activityId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countOnLeaveByActivityId(Long activityId) {
        return activityParticipantRepository.countOnLeaveByActivityId(activityId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserParticipant(Long activityId, Long userId) {
        return activityParticipantRepository.existsByActivityIdAndUserId(activityId, userId);
    }

    @Override
    public void deleteByActivityId(Long activityId) {
        logger.info("删除活动的所有参与记录: activityId={}", activityId);
        activityParticipantRepository.deleteByActivityId(activityId);
    }

    @Override
    public void deleteByUserId(Long userId) {
        logger.info("删除用户的所有参与记录: userId={}", userId);
        activityParticipantRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByUserId(Long userId) {
        return activityParticipantRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countSignedInByUserId(Long userId) {
        return activityParticipantRepository.countSignedInByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Object getActivityParticipantStatistics(Long activityId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总参与人数
        Long totalParticipants = countByActivityId(activityId);
        statistics.put("totalParticipants", totalParticipants);
        
        // 已签到人数
        Long signedInCount = countSignedInByActivityId(activityId);
        statistics.put("signedInCount", signedInCount);
        
        // 请假人数
        Long onLeaveCount = countOnLeaveByActivityId(activityId);
        statistics.put("onLeaveCount", onLeaveCount);
        
        // 缺席人数
        Long absentCount = countAbsentByActivityId(activityId);
        statistics.put("absentCount", absentCount);
        
        // 签到率
        double attendanceRate = totalParticipants > 0 ? 
            (double) signedInCount / totalParticipants * 100 : 0;
        statistics.put("attendanceRate", Math.round(attendanceRate * 100.0) / 100.0);
        
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public Object getUserParticipantStatistics(Long userId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总参与活动数
        Long totalActivities = countByUserId(userId);
        statistics.put("totalActivities", totalActivities);
        
        // 已签到活动数
        Long signedInActivities = countSignedInByUserId(userId);
        statistics.put("signedInActivities", signedInActivities);
        
        // 签到率
        double attendanceRate = totalActivities > 0 ? 
            (double) signedInActivities / totalActivities * 100 : 0;
        statistics.put("attendanceRate", Math.round(attendanceRate * 100.0) / 100.0);
        
        return statistics;
    }
}