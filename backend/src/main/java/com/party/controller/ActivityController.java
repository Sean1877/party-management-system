package com.party.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 活动管理控制器
 */
@RestController
@RequestMapping("/api/activities")
@Tag(name = "活动管理", description = "活动相关的API接口")
@CrossOrigin(origins = "*")
public class ActivityController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityController.class);

    /**
     * 获取活动统计数据
     */
    @GetMapping("/stats")
    @Operation(summary = "获取活动统计数据", description = "获取活动相关的统计信息")
    public ResponseEntity<Map<String, Object>> getActivityStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalActivities", 25);
            stats.put("ongoingActivities", 8);
            stats.put("completedActivities", 15);
            stats.put("plannedActivities", 2);
            
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
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // 模拟最近活动数据
        Map<String, Object> activity1 = new HashMap<>();
        activity1.put("id", 1);
        activity1.put("title", "党史学习教育专题讲座");
        activity1.put("description", "深入学习党的百年奋斗历程");
        activity1.put("status", 1); // 进行中
        activity1.put("startTime", "2024-01-15 14:00:00");
        activity1.put("endTime", "2024-01-15 16:00:00");
        activity1.put("location", "会议室A");
        activity1.put("participantCount", 45);
        activities.add(activity1);
        
        Map<String, Object> activity2 = new HashMap<>();
        activity2.put("id", 2);
        activity2.put("title", "志愿服务活动");
        activity2.put("description", "社区环境清洁志愿服务");
        activity2.put("status", 2); // 已完成
        activity2.put("startTime", "2024-01-10 09:00:00");
        activity2.put("endTime", "2024-01-10 12:00:00");
        activity2.put("location", "社区广场");
        activity2.put("participantCount", 32);
        activities.add(activity2);
        
        Map<String, Object> activity3 = new HashMap<>();
        activity3.put("id", 3);
        activity3.put("title", "理论学习研讨会");
        activity3.put("description", "学习贯彻新时代中国特色社会主义思想");
        activity3.put("status", 0); // 计划中
        activity3.put("startTime", "2024-01-20 15:00:00");
        activity3.put("endTime", "2024-01-20 17:00:00");
        activity3.put("location", "会议室B");
        activity3.put("participantCount", 0);
        activities.add(activity3);
        
        Map<String, Object> activity4 = new HashMap<>();
        activity4.put("id", 4);
        activity4.put("title", "党员发展对象培训");
        activity4.put("description", "入党积极分子培训课程");
        activity4.put("status", 1); // 进行中
        activity4.put("startTime", "2024-01-12 10:00:00");
        activity4.put("endTime", "2024-01-12 12:00:00");
        activity4.put("location", "培训室");
        activity4.put("participantCount", 28);
        activities.add(activity4);
        
        Map<String, Object> activity5 = new HashMap<>();
        activity5.put("id", 5);
        activity5.put("title", "红色教育基地参观");
        activity5.put("description", "参观革命历史纪念馆");
        activity5.put("status", 2); // 已完成
        activity5.put("startTime", "2024-01-08 08:00:00");
        activity5.put("endTime", "2024-01-08 18:00:00");
        activity5.put("location", "革命历史纪念馆");
        activity5.put("participantCount", 56);
        activities.add(activity5);
        
            // 根据limit参数限制返回数量
            if (limit > 0 && limit < activities.size()) {
                activities = activities.subList(0, limit);
            }
            
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
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        try {
            // 模拟分页数据
            Map<String, Object> result = new HashMap<>();
            result.put("total", 25);
            result.put("page", page);
            result.put("size", size);
            
            List<Map<String, Object>> activities = new ArrayList<>();
            // 这里可以添加更多活动数据
            
            result.put("records", activities);
            
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
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", id);
            activity.put("title", "活动标题");
            activity.put("description", "活动描述");
            activity.put("status", 1);
            activity.put("startTime", "2024-01-15 14:00:00");
            activity.put("endTime", "2024-01-15 16:00:00");
            activity.put("location", "会议室A");
            activity.put("participantCount", 45);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "获取活动详情成功");
            response.put("data", activity);
            
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
            @RequestBody Map<String, Object> activity) {
        try {
            // 模拟创建活动
            activity.put("id", System.currentTimeMillis());
            activity.put("status", 0); // 计划中
            activity.put("participantCount", 0);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "创建活动成功");
            response.put("data", activity);
            
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
            @RequestBody Map<String, Object> activity) {
        try {
            activity.put("id", id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "更新活动成功");
            response.put("data", activity);
            
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
}