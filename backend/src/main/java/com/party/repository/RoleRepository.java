package com.party.repository;

import com.party.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 角色数据访问接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * 根据角色名称查找角色
     * 
     * @param name 角色名称
     * @return 角色对象
     */
    Optional<Role> findByName(String name);

    /**
     * 检查角色名称是否存在
     * 
     * @param name 角色名称
     * @return 是否存在
     */
    boolean existsByName(String name);

    /**
     * 根据角色名称列表查找角色
     * 
     * @param names 角色名称列表
     * @return 角色列表
     */
    List<Role> findByNameIn(List<String> names);

    /**
     * 根据关键字搜索角色
     * 
     * @param keyword 关键字
     * @return 角色列表
     */
    @Query("SELECT r FROM Role r WHERE r.name LIKE %:keyword% OR r.description LIKE %:keyword%")
    List<Role> searchByKeyword(@Param("keyword") String keyword);

    /**
     * 查找拥有指定权限的角色
     * 
     * @param permissionId 权限ID
     * @return 角色列表
     */
    @Query("SELECT r FROM Role r JOIN r.permissions p WHERE p.id = :permissionId")
    List<Role> findByPermissionId(@Param("permissionId") Long permissionId);

    /**
     * 查找拥有指定权限代码的角色
     * 
     * @param permissionCode 权限代码
     * @return 角色列表
     */
    @Query("SELECT r FROM Role r JOIN r.permissions p WHERE p.code = :permissionCode")
    List<Role> findByPermissionCode(@Param("permissionCode") String permissionCode);

    /**
     * 统计角色总数
     * 
     * @return 角色总数
     */
    @Query("SELECT COUNT(r) FROM Role r")
    long countAllRoles();

    /**
     * 统计拥有权限的角色数量
     * 
     * @return 拥有权限的角色数量
     */
    @Query("SELECT COUNT(DISTINCT r) FROM Role r JOIN r.permissions p")
    long countRolesWithPermissions();

    /**
     * 统计没有权限的角色数量
     * 
     * @return 没有权限的角色数量
     */
    @Query("SELECT COUNT(r) FROM Role r WHERE r.permissions IS EMPTY")
    long countRolesWithoutPermissions();

    /**
     * 查找没有权限的角色
     * 
     * @return 角色列表
     */
    @Query("SELECT r FROM Role r WHERE r.permissions IS EMPTY")
    List<Role> findRolesWithoutPermissions();

    /**
     * 查找拥有权限的角色
     * 
     * @return 角色列表
     */
    @Query("SELECT DISTINCT r FROM Role r JOIN r.permissions p")
    List<Role> findRolesWithPermissions();

    /**
     * 根据用户ID查找角色
     * 
     * @param userId 用户ID
     * @return 角色列表
     */
    @Query("SELECT r FROM Role r JOIN r.users u WHERE u.id = :userId")
    List<Role> findByUserId(@Param("userId") Long userId);

    /**
     * 根据用户名查找角色
     * 
     * @param username 用户名
     * @return 角色列表
     */
    @Query("SELECT r FROM Role r JOIN r.users u WHERE u.username = :username")
    List<Role> findByUsername(@Param("username") String username);

    /**
     * 统计角色的权限数量
     * 
     * @param roleId 角色ID
     * @return 权限数量
     */
    @Query("SELECT COUNT(p) FROM Role r JOIN r.permissions p WHERE r.id = :roleId")
    long countPermissionsByRoleId(@Param("roleId") Long roleId);

    /**
     * 统计角色的用户数量
     * 
     * @param roleId 角色ID
     * @return 用户数量
     */
    @Query("SELECT COUNT(u) FROM Role r JOIN r.users u WHERE r.id = :roleId")
    long countUsersByRoleId(@Param("roleId") Long roleId);
}