package com.party.service.impl;

import com.party.entity.FeePayment;
import com.party.repository.FeePaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 党费缴费记录服务实现类
 */
@Service
public class FeePaymentServiceImpl {
    
    @Autowired
    private FeePaymentRepository feePaymentRepository;
    
    public List<FeePayment> findAll() {
        return feePaymentRepository.findAll();
    }
    
    public Page<FeePayment> findAll(Pageable pageable) {
        return feePaymentRepository.findAll(pageable);
    }
    
    public Optional<FeePayment> findById(Long id) {
        return feePaymentRepository.findById(id);
    }
    
    public List<FeePayment> findByUserId(Long userId) {
        return feePaymentRepository.findByUserId(userId);
    }
    
    public List<FeePayment> findByStatus(String status) {
        return feePaymentRepository.findByStatus(status);
    }
    
    public List<FeePayment> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return feePaymentRepository.findByPaymentDateBetween(startDate, endDate);
    }
    
    public List<FeePayment> findByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return feePaymentRepository.findByUserIdAndPaymentDateBetween(userId, startDate, endDate);
    }
    
    public List<FeePayment> findByPaymentMethod(String paymentMethod) {
        return feePaymentRepository.findByPaymentMethod(paymentMethod);
    }
    
    public List<FeePayment> findByUserIdAndStatus(Long userId, String status) {
        return feePaymentRepository.findByUserIdAndStatus(userId, status);
    }
    
    public List<FeePayment> findByAmountRange(BigDecimal minAmount, BigDecimal maxAmount) {
        return feePaymentRepository.findByAmountRange(minAmount, maxAmount);
    }
    
    public List<FeePayment> findRecentPaymentsByUserId(Long userId, int limit) {
        return feePaymentRepository.findRecentPaymentsByUserId(userId, PageRequest.of(0, limit));
    }
    
    public FeePayment save(FeePayment feePayment) {
        if (feePayment.getCreatedAt() == null) {
            feePayment.setCreatedAt(LocalDateTime.now());
        }
        feePayment.setUpdatedAt(LocalDateTime.now());
        return feePaymentRepository.save(feePayment);
    }
    
    public Optional<FeePayment> update(Long id, FeePayment updatedPayment) {
        Optional<FeePayment> existingPayment = feePaymentRepository.findById(id);
        if (existingPayment.isPresent()) {
            FeePayment payment = existingPayment.get();
            if (updatedPayment.getAmount() != null) {
                payment.setAmount(updatedPayment.getAmount());
            }
            if (updatedPayment.getPaymentDate() != null) {
                payment.setPaymentDate(updatedPayment.getPaymentDate());
            }
            if (updatedPayment.getPaymentMethod() != null) {
                payment.setPaymentMethod(updatedPayment.getPaymentMethod());
            }
            if (updatedPayment.getStatus() != null) {
                payment.setStatus(updatedPayment.getStatus());
            }
            if (updatedPayment.getRemark() != null) {
                payment.setRemark(updatedPayment.getRemark());
            }
            payment.setUpdatedAt(LocalDateTime.now());
            return Optional.of(feePaymentRepository.save(payment));
        }
        return Optional.empty();
    }
    
    public boolean deleteById(Long id) {
        if (feePaymentRepository.existsById(id)) {
            feePaymentRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public void deleteByUserIdAndPaymentDateBefore(Long userId, LocalDate beforeDate) {
        feePaymentRepository.deleteByUserIdAndPaymentDateBefore(userId, beforeDate);
    }
    
    public BigDecimal getTotalPaidAmountByUserId(Long userId) {
        BigDecimal total = feePaymentRepository.getTotalPaidAmountByUserId(userId);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalPaidAmountByDateRange(LocalDate startDate, LocalDate endDate) {
        BigDecimal total = feePaymentRepository.getTotalPaidAmountByDateRange(startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public long countByStatus(String status) {
        return feePaymentRepository.countByStatus(status);
    }
    
    public long countByUserId(Long userId) {
        return feePaymentRepository.countByUserId(userId);
    }
    
    public long countByPaymentMethod(String paymentMethod) {
        return feePaymentRepository.countByPaymentMethod(paymentMethod);
    }
    
    public long countByDateRange(LocalDate startDate, LocalDate endDate) {
        return feePaymentRepository.countByDateRange(startDate, endDate);
    }
    
    public boolean existsByUserIdAndPaymentDate(Long userId, LocalDate paymentDate) {
        return feePaymentRepository.existsByUserIdAndPaymentDate(userId, paymentDate);
    }
    
    public boolean updatePaymentStatus(Long id, String status) {
        Optional<FeePayment> payment = feePaymentRepository.findById(id);
        if (payment.isPresent()) {
            FeePayment feePayment = payment.get();
            feePayment.setStatus(status);
            feePayment.setUpdatedAt(LocalDateTime.now());
            feePaymentRepository.save(feePayment);
            return true;
        }
        return false;
    }
    
    public BigDecimal calculateTotalAmountByDateRange(LocalDate startDate, LocalDate endDate) {
        return feePaymentRepository.calculateTotalAmountByDateRange(startDate, endDate);
    }
    
    public BigDecimal calculateTotalAmountByUser(Long userId) {
        return feePaymentRepository.calculateTotalAmountByUserId(userId);
    }
}