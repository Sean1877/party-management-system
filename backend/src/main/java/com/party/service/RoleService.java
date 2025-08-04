package com.party.service;

import com.party.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 角色服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface RoleService {

    /**
     * 创建角色
     */
    Role createRole(Role role);

    /**
     * 更新角色
     */
    Role updateRole(Long id, Role role);

    /**
     * 删除角色
     */
    void deleteRole(Long id);

    /**
     * 根据ID查找角色
     */
    Optional<Role> findById(Long id);

    /**
     * 根据编码查找角色
     */
    Optional<Role> findByCode(String code);

    /**
     * 根据名称查找角色
     */
    Optional<Role> findByName(String name);

    /**
     * 查找所有角色
     */
    List<Role> findAll();

    /**
     * 分页查找所有角色
     */
    Page<Role> findAll(Pageable pageable);

    /**
     * 根据条件查询角色
     */
    Page<Role> findByConditions(String name, Boolean isActive, Pageable pageable);

    /**
     * 根据激活状态查找角色
     */
    List<Role> findByIsActive(Boolean isActive);

    /**
     * 激活角色
     */
    void activateRole(Long id);

    /**
     * 停用角色
     */
    void deactivateRole(Long id);

    /**
     * 检查角色编码是否存在
     */
    boolean existsByCode(String code);

    /**
     * 检查角色名称是否存在
     */
    boolean existsByName(String name);

    /**
     * 根据名称模糊查询
     */
    List<Role> findByNameContaining(String name);

    /**
     * 查找有用户的角色
     */
    List<Role> findRolesWithUsers();

    /**
     * 查找没有用户的角色
     */
    List<Role> findRolesWithoutUsers();

    /**
     * 统计各角色的用户数量
     */
    List<Object[]> countUsersByRole();

    /**
     * 批量创建角色
     */
    List<Role> batchCreateRoles(List<Role> roles);

    /**
     * 批量更新角色
     */
    List<Role> batchUpdateRoles(List<Role> roles);

    /**
     * 批量删除角色
     */
    void batchDeleteRoles(List<Long> roleIds);

    /**
     * 获取角色统计信息
     */
    Object getRoleStatistics();

    /**
     * 根据角色ID列表查找角色
     */
    List<Role> findByIdIn(List<Long> roleIds);

    /**
     * 查找所有激活的角色
     */
    List<Role> findActiveRoles();
}