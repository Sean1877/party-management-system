package com.party.service.impl;

import com.party.entity.Permission;
import com.party.entity.Role;
import com.party.entity.User;
import com.party.repository.PermissionRepository;
import com.party.repository.RoleRepository;
import com.party.repository.UserRepository;
import com.party.service.PermissionService;
import com.party.service.OperationLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 权限管理服务实现类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Service
@Transactional
public class PermissionServiceImpl implements PermissionService {

    private static final Logger logger = LoggerFactory.getLogger(PermissionServiceImpl.class);

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OperationLogService operationLogService;

    // ==================== 权限管理 ====================

    @Override
    public Permission createPermission(Permission permission) {
        try {
            permission.setCreatedAt(LocalDateTime.now());
            permission.setUpdatedAt(LocalDateTime.now());
            Permission saved = permissionRepository.save(permission);
            
            operationLogService.logSuccess("CREATE_PERMISSION", "权限管理", "创建权限: " + permission.getName());
            logger.info("创建权限成功: {}", permission.getName());
            return saved;
        } catch (Exception e) {
            operationLogService.logError("CREATE_PERMISSION", "权限管理", "创建权限失败", e.getMessage());
            logger.error("创建权限失败: {}", e.getMessage(), e);
            throw new RuntimeException("创建权限失败: " + e.getMessage(), e);
        }
    }

