package com.party.controller;

import com.party.entity.OperationLog;
import com.party.service.OperationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作日志控制器
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/operation-logs")
@Tag(name = "操作日志管理", description = "操作日志相关接口")
public class OperationLogController {

    @Autowired
    private OperationLogService operationLogService;

    // ==================== 查询操作 ====================

    @GetMapping
    @Operation(summary = "分页查询操作日志", description = "分页查询操作日志列表")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getOperationLogs(
            @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "排序字段") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "排序方向") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<OperationLog> logs = operationLogService.findAll(pageable);
        
        Map<String, Object> data = new HashMap<>();
        data.put("list", logs.getContent());
        data.put("total", logs.getTotalElements());
        data.put("totalPages", logs.getTotalPages());
        data.put("page", logs.getNumber());
        data.put("pageSize", logs.getSize());
        data.put("hasNext", logs.hasNext());
        data.put("hasPrevious", logs.hasPrevious());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "查询成功");
        response.put("data", data);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询操作日志", description = "根据ID查询单个操作日志详情")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getOperationLogById(
            @Parameter(description = "操作日志ID") @PathVariable Long id) {
        OperationLog log = operationLogService.findById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "查询成功");
        response.put("data", log);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "多条件搜索操作日志", description = "根据多个条件搜索操作日志")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> searchOperationLogs(
            @Parameter(description = "用户ID") @RequestParam(required = false) Long userId,
            @Parameter(description = "用户名") @RequestParam(required = false) String username,
            @Parameter(description = "操作类型") @RequestParam(required = false) String operationType,
            @Parameter(description = "操作模块") @RequestParam(required = false) String operationModule,
            @Parameter(description = "目标类型") @RequestParam(required = false) String targetType,
            @Parameter(description = "是否成功") @RequestParam(required = false) Boolean success,
            @Parameter(description = "IP地址") @RequestParam(required = false) String ipAddress,
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "排序字段") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "排序方向") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<OperationLog> logs = operationLogService.searchLogs(userId, username, operationType,
                operationModule, targetType, success, ipAddress, startTime, endTime, keyword, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("currentPage", logs.getNumber());
        response.put("size", logs.getSize());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "查询指定用户的操作日志", description = "分页查询指定用户的操作日志")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<Map<String, Object>> getOperationLogsByUser(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<OperationLog> logs = operationLogService.findByUserId(userId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("currentPage", logs.getNumber());
        response.put("size", logs.getSize());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    @Operation(summary = "获取最近的操作日志", description = "获取最近的操作日志列表")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<OperationLog>> getRecentOperationLogs(
            @Parameter(description = "数量限制") @RequestParam(defaultValue = "10") int limit) {
        List<OperationLog> logs = operationLogService.getRecentLogs(limit);
        return ResponseEntity.ok(logs);
    }

    // ==================== 统计分析操作 ====================

    @GetMapping("/statistics")
    @Operation(summary = "获取操作统计信息", description = "获取指定时间范围内的操作统计信息")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getOperationStatistics(
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        // 默认查询最近7天的数据
        if (startTime == null) {
            startTime = LocalDateTime.now().minusDays(7);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        Map<String, Object> statistics = operationLogService.getOperationStatistics(startTime, endTime);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/statistics/operation-types")
    @Operation(summary = "按操作类型统计", description = "按操作类型统计操作日志数量")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Long>> getOperationTypeStatistics(
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        if (startTime == null) {
            startTime = LocalDateTime.now().minusDays(7);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        Map<String, Long> statistics = operationLogService.countByOperationTypeGrouped(startTime, endTime);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/statistics/modules")
    @Operation(summary = "按操作模块统计", description = "按操作模块统计操作日志数量")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Long>> getOperationModuleStatistics(
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        if (startTime == null) {
            startTime = LocalDateTime.now().minusDays(7);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        Map<String, Long> statistics = operationLogService.countByOperationModuleGrouped(startTime, endTime);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/statistics/users")
    @Operation(summary = "按用户统计", description = "按用户统计操作日志数量")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Long>> getUserStatistics(
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        if (startTime == null) {
            startTime = LocalDateTime.now().minusDays(7);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        Map<String, Long> statistics = operationLogService.countByUsernameGrouped(startTime, endTime);
        return ResponseEntity.ok(statistics);
    }

    // ==================== 数据维护操作 ====================

    @GetMapping("/operation-types")
    @Operation(summary = "获取所有操作类型", description = "获取系统中所有的操作类型")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<String>> getAllOperationTypes() {
        List<String> operationTypes = operationLogService.getAllOperationTypes();
        return ResponseEntity.ok(operationTypes);
    }

    @GetMapping("/operation-modules")
    @Operation(summary = "获取所有操作模块", description = "获取系统中所有的操作模块")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<String>> getAllOperationModules() {
        List<String> operationModules = operationLogService.getAllOperationModules();
        return ResponseEntity.ok(operationModules);
    }

    @GetMapping("/target-types")
    @Operation(summary = "获取所有目标类型", description = "获取系统中所有的目标类型")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<String>> getAllTargetTypes() {
        List<String> targetTypes = operationLogService.getAllTargetTypes();
        return ResponseEntity.ok(targetTypes);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除操作日志", description = "根据ID删除操作日志")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> deleteOperationLog(
            @Parameter(description = "操作日志ID") @PathVariable Long id) {
        operationLogService.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "操作日志删除成功");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/batch")
    @Operation(summary = "批量删除操作日志", description = "根据ID列表批量删除操作日志")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> batchDeleteOperationLogs(
            @Parameter(description = "操作日志ID列表") @RequestBody List<Long> ids) {
        operationLogService.deleteByIds(ids);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "批量删除操作日志成功");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cleanup")
    @Operation(summary = "清理旧日志", description = "清理指定天数之前的操作日志")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> cleanupOldLogs(
            @Parameter(description = "保留天数") @RequestParam(defaultValue = "90") int daysToKeep) {
        operationLogService.cleanupOldLogs(daysToKeep);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "清理旧日志成功");
        return ResponseEntity.ok(response);
    }

    // ==================== 导出操作 ====================

    @GetMapping("/export/csv")
    @Operation(summary = "导出CSV", description = "导出操作日志到CSV文件")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportToCsv(
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        if (startTime == null) {
            startTime = LocalDateTime.now().minusDays(30);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        byte[] csvData = operationLogService.exportToCsv(startTime, endTime);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "operation_logs.csv");
        
        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }

    @GetMapping("/export/excel")
    @Operation(summary = "导出Excel", description = "导出操作日志到Excel文件")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportToExcel(
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        
        if (startTime == null) {
            startTime = LocalDateTime.now().minusDays(30);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        byte[] excelData = operationLogService.exportToExcel(startTime, endTime);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "operation_logs.xlsx");
        
        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
    }
}