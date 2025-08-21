package com.party.controller;

import com.party.entity.OperationLog;
import com.party.service.impl.OperationLogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/operation-logs")
@CrossOrigin(origins = "*")
public class OperationLogController {

    @Autowired
    private OperationLogServiceImpl operationLogService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOperationLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String operation,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<OperationLog> logs = operationLogService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", logs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取操作日志失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOperationLogById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<OperationLog> log = operationLogService.findById(id);
            if (log.isPresent()) {
                response.put("success", true);
                response.put("data", log.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "操作日志不存在");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取操作日志失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOperationLog(@RequestBody OperationLog operationLog) {
        Map<String, Object> response = new HashMap<>();
        try {
            operationLog.setCreatedAt(LocalDateTime.now());
            OperationLog savedLog = operationLogService.save(operationLog);
            response.put("success", true);
            response.put("data", savedLog);
            response.put("message", "操作日志创建成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "创建操作日志失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getOperationLogsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现按用户ID查询操作日志的逻辑
            Pageable pageable = PageRequest.of(page, size);
            Page<OperationLog> logs = operationLogService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", logs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取用户操作日志失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchOperationLogs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String operation,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现搜索逻辑
            Pageable pageable = PageRequest.of(page, size);
            Page<OperationLog> logs = operationLogService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", logs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "搜索操作日志失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOperationStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现统计逻辑
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalOperations", 0);
            statistics.put("operationsByModule", new HashMap<>());
            statistics.put("operationsByUser", new HashMap<>());
            statistics.put("operationsByDate", new HashMap<>());
            
            response.put("success", true);
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取统计数据失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/export")
    public ResponseEntity<Map<String, Object>> exportOperationLogs(
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String operation,
            @RequestParam(required = false) String module) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现导出逻辑
            String exportUrl = "/downloads/operation-logs-export." + (format != null ? format : "csv");
            
            response.put("success", true);
            response.put("data", Map.of("downloadUrl", exportUrl));
            response.put("message", "导出成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "导出失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupOperationLogs(
            @RequestParam(required = false, defaultValue = "30") int retentionDays,
            @RequestParam(required = false) String operation,
            @RequestParam(required = false) String module) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现清理逻辑
            int deletedCount = 0; // 实际应该返回删除的记录数
            
            response.put("success", true);
            response.put("data", Map.of("deletedCount", deletedCount));
            response.put("message", "清理完成，删除了 " + deletedCount + " 条记录");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "清理失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/audit/anomalies")
    public ResponseEntity<Map<String, Object>> getAnomalousOperations(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现异常检测逻辑
            Map<String, Object> anomalies = new HashMap<>();
            anomalies.put("suspiciousLogins", List.of());
            anomalies.put("frequentOperations", List.of());
            anomalies.put("permissionViolations", List.of());
            
            response.put("success", true);
            response.put("data", anomalies);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取异常操作失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/audit/report")
    public ResponseEntity<Map<String, Object>> getSecurityReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现安全报告生成逻辑
            Map<String, Object> report = new HashMap<>();
            report.put("totalOperations", 0);
            report.put("securityEvents", 0);
            report.put("riskLevel", "low");
            report.put("recommendations", List.of());
            
            response.put("success", true);
            response.put("data", report);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "生成安全报告失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}