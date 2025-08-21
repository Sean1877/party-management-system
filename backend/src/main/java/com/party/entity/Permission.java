package com.party.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * 权限实体类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Entity
@Table(name = "permissions")
@Schema(description = "权限信息")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "权限ID")
    private Long id;

    @Column(name = "code", unique = true, nullable = false, length = 100)
    @NotBlank(message = "权限代码不能为空")
    @Size(max = 100, message = "权限代码长度不能超过100个字符")
    @Schema(description = "权限代码", example = "user:read")
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    @NotBlank(message = "权限名称不能为空")
    @Size(max = 100, message = "权限名称长度不能超过100个字符")
    @Schema(description = "权限名称", example = "查看用户")
    private String name;

    @Column(name = "description", length = 500)
    @Size(max = 500, message = "权限描述长度不能超过500个字符")
    @Schema(description = "权限描述", example = "查看用户信息的权限")
    private String description;

    @Column(name = "module", length = 50)
    @Size(max = 50, message = "模块名称长度不能超过50个字符")
    @Schema(description = "所属模块", example = "用户管理")
    private String module;

    @Column(name = "type", length = 20)
    @Size(max = 20, message = "权限类型长度不能超过20个字符")
    @Schema(description = "权限类型", example = "READ")
    private String type;

    @Column(name = "created_at")
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
    @JsonIgnore
    @Schema(description = "拥有此权限的角色")
    private Set<Role> roles;

    // ==================== 构造方法 ====================

    public Permission() {
    }

    public Permission(String code, String name, String description, String module, String type) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.module = module;
        this.type = type;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ==================== Getter 和 Setter ====================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    // ==================== 生命周期回调 ====================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ==================== equals, hashCode, toString ====================

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Permission that = (Permission) o;

        return code != null ? code.equals(that.code) : that.code == null;
    }

    @Override
    public int hashCode() {
        return code != null ? code.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Permission{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", module='" + module + '\'' +
                ", type='" + type + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}