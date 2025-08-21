package com.party.repository;

import com.party.entity.FeePayment;
import com.party.entity.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 党费缴费记录Repository接口
 */
@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    
    /**
     * 根据党员查询缴费记录
     * @param member 党员
     * @return 缴费记录列表
     */
    List<FeePayment> findByMemberOrderByPaymentYearDescPaymentMonthDesc(PartyMember member);
    
    /**
     * 根据党员和缴费状态查询记录
     * @param member 党员
     * @param status 缴费状态
     * @return 缴费记录列表
     */
    List<FeePayment> findByMemberAndStatus(PartyMember member, FeePayment.PaymentStatus status);
    
    /**
     * 根据缴费年月查询记录
     * @param paymentYear 缴费年份
     * @param paymentMonth 缴费月份
     * @return 缴费记录列表
     */
    List<FeePayment> findByPaymentYearAndPaymentMonth(Integer paymentYear, Integer paymentMonth);
    
    /**
     * 根据党员和缴费年月查询记录
     * @param member 党员
     * @param paymentYear 缴费年份
     * @param paymentMonth 缴费月份
     * @return 缴费记录
     */
    Optional<FeePayment> findByMemberAndPaymentYearAndPaymentMonth(PartyMember member, 
                                                                  Integer paymentYear, 
                                                                  Integer paymentMonth);
    
    /**
     * 根据缴费状态查询记录
     * @param status 缴费状态
     * @return 缴费记录列表
     */
    List<FeePayment> findByStatus(FeePayment.PaymentStatus status);
    
    /**
     * 根据缴费日期范围查询记录
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 缴费记录列表
     */
    List<FeePayment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * 查询指定年份的缴费记录
     * @param paymentYear 缴费年份
     * @return 缴费记录列表
     */
    List<FeePayment> findByPaymentYear(Integer paymentYear);
    
    /**
     * 查询党员指定年份的缴费记录
     * @param member 党员
     * @param paymentYear 缴费年份
     * @return 缴费记录列表
     */
    List<FeePayment> findByMemberAndPaymentYearOrderByPaymentMonthDesc(PartyMember member, Integer paymentYear);
    
    /**
     * 统计指定年月的缴费总额
     * @param paymentYear 缴费年份
     * @param paymentMonth 缴费月份
     * @param status 缴费状态
     * @return 缴费总额
     */
    @Query("SELECT COALESCE(SUM(fp.feeAmount), 0) FROM FeePayment fp " +
           "WHERE fp.paymentYear = :paymentYear AND fp.paymentMonth = :paymentMonth " +
           "AND fp.status = :status")
    BigDecimal sumFeeAmountByYearMonthAndStatus(@Param("paymentYear") Integer paymentYear,
                                               @Param("paymentMonth") Integer paymentMonth,
                                               @Param("status") FeePayment.PaymentStatus status);
    
    /**
     * 统计指定年份的缴费总额
     * @param paymentYear 缴费年份
     * @param status 缴费状态
     * @return 缴费总额
     */
    @Query("SELECT COALESCE(SUM(fp.feeAmount), 0) FROM FeePayment fp " +
           "WHERE fp.paymentYear = :paymentYear AND fp.status = :status")
    BigDecimal sumFeeAmountByYearAndStatus(@Param("paymentYear") Integer paymentYear,
                                          @Param("status") FeePayment.PaymentStatus status);
    
    /**
     * 统计党员指定年份的缴费总额
     * @param member 党员
     * @param paymentYear 缴费年份
     * @param status 缴费状态
     * @return 缴费总额
     */
    @Query("SELECT COALESCE(SUM(fp.feeAmount), 0) FROM FeePayment fp " +
           "WHERE fp.member = :member AND fp.paymentYear = :paymentYear AND fp.status = :status")
    BigDecimal sumFeeAmountByMemberYearAndStatus(@Param("member") PartyMember member,
                                                @Param("paymentYear") Integer paymentYear,
                                                @Param("status") FeePayment.PaymentStatus status);
    
    /**
     * 统计指定状态的缴费记录数量
     * @param status 缴费状态
     * @return 记录数量
     */
    long countByStatus(FeePayment.PaymentStatus status);
    
    /**
     * 统计指定年月的缴费记录数量
     * @param paymentYear 缴费年份
     * @param paymentMonth 缴费月份
     * @param status 缴费状态
     * @return 记录数量
     */
    long countByPaymentYearAndPaymentMonthAndStatus(Integer paymentYear, 
                                                   Integer paymentMonth, 
                                                   FeePayment.PaymentStatus status);
    
    /**
     * 查询逾期未缴费的记录
     * @param currentYear 当前年份
     * @param currentMonth 当前月份
     * @return 逾期记录列表
     */
    @Query("SELECT fp FROM FeePayment fp WHERE fp.status = 'PENDING' " +
           "AND (fp.paymentYear < :currentYear OR " +
           "(fp.paymentYear = :currentYear AND fp.paymentMonth < :currentMonth))")
    List<FeePayment> findOverduePayments(@Param("currentYear") Integer currentYear,
                                        @Param("currentMonth") Integer currentMonth);
    
    /**
     * 查询党员的逾期缴费记录
     * @param member 党员
     * @param currentYear 当前年份
     * @param currentMonth 当前月份
     * @return 逾期记录列表
     */
    @Query("SELECT fp FROM FeePayment fp WHERE fp.member = :member AND fp.status = 'PENDING' " +
           "AND (fp.paymentYear < :currentYear OR " +
           "(fp.paymentYear = :currentYear AND fp.paymentMonth < :currentMonth))")
    List<FeePayment> findMemberOverduePayments(@Param("member") PartyMember member,
                                              @Param("currentYear") Integer currentYear,
                                              @Param("currentMonth") Integer currentMonth);
    
    /**
     * 查询指定日期范围内的缴费统计
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 统计结果
     */
    @Query("SELECT fp.paymentYear, fp.paymentMonth, COUNT(fp), SUM(fp.feeAmount) " +
           "FROM FeePayment fp WHERE fp.status = 'PAID' " +
           "AND fp.paymentDate BETWEEN :startDate AND :endDate " +
           "GROUP BY fp.paymentYear, fp.paymentMonth " +
           "ORDER BY fp.paymentYear DESC, fp.paymentMonth DESC")
    List<Object[]> getPaymentStatistics(@Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);
    
    /**
     * 查询党员的缴费历史统计
     * @param member 党员
     * @return 统计结果
     */
    @Query("SELECT fp.paymentYear, COUNT(fp), SUM(fp.feeAmount) " +
           "FROM FeePayment fp WHERE fp.member = :member AND fp.status = 'PAID' " +
           "GROUP BY fp.paymentYear " +
           "ORDER BY fp.paymentYear DESC")
    List<Object[]> getMemberPaymentStatistics(@Param("member") PartyMember member);
}