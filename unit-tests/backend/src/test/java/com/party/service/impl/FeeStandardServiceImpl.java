package com.party.service.impl;

import com.party.entity.FeeStandard;
import com.party.repository.FeeStandardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 党费标准服务实现类
 */
@Service
public class FeeStandardServiceImpl {
    
    @Autowired
    private FeeStandardRepository feeStandardRepository;
    
    /**
     * 查找所有党费标准
     */
    public List<FeeStandard> findAll() {
        return feeStandardRepository.findAll();
    }
    
    /**
     * 分页查找所有党费标准
     */
    public Page<FeeStandard> findAll(Pageable pageable) {
        return feeStandardRepository.findAll(pageable);
    }
    
    /**
     * 根据ID查找党费标准
     */
    public Optional<FeeStandard> findById(Long id) {
        return feeStandardRepository.findById(id);
    }
    
    /**
     * 根据状态查找党费标准
     */
    public List<FeeStandard> findByStatus(String status) {
        return feeStandardRepository.findByStatus(status);
    }
    
    /**
     * 根据收入范围查找适用的党费标准
     */
    public List<FeeStandard> findByIncomeRange(BigDecimal income) {
        return feeStandardRepository.findByIncomeRange(income);
    }
    
    /**
     * 保存党费标准
     */
    public FeeStandard save(FeeStandard feeStandard) {
        if (feeStandard.getCreatedAt() == null) {
            feeStandard.setCreatedAt(LocalDateTime.now());
        }
        feeStandard.setUpdatedAt(LocalDateTime.now());
        return feeStandardRepository.save(feeStandard);
    }
    
    /**
     * 更新党费标准
     */
    public Optional<FeeStandard> update(Long id, FeeStandard updatedStandard) {
        Optional<FeeStandard> existingStandard = feeStandardRepository.findById(id);
        if (existingStandard.isPresent()) {
            FeeStandard standard = existingStandard.get();
            standard.setName(updatedStandard.getName());
            standard.setDescription(updatedStandard.getDescription());
            standard.setMinIncome(updatedStandard.getMinIncome());
            standard.setMaxIncome(updatedStandard.getMaxIncome());
            standard.setFeeRate(updatedStandard.getFeeRate());
            standard.setFixedAmount(updatedStandard.getFixedAmount());
            standard.setStatus(updatedStandard.getStatus());
            standard.setUpdatedAt(LocalDateTime.now());
            return Optional.of(feeStandardRepository.save(standard));
        }
        return Optional.empty();
    }
    
    /**
     * 根据ID删除党费标准
     */
    public boolean deleteById(Long id) {
        if (feeStandardRepository.existsById(id)) {
            feeStandardRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * 查找所有激活状态的党费标准
     */
    public List<FeeStandard> findActiveStandards() {
        return feeStandardRepository.findActiveStandardsOrderByMinIncome();
    }
    
    /**
     * 根据名称搜索党费标准
     */
    public List<FeeStandard> findByNameContaining(String name) {
        return feeStandardRepository.findByNameContaining(name);
    }
    
    /**
     * 检查收入范围是否与现有标准重叠
     */
    public boolean hasOverlappingStandards(BigDecimal minIncome, BigDecimal maxIncome) {
        Long count = feeStandardRepository.countOverlappingStandards(minIncome, maxIncome);
        return count > 0;
    }
    
    /**
     * 根据费率范围查找党费标准
     */
    public List<FeeStandard> findByFeeRateRange(BigDecimal minRate, BigDecimal maxRate) {
        return feeStandardRepository.findByFeeRateRange(minRate, maxRate);
    }
    
    /**
     * 查找固定金额大于指定值的党费标准
     */
    public List<FeeStandard> findByFixedAmountGreaterThan(BigDecimal amount) {
        return feeStandardRepository.findByFixedAmountGreaterThan(amount);
    }
    
    /**
     * 统计指定状态的党费标准数量
     */
    public Long countByStatus(String status) {
        return feeStandardRepository.countByStatus(status);
    }
    
    /**
     * 计算党费金额
     */
    public BigDecimal calculateFeeAmount(FeeStandard feeStandard, BigDecimal income) {
        if (feeStandard.getFixedAmount() != null && feeStandard.getFixedAmount().compareTo(BigDecimal.ZERO) > 0) {
            return feeStandard.getFixedAmount();
        } else if (feeStandard.getFeeRate() != null) {
            return income.multiply(feeStandard.getFeeRate());
        }
        return BigDecimal.ZERO;
    }
}