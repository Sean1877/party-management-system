package com.party.service;

import com.party.entity.Permission;
import com.party.entity.Role;
import com.party.entity.User;

import java.util.List;
import java.util.Optional;

/**
 * 权限管理服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface PermissionService {

    // ==================== 权限管理 ====================
    
    /**
     * 创建权限
     * 
     * @param permission 权限信息
     * @return 创建的权限
     */
    Permission createPermission(Permission permission);
    
    /**
     * 更新权限
     * 
     * @param id 权限ID
     * @param permission 权限信息
     * @return 更新的权限
     */
    Permission updatePermission(Long id, Permission permission);
    
    /**
     * 删除权限
     * 
     * @param id 权限ID
     */
    void deletePermission(Long id);
    
    /**
     * 根据ID查询权限
     * 
     * @param id 权限ID
     * @return 权限信息
     */
    Optional<Permission> findPermissionById(Long id);
    
    /**
     * 根据权限代码查询权限
     * 
     * @param code 权限代码
     * @return 权限信息
     */
    Optional<Permission> findPermissionByCode(String code);
    
    /**
     * 查询所有权限
     * 
     * @return 权限列表
     */
    List<Permission> findAllPermissions();
    
    /**
     * 根据模块查询权限
     * 
     * @param module 模块名称
     * @return 权限列表
     */
    List<Permission> findPermissionsByModule(String module);
    
    /**
     * 根据权限类型查询权限
     * 
     * @param type 权限类型
     * @return 权限列表
     */
    List<Permission> findPermissionsByType(String type);
    
    // ==================== 角色管理 ====================
    
    /**
     * 创建角色
     * 
     * @param role 角色信息
     * @return 创建的角色
     */
    Role createRole(Role role);
    
    /**
     * 更新角色
     * 
     * @param id 角色ID
     * @param role 角色信息
     * @return 更新的角色
     */
    Role updateRole(Long id, Role role);
    
    /**
     * 删除角色
     * 
     * @param id 角色ID
     */
    void deleteRole(Long id);
    
    /**
     * 根据ID查询角色
     * 
     * @param id 角色ID
     * @return 角色信息
     */
    Optional<Role> findRoleById(Long id);
    
    /**
     * 根据角色名称查询角色
     * 
     * @param name 角色名称
     * @return 角色信息
     */
    Optional<Role> findRoleByName(String name);
    
    /**
     * 查询所有角色
     * 
     * @return 角色列表
     */
    List<Role> findAllRoles();
    
    /**
     * 为角色分配权限
     * 
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     */
    void assignPermissionsToRole(Long roleId, List<Long> permissionIds);
    
    /**
     * 移除角色的权限
     * 
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     */
    void removePermissionsFromRole(Long roleId, List<Long> permissionIds);
    
    /**
     * 获取角色的所有权限
     * 
     * @param roleId 角色ID
     * @return 权限列表
     */
    List<Permission> getRolePermissions(Long roleId);
    
    // ==================== 用户权限管理 ====================
    
    /**
     * 为用户分配角色
     * 
     * @param userId 用户ID
     * @param roleIds 角色ID列表
     */
    void assignRolesToUser(Long userId, List<Long> roleIds);
    
    /**
     * 移除用户的角色
     * 
     * @param userId 用户ID
     * @param roleIds 角色ID列表
     */
    void removeRolesFromUser(Long userId, List<Long> roleIds);
    
    /**
     * 获取用户的所有角色
     * 
     * @param userId 用户ID
     * @return 角色列表
     */
    List<Role> getUserRoles(Long userId);
    
    /**
     * 获取用户的所有权限
     * 
     * @param userId 用户ID
     * @return 权限列表
     */
    List<Permission> getUserPermissions(Long userId);
    
    /**
     * 检查用户是否有指定权限
     * 
     * @param userId 用户ID
     * @param permissionCode 权限代码
     * @return 是否有权限
     */
    boolean hasPermission(Long userId, String permissionCode);
    
    /**
     * 检查用户是否有指定角色
     * 
     * @param userId 用户ID
     * @param roleName 角色名称
     * @return 是否有角色
     */
    boolean hasRole(Long userId, String roleName);
    
    /**
     * 检查用户是否有任意一个指定权限
     * 
     * @param userId 用户ID
     * @param permissionCodes 权限代码列表
     * @return 是否有任意权限
     */
    boolean hasAnyPermission(Long userId, List<String> permissionCodes);
    
    /**
     * 检查用户是否有所有指定权限
     * 
     * @param userId 用户ID
     * @param permissionCodes 权限代码列表
     * @return 是否有所有权限
     */
    boolean hasAllPermissions(Long userId, List<String> permissionCodes);
    
    // ==================== 权限初始化 ====================
    
    /**
     * 初始化系统权限
     */
    void initializeSystemPermissions();
    
    /**
     * 初始化系统角色
     */
    void initializeSystemRoles();
    
    /**
     * 初始化管理员用户权限
     * 
     * @param userId 管理员用户ID
     */
    void initializeAdminPermissions(Long userId);
}