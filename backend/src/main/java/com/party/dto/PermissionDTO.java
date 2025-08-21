package com.party.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 权限数据传输对象
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Schema(description = "权限数据传输对象")
public class PermissionDTO {

    @Schema(description = "权限ID")
    private Long id;

    @NotBlank(message = "权限代码不能为空")
    @Size(max = 100, message = "权限代码长度不能超过100个字符")
    @Schema(description = "权限代码", example = "user:read")
    private String code;

    @NotBlank(message = "权限名称不能为空")
    @Size(max = 100, message = "权限名称长度不能超过100个字符")
    @Schema(description = "权限名称", example = "查看用户")
    private String name;

    @Size(max = 500, message = "权限描述长度不能超过500个字符")
    @Schema(description = "权限描述", example = "查看用户信息的权限")
    private String description;

    @Size(max = 50, message = "模块名称长度不能超过50个字符")
    @Schema(description = "所属模块", example = "用户管理")
    private String module;

    @Size(max = 20, message = "权限类型长度不能超过20个字符")
    @Schema(description = "权限类型", example = "READ")
    private String type;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;

    @Schema(description = "拥有此权限的角色列表")
    private List<String> roleNames;

    @Schema(description = "拥有此权限的角色数量")
    private Integer roleCount;

    // ==================== 构造方法 ====================

    public PermissionDTO() {
    }

    public PermissionDTO(String code, String name, String description, String module, String type) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.module = module;
        this.type = type;
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

    public List<String> getRoleNames() {
        return roleNames;
    }

    public void setRoleNames(List<String> roleNames) {
        this.roleNames = roleNames;
    }

    public Integer getRoleCount() {
        return roleCount;
    }

    public void setRoleCount(Integer roleCount) {
        this.roleCount = roleCount;
    }

    // ==================== toString ====================

    @Override
    public String toString() {
        return "PermissionDTO{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", module='" + module + '\'' +
                ", type='" + type + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", roleCount=" + roleCount +
                '}';
    }
}