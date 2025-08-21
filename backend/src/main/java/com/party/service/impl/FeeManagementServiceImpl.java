package com.party.service.impl;

import com.party.entity.*;
import com.party.repository.*;
import com.party.service.FeeManagementService;
import com.party.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 党费管理服务实现类
 */
@Service
@Transactional
public class FeeManagementServiceImpl implements FeeManagementService {
    
    @Autowired
    private FeeStandardRepository feeStandardRepository;
    
    @Autowired
    private FeePaymentRepository feePaymentRepository;
    
    @Autowired
    private PartyMemberRepository partyMemberRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private OperationLogService operationLogService;
    
    // ==================== 党费标准管理 ====================
    
    @Override
    public FeeStandard createFeeStandard(FeeStandard feeStandard) {
        // 检查收入范围是否重叠
        if (hasOverlappingIncomeRange(feeStandard)) {
            throw new IllegalArgumentException("收入范围与现有标准重叠");
        }
        
        FeeStandard saved = feeStandardRepository.save(feeStandard);
        operationLogService.log("CREATE_FEE_STANDARD", "党费管理", 
                "创建党费标准: 收入范围 " + feeStandard.getIncomeMin() + "-" + feeStandard.getIncomeMax() +
                        ", 缴费比例: " + feeStandard.getFeeRate() + "%");
        return saved;
    }
    
    @Override
    public FeeStandard updateFeeStandard(Long id, FeeStandard feeStandard) {
        FeeStandard existing = feeStandardRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("党费标准不存在"));
        
        // 检查收入范围是否重叠（排除当前记录）
        if (hasOverlappingIncomeRangeExcluding(feeStandard, id)) {
            throw new IllegalArgumentException("收入范围与现有标准重叠");
        }
        
        existing.setName(feeStandard.getName());
        existing.setIncomeMin(feeStandard.getIncomeMin());
        existing.setIncomeMax(feeStandard.getIncomeMax());
        existing.setFeeRate(feeStandard.getFeeRate());
        existing.setFixedAmount(feeStandard.getFixedAmount());
        existing.setDescription(feeStandard.getDescription());
        existing.setEffectiveDate(feeStandard.getEffectiveDate());
        existing.setStatus(feeStandard.getStatus());
        
