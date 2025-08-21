package com.party.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 党费缴费记录实体类
 */
@Entity
@Table(name = "fee_payments")
public class FeePayment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private PartyMember member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_standard_id")
    private FeeStandard feeStandard;
    
    @Column(name = "payment_year", nullable = false)
    private Integer paymentYear;
    
    @Column(name = "payment_month", nullable = false)
    private Integer paymentMonth;
    
    @Column(name = "income_amount", precision = 10, scale = 2)
    private BigDecimal incomeAmount;
    
    @Column(name = "fee_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal feeAmount;
    
    @Column(name = "payment_date")
    private LocalDate paymentDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum PaymentMethod {
        CASH,          // 现金
        BANK_TRANSFER, // 银行转账
        ONLINE,        // 在线支付
        DEDUCTION      // 工资扣除
    }
    
    public enum PaymentStatus {
        PENDING,       // 待缴费
        PAID,          // 已缴费
        OVERDUE,       // 逾期
        EXEMPTED       // 免缴
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
    public FeePayment() {}
    
    public FeePayment(PartyMember member, Integer paymentYear, Integer paymentMonth, 
                     BigDecimal feeAmount) {
        this.member = member;
        this.paymentYear = paymentYear;
        this.paymentMonth = paymentMonth;
        this.feeAmount = feeAmount;
    }
    
    public FeePayment(PartyMember member, FeeStandard feeStandard, Integer paymentYear, 
                     Integer paymentMonth, BigDecimal incomeAmount, BigDecimal feeAmount) {
        this.member = member;
        this.feeStandard = feeStandard;
        this.paymentYear = paymentYear;
        this.paymentMonth = paymentMonth;
        this.incomeAmount = incomeAmount;
        this.feeAmount = feeAmount;
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public PartyMember getMember() {
        return member;
    }
    
    public void setMember(PartyMember member) {
        this.member = member;
    }
    
    public FeeStandard getFeeStandard() {
        return feeStandard;
    }
    
    public void setFeeStandard(FeeStandard feeStandard) {
        this.feeStandard = feeStandard;
    }
    
    public Integer getPaymentYear() {
        return paymentYear;
    }
    
    public void setPaymentYear(Integer paymentYear) {
        this.paymentYear = paymentYear;
    }
    
    public Integer getPaymentMonth() {
        return paymentMonth;
    }
    
    public void setPaymentMonth(Integer paymentMonth) {
        this.paymentMonth = paymentMonth;
    }
    
    public BigDecimal getIncomeAmount() {
        return incomeAmount;
    }
    
    public void setIncomeAmount(BigDecimal incomeAmount) {
        this.incomeAmount = incomeAmount;
    }
    
    public BigDecimal getFeeAmount() {
        return feeAmount;
    }
    
    public void setFeeAmount(BigDecimal feeAmount) {
        this.feeAmount = feeAmount;
    }
    
    public LocalDate getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
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
     * 检查是否已缴费
     * @return 是否已缴费
     */
    public boolean isPaid() {
        return status == PaymentStatus.PAID;
    }
    
    /**
     * 检查是否逾期
     * @return 是否逾期
     */
    public boolean isOverdue() {
        return status == PaymentStatus.OVERDUE;
    }
    
    /**
     * 获取缴费期间描述
     * @return 缴费期间描述
     */
    public String getPaymentPeriod() {
        return paymentYear + "年" + paymentMonth + "月";
    }
    
    /**
     * 标记为已缴费
     * @param paymentDate 缴费日期
     * @param paymentMethod 缴费方式
     */
    public void markAsPaid(LocalDate paymentDate, PaymentMethod paymentMethod) {
        this.status = PaymentStatus.PAID;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
    }
    
    /**
     * 标记为逾期
     */
    public void markAsOverdue() {
        this.status = PaymentStatus.OVERDUE;
    }
    
    @Override
    public String toString() {
        return "FeePayment{" +
                "id=" + id +
                ", paymentYear=" + paymentYear +
                ", paymentMonth=" + paymentMonth +
                ", feeAmount=" + feeAmount +
                ", paymentDate=" + paymentDate +
                ", status=" + status +
                '}';
    }
}