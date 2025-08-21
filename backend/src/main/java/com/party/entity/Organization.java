package com.party.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 组织架构实体类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Entity
@Table(name = "organizations")
@EntityListeners(AuditingEntityListener.class)
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "组织名称不能为空")
    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, length = 50)
    private String code;

    @Column(nullable = false, columnDefinition = "TINYINT")
    private Integer type; // 1:党委 2:党总支 3:党支部

    @Column(name = "parent_id")
    private Long parentId;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer level = 1;

    @Column(name = "secretary_id")
    private Long secretaryId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String address;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "established_date")
    private LocalDate establishedDate;

    @Column(name = "establish_date")
    private LocalDate establishDate;

    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 非持久化字段 - 子组织列表
    @Transient
    private List<Organization> childOrganizations = new ArrayList<>();

    // 关联实体
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    @JsonBackReference
    private Organization parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Organization> children = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "secretary_id", insertable = false, updatable = false)
    @JsonIgnore
    private User secretary;

    @OneToMany(mappedBy = "organization", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<User> members = new ArrayList<>();

    // 构造函数
    public Organization() {}

    public Organization(String name, Integer type) {
        this.name = name;
        this.type = type;
    }

    public Organization(String name, String code, Integer type, Long parentId) {
        this.name = name;
        this.code = code;
        this.type = type;
        this.parentId = parentId;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Long getSecretaryId() {
        return secretaryId;
    }

    public void setSecretaryId(Long secretaryId) {
        this.secretaryId = secretaryId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public LocalDate getEstablishedDate() {
        return establishedDate;
    }

    public void setEstablishedDate(LocalDate establishedDate) {
        this.establishedDate = establishedDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Organization getParent() {
        return parent;
    }

    public void setParent(Organization parent) {
        this.parent = parent;
    }

    public List<Organization> getChildren() {
        return children;
    }

    public void setChildren(List<Organization> children) {
        this.children = children;
    }

    public User getSecretary() {
        return secretary;
    }

    public void setSecretary(User secretary) {
        this.secretary = secretary;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    // 工具方法
    public String getTypeText() {
        if (type == null) return "未知";
        switch (type) {
            case 1: return "党委";
            case 2: return "党总支";
            case 3: return "党支部";
            default: return "未知";
        }
    }

    public int getMemberCount() {
        return members != null ? members.size() : 0;
    }

    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    public boolean isRoot() {
        return parentId == null;
    }

    /**
     * 是否有子组织
     */
    public boolean hasChildOrganizations() {
        return childOrganizations != null && !childOrganizations.isEmpty();
    }

    /**
     * 是否为根组织
     */
    public boolean isRootOrganization() {
        return parentId == null;
    }

    /**
     * 获取建立日期
     */
    public LocalDate getEstablishDate() {
        return establishDate;
    }

    /**
     * 设置建立日期
     */
    public void setEstablishDate(LocalDate establishDate) {
        this.establishDate = establishDate;
    }

    /**
     * 获取子组织列表
     */
    public List<Organization> getChildOrganizations() {
        return childOrganizations;
    }

    /**
     * 设置子组织列表
     */
    public void setChildOrganizations(List<Organization> childOrganizations) {
        this.childOrganizations = childOrganizations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Organization that = (Organization) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Organization{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", type=" + type +
                ", parentId=" + parentId +
                ", level=" + level +
                ", isActive=" + isActive +
                '}';
    }
}