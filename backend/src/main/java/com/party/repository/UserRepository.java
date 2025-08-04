package com.party.repository;

import com.party.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 用户数据访问接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据用户名查找用户
     */
    Optional<User> findByUsername(String username);

    /**
     * 根据用户名和激活状态查找用户
     */
    Optional<User> findByUsernameAndIsActive(String username, Boolean isActive);

    /**
     * 根据手机号查找用户
     */
    Optional<User> findByPhone(String phone);

    /**
     * 根据邮箱查找用户
     */
    Optional<User> findByEmail(String email);

    /**
     * 根据身份证号查找用户
     */
    Optional<User> findByIdCard(String idCard);

    /**
     * 根据组织ID查找用户列表
     */
    List<User> findByOrganizationId(Long organizationId);

    /**
     * 根据组织ID和激活状态查找用户列表
     */
    List<User> findByOrganizationIdAndIsActive(Long organizationId, Boolean isActive);

    /**
     * 根据角色ID查找用户列表
     */
    List<User> findByRoleId(Long roleId);

    /**
     * 根据党员状态查找用户列表
     */
    List<User> findByPartyStatus(Integer partyStatus);

    /**
     * 根据激活状态查找用户列表
     */
    List<User> findByIsActive(Boolean isActive);

    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 检查手机号是否存在
     */
    boolean existsByPhone(String phone);

    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 检查身份证号是否存在
     */
    boolean existsByIdCard(String idCard);

    /**
     * 根据真实姓名模糊查询
     */
    @Query("SELECT u FROM User u WHERE u.realName LIKE %:realName%")
    List<User> findByRealNameContaining(@Param("realName") String realName);

    /**
     * 根据多个条件查询用户（分页）
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:realName IS NULL OR u.realName LIKE %:realName%) AND " +
           "(:organizationId IS NULL OR u.organizationId = :organizationId) AND " +
           "(:partyStatus IS NULL OR u.partyStatus = :partyStatus) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive)")
    Page<User> findByConditions(@Param("realName") String realName,
                               @Param("organizationId") Long organizationId,
                               @Param("partyStatus") Integer partyStatus,
                               @Param("isActive") Boolean isActive,
                               Pageable pageable);

    /**
     * 统计组织下的用户数量
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.organizationId = :organizationId AND u.isActive = true")
    long countByOrganizationId(@Param("organizationId") Long organizationId);

    /**
     * 统计各党员状态的人数
     */
    @Query("SELECT u.partyStatus, COUNT(u) FROM User u WHERE u.isActive = true GROUP BY u.partyStatus")
    List<Object[]> countByPartyStatus();

    /**
     * 查找指定组织及其子组织的所有用户
     */
    @Query("SELECT u FROM User u WHERE u.organizationId IN :organizationIds AND u.isActive = true")
    List<User> findByOrganizationIds(@Param("organizationIds") List<Long> organizationIds);

    /**
     * 根据用户ID列表查找用户
     */
    List<User> findByIdIn(List<Long> userIds);

    /**
     * 查找最近注册的用户
     */
    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    List<User> findRecentUsers(Pageable pageable);

    /**
     * 查找即将过生日的用户（本月）
     */
    @Query("SELECT u FROM User u WHERE MONTH(u.birthDate) = MONTH(CURRENT_DATE) AND u.isActive = true")
    List<User> findUsersWithBirthdayThisMonth();

    /**
     * 查找入党周年纪念的用户（本月）
     */
    @Query("SELECT u FROM User u WHERE MONTH(u.joinPartyDate) = MONTH(CURRENT_DATE) AND u.isActive = true")
    List<User> findUsersWithPartyAnniversaryThisMonth();
}