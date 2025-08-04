package com.party.repository;

import com.party.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 组织数据访问接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    /**
     * 根据组织编码查找组织
     */
    Optional<Organization> findByCode(String code);

    /**
     * 根据父组织ID查找子组织列表
     */
    List<Organization> findByParentId(Long parentId);

    /**
     * 根据父组织ID和激活状态查找子组织列表
     */
    List<Organization> findByParentIdAndIsActive(Long parentId, Boolean isActive);

    /**
     * 根据组织类型查找组织列表
     */
    List<Organization> findByType(Integer type);

    /**
     * 根据组织类型和激活状态查找组织列表
     */
    List<Organization> findByTypeAndIsActive(Integer type, Boolean isActive);

    /**
     * 根据组织层级查找组织列表
     */
    List<Organization> findByLevel(Integer level);

    /**
     * 根据激活状态查找组织列表
     */
    List<Organization> findByIsActive(Boolean isActive);

    /**
     * 查找根组织（没有父组织的组织）
     */
    List<Organization> findByParentIdIsNull();

    /**
     * 查找根组织且激活的组织
     */
    List<Organization> findByParentIdIsNullAndIsActive(Boolean isActive);

    /**
     * 检查组织编码是否存在
     */
    boolean existsByCode(String code);

    /**
     * 根据组织名称模糊查询
     */
    @Query("SELECT o FROM Organization o WHERE o.name LIKE %:name%")
    List<Organization> findByNameContaining(@Param("name") String name);

    /**
     * 根据书记ID查找组织
     */
    List<Organization> findBySecretaryId(Long secretaryId);

    /**
     * 查找指定组织的所有子组织（递归）
     */
    @Query(value = "WITH RECURSIVE org_tree AS (" +
                   "  SELECT id, name, code, type, parent_id, level " +
                   "  FROM organizations " +
                   "  WHERE id = :organizationId " +
                   "  UNION ALL " +
                   "  SELECT o.id, o.name, o.code, o.type, o.parent_id, o.level " +
                   "  FROM organizations o " +
                   "  INNER JOIN org_tree ot ON o.parent_id = ot.id " +
                   ") " +
                   "SELECT * FROM org_tree WHERE id != :organizationId", 
           nativeQuery = true)
    List<Organization> findAllChildren(@Param("organizationId") Long organizationId);

    /**
     * 查找指定组织的所有父组织（递归）
     */
    @Query(value = "WITH RECURSIVE org_tree AS (" +
                   "  SELECT id, name, code, type, parent_id, level " +
                   "  FROM organizations " +
                   "  WHERE id = :organizationId " +
                   "  UNION ALL " +
                   "  SELECT o.id, o.name, o.code, o.type, o.parent_id, o.level " +
                   "  FROM organizations o " +
                   "  INNER JOIN org_tree ot ON ot.parent_id = o.id " +
                   ") " +
                   "SELECT * FROM org_tree WHERE id != :organizationId", 
           nativeQuery = true)
    List<Organization> findAllParents(@Param("organizationId") Long organizationId);

    /**
     * 统计各类型组织的数量
     */
    @Query("SELECT o.type, COUNT(o) FROM Organization o WHERE o.isActive = true GROUP BY o.type")
    List<Object[]> countByType();

    /**
     * 统计各层级组织的数量
     */
    @Query("SELECT o.level, COUNT(o) FROM Organization o WHERE o.isActive = true GROUP BY o.level")
    List<Object[]> countByLevel();

    /**
     * 查找有成员的组织
     */
    @Query("SELECT DISTINCT o FROM Organization o " +
           "INNER JOIN User u ON u.organizationId = o.id " +
           "WHERE o.isActive = true AND u.isActive = true")
    List<Organization> findOrganizationsWithMembers();

    /**
     * 查找没有成员的组织
     */
    @Query("SELECT o FROM Organization o " +
           "WHERE o.isActive = true " +
           "AND NOT EXISTS (SELECT 1 FROM User u WHERE u.organizationId = o.id AND u.isActive = true)")
    List<Organization> findOrganizationsWithoutMembers();

    /**
     * 根据多个条件查询组织
     */
    @Query("SELECT o FROM Organization o WHERE " +
           "(:name IS NULL OR o.name LIKE %:name%) AND " +
           "(:type IS NULL OR o.type = :type) AND " +
           "(:level IS NULL OR o.level = :level) AND " +
           "(:isActive IS NULL OR o.isActive = :isActive)")
    Page<Organization> findByConditions(@Param("name") String name,
                                       @Param("type") Integer type,
                                       @Param("level") Integer level,
                                       @Param("isActive") Boolean isActive,
                                       Pageable pageable);

    /**
     * 查找指定组织的所有子组织（递归）
     */
    @Query(value = "WITH RECURSIVE org_tree AS (" +
           "  SELECT id, name, code, type, parent_id, level " +
           "  FROM organizations " +
           "  WHERE parent_id = :organizationId " +
           "  UNION ALL " +
           "  SELECT o.id, o.name, o.code, o.type, o.parent_id, o.level " +
           "  FROM organizations o " +
           "  INNER JOIN org_tree ot ON o.parent_id = ot.id" +
           ") SELECT * FROM org_tree", nativeQuery = true)
    List<Organization> findAllChildOrganizations(@Param("organizationId") Long organizationId);

    /**
     * 查找指定组织的所有父组织（递归）
     */
    @Query(value = "WITH RECURSIVE org_tree AS (" +
           "  SELECT id, name, code, type, parent_id, level " +
           "  FROM organizations " +
           "  WHERE id = (SELECT parent_id FROM organizations WHERE id = :organizationId) " +
           "  UNION ALL " +
           "  SELECT o.id, o.name, o.code, o.type, o.parent_id, o.level " +
           "  FROM organizations o " +
           "  INNER JOIN org_tree ot ON o.id = ot.parent_id" +
           ") SELECT * FROM org_tree", nativeQuery = true)
    List<Organization> findAllParentOrganizations(@Param("organizationId") Long organizationId);

    /**
     * 查找组织树结构（用于前端展示）
     */
    @Query("SELECT o FROM Organization o WHERE o.isActive = true ORDER BY o.level, o.name")
    List<Organization> findOrganizationTree();

    /**
     * 根据组织ID列表查找组织
     */
    List<Organization> findByIdIn(List<Long> organizationIds);
}