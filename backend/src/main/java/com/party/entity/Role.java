package com.party.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Objects;

/**
 * 角色实体类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Entity
@Table(name = "roles")
@EntityListeners(AuditingEntityListener.class)
@Schema(description = "角色信息")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "角色ID")
    private Long id;

    @NotBlank(message = "角色名称不能为空")
    @Size(max = 50, message = "角色名称长度不能超过50个字符")
    @Column(name = "name", nullable = false, length = 50)
    @Schema(description = "角色名称", example = "管理员")
    private String name;

    @Size(max = 50, message = "角色代码长度不能超过50个字符")
    @Column(name = "code", unique = true, length = 50)
    @Schema(description = "角色代码", example = "ADMIN")
    private String code;

    @Size(max = 255, message = "角色描述长度不能超过255个字符")
    @Column(name = "description", length = 255)
    @Schema(description = "角色描述", example = "系统管理员角色")
    private String description;

    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    @Schema(description = "是否激活")
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;

    // 关联实体
    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @JsonIgnore
    @Schema(description = "拥有此角色的用户")
    private List<User> users = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @JsonIgnore
    @Schema(description = "角色拥有的权限")
    private Set<Permission> permissions = new HashSet<>();

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    @JsonIgnore
    @Schema(description = "拥有此角色的用户（多对多关系）")
    private Set<User> roleUsers = new HashSet<>();

    // 构造函数
    public Role() {}

    public Role(String name, String code) {
        this.name = name;
        this.code = code;
    }

    public Role(String name, String code, String description) {
        this.name = name;
        this.code = code;
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<User> getRoleUsers() {
        return roleUsers;
    }

    public void setRoleUsers(Set<User> roleUsers) {
        this.roleUsers = roleUsers;
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

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    // 工具方法
    public int getUserCount() {
        return users != null ? users.size() : 0;
    }

    public int getPermissionCount() {
        return permissions != null ? permissions.size() : 0;
    }

    public void addPermission(Permission permission) {
        if (permissions == null) {
            permissions = new HashSet<>();
        }
        permissions.add(permission);
        if (permission.getRoles() == null) {
            permission.setRoles(new HashSet<>());
        }
        permission.getRoles().add(this);
    }

    public void removePermission(Permission permission) {
        if (permissions != null) {
            permissions.remove(permission);
        }
        if (permission != null && permission.getRoles() != null) {
            permission.getRoles().remove(this);
        }
    }

    // ==================== 生命周期回调 ====================

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return Objects.equals(id, role.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", description='" + description + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}