    @Override
    public Permission updatePermission(Long id, Permission permission) {
        try {
            Optional<Permission> existingOpt = permissionRepository.findById(id);
            if (!existingOpt.isPresent()) {
                throw new RuntimeException("权限不存在");
            }
            
            Permission existing = existingOpt.get();
            existing.setName(permission.getName());
            existing.setCode(permission.getCode());
            existing.setDescription(permission.getDescription());
            existing.setModule(permission.getModule());
            existing.setType(permission.getType());
            existing.setUpdatedAt(LocalDateTime.now());
            
            Permission saved = permissionRepository.save(existing);
            
            operationLogService.logSuccess("UPDATE_PERMISSION", "权限管理", "更新权限: " + permission.getName());
            logger.info("更新权限成功: {}", permission.getName());
            return saved;
        } catch (Exception e) {
            operationLogService.logError("UPDATE_PERMISSION", "权限管理", "更新权限失败", e.getMessage());
            logger.error("更新权限失败: {}", e.getMessage(), e);
            throw new RuntimeException("更新权限失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void deletePermission(Long id) {
        try {
            Optional<Permission> permissionOpt = permissionRepository.findById(id);
            if (!permissionOpt.isPresent()) {
                throw new RuntimeException("权限不存在");
            }
            
            Permission permission = permissionOpt.get();
            permissionRepository.deleteById(id);
            
            operationLogService.logSuccess("DELETE_PERMISSION", "权限管理", "删除权限: " + permission.getName());
            logger.info("删除权限成功: {}", permission.getName());
        } catch (Exception e) {
            operationLogService.logError("DELETE_PERMISSION", "权限管理", "删除权限失败", e.getMessage());
            logger.error("删除权限失败: {}", e.getMessage(), e);
            throw new RuntimeException("删除权限失败: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Permission> findPermissionById(Long id) {
        return permissionRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Permission> findPermissionByCode(String code) {
        return permissionRepository.findByCode(code);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permission> findAllPermissions() {
        return permissionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permission> findPermissionsByModule(String module) {
        return permissionRepository.findByModule(module);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permission> findPermissionsByType(String type) {
        return permissionRepository.findByType(type);
    }

    // ==================== 角色管理 ====================

    @Override
    public Role createRole(Role role) {
        try {
            role.setCreatedAt(LocalDateTime.now());
            role.setUpdatedAt(LocalDateTime.now());
            Role saved = roleRepository.save(role);
            
            operationLogService.logSuccess("CREATE_ROLE", "角色管理", "创建角色: " + role.getName());
            logger.info("创建角色成功: {}", role.getName());
            return saved;
        } catch (Exception e) {
            operationLogService.logError("CREATE_ROLE", "角色管理", "创建角色失败", e.getMessage());
            logger.error("创建角色失败: {}", e.getMessage(), e);
            throw new RuntimeException("创建角色失败: " + e.getMessage(), e);
        }
    }

    @Override
    public Role updateRole(Long id, Role role) {
        try {
            Optional<Role> existingOpt = roleRepository.findById(id);
            if (!existingOpt.isPresent()) {
                throw new RuntimeException("角色不存在");
            }
            
            Role existing = existingOpt.get();
            existing.setName(role.getName());
            existing.setDescription(role.getDescription());
            existing.setUpdatedAt(LocalDateTime.now());
            
            Role saved = roleRepository.save(existing);
            
            operationLogService.logSuccess("UPDATE_ROLE", "角色管理", "更新角色: " + role.getName());
            logger.info("更新角色成功: {}", role.getName());
            return saved;
        } catch (Exception e) {
            operationLogService.logError("UPDATE_ROLE", "角色管理", "更新角色失败", e.getMessage());
            logger.error("更新角色失败: {}", e.getMessage(), e);
            throw new RuntimeException("更新角色失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteRole(Long id) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(id);
            if (!roleOpt.isPresent()) {
                throw new RuntimeException("角色不存在");
            }
            
            Role role = roleOpt.get();
            roleRepository.deleteById(id);
            
            operationLogService.logSuccess("DELETE_ROLE", "角色管理", "删除角色: " + role.getName());
            logger.info("删除角色成功: {}", role.getName());
        } catch (Exception e) {
            operationLogService.logError("DELETE_ROLE", "角色管理", "删除角色失败", e.getMessage());
            logger.error("删除角色失败: {}", e.getMessage(), e);
            throw new RuntimeException("删除角色失败: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Role> findRoleById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Role> findRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> findAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public void assignPermissionsToRole(Long roleId, List<Long> permissionIds) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (!roleOpt.isPresent()) {
                throw new RuntimeException("角色不存在");
            }
            
            Role role = roleOpt.get();
            List<Permission> permissions = permissionRepository.findAllById(permissionIds);
            
            if (role.getPermissions() == null) {
                role.setPermissions(new HashSet<>());
            }
            role.getPermissions().addAll(permissions);
            
            roleRepository.save(role);
            
            operationLogService.logSuccess("ASSIGN_PERMISSION", "权限管理", 
                "为角色 " + role.getName() + " 分配 " + permissions.size() + " 个权限");
            logger.info("为角色 {} 分配权限成功", role.getName());
        } catch (Exception e) {
            operationLogService.logError("ASSIGN_PERMISSION", "权限管理", "分配权限失败", e.getMessage());
            logger.error("分配权限失败: {}", e.getMessage(), e);
            throw new RuntimeException("分配权限失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void removePermissionsFromRole(Long roleId, List<Long> permissionIds) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (!roleOpt.isPresent()) {
                throw new RuntimeException("角色不存在");
            }
            
            Role role = roleOpt.get();
            List<Permission> permissions = permissionRepository.findAllById(permissionIds);
            
            if (role.getPermissions() != null) {
                role.getPermissions().removeAll(permissions);
                roleRepository.save(role);
            }
            
            operationLogService.logSuccess("REMOVE_PERMISSION", "权限管理", 
                "从角色 " + role.getName() + " 移除 " + permissions.size() + " 个权限");
            logger.info("从角色 {} 移除权限成功", role.getName());
        } catch (Exception e) {
            operationLogService.logError("REMOVE_PERMISSION", "权限管理", "移除权限失败", e.getMessage());
            logger.error("移除权限失败: {}", e.getMessage(), e);
            throw new RuntimeException("移除权限失败: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permission> getRolePermissions(Long roleId) {
        Optional<Role> roleOpt = roleRepository.findById(roleId);
        if (roleOpt.isPresent() && roleOpt.get().getPermissions() != null) {
            return new ArrayList<>(roleOpt.get().getPermissions());
        }
        return new ArrayList<>();
    }

    // ==================== 用户权限管理 ====================

    @Override
    public void assignRolesToUser(Long userId, List<Long> roleIds) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                throw new RuntimeException("用户不存在");
            }
            
            User user = userOpt.get();
            List<Role> roles = roleRepository.findAllById(roleIds);
            
            if (user.getRoles() == null) {
                user.setRoles(new HashSet<>());
            }
            user.getRoles().addAll(roles);
            
            userRepository.save(user);
            
            operationLogService.logSuccess("ASSIGN_ROLE", "用户管理", 
                "为用户 " + user.getUsername() + " 分配 " + roles.size() + " 个角色");
            logger.info("为用户 {} 分配角色成功", user.getUsername());
        } catch (Exception e) {
            operationLogService.logError("ASSIGN_ROLE", "用户管理", "分配角色失败", e.getMessage());
            logger.error("分配角色失败: {}", e.getMessage(), e);
            throw new RuntimeException("分配角色失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void removeRolesFromUser(Long userId, List<Long> roleIds) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                throw new RuntimeException("用户不存在");
            }
            
            User user = userOpt.get();
            List<Role> roles = roleRepository.findAllById(roleIds);
            
            if (user.getRoles() != null) {
                user.getRoles().removeAll(roles);
                userRepository.save(user);
            }
            
            operationLogService.logSuccess("REMOVE_ROLE", "用户管理", 
                "从用户 " + user.getUsername() + " 移除 " + roles.size() + " 个角色");
            logger.info("从用户 {} 移除角色成功", user.getUsername());
        } catch (Exception e) {
            operationLogService.logError("REMOVE_ROLE", "用户管理", "移除角色失败", e.getMessage());
            logger.error("移除角色失败: {}", e.getMessage(), e);
            throw new RuntimeException("移除角色失败: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getUserRoles(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent() && userOpt.get().getRoles() != null) {
            return new ArrayList<>(userOpt.get().getRoles());
        }
        return new ArrayList<>();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permission> getUserPermissions(Long userId) {
        List<Role> roles = getUserRoles(userId);
        Set<Permission> permissions = new HashSet<>();
        
        for (Role role : roles) {
            if (role.getPermissions() != null) {
                permissions.addAll(role.getPermissions());
            }
        }
        
        return new ArrayList<>(permissions);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasPermission(Long userId, String permissionCode) {
        List<Permission> permissions = getUserPermissions(userId);
        return permissions.stream()
                .anyMatch(permission -> permission.getCode().equals(permissionCode));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasRole(Long userId, String roleName) {
        List<Role> roles = getUserRoles(userId);
        return roles.stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasAnyPermission(Long userId, List<String> permissionCodes) {
        List<Permission> permissions = getUserPermissions(userId);
        Set<String> userPermissionCodes = permissions.stream()
                .map(Permission::getCode)
                .collect(Collectors.toSet());
        
        return permissionCodes.stream()
                .anyMatch(userPermissionCodes::contains);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasAllPermissions(Long userId, List<String> permissionCodes) {
        List<Permission> permissions = getUserPermissions(userId);
        Set<String> userPermissionCodes = permissions.stream()
                .map(Permission::getCode)
                .collect(Collectors.toSet());
        
        return userPermissionCodes.containsAll(permissionCodes);
    }

    // ==================== 权限初始化 ====================

    @Override
    public void initializeSystemPermissions() {
        try {
            List<Permission> systemPermissions = getSystemPermissions();
            
            for (Permission permission : systemPermissions) {
                Optional<Permission> existing = permissionRepository.findByCode(permission.getCode());
                if (!existing.isPresent()) {
                    permission.setCreatedAt(LocalDateTime.now());
                    permission.setUpdatedAt(LocalDateTime.now());
                    permissionRepository.save(permission);
                    logger.info("初始化权限: {}", permission.getName());
                }
            }
            
            operationLogService.logSuccess("INIT_PERMISSIONS", "系统初始化", "初始化系统权限完成");
            logger.info("系统权限初始化完成");
        } catch (Exception e) {
            operationLogService.logError("INIT_PERMISSIONS", "系统初始化", "初始化权限失败", e.getMessage());
            logger.error("初始化权限失败: {}", e.getMessage(), e);
            throw new RuntimeException("初始化权限失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void initializeSystemRoles() {
        try {
            List<Role> systemRoles = getSystemRoles();
            
            for (Role role : systemRoles) {
                Optional<Role> existing = roleRepository.findByName(role.getName());
                if (!existing.isPresent()) {
                    role.setCreatedAt(LocalDateTime.now());
                    role.setUpdatedAt(LocalDateTime.now());
                    roleRepository.save(role);
                    logger.info("初始化角色: {}", role.getName());
                }
            }
            
            // 为角色分配权限
            assignPermissionsToSystemRoles();
            
            operationLogService.logSuccess("INIT_ROLES", "系统初始化", "初始化系统角色完成");
            logger.info("系统角色初始化完成");
        } catch (Exception e) {
            operationLogService.logError("INIT_ROLES", "系统初始化", "初始化角色失败", e.getMessage());
            logger.error("初始化角色失败: {}", e.getMessage(), e);
            throw new RuntimeException("初始化角色失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void initializeAdminPermissions(Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                throw new RuntimeException("用户不存在");
            }
            
            Optional<Role> adminRoleOpt = roleRepository.findByName("ADMIN");
            if (adminRoleOpt.isPresent()) {
                assignRolesToUser(userId, Arrays.asList(adminRoleOpt.get().getId()));
                logger.info("为管理员用户分配权限完成");
            }
        } catch (Exception e) {
            logger.error("初始化管理员权限失败: {}", e.getMessage(), e);
            throw new RuntimeException("初始化管理员权限失败: " + e.getMessage(), e);
        }
    }

    // ==================== 私有方法 ====================

    /**
     * 获取系统权限列表
     */
    private List<Permission> getSystemPermissions() {
        List<Permission> permissions = new ArrayList<>();
        
        // 用户管理权限
        permissions.add(createPermission("user:read", "查看用户", "用户管理", "READ", "查看用户信息的权限"));
        permissions.add(createPermission("user:write", "编辑用户", "用户管理", "WRITE", "编辑用户信息的权限"));
        permissions.add(createPermission("user:delete", "删除用户", "用户管理", "DELETE", "删除用户的权限"));
        
        // 组织管理权限
        permissions.add(createPermission("organization:read", "查看组织", "组织管理", "READ", "查看组织信息的权限"));
        permissions.add(createPermission("organization:write", "编辑组织", "组织管理", "WRITE", "编辑组织信息的权限"));
        permissions.add(createPermission("organization:delete", "删除组织", "组织管理", "DELETE", "删除组织的权限"));
        
        // 党员管理权限
        permissions.add(createPermission("member:read", "查看党员", "党员管理", "READ", "查看党员信息的权限"));
        permissions.add(createPermission("member:write", "编辑党员", "党员管理", "WRITE", "编辑党员信息的权限"));
        permissions.add(createPermission("member:delete", "删除党员", "党员管理", "DELETE", "删除党员的权限"));
        
        // 活动管理权限
        permissions.add(createPermission("activity:read", "查看活动", "活动管理", "READ", "查看活动信息的权限"));
        permissions.add(createPermission("activity:write", "编辑活动", "活动管理", "WRITE", "编辑活动信息的权限"));
        permissions.add(createPermission("activity:delete", "删除活动", "活动管理", "DELETE", "删除活动的权限"));
        
        // 党费管理权限
        permissions.add(createPermission("fee:read", "查看党费", "党费管理", "READ", "查看党费信息的权限"));
        permissions.add(createPermission("fee:write", "编辑党费", "党费管理", "WRITE", "编辑党费信息的权限"));
        permissions.add(createPermission("fee:delete", "删除党费", "党费管理", "DELETE", "删除党费记录的权限"));
        
        // 系统管理权限
        permissions.add(createPermission("system:config", "系统配置", "系统管理", "ADMIN", "系统配置管理的权限"));
        permissions.add(createPermission("system:log", "操作日志", "系统管理", "ADMIN", "查看操作日志的权限"));
        permissions.add(createPermission("system:permission", "权限管理", "系统管理", "ADMIN", "权限管理的权限"));
        
        return permissions;
    }
    
    /**
     * 获取系统角色列表
     */
    private List<Role> getSystemRoles() {
        List<Role> roles = new ArrayList<>();
        
        roles.add(createRole("ADMIN", "系统管理员", "拥有系统所有权限的管理员角色"));
        roles.add(createRole("PARTY_SECRETARY", "党委书记", "党委书记角色，拥有党务管理权限"));
        roles.add(createRole("ORGANIZATION_ADMIN", "组织管理员", "组织管理员角色，拥有组织管理权限"));
        roles.add(createRole("USER", "普通用户", "普通用户角色，拥有基本查看权限"));
        
        return roles;
    }
    
    /**
     * 为系统角色分配权限
     */
    private void assignPermissionsToSystemRoles() {
        // 管理员角色 - 所有权限
        Optional<Role> adminRole = roleRepository.findByName("ADMIN");
        if (adminRole.isPresent()) {
            List<Permission> allPermissions = permissionRepository.findAll();
            List<Long> permissionIds = allPermissions.stream()
                    .map(Permission::getId)
                    .collect(Collectors.toList());
            assignPermissionsToRole(adminRole.get().getId(), permissionIds);
        }
        
        // 党委书记角色 - 党务管理权限
        Optional<Role> secretaryRole = roleRepository.findByName("PARTY_SECRETARY");
        if (secretaryRole.isPresent()) {
            List<String> permissionCodes = Arrays.asList(
                "member:read", "member:write", "activity:read", "activity:write",
                "fee:read", "fee:write", "organization:read"
            );
            assignPermissionsByCode(secretaryRole.get().getId(), permissionCodes);
        }
        
        // 组织管理员角色 - 组织管理权限
        Optional<Role> orgAdminRole = roleRepository.findByName("ORGANIZATION_ADMIN");
        if (orgAdminRole.isPresent()) {
            List<String> permissionCodes = Arrays.asList(
                "organization:read", "organization:write", "member:read", "member:write",
                "activity:read", "activity:write"
            );
            assignPermissionsByCode(orgAdminRole.get().getId(), permissionCodes);
        }
        
        // 普通用户角色 - 基本查看权限
        Optional<Role> userRole = roleRepository.findByName("USER");
        if (userRole.isPresent()) {
            List<String> permissionCodes = Arrays.asList(
                "user:read", "organization:read", "member:read", "activity:read", "fee:read"
            );
            assignPermissionsByCode(userRole.get().getId(), permissionCodes);
        }
    }
    
    /**
     * 根据权限代码为角色分配权限
     */
    private void assignPermissionsByCode(Long roleId, List<String> permissionCodes) {
        List<Long> permissionIds = new ArrayList<>();
        for (String code : permissionCodes) {
            Optional<Permission> permission = permissionRepository.findByCode(code);
            if (permission.isPresent()) {
                permissionIds.add(permission.get().getId());
            }
        }
        if (!permissionIds.isEmpty()) {
            assignPermissionsToRole(roleId, permissionIds);
        }
    }
    
    /**
     * 创建权限对象
     */
    private Permission createPermission(String code, String name, String module, String type, String description) {
        Permission permission = new Permission();
        permission.setCode(code);
        permission.setName(name);
        permission.setModule(module);
        permission.setType(type);
        permission.setDescription(description);
        return permission;
    }
    
    /**
     * 创建角色对象
     */
    private Role createRole(String name, String displayName, String description) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        return role;
    }
}