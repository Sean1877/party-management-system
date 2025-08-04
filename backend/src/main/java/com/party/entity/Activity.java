package com.party.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 活动实体类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Entity
@Table(name = "activities")
@EntityListeners(AuditingEntityListener.class)
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "活动标题不能为空")
    @Column(nullable = false, length = 200)
    private String title;

    @NotNull(message = "活动类型不能为空")
    @Column(nullable = false, columnDefinition = "TINYINT")
    private Integer type; // 1:支部大会 2:支委会 3:党小组会 4:党课 5:主题党日

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 255)
    private String location;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "organizer_id")
    private Long organizerId;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(columnDefinition = "TINYINT DEFAULT 1")
    private Integer status = 1; // 1:计划中 2:进行中 3:已结束 4:已取消

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "is_required", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isRequired = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 关联实体
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", insertable = false, updatable = false)
    private User organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", insertable = false, updatable = false)
    private Organization organization;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ActivityParticipant> participants = new ArrayList<>();

    // 构造函数
    public Activity() {}

    public Activity(String title, Integer type, LocalDateTime startTime) {
        this.title = title;
        this.type = type;
        this.startTime = startTime;
    }

    public Activity(String title, Integer type, String content, String location, 
                   LocalDateTime startTime, LocalDateTime endTime, Long organizerId, Long organizationId) {
        this.title = title;
        this.type = type;
        this.content = content;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.organizerId = organizerId;
        this.organizationId = organizationId;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public Boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
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

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public List<ActivityParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ActivityParticipant> participants) {
        this.participants = participants;
    }

    // 工具方法
    public String getTypeText() {
        if (type == null) return "未知";
        switch (type) {
            case 1: return "支部党员大会";
            case 2: return "支部委员会";
            case 3: return "党小组会";
            case 4: return "党课";
            case 5: return "主题党日活动";
            default: return "未知";
        }
    }

    public String getStatusText() {
        if (status == null) return "未知";
        switch (status) {
            case 1: return "计划中";
            case 2: return "进行中";
            case 3: return "已结束";
            case 4: return "已取消";
            default: return "未知";
        }
    }

    public int getParticipantCount() {
        return participants != null ? participants.size() : 0;
    }

    public int getSignedInCount() {
        if (participants == null) return 0;
        return (int) participants.stream()
                .filter(p -> p.getStatus() != null && p.getStatus() == 2)
                .count();
    }

    public boolean isFull() {
        return maxParticipants != null && getParticipantCount() >= maxParticipants;
    }

    public boolean isOngoing() {
        return status != null && status == 2;
    }

    public boolean isFinished() {
        return status != null && status == 3;
    }

    public boolean isCancelled() {
        return status != null && status == 4;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Activity activity = (Activity) o;
        return Objects.equals(id, activity.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Activity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", location='" + location + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", status=" + status +
                ", isRequired=" + isRequired +
                '}';
    }
}