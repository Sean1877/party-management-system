package com.party.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 党费标准实体类
 */
@Entity
@Table(name = "fee_standards")
public class FeeStandard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "income_min", nullable = false, precision = 10, scale = 2)
    private BigDecimal incomeMin;
    
    @Column(name = "income_max", precision = 10, scale = 2)
    private BigDecimal incomeMax;
    
    @Column(name = "fee_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal feeRate;
    
    @Column(name = "fixed_amount", precision = 10, scale = 2)
    private BigDecimal fixedAmount;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FeeStandardStatus status = FeeStandardStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum FeeStandardStatus {
        ACTIVE, INACTIVE
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // 构造函数
    public FeeStandard() {}
    
    public FeeStandard(String name, BigDecimal incomeMin, BigDecimal incomeMax, 
                      BigDecimal feeRate, BigDecimal fixedAmount, String description, 
                      LocalDate effectiveDate) {
        this.name = name;
        this.incomeMin = incomeMin;
        this.incomeMax = incomeMax;
        this.feeRate = feeRate;
        this.fixedAmount = fixedAmount;
        this.description = description;
        this.effectiveDate = effectiveDate;
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public BigDecimal getIncomeMin() {
        return incomeMin;
    }
    
    public void setIncomeMin(BigDecimal incomeMin) {
        this.incomeMin = incomeMin;
    }
    
    public BigDecimal getIncomeMax() {
        return incomeMax;
    }
    
    public void setIncomeMax(BigDecimal incomeMax) {
        this.incomeMax = incomeMax;
    }
    
    public BigDecimal getFeeRate() {
        return feeRate;
    }
    
    public void setFeeRate(BigDecimal feeRate) {
        this.feeRate = feeRate;
    }
    
    public BigDecimal getFixedAmount() {
        return fixedAmount;
    }
    
    public void setFixedAmount(BigDecimal fixedAmount) {
        this.fixedAmount = fixedAmount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }
    
    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }
    
    public FeeStandardStatus getStatus() {
        return status;
    }
    
    public void setStatus(FeeStandardStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    /**
     * 计算指定收入的党费金额
     * @param income 收入金额
     * @return 党费金额
     */
    public BigDecimal calculateFee(BigDecimal income) {
        if (fixedAmount != null) {
            return fixedAmount;
        }
        
        if (feeRate != null && income != null) {
            return income.multiply(feeRate);
        }
        
        return BigDecimal.ZERO;
    }
    
    /**
     * 检查收入是否适用此标准
     * @param income 收入金额
     * @return 是否适用
     */
    public boolean isApplicable(BigDecimal income) {
        if (income == null) {
            return false;
        }
        
        boolean minCheck = incomeMin == null || income.compareTo(incomeMin) >= 0;
        boolean maxCheck = incomeMax == null || income.compareTo(incomeMax) <= 0;
        
        return minCheck && maxCheck && status == FeeStandardStatus.ACTIVE;
    }
    
    @Override
    public String toString() {
        return "FeeStandard{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", incomeMin=" + incomeMin +
                ", incomeMax=" + incomeMax +
                ", feeRate=" + feeRate +
                ", fixedAmount=" + fixedAmount +
                ", effectiveDate=" + effectiveDate +
                ", status=" + status +
                '}';
    }
}