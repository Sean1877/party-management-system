package com.party.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
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
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Column(name = "min_income", precision = 10, scale = 2)
    private BigDecimal minIncome;
    
    @Column(name = "max_income", precision = 10, scale = 2)
    private BigDecimal maxIncome;
    
    @Column(name = "fee_rate", precision = 5, scale = 4)
    private BigDecimal feeRate;
    
    @Column(name = "fixed_amount", precision = 10, scale = 2)
    private BigDecimal fixedAmount;
    
    @Column(nullable = false, length = 20)
    private String status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 构造函数
    public FeeStandard() {
    }
    
    public FeeStandard(String name, String description, BigDecimal minIncome, 
                      BigDecimal maxIncome, BigDecimal feeRate, BigDecimal fixedAmount, String status) {
        this.name = name;
        this.description = description;
        this.minIncome = minIncome;
        this.maxIncome = maxIncome;
        this.feeRate = feeRate;
        this.fixedAmount = fixedAmount;
        this.status = status;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getMinIncome() {
        return minIncome;
    }
    
    public void setMinIncome(BigDecimal minIncome) {
        this.minIncome = minIncome;
    }
    
    public BigDecimal getMaxIncome() {
        return maxIncome;
    }
    
    public void setMaxIncome(BigDecimal maxIncome) {
        this.maxIncome = maxIncome;
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
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
    
    @Override
    public String toString() {
        return "FeeStandard{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", minIncome=" + minIncome +
                ", maxIncome=" + maxIncome +
                ", feeRate=" + feeRate +
                ", fixedAmount=" + fixedAmount +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}