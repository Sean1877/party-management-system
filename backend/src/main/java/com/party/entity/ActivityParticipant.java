package com.party.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * 活动参与者实体类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Entity
@Table(name = "activity_participants")
@EntityListeners(AuditingEntityListener.class)
public class ActivityParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "活动ID不能为空")
    @Column(name = "activity_id", nullable = false)
    private Long activityId;

    @NotNull(message = "用户ID不能为空")
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(columnDefinition = "TINYINT DEFAULT 1")
    private Integer status = 1; // 1:已报名 2:已签到 3:请假 4:缺席

    @Column(name = "sign_in_time")
    private LocalDateTime signInTime;

    @Column(length = 500)
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 关联实体
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", insertable = false, updatable = false)
    private Activity activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    // 构造函数
    public ActivityParticipant() {}

    public ActivityParticipant(Long activityId, Long userId) {
        this.activityId = activityId;
        this.userId = userId;
    }

    public ActivityParticipant(Long activityId, Long userId, Integer status) {
        this.activityId = activityId;
        this.userId = userId;
        this.status = status;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getSignInTime() {
        return signInTime;
    }

    public void setSignInTime(LocalDateTime signInTime) {
        this.signInTime = signInTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // 工具方法
    public String getStatusText() {
        if (status == null) return "未知";
        switch (status) {
            case 1: return "已报名";
            case 2: return "已签到";
            case 3: return "请假";
            case 4: return "缺席";
            default: return "未知";
        }
    }

    public boolean isSignedIn() {
        return status != null && status == 2;
    }

    public boolean isAbsent() {
        return status != null && status == 4;
    }

    public boolean isOnLeave() {
        return status != null && status == 3;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ActivityParticipant that = (ActivityParticipant) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ActivityParticipant{" +
                "id=" + id +
                ", activityId=" + activityId +
                ", userId=" + userId +
                ", status=" + status +
                ", signInTime=" + signInTime +
                ", createdAt=" + createdAt +
                '}';
    }
}