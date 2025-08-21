package com.party.repository;

import com.party.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 权限数据访问接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    /**
     * 根据权限代码查找权限
     * 
     * @param code 权限代码
     * @return 权限对象
     */
    Optional<Permission> findByCode(String code);

    /**
     * 根据权限名称查找权限
     * 
     * @param name 权限名称
     * @return 权限对象
     */
    Optional<Permission> findByName(String name);

    /**
     * 根据模块查找权限列表
     * 
     * @param module 模块名称
     * @return 权限列表
     */
    List<Permission> findByModule(String module);

    /**
     * 根据权限类型查找权限列表
     * 
     * @param type 权限类型
     * @return 权限列表
     */
    List<Permission> findByType(String type);

    /**
     * 根据模块和类型查找权限列表
     * 
     * @param module 模块名称
     * @param type 权限类型
     * @return 权限列表
     */
    List<Permission> findByModuleAndType(String module, String type);

    /**
     * 检查权限代码是否存在
     * 
     * @param code 权限代码
     * @return 是否存在
     */
    boolean existsByCode(String code);

    /**
     * 检查权限名称是否存在
     * 
     * @param name 权限名称
     * @return 是否存在
     */
    boolean existsByName(String name);

    /**
     * 根据权限代码列表查找权限
     * 
     * @param codes 权限代码列表
     * @return 权限列表
     */
    List<Permission> findByCodeIn(List<String> codes);

    /**
     * 根据模块列表查找权限
     * 
     * @param modules 模块列表
     * @return 权限列表
     */
    List<Permission> findByModuleIn(List<String> modules);

    /**
     * 查找所有模块
     * 
     * @return 模块列表
     */
    @Query("SELECT DISTINCT p.module FROM Permission p ORDER BY p.module")
    List<String> findAllModules();

    /**
     * 查找所有权限类型
     * 
     * @return 权限类型列表
     */
    @Query("SELECT DISTINCT p.type FROM Permission p ORDER BY p.type")
    List<String> findAllTypes();

    /**
     * 根据关键字搜索权限
     * 
     * @param keyword 关键字
     * @return 权限列表
     */
    @Query("SELECT p FROM Permission p WHERE p.name LIKE %:keyword% OR p.code LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Permission> searchByKeyword(@Param("keyword") String keyword);

    /**
     * 统计权限总数
     * 
     * @return 权限总数
     */
    @Query("SELECT COUNT(p) FROM Permission p")
    long countAllPermissions();

    /**
     * 根据模块统计权限数量
     * 
     * @param module 模块名称
     * @return 权限数量
     */
    long countByModule(String module);

    /**
     * 根据类型统计权限数量
     * 
     * @param type 权限类型
     * @return 权限数量
     */
    long countByType(String type);
}