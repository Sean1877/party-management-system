package com.party.controller;

import com.party.entity.FeePayment;
import com.party.entity.FeeStandard;
import com.party.service.FeeManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 党费管理控制器
 */
@RestController
@RequestMapping("/api/fee")
@Tag(name = "党费管理", description = "党费标准和缴费管理相关接口")
public class FeeManagementController {
    
    @Autowired
    private FeeManagementService feeManagementService;
    
    // ==================== 党费标准管理 ====================
    
    @PostMapping("/standards")
    @Operation(summary = "创建党费标准", description = "创建新的党费标准")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<FeeStandard> createFeeStandard(@Valid @RequestBody FeeStandard feeStandard) {
        FeeStandard created = feeManagementService.createFeeStandard(feeStandard);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/standards/{id}")
    @Operation(summary = "更新党费标准", description = "更新指定的党费标准")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<FeeStandard> updateFeeStandard(
            @Parameter(description = "党费标准ID") @PathVariable Long id,
            @Valid @RequestBody FeeStandard feeStandard) {
        FeeStandard updated = feeManagementService.updateFeeStandard(id, feeStandard);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/standards/{id}")
    @Operation(summary = "删除党费标准", description = "删除指定的党费标准")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFeeStandard(
            @Parameter(description = "党费标准ID") @PathVariable Long id) {
        feeManagementService.deleteFeeStandard(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/standards/{id}")
    @Operation(summary = "查询党费标准", description = "根据ID查询党费标准详情")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FeeStandard> getFeeStandard(
            @Parameter(description = "党费标准ID") @PathVariable Long id) {
        FeeStandard feeStandard = feeManagementService.getFeeStandardById(id);
        return ResponseEntity.ok(feeStandard);
    }
    
    @GetMapping("/standards")
    @Operation(summary = "分页查询党费标准", description = "分页查询党费标准列表")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FeeStandard>> getFeeStandards(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "排序字段") @RequestParam(defaultValue = "effectiveDate") String sort,
            @Parameter(description = "排序方向") @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<FeeStandard> feeStandards = feeManagementService.getFeeStandards(pageable);
        return ResponseEntity.ok(feeStandards);
    }
    
    @GetMapping("/standards/active")
    @Operation(summary = "查询有效党费标准", description = "查询所有有效的党费标准")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<FeeStandard>> getActiveFeeStandards() {
        List<FeeStandard> feeStandards = feeManagementService.getActiveFeeStandards();
        return ResponseEntity.ok(feeStandards);
    }
    
    @GetMapping("/standards/applicable")
    @Operation(summary = "查找适用党费标准", description = "根据收入查找适用的党费标准")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FeeStandard> findApplicableFeeStandard(
            @Parameter(description = "收入金额") @RequestParam BigDecimal income) {
        FeeStandard feeStandard = feeManagementService.findApplicableFeeStandard(income);
        return ResponseEntity.ok(feeStandard);
    }
    
    @PutMapping("/standards/{id}/enable")
    @Operation(summary = "启用党费标准", description = "启用指定的党费标准")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Void> enableFeeStandard(
            @Parameter(description = "党费标准ID") @PathVariable Long id) {
        feeManagementService.enableFeeStandard(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/standards/{id}/disable")
    @Operation(summary = "禁用党费标准", description = "禁用指定的党费标准")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Void> disableFeeStandard(
            @Parameter(description = "党费标准ID") @PathVariable Long id) {
        feeManagementService.disableFeeStandard(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== 党费缴费管理 ====================
    
    @PostMapping("/payments")
    @Operation(summary = "创建缴费记录", description = "创建新的党费缴费记录")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<FeePayment> createFeePayment(@Valid @RequestBody FeePayment feePayment) {
        FeePayment created = feeManagementService.createFeePayment(feePayment);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/payments/{id}")
    @Operation(summary = "更新缴费记录", description = "更新指定的党费缴费记录")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<FeePayment> updateFeePayment(
            @Parameter(description = "缴费记录ID") @PathVariable Long id,
            @Valid @RequestBody FeePayment feePayment) {
        FeePayment updated = feeManagementService.updateFeePayment(id, feePayment);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/payments/{id}")
    @Operation(summary = "删除缴费记录", description = "删除指定的党费缴费记录")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFeePayment(
            @Parameter(description = "缴费记录ID") @PathVariable Long id) {
        feeManagementService.deleteFeePayment(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/payments/{id}")
    @Operation(summary = "查询缴费记录", description = "根据ID查询党费缴费记录详情")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FeePayment> getFeePayment(
            @Parameter(description = "缴费记录ID") @PathVariable Long id) {
        FeePayment feePayment = feeManagementService.getFeePaymentById(id);
        return ResponseEntity.ok(feePayment);
    }
    
    @GetMapping("/payments")
    @Operation(summary = "分页查询缴费记录", description = "分页查询党费缴费记录列表")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FeePayment>> getFeePayments(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "排序字段") @RequestParam(defaultValue = "paymentYear,paymentMonth") String sort,
            @Parameter(description = "排序方向") @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        String[] sortFields = sort.split(",");
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortFields));
        Page<FeePayment> feePayments = feeManagementService.getFeePayments(pageable);
        return ResponseEntity.ok(feePayments);
    }
    
    @GetMapping("/payments/member/{memberId}")
    @Operation(summary = "查询党员缴费记录", description = "查询指定党员的缴费记录")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FeePayment>> getFeePaymentsByMember(
            @Parameter(description = "党员ID") @PathVariable Long memberId,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "paymentYear", "paymentMonth"));
        Page<FeePayment> feePayments = feeManagementService.getFeePaymentsByMember(memberId, pageable);
        return ResponseEntity.ok(feePayments);
    }
    
    @GetMapping("/payments/year/{year}")
    @Operation(summary = "查询年度缴费记录", description = "查询指定年份的缴费记录")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FeePayment>> getFeePaymentsByYear(
            @Parameter(description = "年份") @PathVariable Integer year,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "paymentMonth"));
        Page<FeePayment> feePayments = feeManagementService.getFeePaymentsByYear(year, pageable);
        return ResponseEntity.ok(feePayments);
    }
    
    @GetMapping("/payments/status/{status}")
    @Operation(summary = "查询缴费状态记录", description = "根据缴费状态查询记录")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FeePayment>> getFeePaymentsByStatus(
            @Parameter(description = "缴费状态") @PathVariable FeePayment.PaymentStatus status,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "paymentYear", "paymentMonth"));
        Page<FeePayment> feePayments = feeManagementService.getFeePaymentsByStatus(status, pageable);
        return ResponseEntity.ok(feePayments);
    }
    
    @GetMapping("/payments/overdue")
    @Operation(summary = "查询逾期缴费记录", description = "查询逾期未缴费的记录")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<FeePayment>> getOverdueFeePayments(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "paymentYear", "paymentMonth"));
        Page<FeePayment> feePayments = feeManagementService.getOverdueFeePayments(pageable);
        return ResponseEntity.ok(feePayments);
    }
    
