package com.party.controller;

import com.party.entity.Activity;
import com.party.service.impl.ActivityServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private ActivityServiceImpl activityService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Activity> activities = activityService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", activities);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取活动列表失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getActivityById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Activity> activity = activityService.findById(id);
            if (activity.isPresent()) {
                response.put("success", true);
                response.put("data", activity.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "活动不存在");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取活动详情失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createActivity(@RequestBody Activity activity) {
        Map<String, Object> response = new HashMap<>();
        try {
            Activity savedActivity = activityService.createActivity(activity);
            response.put("success", true);
            response.put("data", savedActivity);
            response.put("message", "活动创建成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "创建活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateActivity(@PathVariable Long id, @RequestBody Activity activity) {
        Map<String, Object> response = new HashMap<>();
        try {
            activity.setId(id);
            Activity updatedActivity = activityService.updateActivity(activity);
            response.put("success", true);
            response.put("data", updatedActivity);
            response.put("message", "活动更新成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteActivity(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            activityService.deleteActivity(id);
            response.put("success", true);
            response.put("message", "活动删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "删除活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Map<String, Object>> joinActivity(@PathVariable Long id, @RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现参加活动的逻辑
            response.put("success", true);
            response.put("message", "参加活动成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "参加活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Map<String, Object>> leaveActivity(@PathVariable Long id, @RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现退出活动的逻辑
            response.put("success", true);
            response.put("message", "退出活动成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "退出活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchActivities(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现搜索逻辑
            Pageable pageable = PageRequest.of(page, size);
            Page<Activity> activities = activityService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", activities);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "搜索活动失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}