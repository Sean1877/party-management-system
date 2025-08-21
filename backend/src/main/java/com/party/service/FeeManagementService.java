package com.party.service;

import com.party.entity.FeePayment;
import com.party.entity.FeeStandard;
import com.party.entity.PartyMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 党费管理服务接口
 */
public interface FeeManagementService {
    
    // ==================== 党费标准管理 ====================
    
    /**
     * 创建党费标准
     * @param feeStandard 党费标准
     * @return 创建的党费标准
     */
    FeeStandard createFeeStandard(FeeStandard feeStandard);
    
    /**
     * 更新党费标准
     * @param id 党费标准ID
     * @param feeStandard 党费标准
     * @return 更新的党费标准
     */
    FeeStandard updateFeeStandard(Long id, FeeStandard feeStandard);
    
    /**
     * 删除党费标准
     * @param id 党费标准ID
     */
    void deleteFeeStandard(Long id);
    
    /**
     * 根据ID查询党费标准
     * @param id 党费标准ID
     * @return 党费标准
     */
    FeeStandard getFeeStandardById(Long id);
    
    /**
     * 查询所有有效的党费标准
     * @return 党费标准列表
     */
    List<FeeStandard> getActiveFeeStandards();
    
    /**
     * 分页查询党费标准
     * @param pageable 分页参数
     * @return 党费标准分页
     */
    Page<FeeStandard> getFeeStandards(Pageable pageable);
    
    /**
     * 根据收入范围查找适用的党费标准
     * @param income 收入金额
     * @return 适用的党费标准
     */
    FeeStandard findApplicableFeeStandard(BigDecimal income);
    
    /**
     * 启用党费标准
     * @param id 党费标准ID
     */
    void enableFeeStandard(Long id);
    
    /**
     * 禁用党费标准
     * @param id 党费标准ID
     */
    void disableFeeStandard(Long id);
    
    // ==================== 党费缴费管理 ====================
    
    /**
     * 创建党费缴费记录
     * @param feePayment 党费缴费记录
     * @return 创建的党费缴费记录
     */
    FeePayment createFeePayment(FeePayment feePayment);
    
    /**
     * 更新党费缴费记录
     * @param id 党费缴费记录ID
     * @param feePayment 党费缴费记录
     * @return 更新的党费缴费记录
     */
    FeePayment updateFeePayment(Long id, FeePayment feePayment);
    
    /**
     * 删除党费缴费记录
     * @param id 党费缴费记录ID
     */
    void deleteFeePayment(Long id);
    
    /**
     * 根据ID查询党费缴费记录
     * @param id 党费缴费记录ID
     * @return 党费缴费记录
     */
    FeePayment getFeePaymentById(Long id);
    
    /**
     * 分页查询党费缴费记录
     * @param pageable 分页参数
     * @return 党费缴费记录分页
     */
    Page<FeePayment> getFeePayments(Pageable pageable);
    
    /**
     * 根据党员查询党费缴费记录
     * @param memberId 党员ID
     * @param pageable 分页参数
     * @return 党费缴费记录分页
     */
    Page<FeePayment> getFeePaymentsByMember(Long memberId, Pageable pageable);
    
    /**
     * 根据年份查询党费缴费记录
     * @param year 年份
     * @param pageable 分页参数
     * @return 党费缴费记录分页
     */
    Page<FeePayment> getFeePaymentsByYear(Integer year, Pageable pageable);
    
    /**
     * 根据缴费状态查询党费缴费记录
     * @param status 缴费状态
     * @param pageable 分页参数
     * @return 党费缴费记录分页
     */
    Page<FeePayment> getFeePaymentsByStatus(FeePayment.PaymentStatus status, Pageable pageable);
    
    /**
     * 查询逾期未缴费记录
     * @param pageable 分页参数
     * @return 党费缴费记录分页
     */
    Page<FeePayment> getOverdueFeePayments(Pageable pageable);
    