    @PostMapping("/payments/batch")
    @Operation(summary = "批量创建缴费记录", description = "为指定年月批量创建党费缴费记录")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> batchCreateFeePayments(
            @Parameter(description = "年份") @RequestParam Integer year,
            @Parameter(description = "月份") @RequestParam Integer month) {
        
        int count = feeManagementService.batchCreateFeePayments(year, month);
        Map<String, Object> result = Map.of(
            "success", true,
            "message", "批量创建成功",
            "count", count
        );
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/calculate")
    @Operation(summary = "计算党费", description = "计算党员应缴党费金额")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> calculateMemberFee(
            @Parameter(description = "党员ID") @RequestParam Long memberId,
            @Parameter(description = "收入金额") @RequestParam BigDecimal income) {
        
        BigDecimal feeAmount = feeManagementService.calculateMemberFee(memberId, income);
        Map<String, Object> result = Map.of(
            "memberId", memberId,
            "income", income,
            "feeAmount", feeAmount
        );
        return ResponseEntity.ok(result);
    }
    
    @PutMapping("/payments/{id}/paid")
    @Operation(summary = "标记已缴费", description = "标记缴费记录为已缴费状态")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Void> markAsPaid(
            @Parameter(description = "缴费记录ID") @PathVariable Long id,
            @Parameter(description = "缴费日期") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate paymentDate,
            @Parameter(description = "缴费方式") @RequestParam FeePayment.PaymentMethod paymentMethod) {
        
        feeManagementService.markAsPaid(id, paymentDate, paymentMethod);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/payments/{id}/overdue")
    @Operation(summary = "标记逾期", description = "标记缴费记录为逾期状态")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Void> markAsOverdue(
            @Parameter(description = "缴费记录ID") @PathVariable Long id) {
        
        feeManagementService.markAsOverdue(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== 统计分析 ====================
    
    @GetMapping("/statistics/income/{year}")
    @Operation(summary = "年度收入统计", description = "统计指定年份的党费收入")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getFeeIncomeStatistics(
            @Parameter(description = "年份") @PathVariable Integer year) {
        
        Map<String, Object> statistics = feeManagementService.getFeeIncomeStatistics(year);
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/monthly/{year}")
    @Operation(summary = "月度收入统计", description = "统计指定年份的月度党费收入")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyFeeIncomeStatistics(
            @Parameter(description = "年份") @PathVariable Integer year) {
        
        List<Map<String, Object>> statistics = feeManagementService.getMonthlyFeeIncomeStatistics(year);
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/members")
    @Operation(summary = "党员缴费统计", description = "统计党员缴费情况")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getMemberPaymentStatistics(
            @Parameter(description = "年份") @RequestParam Integer year,
            @Parameter(description = "月份") @RequestParam Integer month) {
        
        Map<String, Object> statistics = feeManagementService.getMemberPaymentStatistics(year, month);
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/organizations")
    @Operation(summary = "组织缴费统计", description = "统计各组织缴费情况")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Map<String, Object>>> getOrganizationPaymentStatistics(
            @Parameter(description = "年份") @RequestParam Integer year,
            @Parameter(description = "月份") @RequestParam Integer month) {
        
        List<Map<String, Object>> statistics = feeManagementService.getOrganizationPaymentStatistics(year, month);
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/payment-methods/{year}")
    @Operation(summary = "缴费方式统计", description = "统计缴费方式分布")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Map<String, Object>>> getPaymentMethodStatistics(
            @Parameter(description = "年份") @PathVariable Integer year) {
        
        List<Map<String, Object>> statistics = feeManagementService.getPaymentMethodStatistics(year);
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/overdue")
    @Operation(summary = "逾期统计", description = "统计逾期缴费情况")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> getOverduePaymentStatistics() {
        Map<String, Object> statistics = feeManagementService.getOverduePaymentStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/statistics/ranking/{year}")
    @Operation(summary = "缴费排行榜", description = "获取党费缴费排行榜")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Map<String, Object>>> getFeePaymentRanking(
            @Parameter(description = "年份") @PathVariable Integer year,
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") Integer limit) {
        
        List<Map<String, Object>> ranking = feeManagementService.getFeePaymentRanking(year, limit);
        return ResponseEntity.ok(ranking);
    }
    
    @GetMapping("/statistics/trend")
    @Operation(summary = "缴费趋势", description = "获取党费缴费趋势")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Map<String, Object>>> getFeePaymentTrend(
            @Parameter(description = "开始年份") @RequestParam Integer startYear,
            @Parameter(description = "结束年份") @RequestParam Integer endYear) {
        
        List<Map<String, Object>> trend = feeManagementService.getFeePaymentTrend(startYear, endYear);
        return ResponseEntity.ok(trend);
    }
    
    // ==================== 导出功能 ====================
    
    @GetMapping("/export/payments")
    @Operation(summary = "导出缴费记录", description = "导出党费缴费记录")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> exportFeePayments(
            @Parameter(description = "年份") @RequestParam Integer year,
            @Parameter(description = "月份") @RequestParam Integer month,
            @Parameter(description = "组织ID") @RequestParam(required = false) Long organizationId) {
        
        String filePath = feeManagementService.exportFeePayments(year, month, organizationId);
        Map<String, Object> result = Map.of(
            "success", true,
            "message", "导出成功",
            "filePath", filePath
        );
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/export/statistics/{year}")
    @Operation(summary = "导出统计报表", description = "导出党费统计报表")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> exportFeeStatistics(
            @Parameter(description = "年份") @PathVariable Integer year) {
        
        String filePath = feeManagementService.exportFeeStatistics(year);
        Map<String, Object> result = Map.of(
            "success", true,
            "message", "导出成功",
            "filePath", filePath
        );
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/export/overdue")
    @Operation(summary = "导出逾期名单", description = "导出逾期缴费名单")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> exportOverduePayments() {
        String filePath = feeManagementService.exportOverduePayments();
        Map<String, Object> result = Map.of(
            "success", true,
            "message", "导出成功",
            "filePath", filePath
        );
        return ResponseEntity.ok(result);
    }
    
    // ==================== 提醒功能 ====================
    
    @PostMapping("/reminder/payment")
    @Operation(summary = "发送缴费提醒", description = "发送党费缴费提醒")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> sendPaymentReminder(
            @Parameter(description = "年份") @RequestParam Integer year,
            @Parameter(description = "月份") @RequestParam Integer month) {
        
        Map<String, Object> result = feeManagementService.sendPaymentReminder(year, month);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/reminder/overdue")
    @Operation(summary = "发送逾期提醒", description = "发送逾期缴费提醒")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SECRETARY')")
    public ResponseEntity<Map<String, Object>> sendOverdueReminder() {
        Map<String, Object> result = feeManagementService.sendOverdueReminder();
        return ResponseEntity.ok(result);
    }
}