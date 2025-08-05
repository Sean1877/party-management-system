package com.party.service.impl;

import com.party.entity.User;
import com.party.repository.UserRepository;
import com.party.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * 用户服务实现类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${party.system.default-password}")
    private String defaultPassword;

    @Override
    public User createUser(User user) {
        logger.info("创建用户: {}", user.getUsername());
        
        // 验证用户名唯一性
        if (existsByUsername(user.getUsername())) {
            throw new RuntimeException("用户名已存在: " + user.getUsername());
        }
        
        // 验证手机号唯一性
        if (StringUtils.hasText(user.getPhone()) && existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已存在: " + user.getPhone());
        }
        
        // 验证邮箱唯一性
        if (StringUtils.hasText(user.getEmail()) && existsByEmail(user.getEmail())) {
            throw new RuntimeException("邮箱已存在: " + user.getEmail());
        }
        
        // 验证身份证号唯一性
        if (StringUtils.hasText(user.getIdCard()) && existsByIdCard(user.getIdCard())) {
            throw new RuntimeException("身份证号已存在: " + user.getIdCard());
        }
        
        // 设置默认密码
        if (!StringUtils.hasText(user.getPassword())) {
            user.setPassword(defaultPassword);
        }
        
        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // 设置默认值
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }
        if (user.getPartyStatus() == null) {
            user.setPartyStatus(1); // 默认为正式党员
        }
        
        User savedUser = userRepository.save(user);
        logger.info("用户创建成功: ID={}, 用户名={}", savedUser.getId(), savedUser.getUsername());
        return savedUser;
    }

    @Override
    public User updateUser(Long id, User user) {
        logger.info("更新用户: ID={}", id);
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在: ID=" + id));
        
        // 验证用户名唯一性（排除当前用户）
        if (StringUtils.hasText(user.getUsername()) && 
            !user.getUsername().equals(existingUser.getUsername()) && 
            existsByUsername(user.getUsername())) {
            throw new RuntimeException("用户名已存在: " + user.getUsername());
        }
        
        // 验证手机号唯一性（排除当前用户）
        if (StringUtils.hasText(user.getPhone()) && 
            !Objects.equals(user.getPhone(), existingUser.getPhone()) && 
            existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已存在: " + user.getPhone());
        }
        
        // 验证邮箱唯一性（排除当前用户）
        if (StringUtils.hasText(user.getEmail()) && 
            !Objects.equals(user.getEmail(), existingUser.getEmail()) && 
            existsByEmail(user.getEmail())) {
            throw new RuntimeException("邮箱已存在: " + user.getEmail());
        }
        
        // 验证身份证号唯一性（排除当前用户）
        if (StringUtils.hasText(user.getIdCard()) && 
            !Objects.equals(user.getIdCard(), existingUser.getIdCard()) && 
            existsByIdCard(user.getIdCard())) {
            throw new RuntimeException("身份证号已存在: " + user.getIdCard());
        }
        
        // 更新字段
        if (StringUtils.hasText(user.getUsername())) {
            existingUser.setUsername(user.getUsername());
        }
        if (StringUtils.hasText(user.getRealName())) {
            existingUser.setRealName(user.getRealName());
        }
        if (StringUtils.hasText(user.getIdCard())) {
            existingUser.setIdCard(user.getIdCard());
        }
        if (StringUtils.hasText(user.getPhone())) {
            existingUser.setPhone(user.getPhone());
        }
        if (StringUtils.hasText(user.getEmail())) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getGender() != null) {
            existingUser.setGender(user.getGender());
        }
        if (user.getBirthDate() != null) {
            existingUser.setBirthDate(user.getBirthDate());
        }
        if (user.getJoinPartyDate() != null) {
            existingUser.setJoinPartyDate(user.getJoinPartyDate());
        }
        if (user.getPartyStatus() != null) {
            existingUser.setPartyStatus(user.getPartyStatus());
        }
        if (user.getOrganizationId() != null) {
            existingUser.setOrganizationId(user.getOrganizationId());
        }
        if (user.getRoleId() != null) {
            existingUser.setRoleId(user.getRoleId());
        }
        if (StringUtils.hasText(user.getAvatarUrl())) {
            existingUser.setAvatarUrl(user.getAvatarUrl());
        }
        if (user.getIsActive() != null) {
            existingUser.setIsActive(user.getIsActive());
        }
        
        User updatedUser = userRepository.save(existingUser);
        logger.info("用户更新成功: ID={}, 用户名={}", updatedUser.getId(), updatedUser.getUsername());
        return updatedUser;
    }

    @Override
    public void deleteUser(Long id) {
        logger.info("删除用户: ID={}", id);
        
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("用户不存在: ID=" + id);
        }
        
        userRepository.deleteById(id);
        logger.info("用户删除成功: ID={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> findByConditions(String realName, Long organizationId, 
                                      Integer partyStatus, Boolean isActive, Pageable pageable) {
        return userRepository.findByConditions(realName, organizationId, partyStatus, isActive, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findByOrganizationId(Long organizationId) {
        return userRepository.findByOrganizationId(organizationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findByRoleId(Long roleId) {
        return userRepository.findByRoleId(roleId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findByPartyStatus(Integer partyStatus) {
        return userRepository.findByPartyStatus(partyStatus);
    }

    @Override
    public void activateUser(Long id) {
        logger.info("激活用户: ID={}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在: ID=" + id));
        
        user.setIsActive(true);
        userRepository.save(user);
        
        logger.info("用户激活成功: ID={}", id);
    }

    @Override
    public void deactivateUser(Long id) {
        logger.info("停用用户: ID={}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在: ID=" + id));
        
        user.setIsActive(false);
        userRepository.save(user);
        
        logger.info("用户停用成功: ID={}", id);
    }

    @Override
    public void changePassword(Long id, String oldPassword, String newPassword) {
        logger.info("修改用户密码: ID={}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在: ID=" + id));
        
        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }
        
        // 设置新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        logger.info("用户密码修改成功: ID={}", id);
    }

    @Override
    public void resetPassword(Long id, String newPassword) {
        logger.info("重置用户密码: ID={}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在: ID=" + id));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        logger.info("用户密码重置成功: ID={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByIdCard(String idCard) {
        return userRepository.existsByIdCard(idCard);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findByRealNameContaining(String realName) {
        return userRepository.findByRealNameContaining(realName);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByOrganizationId(Long organizationId) {
        return userRepository.countByOrganizationId(organizationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> countByPartyStatus() {
        return userRepository.countByPartyStatus();
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findByOrganizationIds(List<Long> organizationIds) {
        return userRepository.findByOrganizationIds(organizationIds);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findRecentUsers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return userRepository.findRecentUsers(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findUsersWithBirthdayThisMonth() {
        return userRepository.findUsersWithBirthdayThisMonth();
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findUsersWithPartyAnniversaryThisMonth() {
        return userRepository.findUsersWithPartyAnniversaryThisMonth();
    }

    @Override
    public List<User> batchCreateUsers(List<User> users) {
        logger.info("批量创建用户: 数量={}", users.size());
        
        List<User> createdUsers = new ArrayList<>();
        for (User user : users) {
            try {
                User createdUser = createUser(user);
                createdUsers.add(createdUser);
            } catch (Exception e) {
                logger.error("批量创建用户失败: 用户名={}, 错误={}", user.getUsername(), e.getMessage());
                // 继续处理其他用户
            }
        }
        
        logger.info("批量创建用户完成: 成功={}, 总数={}", createdUsers.size(), users.size());
        return createdUsers;
    }

    @Override
    public List<User> batchUpdateUsers(List<User> users) {
        logger.info("批量更新用户: 数量={}", users.size());
        
        List<User> updatedUsers = new ArrayList<>();
        for (User user : users) {
            try {
                User updatedUser = updateUser(user.getId(), user);
                updatedUsers.add(updatedUser);
            } catch (Exception e) {
                logger.error("批量更新用户失败: ID={}, 错误={}", user.getId(), e.getMessage());
                // 继续处理其他用户
            }
        }
        
        logger.info("批量更新用户完成: 成功={}, 总数={}", updatedUsers.size(), users.size());
        return updatedUsers;
    }

    @Override
    public void batchDeleteUsers(List<Long> userIds) {
        logger.info("批量删除用户: 数量={}", userIds.size());
        
        int successCount = 0;
        for (Long userId : userIds) {
            try {
                deleteUser(userId);
                successCount++;
            } catch (Exception e) {
                logger.error("批量删除用户失败: ID={}, 错误={}", userId, e.getMessage());
                // 继续处理其他用户
            }
        }
        
        logger.info("批量删除用户完成: 成功={}, 总数={}", successCount, userIds.size());
    }

    @Override
    public void transferUsersToOrganization(List<Long> userIds, Long newOrganizationId) {
        logger.info("转移用户到新组织: 用户数量={}, 新组织ID={}", userIds.size(), newOrganizationId);
        
        List<User> users = userRepository.findByIdIn(userIds);
        for (User user : users) {
            user.setOrganizationId(newOrganizationId);
        }
        
        userRepository.saveAll(users);
        logger.info("用户组织转移完成: 成功转移{}个用户", users.size());
    }

    @Override
    public void updateUserAvatar(Long id, String avatarUrl) {
        logger.info("更新用户头像: ID={}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在: ID=" + id));
        
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        
        logger.info("用户头像更新成功: ID={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validatePassword(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsernameAndIsActive(username, true);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public Object getUserStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总用户数
        long totalUsers = userRepository.count();
        statistics.put("totalUsers", totalUsers);
        
        // 激活用户数
        long activeUsers = userRepository.findByIsActive(true).size();
        statistics.put("activeUsers", activeUsers);
        
        // 各党员状态统计
        List<Object[]> partyStatusStats = userRepository.countByPartyStatus();
        Map<String, Long> partyStatusMap = new HashMap<>();
        for (Object[] stat : partyStatusStats) {
            Integer status = (Integer) stat[0];
            Long count = (Long) stat[1];
            String statusText = getPartyStatusText(status);
            partyStatusMap.put(statusText, count);
        }
        statistics.put("partyStatusStats", partyStatusMap);
        
        // 本月生日用户
        List<User> birthdayUsers = userRepository.findUsersWithBirthdayThisMonth();
        statistics.put("birthdayUsersThisMonth", birthdayUsers.size());
        
        // 本月入党周年用户
        List<User> anniversaryUsers = userRepository.findUsersWithPartyAnniversaryThisMonth();
        statistics.put("anniversaryUsersThisMonth", anniversaryUsers.size());
        
        return statistics;
    }
    
    private String getPartyStatusText(Integer status) {
        if (status == null) return "未知";
        switch (status) {
            case 1: return "正式党员";
            case 2: return "预备党员";
            case 3: return "入党积极分子";
            case 4: return "已退党";
            default: return "未知";
        }
    }
}