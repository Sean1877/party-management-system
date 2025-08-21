package com.party.entity;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 党员实体类
 */
@Entity
@Table(name = "party_members")
public class PartyMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    
    @Column(name = "member_number", unique = true, length = 50)
    private String memberNumber;
    
    @Column(name = "join_date")
    private LocalDate joinDate;
    
    @Column(name = "probation_start_date")
    private LocalDate probationStartDate;
    
    @Column(name = "probation_end_date")
    private LocalDate probationEndDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "member_type", nullable = false)
    private MemberType memberType = MemberType.APPLICANT;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MemberStatus status = MemberStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum MemberType {
        FORMAL,        // 正式党员
        PROBATIONARY,  // 预备党员
        APPLICANT      // 入党申请人
    }
    
    public enum MemberStatus {
        ACTIVE,        // 正常
        TRANSFERRED,   // 已转出
        SUSPENDED      // 停权
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
    public PartyMember() {}
    
    public PartyMember(User user, Organization organization, String memberNumber, 
                      LocalDate joinDate, MemberType memberType) {
        this.user = user;
        this.organization = organization;
        this.memberNumber = memberNumber;
        this.joinDate = joinDate;
        this.memberType = memberType;
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Organization getOrganization() {
        return organization;
    }
    
    public void setOrganization(Organization organization) {
        this.organization = organization;
    }
    
    public String getMemberNumber() {
        return memberNumber;
    }
    
    public void setMemberNumber(String memberNumber) {
        this.memberNumber = memberNumber;
    }
    
    public LocalDate getJoinDate() {
        return joinDate;
    }
    
    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }
    
    public LocalDate getProbationStartDate() {
        return probationStartDate;
    }
    
    public void setProbationStartDate(LocalDate probationStartDate) {
        this.probationStartDate = probationStartDate;
    }
    
    public LocalDate getProbationEndDate() {
        return probationEndDate;
    }
    
    public void setProbationEndDate(LocalDate probationEndDate) {
        this.probationEndDate = probationEndDate;
    }
    
    public MemberType getMemberType() {
        return memberType;
    }
    
    public void setMemberType(MemberType memberType) {
        this.memberType = memberType;
    }
    
    public MemberStatus getStatus() {
        return status;
    }
    
    public void setStatus(MemberStatus status) {
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
     * 检查是否为正式党员
     * @return 是否为正式党员
     */
    public boolean isFormalMember() {
        return memberType == MemberType.FORMAL;
    }
    
    /**
     * 检查是否为预备党员
     * @return 是否为预备党员
     */
    public boolean isProbationaryMember() {
        return memberType == MemberType.PROBATIONARY;
    }
    
    /**
     * 检查预备期是否已结束
     * @return 预备期是否已结束
     */
    public boolean isProbationExpired() {
        if (probationEndDate == null) {
            return false;
        }
        return LocalDate.now().isAfter(probationEndDate);
    }
    
    /**
     * 获取党龄（年）
     * @return 党龄
     */
    public int getPartyAge() {
        if (joinDate == null || !isFormalMember()) {
            return 0;
        }
        return LocalDate.now().getYear() - joinDate.getYear();
    }
    
    @Override
    public String toString() {
        return "PartyMember{" +
                "id=" + id +
                ", memberNumber='" + memberNumber + '\'' +
                ", joinDate=" + joinDate +
                ", memberType=" + memberType +
                ", status=" + status +
                '}';
    }
}