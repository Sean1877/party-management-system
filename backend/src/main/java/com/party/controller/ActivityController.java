package com.party.controller;

import com.party.entity.Activity;
import com.party.entity.ActivityParticipant;
import com.party.service.ActivityService;
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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 活动管理控制器
 */
@RestController
@RequestMapping("/api/activities")
@Tag(name = "活动管理", description = "活动相关的API接口")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ActivityController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityController.class);
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private ActivityParticipantService activityParticipantService;

    /**
     * 获取活动统计数据
     */
    @GetMapping("/stats")
    @Operation(summary = "获取活动统计数据", description = "获取活动相关的统计信息")
    public ResponseEntity<Map<String, Object>> getActivityStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // 获取各状态活动数量
            Long totalActivities = activityService.countByStatus(null); // 总数
            Long plannedActivities = activityService.countByStatus(1); // 计划中
            Long ongoingActivities = activityService.countByStatus(2); // 进行中
            Long completedActivities = activityService.countByStatus(3); // 已完成
            
            stats.put("totalActivities", totalActivities != null ? totalActivities : 0);
            stats.put("plannedActivities", plannedActivities != null ? plannedActivities : 0);
            stats.put("ongoingActivities", ongoingActivities != null ? ongoingActivities : 0);
            stats.put("completedActivities", completedActivities != null ? completedActivities : 0);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取统计数据成功");
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取活动统计数据失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取统计数据失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取最近活动列表
     */
    @GetMapping("/recent")
    @Operation(summary = "获取最近活动列表", description = "获取最近的活动列表")
    public ResponseEntity<Map<String, Object>> getRecentActivities(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "5") int limit) {
        try {
            List<Activity> recentActivities = activityService.findRecentActivities(limit);
            
            List<Map<String, Object>> activities = recentActivities.stream().map(activity -> {
                Map<String, Object> activityMap = new HashMap<>();
                activityMap.put("id", activity.getId());
                activityMap.put("title", activity.getTitle());
                activityMap.put("description", activity.getContent());
                activityMap.put("status", activity.getStatus());
                activityMap.put("startTime", activity.getStartTime() != null ? 
                    activity.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                activityMap.put("endTime", activity.getEndTime() != null ? 
                    activity.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                activityMap.put("location", activity.getLocation());
                activityMap.put("participantCount", activity.getParticipantCount());
                activityMap.put("maxParticipants", activity.getMaxParticipants());
                activityMap.put("type", activity.getType());
                activityMap.put("isRequired", activity.getIsRequired());
                return activityMap;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取最近活动成功");
            response.put("data", activities);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取最近活动失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取最近活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取活动列表
     */
    @GetMapping
    @Operation(summary = "获取活动列表", description = "分页获取活动列表")
    public ResponseEntity<Map<String, Object>> getActivities(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "类型") @RequestParam(required = false) Integer type,
            @Parameter(description = "组织ID") @RequestParam(required = false) Long organizationId,
            @Parameter(description = "开始时间") @RequestParam(required = false) String startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) String endTime) {
        try {
            // 创建分页对象（前端传递的page已经是从0开始的）
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            
            // 解析时间参数
            LocalDateTime startDateTime = null;
            LocalDateTime endDateTime = null;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            
            if (startTime != null && !startTime.isEmpty()) {
                startDateTime = LocalDateTime.parse(startTime, formatter);
            }
            if (endTime != null && !endTime.isEmpty()) {
                endDateTime = LocalDateTime.parse(endTime, formatter);
            }
            
            // 调用服务层查询
            Page<Activity> activityPage = activityService.findByConditions(
                keyword, type, status, organizationId, startDateTime, endDateTime, pageable);
            
            // 转换为响应格式
            List<Map<String, Object>> activities = activityPage.getContent().stream().map(activity -> {
                Map<String, Object> activityMap = new HashMap<>();
                activityMap.put("id", activity.getId());
                activityMap.put("title", activity.getTitle());
                activityMap.put("description", activity.getContent());
                activityMap.put("status", activity.getStatus());
                activityMap.put("type", activity.getType());
                activityMap.put("startTime", activity.getStartTime() != null ? 
                    activity.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                activityMap.put("endTime", activity.getEndTime() != null ? 
                    activity.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                activityMap.put("location", activity.getLocation());
                activityMap.put("participantCount", activity.getParticipantCount());
                activityMap.put("maxParticipants", activity.getMaxParticipants());
                activityMap.put("isRequired", activity.getIsRequired());
                activityMap.put("organizationId", activity.getOrganizationId());
                activityMap.put("organizerId", activity.getOrganizerId());
                activityMap.put("createTime", activity.getCreatedAt() != null ?
                activity.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                return activityMap;
            }).collect(Collectors.toList());
            
            Map<String, Object> result = new HashMap<>();
            result.put("totalElements", activityPage.getTotalElements());
            result.put("page", page);
            result.put("size", size);
            result.put("totalPages", activityPage.getTotalPages());
            result.put("content", activities);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取活动列表成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取活动列表失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取活动列表失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取活动详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取活动详情", description = "根据ID获取活动详细信息")
    public ResponseEntity<Map<String, Object>> getActivity(
            @Parameter(description = "活动ID") @PathVariable Long id) {
        try {
            Optional<Activity> activityOpt = activityService.findById(id);
            
            if (!activityOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "活动不存在");
                return ResponseEntity.notFound().build();
            }
            
            Activity activity = activityOpt.get();
            Map<String, Object> activityMap = new HashMap<>();
            activityMap.put("id", activity.getId());
            activityMap.put("title", activity.getTitle());
            activityMap.put("description", activity.getContent());
            activityMap.put("status", activity.getStatus());
            activityMap.put("type", activity.getType());
            activityMap.put("startTime", activity.getStartTime() != null ? 
                activity.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            activityMap.put("endTime", activity.getEndTime() != null ? 
                activity.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            activityMap.put("location", activity.getLocation());
            activityMap.put("participantCount", activity.getParticipantCount());
            activityMap.put("maxParticipants", activity.getMaxParticipants());
            activityMap.put("isRequired", activity.getIsRequired());
            activityMap.put("organizationId", activity.getOrganizationId());
            activityMap.put("organizerId", activity.getOrganizerId());
            activityMap.put("createTime", activity.getCreatedAt() != null ?
                activity.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            activityMap.put("updateTime", activity.getUpdatedAt() != null ?
                activity.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取活动详情成功");
            response.put("data", activityMap);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取活动详情失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取活动详情失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 创建活动
     */
    @PostMapping
    @Operation(summary = "创建活动", description = "创建新的活动")
    public ResponseEntity<Map<String, Object>> createActivity(
            @RequestBody Map<String, Object> activityData) {
        try {
            // 构建Activity对象
            Activity activity = new Activity();
            activity.setTitle((String) activityData.get("title"));
            activity.setContent((String) activityData.get("description"));
            activity.setType((Integer) activityData.get("type"));
            activity.setLocation((String) activityData.get("location"));
            activity.setMaxParticipants((Integer) activityData.get("maxParticipants"));
            activity.setIsRequired((Boolean) activityData.get("isRequired"));
            activity.setOrganizationId((Long) activityData.get("organizationId"));
            activity.setOrganizerId((Long) activityData.get("organizerId"));
            
            // 解析时间
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            if (activityData.get("startTime") != null) {
                activity.setStartTime(LocalDateTime.parse((String) activityData.get("startTime"), formatter));
            }
            if (activityData.get("endTime") != null) {
                activity.setEndTime(LocalDateTime.parse((String) activityData.get("endTime"), formatter));
            }
            
            // 创建活动
            Activity savedActivity = activityService.createActivity(activity);
            
            // 构建响应数据
            Map<String, Object> activityMap = new HashMap<>();
            activityMap.put("id", savedActivity.getId());
            activityMap.put("title", savedActivity.getTitle());
            activityMap.put("description", savedActivity.getContent());
            activityMap.put("status", savedActivity.getStatus());
            activityMap.put("type", savedActivity.getType());
            activityMap.put("startTime", savedActivity.getStartTime() != null ? 
                savedActivity.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            activityMap.put("endTime", savedActivity.getEndTime() != null ? 
                savedActivity.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            activityMap.put("location", savedActivity.getLocation());
            activityMap.put("participantCount", savedActivity.getParticipantCount());
            activityMap.put("maxParticipants", savedActivity.getMaxParticipants());
            activityMap.put("isRequired", savedActivity.getIsRequired());
            activityMap.put("organizationId", savedActivity.getOrganizationId());
            activityMap.put("organizerId", savedActivity.getOrganizerId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "创建活动成功");
            response.put("data", activityMap);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("创建活动失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "创建活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 更新活动
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新活动", description = "根据ID更新活动信息")
    public ResponseEntity<Map<String, Object>> updateActivity(
            @Parameter(description = "活动ID") @PathVariable Long id,
            @RequestBody Map<String, Object> activityData) {
        try {
            // 检查活动是否存在
            Optional<Activity> existingActivityOpt = activityService.findById(id);
            if (!existingActivityOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "活动不存在");
                return ResponseEntity.notFound().build();
            }
            
            Activity activity = existingActivityOpt.get();
            
            // 更新活动信息
            if (activityData.get("title") != null) {
                activity.setTitle((String) activityData.get("title"));
            }
            if (activityData.get("description") != null) {
                activity.setContent((String) activityData.get("description"));
            }
            if (activityData.get("type") != null) {
                activity.setType((Integer) activityData.get("type"));
            }
            if (activityData.get("status") != null) {
                activity.setStatus((Integer) activityData.get("status"));
            }
            if (activityData.get("location") != null) {
                activity.setLocation((String) activityData.get("location"));
            }
            if (activityData.get("maxParticipants") != null) {
                activity.setMaxParticipants((Integer) activityData.get("maxParticipants"));
            }
            if (activityData.get("isRequired") != null) {
                activity.setIsRequired((Boolean) activityData.get("isRequired"));
            }
            
            // 解析时间
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            if (activityData.get("startTime") != null) {
                activity.setStartTime(LocalDateTime.parse((String) activityData.get("startTime"), formatter));
            }
            if (activityData.get("endTime") != null) {
                activity.setEndTime(LocalDateTime.parse((String) activityData.get("endTime"), formatter));
            }
            
            // 更新活动
            Activity updatedActivity = activityService.updateActivity(activity);
            
            // 构建响应数据
            Map<String, Object> activityMap = new HashMap<>();
            activityMap.put("id", updatedActivity.getId());
            activityMap.put("title", updatedActivity.getTitle());
            activityMap.put("description", updatedActivity.getContent());
            activityMap.put("status", updatedActivity.getStatus());
            activityMap.put("type", updatedActivity.getType());
            activityMap.put("startTime", updatedActivity.getStartTime() != null ? 
                updatedActivity.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            activityMap.put("endTime", updatedActivity.getEndTime() != null ? 
                updatedActivity.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
            activityMap.put("location", updatedActivity.getLocation());
            activityMap.put("participantCount", updatedActivity.getParticipantCount());
            activityMap.put("maxParticipants", updatedActivity.getMaxParticipants());
            activityMap.put("isRequired", updatedActivity.getIsRequired());
            activityMap.put("organizationId", updatedActivity.getOrganizationId());
            activityMap.put("organizerId", updatedActivity.getOrganizerId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "更新活动成功");
            response.put("data", activityMap);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新活动失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "更新活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 删除活动
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除活动", description = "根据ID删除活动")
    public ResponseEntity<Map<String, Object>> deleteActivity(
            @Parameter(description = "活动ID") @PathVariable Long id) {
        try {
            // 检查活动是否存在
            Optional<Activity> activityOpt = activityService.findById(id);
            if (!activityOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "活动不存在");
                return ResponseEntity.notFound().build();
            }
            
            // 删除活动
            activityService.deleteActivity(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "删除活动成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("删除活动失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "删除活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 批量删除活动
     */
    @DeleteMapping("/batch")
    @Operation(summary = "批量删除活动", description = "批量删除多个活动")
    public ResponseEntity<Map<String, Object>> batchDeleteActivities(
            @RequestBody List<Long> ids) {
        try {
            activityService.batchDeleteActivities(ids);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "批量删除活动成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("批量删除活动失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "批量删除活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 更新活动状态
     */
    @PutMapping("/{id}/status")
    @Operation(summary = "更新活动状态", description = "更新活动的状态")
    public ResponseEntity<Map<String, Object>> updateActivityStatus(
            @Parameter(description = "活动ID") @PathVariable Long id,
            @Parameter(description = "状态") @RequestParam Integer status) {
        try {
            activityService.updateActivityStatus(id, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "更新活动状态成功");
            response.put("data", null);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新活动状态失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "更新活动状态失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 获取我的活动
     */
    @GetMapping("/my")
    @Operation(summary = "获取我的活动", description = "获取当前用户参与的活动列表")
    public ResponseEntity<Map<String, Object>> getMyActivities(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            // 这里暂时使用固定的用户ID，实际应该从认证信息中获取
            Long currentUserId = 1L; // TODO: 从JWT或Session中获取当前用户ID
            
            // 获取用户参与的活动记录
            List<ActivityParticipant> participants = activityParticipantService.findByUserId(currentUserId);
            
            // 获取活动详情并转换为响应格式
            List<Map<String, Object>> activities = new ArrayList<>();
            for (ActivityParticipant participant : participants) {
                Optional<Activity> activityOpt = activityService.findById(participant.getActivityId());
                if (activityOpt.isPresent()) {
                    Activity activity = activityOpt.get();
                    Map<String, Object> activityMap = new HashMap<>();
                    activityMap.put("id", activity.getId());
                    activityMap.put("title", activity.getTitle());
                    activityMap.put("description", activity.getContent());
                    activityMap.put("status", activity.getStatus());
                    activityMap.put("type", activity.getType());
                    activityMap.put("startTime", activity.getStartTime() != null ? 
                        activity.getStartTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                    activityMap.put("endTime", activity.getEndTime() != null ? 
                        activity.getEndTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                    activityMap.put("location", activity.getLocation());
                    activityMap.put("participantCount", activity.getParticipantCount());
                    activityMap.put("maxParticipants", activity.getMaxParticipants());
                    activityMap.put("isRequired", activity.getIsRequired());
                    activityMap.put("organizationId", activity.getOrganizationId());
                    activityMap.put("organizerId", activity.getOrganizerId());
                    
                    // 添加参与者相关信息
                    activityMap.put("participantStatus", participant.getStatus());
                    activityMap.put("signUpTime", participant.getCreatedAt() != null ? 
                        participant.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                    activityMap.put("checkInTime", participant.getSignInTime() != null ? 
                        participant.getSignInTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null);
                    
                    activities.add(activityMap);
                }
            }
            
            // 手动分页
            int start = (page - 1) * size;
            int end = Math.min(start + size, activities.size());
            List<Map<String, Object>> pagedActivities = activities.subList(start, end);
            
            int totalElements = activities.size();
            int totalPages = (int) Math.ceil((double) totalElements / size);
            
            Map<String, Object> result = new HashMap<>();
            result.put("content", pagedActivities);
            result.put("totalElements", totalElements);
            result.put("totalPages", totalPages);
            result.put("number", page - 1);
            result.put("size", size);
            result.put("first", page == 1);
            result.put("last", page >= totalPages);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取我的活动成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取我的活动失败", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取我的活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}