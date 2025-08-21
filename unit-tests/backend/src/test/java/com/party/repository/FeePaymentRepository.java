package com.party.repository;

import com.party.entity.FeePayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 党费缴费记录Repository接口
 */
@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    
    List<FeePayment> findByUserId(Long userId);
    
    List<FeePayment> findByStatus(String status);
    
    List<FeePayment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<FeePayment> findByUserIdAndPaymentDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<FeePayment> findByPaymentMethod(String paymentMethod);
    
    List<FeePayment> findByUserIdAndStatus(Long userId, String status);
    
    @Query("SELECT fp FROM FeePayment fp WHERE fp.amount >= :minAmount AND fp.amount <= :maxAmount")
    List<FeePayment> findByAmountRange(@Param("minAmount") BigDecimal minAmount, @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT fp FROM FeePayment fp WHERE fp.user.id = :userId ORDER BY fp.paymentDate DESC")
    List<FeePayment> findRecentPaymentsByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT SUM(fp.amount) FROM FeePayment fp WHERE fp.user.id = :userId AND fp.status = 'PAID'")
    BigDecimal getTotalPaidAmountByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(fp.amount) FROM FeePayment fp WHERE fp.status = 'PAID' AND fp.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalPaidAmountByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    long countByStatus(String status);
    
    long countByUserId(Long userId);
    
    long countByPaymentMethod(String paymentMethod);
    
    @Query("SELECT COUNT(fp) FROM FeePayment fp WHERE fp.paymentDate BETWEEN :startDate AND :endDate")
    long countByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    boolean existsByUserIdAndPaymentDate(Long userId, LocalDate paymentDate);
    
    void deleteByUserIdAndPaymentDateBefore(Long userId, LocalDate beforeDate);
    
    @Query("SELECT SUM(fp.amount) FROM FeePayment fp WHERE fp.paymentMethod = :paymentMethod")
    BigDecimal calculateTotalAmountByPaymentMethod(@Param("paymentMethod") String paymentMethod);
    
    @Query("SELECT SUM(fp.amount) FROM FeePayment fp WHERE fp.user.id = :userId")
    BigDecimal calculateTotalAmountByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(fp.amount) FROM FeePayment fp WHERE fp.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalAmountByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}