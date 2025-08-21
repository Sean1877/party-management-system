package com.party.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 角色数据传输对象
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Schema(description = "角色数据传输对象")
public class RoleDTO {

    @Schema(description = "角色ID")
    private Long id;

    @NotBlank(message = "角色名称不能为空")
    @Size(max = 50, message = "角色名称长度不能超过50个字符")
    @Schema(description = "角色名称", example = "管理员")
    private String name;

    @Size(max = 50, message = "角色代码长度不能超过50个字符")
    @Schema(description = "角色代码", example = "ADMIN")
    private String code;

    @Size(max = 500, message = "角色描述长度不能超过500个字符")
    @Schema(description = "角色描述", example = "系统管理员角色")
    private String description;

    @Schema(description = "是否激活", example = "true")
    private Boolean active;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;

    @Schema(description = "角色拥有的权限列表")
    private List<PermissionDTO> permissions;

    @Schema(description = "权限代码列表")
    private List<String> permissionCodes;

    @Schema(description = "权限数量")
    private Integer permissionCount;

    @Schema(description = "用户数量")
    private Integer userCount;

    @Schema(description = "拥有此角色的用户列表")
    private List<String> usernames;

    // ==================== 构造方法 ====================

    public RoleDTO() {
    }

    public RoleDTO(String name, String code, String description) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.active = true;
    }

    // ==================== Getter 和 Setter ====================

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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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

    public List<PermissionDTO> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDTO> permissions) {
        this.permissions = permissions;
    }

    public List<String> getPermissionCodes() {
        return permissionCodes;
    }

    public void setPermissionCodes(List<String> permissionCodes) {
        this.permissionCodes = permissionCodes;
    }

    public Integer getPermissionCount() {
        return permissionCount;
    }

    public void setPermissionCount(Integer permissionCount) {
        this.permissionCount = permissionCount;
    }

    public Integer getUserCount() {
        return userCount;
    }

    public void setUserCount(Integer userCount) {
        this.userCount = userCount;
    }

    public List<String> getUsernames() {
        return usernames;
    }

    public void setUsernames(List<String> usernames) {
        this.usernames = usernames;
    }

    // ==================== toString ====================

    @Override
    public String toString() {
        return "RoleDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", description='" + description + '\'' +
                ", active=" + active +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", permissionCount=" + permissionCount +
                ", userCount=" + userCount +
                '}';
    }
}