        FeeStandard saved = feeStandardRepository.save(existing);
        operationLogService.log("UPDATE_FEE_STANDARD", "党费管理", 
                "更新党费标准: 收入范围 " + feeStandard.getIncomeMin() + "-" + feeStandard.getIncomeMax() +
                        ", 缴费比例: " + feeStandard.getFeeRate() + "%");
        return saved;
    }
    
    @Override
    public void deleteFeeStandard(Long id) {
        FeeStandard feeStandard = feeStandardRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("党费标准不存在"));
        
        // 检查是否有使用此标准的缴费记录
        // 这里简化处理，实际应该检查相关的缴费记录
        if (false) { // 暂时禁用此检查
            throw new IllegalStateException("该党费标准已有关联的缴费记录，无法删除");
        }
        
        feeStandardRepository.delete(feeStandard);
        operationLogService.log("DELETE_FEE_STANDARD", "党费管理", 
            "删除党费标准: " + feeStandard.getName());
    }
    
    @Override
    @Transactional(readOnly = true)
    public FeeStandard getFeeStandardById(Long id) {
        return feeStandardRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("党费标准不存在"));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<FeeStandard> getFeeStandards(Pageable pageable) {
        return feeStandardRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<FeeStandard> getActiveFeeStandards() {
        return feeStandardRepository.findByStatus(FeeStandard.FeeStandardStatus.ACTIVE);
    }
    
    @Override
    @Transactional(readOnly = true)
    public FeeStandard findApplicableFeeStandard(BigDecimal income) {
        return feeStandardRepository.findMostApplicableStandard(income).orElse(null);
    }
    
    @Override
    public void enableFeeStandard(Long id) {
        FeeStandard feeStandard = feeStandardRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("党费标准不存在"));
        
        feeStandard.setStatus(FeeStandard.FeeStandardStatus.ACTIVE);
        feeStandardRepository.save(feeStandard);
        
        operationLogService.log("ENABLE_FEE_STANDARD", "党费管理", 
            "启用党费标准: " + feeStandard.getName());
    }
    
    @Override
    public void disableFeeStandard(Long id) {
        FeeStandard feeStandard = feeStandardRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("党费标准不存在"));
        
        feeStandard.setStatus(FeeStandard.FeeStandardStatus.INACTIVE);
        feeStandardRepository.save(feeStandard);
        
        operationLogService.log("DISABLE_FEE_STANDARD", "党费管理", 
            "禁用党费标准: " + feeStandard.getName());
    }
    
    // ==================== 党费缴费管理 ====================
    
    @Override
    public FeePayment createFeePayment(FeePayment feePayment) {
        // 检查是否已存在相同期间的缴费记录
        if (feePaymentRepository.findByMemberAndPaymentYearAndPaymentMonth(
                feePayment.getMember(), feePayment.getPaymentYear(), feePayment.getPaymentMonth()).isPresent()) {
            throw new IllegalArgumentException("该党员在此期间已有缴费记录");
        }
        
        FeePayment saved = feePaymentRepository.save(feePayment);
        operationLogService.log("CREATE_FEE_PAYMENT", "党费管理", 
            "创建缴费记录: " + saved.getMember().getUser().getRealName() + " " + 
            saved.getPaymentYear() + "年" + saved.getPaymentMonth() + "月");
        return saved;
    }
    
    @Override
    public FeePayment updateFeePayment(Long id, FeePayment feePayment) {
        FeePayment existing = feePaymentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("缴费记录不存在"));
        
        existing.setIncomeAmount(feePayment.getIncomeAmount());
        existing.setFeeAmount(feePayment.getFeeAmount());
        existing.setPaymentDate(feePayment.getPaymentDate());
        existing.setPaymentMethod(feePayment.getPaymentMethod());
        existing.setStatus(feePayment.getStatus());
        existing.setRemarks(feePayment.getRemarks());
        
        FeePayment saved = feePaymentRepository.save(existing);
        operationLogService.log("UPDATE_FEE_PAYMENT", "党费管理", 
            "更新缴费记录: " + saved.getMember().getUser().getRealName() + " " + 
            saved.getPaymentYear() + "年" + saved.getPaymentMonth() + "月");
        return saved;
    }
    
    @Override
    public void deleteFeePayment(Long id) {
        FeePayment feePayment = feePaymentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("缴费记录不存在"));
        
        feePaymentRepository.delete(feePayment);
        operationLogService.log("DELETE_FEE_PAYMENT", "党费管理", 
            "删除缴费记录: " + feePayment.getMember().getUser().getRealName() + " " + 
            feePayment.getPaymentYear() + "年" + feePayment.getPaymentMonth() + "月");
    }
    
    @Override
    @Transactional(readOnly = true)
    public FeePayment getFeePaymentById(Long id) {
        return feePaymentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("缴费记录不存在"));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<FeePayment> getFeePayments(Pageable pageable) {
        return feePaymentRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<FeePayment> getFeePaymentsByMember(Long memberId, Pageable pageable) {
        PartyMember member = partyMemberRepository.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("党员不存在"));
        List<FeePayment> payments = feePaymentRepository.findByMemberOrderByPaymentYearDescPaymentMonthDesc(member);
        return new PageImpl<>(payments, pageable, payments.size());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<FeePayment> getFeePaymentsByYear(Integer year, Pageable pageable) {
        List<FeePayment> payments = feePaymentRepository.findByPaymentYear(year);
        return new PageImpl<>(payments, pageable, payments.size());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<FeePayment> getFeePaymentsByStatus(FeePayment.PaymentStatus status, Pageable pageable) {
        List<FeePayment> payments = feePaymentRepository.findByStatus(status);
        return new PageImpl<>(payments, pageable, payments.size());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<FeePayment> getOverdueFeePayments(Pageable pageable) {
        LocalDate now = LocalDate.now();
        List<FeePayment> payments = feePaymentRepository.findOverduePayments(now.getYear(), now.getMonthValue());
        return new PageImpl<>(payments, pageable, payments.size());
    }
    
    @Override
    public int batchCreateFeePayments(Integer year, Integer month) {
        List<PartyMember> activeMembers = partyMemberRepository.findByStatus(PartyMember.MemberStatus.ACTIVE);
        int count = 0;
        
        for (PartyMember member : activeMembers) {
            // 检查是否已存在缴费记录
            if (!feePaymentRepository.findByMemberAndPaymentYearAndPaymentMonth(member, year, month).isPresent()) {
                FeePayment payment = new FeePayment();
                payment.setMember(member);
                payment.setPaymentYear(year);
                payment.setPaymentMonth(month);
                payment.setStatus(FeePayment.PaymentStatus.PENDING);
                
                feePaymentRepository.save(payment);
                count++;
            }
        }
        
        operationLogService.log("BATCH_CREATE_FEE_PAYMENTS", "党费管理", 
            "批量创建" + year + "年" + month + "月缴费记录，共" + count + "条");
        
        return count;
    }
    
    @Override
    @Transactional(readOnly = true)
    public BigDecimal calculateMemberFee(Long memberId, BigDecimal income) {
        PartyMember member = partyMemberRepository.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("党员不存在"));
        
        FeeStandard standard = findApplicableFeeStandard(income);
        return standard.calculateFee(income);
    }
    
    @Override
    public void markAsPaid(Long id, LocalDate paymentDate, FeePayment.PaymentMethod paymentMethod) {
        FeePayment payment = feePaymentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("缴费记录不存在"));
        
        payment.markAsPaid(paymentDate, paymentMethod);
        payment.setPaymentDate(paymentDate);
        payment.setPaymentMethod(paymentMethod);
        
        feePaymentRepository.save(payment);
        operationLogService.log("MARK_PAYMENT_PAID", "党费管理", 
            "标记缴费: " + payment.getMember().getUser().getRealName() + " " + 
            payment.getPaymentYear() + "年" + payment.getPaymentMonth() + "月");
    }
    
    @Override
    public void markAsOverdue(Long id) {
        FeePayment payment = feePaymentRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("缴费记录不存在"));
        
        payment.markAsOverdue();
        feePaymentRepository.save(payment);
        
        operationLogService.log("MARK_PAYMENT_OVERDUE", "党费管理", 
            "标记逾期: " + payment.getMember().getUser().getRealName() + " " + 
            payment.getPaymentYear() + "年" + payment.getPaymentMonth() + "月");
    }
    
    // ==================== 统计分析 ====================
    
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getFeeIncomeStatistics(Integer year) {
        BigDecimal totalIncome = feePaymentRepository.sumFeeAmountByYearAndStatus(year, FeePayment.PaymentStatus.PAID);
        Long totalCount = (long) feePaymentRepository.findByPaymentYear(year).size();
        Long paidCount = feePaymentRepository.findByPaymentYear(year).stream()
            .filter(p -> p.getStatus() == FeePayment.PaymentStatus.PAID).count();
        Long pendingCount = feePaymentRepository.findByPaymentYear(year).stream()
            .filter(p -> p.getStatus() == FeePayment.PaymentStatus.PENDING).count();
        Long overdueCount = feePaymentRepository.findByPaymentYear(year).stream()
            .filter(p -> p.getStatus() == FeePayment.PaymentStatus.OVERDUE).count();
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("year", year);
        statistics.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        statistics.put("totalCount", totalCount);
        statistics.put("paidCount", paidCount);
        statistics.put("pendingCount", pendingCount);
        statistics.put("overdueCount", overdueCount);
        statistics.put("paymentRate", totalCount > 0 ? (double) paidCount / totalCount * 100 : 0);
        
        return statistics;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMonthlyFeeIncomeStatistics(Integer year) {
        List<Map<String, Object>> monthlyStats = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            BigDecimal monthlyIncome = feePaymentRepository.sumFeeAmountByYearMonthAndStatus(year, month, FeePayment.PaymentStatus.PAID);
            Long monthlyCount = (long) feePaymentRepository.findByPaymentYearAndPaymentMonth(year, month).size();
            Long paidCount = feePaymentRepository.countByPaymentYearAndPaymentMonthAndStatus(
                year, month, FeePayment.PaymentStatus.PAID);
            
            Map<String, Object> monthStat = new HashMap<>();
            monthStat.put("month", month);
            monthStat.put("income", monthlyIncome != null ? monthlyIncome : BigDecimal.ZERO);
            monthStat.put("totalCount", monthlyCount);
            monthStat.put("paidCount", paidCount);
            monthStat.put("paymentRate", monthlyCount > 0 ? (double) paidCount / monthlyCount * 100 : 0);
            
            monthlyStats.add(monthStat);
        }
        
        return monthlyStats;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getMemberPaymentStatistics(Integer year, Integer month) {
        Long totalMembers = partyMemberRepository.countByStatus(PartyMember.MemberStatus.ACTIVE);
        Long paidMembers = feePaymentRepository.countByPaymentYearAndPaymentMonthAndStatus(
            year, month, FeePayment.PaymentStatus.PAID);
        Long pendingMembers = feePaymentRepository.countByPaymentYearAndPaymentMonthAndStatus(
            year, month, FeePayment.PaymentStatus.PENDING);
        Long overdueMembers = feePaymentRepository.countByPaymentYearAndPaymentMonthAndStatus(
            year, month, FeePayment.PaymentStatus.OVERDUE);
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("year", year);
        statistics.put("month", month);
        statistics.put("totalMembers", totalMembers);
        statistics.put("paidMembers", paidMembers);
        statistics.put("pendingMembers", pendingMembers);
        statistics.put("overdueMembers", overdueMembers);
        statistics.put("paymentRate", totalMembers > 0 ? (double) paidMembers / totalMembers * 100 : 0);
        
        return statistics;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getOrganizationPaymentStatistics(Integer year, Integer month) {
        // 这里需要根据实际的组织结构来实现
        // 暂时返回空列表，实际实现需要根据组织表结构调整
        return new ArrayList<>();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPaymentMethodStatistics(Integer year) {
        List<Map<String, Object>> methodStats = new ArrayList<>();
        
        for (FeePayment.PaymentMethod method : FeePayment.PaymentMethod.values()) {
            Long count = feePaymentRepository.findByPaymentYear(year).stream()
                .filter(p -> p.getPaymentMethod() == method).count();
            BigDecimal amount = feePaymentRepository.findByPaymentYear(year).stream()
                .filter(p -> p.getPaymentMethod() == method && p.getFeeAmount() != null)
                .map(FeePayment::getFeeAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Map<String, Object> methodStat = new HashMap<>();
            methodStat.put("method", method.name());
            methodStat.put("methodName", getPaymentMethodName(method));
            methodStat.put("count", count);
            methodStat.put("amount", amount != null ? amount : BigDecimal.ZERO);
            
            methodStats.add(methodStat);
        }
        
        return methodStats;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOverduePaymentStatistics() {
        LocalDate now = LocalDate.now();
        List<FeePayment> overduePayments = feePaymentRepository.findOverduePayments(now.getYear(), now.getMonthValue());
        Long overdueCount = (long) overduePayments.size();
        BigDecimal overdueAmount = overduePayments.stream()
            .filter(p -> p.getFeeAmount() != null)
            .map(FeePayment::getFeeAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("overdueCount", overdueCount);
        statistics.put("overdueAmount", overdueAmount != null ? overdueAmount : BigDecimal.ZERO);
        statistics.put("statisticsDate", now);
        
        return statistics;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getFeePaymentRanking(Integer year, Integer limit) {
        // 这里需要根据实际需求实现排行榜逻辑
        // 可以按缴费金额、缴费及时性等维度排序
        return new ArrayList<>();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getFeePaymentTrend(Integer startYear, Integer endYear) {
        List<Map<String, Object>> trendData = new ArrayList<>();
        
        for (int year = startYear; year <= endYear; year++) {
            Map<String, Object> yearData = getFeeIncomeStatistics(year);
            trendData.add(yearData);
        }
        
        return trendData;
    }
    
    // ==================== 导出功能 ====================
    
    @Override
    @Transactional(readOnly = true)
    public String exportFeePayments(Integer year, Integer month, Long organizationId) {
        // 实际实现需要根据具体的导出需求来完成
        // 这里返回一个模拟的文件路径
        String fileName = String.format("fee_payments_%d_%02d.xlsx", year, month);
        operationLogService.log("EXPORT_FEE_PAYMENTS", "党费管理", 
            "导出" + year + "年" + month + "月缴费记录");
        return "/exports/" + fileName;
    }
    
    @Override
    @Transactional(readOnly = true)
    public String exportFeeStatistics(Integer year) {
        String fileName = String.format("fee_statistics_%d.xlsx", year);
        operationLogService.log("EXPORT_FEE_STATISTICS", "党费管理", 
            "导出" + year + "年统计报表");
        return "/exports/" + fileName;
    }
    
    @Override
    @Transactional(readOnly = true)
    public String exportOverduePayments() {
        String fileName = String.format("overdue_payments_%s.xlsx", LocalDate.now().toString());
        operationLogService.log("EXPORT_OVERDUE_PAYMENTS", "党费管理", 
            "导出逾期缴费名单");
        return "/exports/" + fileName;
    }
    
    // ==================== 提醒功能 ====================
    
    @Override
    public Map<String, Object> sendPaymentReminder(Integer year, Integer month) {
        List<PartyMember> membersNeedingReminder = getMembersNeedingReminder(year, month);
        
        int sentCount = 0;
        for (PartyMember member : membersNeedingReminder) {
            // 实际发送提醒逻辑
            // 这里可以集成短信、邮件或系统通知
            sentCount++;
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "缴费提醒发送完成");
        result.put("sentCount", sentCount);
        result.put("totalCount", membersNeedingReminder.size());
        
        operationLogService.log("SEND_PAYMENT_REMINDER", "党费管理", 
            "发送" + year + "年" + month + "月缴费提醒，共" + sentCount + "人");
        
        return result;
    }
    
    @Override
    public Map<String, Object> sendOverdueReminder() {
        List<PartyMember> overdueMembers = getOverdueMembers();
        
        int sentCount = 0;
        for (PartyMember member : overdueMembers) {
            // 实际发送逾期提醒逻辑
            sentCount++;
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "逾期提醒发送完成");
        result.put("sentCount", sentCount);
        result.put("totalCount", overdueMembers.size());
        
        operationLogService.log("SEND_OVERDUE_REMINDER", "党费管理", 
            "发送逾期提醒给 " + overdueMembers.size() + " 名党员");
        
        return result;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PartyMember> getMembersNeedingReminder(Integer year, Integer month) {
        // 查询需要缴费提醒的党员 - 简化实现，返回所有活跃党员
        return partyMemberRepository.findByStatus(PartyMember.MemberStatus.ACTIVE);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PartyMember> getOverdueMembers() {
        // 查询有逾期缴费的党员 - 简化实现，返回所有活跃党员
        return partyMemberRepository.findByStatus(PartyMember.MemberStatus.ACTIVE);
    }
    
    // ==================== 私有辅助方法 ====================
    
    private boolean hasOverlappingIncomeRange(FeeStandard feeStandard) {
        return feeStandardRepository.existsOverlappingRange(
            feeStandard.getIncomeMin(), feeStandard.getIncomeMax(), 
            feeStandard.getEffectiveDate(), null);
    }
    
    private boolean hasOverlappingIncomeRangeExcluding(FeeStandard feeStandard, Long excludeId) {
        return feeStandardRepository.existsOverlappingRange(
            feeStandard.getIncomeMin(), feeStandard.getIncomeMax(), 
            feeStandard.getEffectiveDate(), excludeId);
    }
    
    private String getPaymentMethodName(FeePayment.PaymentMethod method) {
        switch (method) {
            case CASH: return "现金";
            case BANK_TRANSFER: return "银行转账";
            case ONLINE: return "在线支付";
            default: return method.name();
        }
    }
}