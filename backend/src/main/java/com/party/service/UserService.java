package com.party.service;

import com.party.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 用户服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface UserService {

    /**
     * 创建用户
     */
    User createUser(User user);

    /**
     * 更新用户信息
     */
    User updateUser(Long id, User user);

    /**
     * 根据ID删除用户
     */
    void deleteUser(Long id);

    /**
     * 根据ID查找用户
     */
    Optional<User> findById(Long id);

    /**
     * 根据用户名查找用户
     */
    Optional<User> findByUsername(String username);
    
    /**
     * 根据邮箱查找用户
     */
    Optional<User> findByEmail(String email);
    
    /**
     * 保存用户
     */
    User save(User user);

    /**
     * 获取所有用户
     */
    List<User> findAll();

    /**
     * 分页查询用户
     */
    Page<User> findAll(Pageable pageable);

    /**
     * 根据条件查询用户
     */
    Page<User> findByConditions(String realName, Long organizationId, 
                               Integer partyStatus, Boolean isActive, Pageable pageable);

    /**
     * 根据组织ID查找用户
     */
    List<User> findByOrganizationId(Long organizationId);

    /**
     * 根据角色ID查找用户
     */
    List<User> findByRoleId(Long roleId);

    /**
     * 根据党员状态查找用户
     */
    List<User> findByPartyStatus(Integer partyStatus);

    /**
     * 激活用户
     */
    void activateUser(Long id);

    /**
     * 停用用户
     */
    void deactivateUser(Long id);

    /**
     * 修改密码
     */
    void changePassword(Long id, String oldPassword, String newPassword);

    /**
     * 重置密码
     */
    void resetPassword(Long id, String newPassword);

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
    List<User> findByRealNameContaining(String realName);

    /**
     * 统计组织下的用户数量
     */
    long countByOrganizationId(Long organizationId);

    /**
     * 统计各党员状态的人数
     */
    List<Object[]> countByPartyStatus();

    /**
     * 查找指定组织及其子组织的所有用户
     */
    List<User> findByOrganizationIds(List<Long> organizationIds);

    /**
     * 查找最近注册的用户
     */
    List<User> findRecentUsers(int limit);

    /**
     * 查找即将过生日的用户（本月）
     */
    List<User> findUsersWithBirthdayThisMonth();

    /**
     * 查找入党周年纪念的用户（本月）
     */
    List<User> findUsersWithPartyAnniversaryThisMonth();

    /**
     * 批量创建用户
     */
    List<User> batchCreateUsers(List<User> users);

    /**
     * 批量更新用户
     */
    List<User> batchUpdateUsers(List<User> users);

    /**
     * 批量删除用户
     */
    void batchDeleteUsers(List<Long> userIds);

    /**
     * 转移用户到新组织
     */
    void transferUsersToOrganization(List<Long> userIds, Long newOrganizationId);

    /**
     * 更新用户头像
     */
    void updateUserAvatar(Long id, String avatarUrl);

    /**
     * 验证用户密码
     */
    boolean validatePassword(String username, String password);

    /**
     * 获取用户统计信息
     */
    Object getUserStatistics();
}