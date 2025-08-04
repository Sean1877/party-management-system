package com.party.repository;

import com.party.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
     * 根据角色编码查找角色
     */
    Optional<Role> findByCode(String code);

    /**
     * 根据角色名称查找角色
     */
    Optional<Role> findByName(String name);

    /**
     * 根据激活状态查找角色列表
     */
    List<Role> findByIsActive(Boolean isActive);

    /**
     * 检查角色编码是否存在
     */
    boolean existsByCode(String code);

    /**
     * 检查角色名称是否存在
     */
    boolean existsByName(String name);

    /**
     * 根据角色名称模糊查询
     */
    @Query("SELECT r FROM Role r WHERE r.name LIKE %:name%")
    List<Role> findByNameContaining(@Param("name") String name);

    /**
     * 根据多个条件查询角色（分页）
     */
    @Query("SELECT r FROM Role r WHERE " +
           "(:name IS NULL OR r.name LIKE %:name%) AND " +
           "(:isActive IS NULL OR r.isActive = :isActive)")
    Page<Role> findByConditions(@Param("name") String name,
                               @Param("isActive") Boolean isActive,
                               Pageable pageable);

    /**
     * 查找有用户的角色
     */
    @Query("SELECT DISTINCT r FROM Role r " +
           "INNER JOIN User u ON u.roleId = r.id " +
           "WHERE r.isActive = true AND u.isActive = true")
    List<Role> findRolesWithUsers();

    /**
     * 查找没有用户的角色
     */
    @Query("SELECT r FROM Role r " +
           "WHERE r.isActive = true " +
           "AND NOT EXISTS (SELECT 1 FROM User u WHERE u.roleId = r.id AND u.isActive = true)")
    List<Role> findRolesWithoutUsers();

    /**
     * 统计各角色的用户数量
     */
    @Query("SELECT r.name, COUNT(u) FROM Role r " +
           "LEFT JOIN User u ON u.roleId = r.id AND u.isActive = true " +
           "WHERE r.isActive = true " +
           "GROUP BY r.id, r.name")
    List<Object[]> countUsersByRole();

    /**
     * 根据角色ID列表查找角色
     */
    List<Role> findByIdIn(List<Long> roleIds);

    /**
     * 查找所有激活的角色，按名称排序
     */
    List<Role> findByIsActiveTrueOrderByName();
}