package com.party.controller;

import com.party.entity.Permission;
import com.party.entity.Role;
import com.party.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 权限管理控制器
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/permissions")
@Tag(name = "权限管理", description = "权限和角色管理相关接口")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    // ==================== 权限管理 ====================

    @PostMapping
    @Operation(summary = "创建权限", description = "创建新的权限")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Permission> createPermission(@RequestBody Permission permission) {
        Permission created = permissionService.createPermission(permission);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新权限", description = "更新指定ID的权限")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Permission> updatePermission(
            @Parameter(description = "权限ID") @PathVariable Long id,
            @RequestBody Permission permission) {
        Permission updated = permissionService.updatePermission(id, permission);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除权限", description = "删除指定ID的权限")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePermission(
            @Parameter(description = "权限ID") @PathVariable Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取权限详情", description = "根据ID获取权限详情")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Permission> getPermissionById(
            @Parameter(description = "权限ID") @PathVariable Long id) {
        Optional<Permission> permission = permissionService.findPermissionById(id);
        return permission.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "根据代码获取权限", description = "根据权限代码获取权限详情")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Permission> getPermissionByCode(
            @Parameter(description = "权限代码") @PathVariable String code) {
        Optional<Permission> permission = permissionService.findPermissionByCode(code);
        return permission.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "获取所有权限", description = "获取系统中所有权限列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        List<Permission> permissions = permissionService.findAllPermissions();
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/module/{module}")
    @Operation(summary = "根据模块获取权限", description = "根据模块名称获取权限列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Permission>> getPermissionsByModule(
            @Parameter(description = "模块名称") @PathVariable String module) {
        List<Permission> permissions = permissionService.findPermissionsByModule(module);
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "根据类型获取权限", description = "根据权限类型获取权限列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Permission>> getPermissionsByType(
            @Parameter(description = "权限类型") @PathVariable String type) {
        List<Permission> permissions = permissionService.findPermissionsByType(type);
        return ResponseEntity.ok(permissions);
    }

    // ==================== 角色管理 ====================

    @PostMapping("/roles")
    @Operation(summary = "创建角色", description = "创建新的角色")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        Role created = permissionService.createRole(role);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/roles/{id}")
    @Operation(summary = "更新角色", description = "更新指定ID的角色")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> updateRole(
            @Parameter(description = "角色ID") @PathVariable Long id,
            @RequestBody Role role) {
        Role updated = permissionService.updateRole(id, role);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/roles/{id}")
    @Operation(summary = "删除角色", description = "删除指定ID的角色")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRole(
            @Parameter(description = "角色ID") @PathVariable Long id) {
        permissionService.deleteRole(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/roles/{id}")
    @Operation(summary = "获取角色详情", description = "根据ID获取角色详情")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> getRoleById(
            @Parameter(description = "角色ID") @PathVariable Long id) {
        Optional<Role> role = permissionService.findRoleById(id);
        return role.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/roles/name/{name}")
    @Operation(summary = "根据名称获取角色", description = "根据角色名称获取角色详情")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> getRoleByName(
            @Parameter(description = "角色名称") @PathVariable String name) {
        Optional<Role> role = permissionService.findRoleByName(name);
        return role.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/roles")
    @Operation(summary = "获取所有角色", description = "获取系统中所有角色列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = permissionService.findAllRoles();
        return ResponseEntity.ok(roles);
    }

    @PostMapping("/roles/{roleId}/permissions")
    @Operation(summary = "为角色分配权限", description = "为指定角色分配权限列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignPermissionsToRole(
            @Parameter(description = "角色ID") @PathVariable Long roleId,
            @RequestBody List<Long> permissionIds) {
        permissionService.assignPermissionsToRole(roleId, permissionIds);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/roles/{roleId}/permissions")
    @Operation(summary = "移除角色权限", description = "从指定角色移除权限列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removePermissionsFromRole(
            @Parameter(description = "角色ID") @PathVariable Long roleId,
            @RequestBody List<Long> permissionIds) {
        permissionService.removePermissionsFromRole(roleId, permissionIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/roles/{roleId}/permissions")
    @Operation(summary = "获取角色权限", description = "获取指定角色的权限列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Permission>> getRolePermissions(
            @Parameter(description = "角色ID") @PathVariable Long roleId) {
        List<Permission> permissions = permissionService.getRolePermissions(roleId);
        return ResponseEntity.ok(permissions);
    }

    // ==================== 用户权限管理 ====================

    @PostMapping("/users/{userId}/roles")
    @Operation(summary = "为用户分配角色", description = "为指定用户分配角色列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignRolesToUser(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @RequestBody List<Long> roleIds) {
        permissionService.assignRolesToUser(userId, roleIds);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}/roles")
    @Operation(summary = "移除用户角色", description = "从指定用户移除角色列表")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeRolesFromUser(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @RequestBody List<Long> roleIds) {
        permissionService.removeRolesFromUser(userId, roleIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{userId}/roles")
    @Operation(summary = "获取用户角色", description = "获取指定用户的角色列表")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.userId")
    public ResponseEntity<List<Role>> getUserRoles(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        List<Role> roles = permissionService.getUserRoles(userId);
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/users/{userId}/permissions")
    @Operation(summary = "获取用户权限", description = "获取指定用户的权限列表")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.userId")
    public ResponseEntity<List<Permission>> getUserPermissions(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        List<Permission> permissions = permissionService.getUserPermissions(userId);
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/users/{userId}/check-permission/{permissionCode}")
    @Operation(summary = "检查用户权限", description = "检查用户是否拥有指定权限")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.userId")
    public ResponseEntity<Map<String, Boolean>> checkUserPermission(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @Parameter(description = "权限代码") @PathVariable String permissionCode) {
        boolean hasPermission = permissionService.hasPermission(userId, permissionCode);
        return ResponseEntity.ok(Map.of("hasPermission", hasPermission));
    }

    @GetMapping("/users/{userId}/check-role/{roleName}")
    @Operation(summary = "检查用户角色", description = "检查用户是否拥有指定角色")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.userId")
    public ResponseEntity<Map<String, Boolean>> checkUserRole(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @Parameter(description = "角色名称") @PathVariable String roleName) {
        boolean hasRole = permissionService.hasRole(userId, roleName);
        return ResponseEntity.ok(Map.of("hasRole", hasRole));
    }

    @PostMapping("/users/{userId}/check-permissions")
    @Operation(summary = "批量检查用户权限", description = "检查用户是否拥有指定权限列表中的任意权限")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.userId")
    public ResponseEntity<Map<String, Boolean>> checkUserAnyPermissions(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @RequestBody List<String> permissionCodes) {
        boolean hasAnyPermission = permissionService.hasAnyPermission(userId, permissionCodes);
        return ResponseEntity.ok(Map.of("hasAnyPermission", hasAnyPermission));
    }

    @PostMapping("/users/{userId}/check-all-permissions")
    @Operation(summary = "检查用户所有权限", description = "检查用户是否拥有指定权限列表中的所有权限")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.userId")
    public ResponseEntity<Map<String, Boolean>> checkUserAllPermissions(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @RequestBody List<String> permissionCodes) {
        boolean hasAllPermissions = permissionService.hasAllPermissions(userId, permissionCodes);
        return ResponseEntity.ok(Map.of("hasAllPermissions", hasAllPermissions));
    }

    // ==================== 系统初始化 ====================

    @PostMapping("/initialize/permissions")
    @Operation(summary = "初始化系统权限", description = "初始化系统默认权限")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> initializeSystemPermissions() {
        permissionService.initializeSystemPermissions();
        return ResponseEntity.ok(Map.of("message", "系统权限初始化完成"));
    }

    @PostMapping("/initialize/roles")
    @Operation(summary = "初始化系统角色", description = "初始化系统默认角色")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> initializeSystemRoles() {
        permissionService.initializeSystemRoles();
        return ResponseEntity.ok(Map.of("message", "系统角色初始化完成"));
    }

    @PostMapping("/initialize/admin/{userId}")
    @Operation(summary = "初始化管理员权限", description = "为指定用户初始化管理员权限")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> initializeAdminPermissions(
            @Parameter(description = "用户ID") @PathVariable Long userId) {
        permissionService.initializeAdminPermissions(userId);
        return ResponseEntity.ok(Map.of("message", "管理员权限初始化完成"));
    }

    @PostMapping("/initialize/all")
    @Operation(summary = "初始化所有权限数据", description = "初始化系统权限、角色等所有权限相关数据")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> initializeAll() {
        permissionService.initializeSystemPermissions();
        permissionService.initializeSystemRoles();
        return ResponseEntity.ok(Map.of("message", "权限系统初始化完成"));
    }
}