    /**
     * 批量创建党费缴费记录
     * @param year 年份
     * @param month 月份
     * @return 创建的记录数
     */
    int batchCreateFeePayments(Integer year, Integer month);
    
    /**
     * 计算党员应缴党费
     * @param memberId 党员ID
     * @param income 收入金额
     * @return 应缴党费金额
     */
    BigDecimal calculateMemberFee(Long memberId, BigDecimal income);
    
    /**
     * 标记缴费记录为已缴费
     * @param paymentId 缴费记录ID
     * @param paymentDate 缴费日期
     * @param paymentMethod 缴费方式
     */
    void markAsPaid(Long paymentId, LocalDate paymentDate, FeePayment.PaymentMethod paymentMethod);
    
    /**
     * 标记缴费记录为逾期
     * @param paymentId 缴费记录ID
     */
    void markAsOverdue(Long paymentId);
    
    // ==================== 统计分析 ====================
    
    /**
     * 统计指定年份的党费收入
     * @param year 年份
     * @return 党费收入统计
     */
    Map<String, Object> getFeeIncomeStatistics(Integer year);
    
    /**
     * 统计指定年份月度党费收入
     * @param year 年份
     * @return 月度党费收入统计
     */
    List<Map<String, Object>> getMonthlyFeeIncomeStatistics(Integer year);
    
    /**
     * 统计党员缴费情况
     * @param year 年份
     * @param month 月份
     * @return 党员缴费统计
     */
    Map<String, Object> getMemberPaymentStatistics(Integer year, Integer month);
    
    /**
     * 统计组织缴费情况
     * @param year 年份
     * @param month 月份
     * @return 组织缴费统计
     */
    List<Map<String, Object>> getOrganizationPaymentStatistics(Integer year, Integer month);
    
    /**
     * 统计缴费方式分布
     * @param year 年份
     * @return 缴费方式统计
     */
    List<Map<String, Object>> getPaymentMethodStatistics(Integer year);
    
    /**
     * 统计逾期缴费情况
     * @return 逾期缴费统计
     */
    Map<String, Object> getOverduePaymentStatistics();
    
    /**
     * 获取党费缴费排行榜
     * @param year 年份
     * @param limit 限制数量
     * @return 缴费排行榜
     */
    List<Map<String, Object>> getFeePaymentRanking(Integer year, Integer limit);
    
    /**
     * 获取党费缴费趋势
     * @param startYear 开始年份
     * @param endYear 结束年份
     * @return 缴费趋势数据
     */
    List<Map<String, Object>> getFeePaymentTrend(Integer startYear, Integer endYear);
    
    // ==================== 导出功能 ====================
    
    /**
     * 导出党费缴费记录
     * @param year 年份
     * @param month 月份
     * @param organizationId 组织ID（可选）
     * @return 导出文件路径
     */
    String exportFeePayments(Integer year, Integer month, Long organizationId);
    
    /**
     * 导出党费统计报表
     * @param year 年份
     * @return 导出文件路径
     */
    String exportFeeStatistics(Integer year);
    
    /**
     * 导出逾期缴费名单
     * @return 导出文件路径
     */
    String exportOverduePayments();
    
    // ==================== 提醒功能 ====================
    
    /**
     * 发送缴费提醒
     * @param year 年份
     * @param month 月份
     * @return 提醒发送结果
     */
    Map<String, Object> sendPaymentReminder(Integer year, Integer month);
    
    /**
     * 发送逾期提醒
     * @return 提醒发送结果
     */
    Map<String, Object> sendOverdueReminder();
    
    /**
     * 获取需要提醒的党员列表
     * @param year 年份
     * @param month 月份
     * @return 党员列表
     */
    List<PartyMember> getMembersNeedingReminder(Integer year, Integer month);
    
    /**
     * 获取逾期未缴费的党员列表
     * @return 党员列表
     */
    List<PartyMember> getOverdueMembers();
}