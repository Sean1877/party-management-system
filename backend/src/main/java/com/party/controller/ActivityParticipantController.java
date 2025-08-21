package com.party.controller;

import com.party.entity.ActivityParticipant;
import com.party.service.ActivityParticipantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 活动参与者管理控制器
 */
@RestController
@RequestMapping("/api/activity-participants")
@Tag(name = "活动参与者管理", description = "活动参与者相关的API接口")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ActivityParticipantController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityParticipantController.class);
    
    @Autowired
    private ActivityParticipantService activityParticipantService;

    /**
     * 用户报名参加活动
     */
    @PostMapping("/signup")
    @Operation(summary = "报名参加活动", description = "用户报名参加指定活动")
    public ResponseEntity<Map<String, Object>> signUpActivity(
            @RequestBody Map<String, Object> requestData) {
        try {
            Long activityId = Long.valueOf(requestData.get("activityId").toString());
            Long userId = Long.valueOf(requestData.get("userId").toString());
            
            ActivityParticipant participant = activityParticipantService.signUpActivity(activityId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "报名成功");
            response.put("data", convertToMap(participant));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("报名失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "报名失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 取消报名
     */
    @DeleteMapping("/signup")
    @Operation(summary = "取消报名", description = "用户取消报名参加的活动")
    public ResponseEntity<Map<String, Object>> cancelSignUp(
            @Parameter(description = "活动ID") @RequestParam Long activityId,
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        try {
            activityParticipantService.cancelSignUp(activityId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "取消报名成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("取消报名失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "取消报名失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 签到
     */
    @PostMapping("/checkin")
    @Operation(summary = "签到", description = "用户签到参加活动")
    public ResponseEntity<Map<String, Object>> checkIn(
            @RequestBody Map<String, Object> requestData) {
        try {
            Long activityId = Long.valueOf(requestData.get("activityId").toString());
            Long userId = Long.valueOf(requestData.get("userId").toString());
            
            activityParticipantService.checkIn(activityId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "签到成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("签到失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "签到失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 批量签到
     */
    @PostMapping("/batch-checkin")
    @Operation(summary = "批量签到", description = "批量为用户签到")
    public ResponseEntity<Map<String, Object>> batchCheckIn(
            @RequestBody Map<String, Object> requestData) {
        try {
            Long activityId = Long.valueOf(requestData.get("activityId").toString());
            @SuppressWarnings("unchecked")
            List<Long> userIds = ((List<Object>) requestData.get("userIds"))
                .stream()
                .map(id -> Long.valueOf(id.toString()))
                .collect(Collectors.toList());
            
            activityParticipantService.batchCheckIn(activityId, userIds);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "批量签到完成");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("批量签到失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "批量签到失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 请假
     */
    @PostMapping("/leave")
    @Operation(summary = "请假", description = "用户请假不参加活动")
    public ResponseEntity<Map<String, Object>> requestLeave(
            @RequestBody Map<String, Object> requestData) {
        try {
            Long activityId = Long.valueOf(requestData.get("activityId").toString());
            Long userId = Long.valueOf(requestData.get("userId").toString());
            String reason = (String) requestData.get("reason");
            
            activityParticipantService.requestLeave(activityId, userId, reason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "请假成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("请假失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "请假失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 标记缺席
     */
    @PostMapping("/absent")
    @Operation(summary = "标记缺席", description = "标记用户缺席活动")
    public ResponseEntity<Map<String, Object>> markAbsent(
            @RequestBody Map<String, Object> requestData) {
        try {
            Long activityId = Long.valueOf(requestData.get("activityId").toString());
            Long userId = Long.valueOf(requestData.get("userId").toString());
            
            activityParticipantService.markAbsent(activityId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "标记缺席成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("标记缺席失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "标记缺席失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 获取活动参与者列表
     */
    @GetMapping("/activity/{activityId}")
    @Operation(summary = "获取活动参与者列表", description = "分页获取指定活动的参与者列表")
    public ResponseEntity<Map<String, Object>> getActivityParticipants(
            @Parameter(description = "活动ID") @PathVariable Long activityId,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "状态筛选") @RequestParam(required = false) Integer status) {
        try {
            List<ActivityParticipant> participants;
            
            if (status != null) {
                participants = activityParticipantService.findByActivityIdAndStatus(activityId, status);
            } else {
                participants = activityParticipantService.findByActivityId(activityId);
            }
            
            // 手动分页
            int start = (page - 1) * size;
            int end = Math.min(start + size, participants.size());
            List<ActivityParticipant> pageContent = participants.subList(start, end);
            
            List<Map<String, Object>> participantMaps = pageContent.stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", participants.size());
            result.put("page", page);
            result.put("size", size);
            result.put("pages", (int) Math.ceil((double) participants.size() / size));
            result.put("records", participantMaps);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取参与者列表成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取参与者列表失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取参与者列表失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取用户参与的活动列表
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "获取用户参与的活动列表", description = "获取指定用户参与的所有活动")
    public ResponseEntity<Map<String, Object>> getUserParticipatedActivities(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        try {
            List<ActivityParticipant> participants = activityParticipantService.findByUserId(userId);
            
            List<Map<String, Object>> participantMaps = participants.stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取用户参与活动列表成功");
            response.put("data", participantMaps);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户参与活动列表失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取用户参与活动列表失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取活动参与统计
     */
    @GetMapping("/statistics/activity/{activityId}")
    @Operation(summary = "获取活动参与统计", description = "获取指定活动的参与统计信息")
    public ResponseEntity<Map<String, Object>> getActivityParticipantStatistics(
            @Parameter(description = "活动ID") @PathVariable Long activityId) {
        try {
            Object statistics = activityParticipantService.getActivityParticipantStatistics(activityId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取活动参与统计成功");
            response.put("data", statistics);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取活动参与统计失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取活动参与统计失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取用户参与统计
     */
    @GetMapping("/statistics/user/{userId}")
    @Operation(summary = "获取用户参与统计", description = "获取指定用户的参与统计信息")
    public ResponseEntity<Map<String, Object>> getUserParticipantStatistics(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        try {
            Object statistics = activityParticipantService.getUserParticipantStatistics(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取用户参与统计成功");
            response.put("data", statistics);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户参与统计失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取用户参与统计失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 更新参与状态
     */
    @PutMapping("/status")
    @Operation(summary = "更新参与状态", description = "更新用户的活动参与状态")
    public ResponseEntity<Map<String, Object>> updateParticipantStatus(
            @RequestBody Map<String, Object> requestData) {
        try {
            Long activityId = Long.valueOf(requestData.get("activityId").toString());
            Long userId = Long.valueOf(requestData.get("userId").toString());
            Integer status = Integer.valueOf(requestData.get("status").toString());
            
            activityParticipantService.updateParticipantStatus(activityId, userId, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "更新参与状态成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新参与状态失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "更新参与状态失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 检查用户是否已参与活动
     */
    @GetMapping("/check")
    @Operation(summary = "检查参与状态", description = "检查用户是否已参与指定活动")
    public ResponseEntity<Map<String, Object>> checkParticipantStatus(
            @Parameter(description = "活动ID") @RequestParam Long activityId,
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        try {
            boolean isParticipant = activityParticipantService.isUserParticipant(activityId, userId);
            
            Map<String, Object> data = new HashMap<>();
            data.put("isParticipant", isParticipant);
            
            if (isParticipant) {
                var participant = activityParticipantService.findByActivityIdAndUserId(activityId, userId);
                if (participant.isPresent()) {
                    data.put("status", participant.get().getStatus());
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "检查参与状态成功");
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("检查参与状态失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "检查参与状态失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 转换ActivityParticipant为Map
     */
    private Map<String, Object> convertToMap(ActivityParticipant participant) {
        Map<String, Object> map = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        map.put("id", participant.getId());
        map.put("activityId", participant.getActivityId());
        map.put("userId", participant.getUserId());
        map.put("status", participant.getStatus());
        map.put("signUpTime", participant.getCreatedAt() != null ? 
            participant.getCreatedAt().format(formatter) : null);
        map.put("checkInTime", participant.getSignInTime() != null ? 
            participant.getSignInTime().format(formatter) : null);
        map.put("leaveTime", null); // 暂时设为null，后续可扩展
        map.put("leaveReason", participant.getNotes()); // 使用notes字段作为请假原因
        map.put("createTime", participant.getCreatedAt() != null ? 
            participant.getCreatedAt().format(formatter) : null);
        map.put("updateTime", null); // 暂时设为null，后续可扩展
        
        return map;
    }
}