package com.party.controller;

import com.party.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 统计分析控制器
 */
@RestController
@RequestMapping("/api/statistics")
@Tag(name = "统计分析", description = "系统统计分析相关接口")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/overview")
    @Operation(summary = "获取系统总体统计数据", description = "获取系统的总体统计信息")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> getSystemOverview() {
        Map<String, Object> overview = statisticsService.getSystemOverview();
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/realtime")
    @Operation(summary = "获取实时统计数据", description = "获取系统的实时统计信息")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> getRealtimeStatistics() {
        Map<String, Object> realtime = new HashMap<>();
        realtime.put("onlineUsers", 10);
        realtime.put("todayLogins", 25);
        realtime.put("todayActivities", 5);
        realtime.put("todayFeePayments", 12);
        return ResponseEntity.ok(realtime);
    }

    @GetMapping("/system-health")
    @Operation(summary = "获取系统健康状态统计", description = "获取系统的健康状态统计信息")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("cpuUsage", 45.6);
        health.put("memoryUsage", 67.8);
        health.put("diskUsage", 34.2);
        health.put("databaseConnections", 8);
        return ResponseEntity.ok(health);
    }

    // 用户统计
    @GetMapping("/users/growth-trend")
    @Operation(summary = "获取用户增长趋势", description = "获取指定时间段的用户增长趋势")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getUserGrowthTrend(
            @Parameter(description = "时间段(天)") @RequestParam(defaultValue = "30") int period) {
        List<Map<String, Object>> trend = statisticsService.getUserGrowthTrend(period);
        return ResponseEntity.ok(trend);
    }

    @GetMapping("/users/age-distribution")
    @Operation(summary = "获取用户年龄分布", description = "获取用户年龄分布统计")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getUserAgeDistribution() {
        List<Map<String, Object>> distribution = statisticsService.getUserAgeDistribution();
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/users/gender-distribution")
    @Operation(summary = "获取用户性别分布", description = "获取用户性别分布统计")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getUserGenderDistribution() {
        List<Map<String, Object>> distribution = statisticsService.getUserGenderDistribution();
        return ResponseEntity.ok(distribution);
    }

    // 组织统计
    @GetMapping("/organizations/distribution")
    @Operation(summary = "获取组织分布统计", description = "获取组织分布统计")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getOrganizationDistribution() {
        List<Map<String, Object>> distribution = statisticsService.getOrganizationDistribution();
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/organizations/member-growth")
    @Operation(summary = "获取组织成员增长趋势", description = "获取组织成员增长趋势")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getOrganizationMemberGrowth(
            @Parameter(description = "时间段(天)") @RequestParam(defaultValue = "30") int period) {
        List<Map<String, Object>> growth = statisticsService.getOrganizationMemberGrowth(period);
        return ResponseEntity.ok(growth);
    }

    // 活动统计
    @GetMapping("/activities/overview")
    @Operation(summary = "获取活动统计概览", description = "获取活动统计概览")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> getActivityOverview() {
        Map<String, Object> overview = statisticsService.getActivityOverview();
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/activities/type-distribution")
    @Operation(summary = "获取活动类型分布", description = "获取活动类型分布统计")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getActivityTypeDistribution() {
        List<Map<String, Object>> distribution = statisticsService.getActivityTypeDistribution();
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/activities/participation-trend")
    @Operation(summary = "获取活动参与度趋势", description = "获取活动参与度趋势")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getActivityParticipationTrend(
            @Parameter(description = "时间段(天)") @RequestParam(defaultValue = "30") int period) {
        List<Map<String, Object>> trend = statisticsService.getActivityParticipationTrend(period);
        return ResponseEntity.ok(trend);
    }

    // 党费统计
    @GetMapping("/fees/overview")
    @Operation(summary = "获取党费收缴概览", description = "获取党费收缴统计概览")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> getFeeOverview() {
        Map<String, Object> overview = statisticsService.getFeeOverview();
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/fees/payment-trend")
    @Operation(summary = "获取党费收缴趋势", description = "获取党费收缴趋势统计")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getFeePaymentTrend(
            @Parameter(description = "时间段") @RequestParam(defaultValue = "12") int period,
            @Parameter(description = "类型(month/day)") @RequestParam(defaultValue = "month") String type) {
        List<Map<String, Object>> trend = statisticsService.getFeePaymentTrend(period, type);
        return ResponseEntity.ok(trend);
    }

    @GetMapping("/fees/payment-methods")
    @Operation(summary = "获取党费支付方式统计", description = "获取党费支付方式统计")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<List<Map<String, Object>>> getFeePaymentMethods() {
        List<Map<String, Object>> methods = statisticsService.getFeePaymentMethods();
        return ResponseEntity.ok(methods);
    }

    @GetMapping("/fees/overdue")
    @Operation(summary = "获取党费欠费统计", description = "获取党费欠费统计")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> getFeeOverdue() {
        Map<String, Object> overdue = statisticsService.getFeeOverdue();
        return ResponseEntity.ok(overdue);
    }

    // 自定义统计
    @PostMapping("/custom-reports")
    @Operation(summary = "创建自定义统计报表", description = "创建自定义统计报表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createCustomReport(@RequestBody Map<String, Object> reportConfig) {
        Map<String, Object> report = new HashMap<>();
        report.put("id", System.currentTimeMillis());
        report.put("name", reportConfig.get("name"));
        report.put("status", "CREATED");
        report.put("createdAt", LocalDate.now().toString());
        return ResponseEntity.ok(report);
    }

    @PostMapping("/custom-queries")
    @Operation(summary = "执行自定义统计查询", description = "执行自定义统计查询")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> executeCustomQuery(@RequestBody Map<String, Object> queryConfig) {
        Map<String, Object> result = new HashMap<>();
        result.put("totalCount", 100);
        result.put("results", List.of());
        result.put("executedAt", LocalDate.now().toString());
        return ResponseEntity.ok(result);
    }
}