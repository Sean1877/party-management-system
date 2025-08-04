package com.party.service;

import com.party.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 组织服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface OrganizationService {

    /**
     * 创建组织
     * 
     * @param organization 组织信息
     * @return 创建的组织
     */
    Organization createOrganization(Organization organization);

    /**
     * 更新组织
     * 
     * @param id 组织ID
     * @param organization 组织信息
     * @return 更新后的组织
     */
    Organization updateOrganization(Long id, Organization organization);

    /**
     * 删除组织
     * 
     * @param id 组织ID
     */
    void deleteOrganization(Long id);

    /**
     * 根据ID查找组织
     * 
     * @param id 组织ID
     * @return 组织信息
     */
    Optional<Organization> findById(Long id);

    /**
     * 根据编码查找组织
     * 
     * @param code 组织编码
     * @return 组织信息
     */
    Optional<Organization> findByCode(String code);

    /**
     * 查找所有组织
     * 
     * @return 组织列表
     */
    List<Organization> findAll();

    /**
     * 分页查找所有组织
     * 
     * @param pageable 分页参数
     * @return 组织分页数据
     */
    Page<Organization> findAll(Pageable pageable);

    /**
     * 根据条件查找组织
     * 
     * @param name 组织名称（模糊查询）
     * @param type 组织类型
     * @param level 组织层级
     * @param isActive 是否激活
     * @param pageable 分页参数
     * @return 组织分页数据
     */
    Page<Organization> findByConditions(String name, Integer type, Integer level, 
                                       Boolean isActive, Pageable pageable);

    /**
     * 根据父组织ID查找子组织
     * 
     * @param parentId 父组织ID
     * @return 子组织列表
     */
    List<Organization> findByParentId(Long parentId);

    /**
     * 根据组织类型查找组织
     * 
     * @param type 组织类型
     * @return 组织列表
     */
    List<Organization> findByType(Integer type);

    /**
     * 根据组织层级查找组织
     * 
     * @param level 组织层级
     * @return 组织列表
     */
    List<Organization> findByLevel(Integer level);

    /**
     * 根据书记ID查找组织
     * 
     * @param secretaryId 书记ID
     * @return 组织列表
     */
    List<Organization> findBySecretaryId(Long secretaryId);

    /**
     * 激活组织
     * 
     * @param id 组织ID
     */
    void activateOrganization(Long id);

    /**
     * 停用组织
     * 
     * @param id 组织ID
     */
    void deactivateOrganization(Long id);

    /**
     * 检查组织编码是否存在
     * 
     * @param code 组织编码
     * @return 是否存在
     */
    boolean existsByCode(String code);

    /**
     * 根据组织名称模糊查询
     * 
     * @param name 组织名称
     * @return 组织列表
     */
    List<Organization> findByNameContaining(String name);

    /**
     * 获取组织树结构
     * 
     * @return 组织树
     */
    List<Organization> getOrganizationTree();

    /**
     * 获取指定组织的所有子组织（递归）
     * 
     * @param organizationId 组织ID
     * @return 子组织列表
     */
    List<Organization> getAllChildOrganizations(Long organizationId);

    /**
     * 获取指定组织的所有父组织（递归）
     * 
     * @param organizationId 组织ID
     * @return 父组织列表
     */
    List<Organization> getAllParentOrganizations(Long organizationId);

    /**
     * 统计各类型组织数量
     * 
     * @return 统计结果
     */
    List<Object[]> countByType();

    /**
     * 统计各层级组织数量
     * 
     * @return 统计结果
     */
    List<Object[]> countByLevel();

    /**
     * 查找有成员的组织
     * 
     * @return 组织列表
     */
    List<Organization> findOrganizationsWithMembers();

    /**
     * 查找没有成员的组织
     * 
     * @return 组织列表
     */
    List<Organization> findOrganizationsWithoutMembers();

    /**
     * 批量创建组织
     * 
     * @param organizations 组织列表
     * @return 创建的组织列表
     */
    List<Organization> batchCreateOrganizations(List<Organization> organizations);

    /**
     * 批量更新组织
     * 
     * @param organizations 组织列表
     * @return 更新的组织列表
     */
    List<Organization> batchUpdateOrganizations(List<Organization> organizations);

    /**
     * 批量删除组织
     * 
     * @param organizationIds 组织ID列表
     */
    void batchDeleteOrganizations(List<Long> organizationIds);

    /**
     * 移动组织到新的父组织
     * 
     * @param organizationId 组织ID
     * @param newParentId 新父组织ID
     */
    void moveOrganization(Long organizationId, Long newParentId);

    /**
     * 设置组织书记
     * 
     * @param organizationId 组织ID
     * @param secretaryId 书记ID
     */
    void setOrganizationSecretary(Long organizationId, Long secretaryId);

    /**
     * 获取组织统计信息
     * 
     * @return 统计信息
     */
    Object getOrganizationStatistics();

    /**
     * 根据组织ID列表查找组织
     * 
     * @param organizationIds 组织ID列表
     * @return 组织列表
     */
    List<Organization> findByIdIn(List<Long> organizationIds);

    /**
     * 验证组织层级结构
     * 
     * @param organizationId 组织ID
     * @param parentId 父组织ID
     * @return 是否有效
     */
    boolean validateOrganizationHierarchy(Long organizationId, Long parentId);

    /**
     * 获取根组织列表
     * 
     * @return 根组织列表
     */
    List<Organization> findRootOrganizations();

    /**
     * 获取叶子组织列表（没有子组织的组织）
     * 
     * @return 叶子组织列表
     */
    List<Organization> findLeafOrganizations();
}