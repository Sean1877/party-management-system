package com.party.common;

import com.party.entity.Activity;
import com.party.entity.Organization;
import com.party.entity.Role;
import com.party.entity.User;
import com.party.repository.ActivityRepository;
import com.party.repository.OrganizationRepository;
import com.party.repository.RoleRepository;
import com.party.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 测试数据工厂类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public class TestDataFactory {

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public OrganizationRepository organizationRepository;

    @Autowired
    public RoleRepository roleRepository;

    @Autowired
    public ActivityRepository activityRepository;

    /**
     * 创建测试角色
     */
    public Role createTestRole(String name, String code, String description) {
        Role role = new Role(name, code, description);
        return roleRepository.save(role);
    }

    /**
     * 创建测试组织
     */
    public Organization createTestOrganization(String name, String code, Integer type, Long parentId) {
        Organization organization = new Organization();
        organization.setName(name);
        organization.setCode(code);
        organization.setType(type);
        organization.setParentId(parentId);
        organization.setLevel(parentId == null ? 1 : 2);
        organization.setDescription("测试组织");
        organization.setAddress("测试地址");
        organization.setContactPhone("010-12345678");
        organization.setEstablishedDate(LocalDate.of(2020, 1, 1));
        organization.setIsActive(true);
        organization.setCreatedAt(LocalDateTime.now());
        organization.setUpdatedAt(LocalDateTime.now());
        return organizationRepository.save(organization);
    }

    /**
     * 创建测试用户
     */
    public User createTestUser(String username, String realName, Long organizationId, Long roleId) {
        User user = new User();
        user.setUsername(username);
        user.setPassword("password123");
        user.setRealName(realName);
        user.setIdCard("110101199001011234");
        user.setPhone("13800138000");
        user.setEmail(username + "@example.com");
        user.setGender(1);
        user.setBirthDate(LocalDate.of(1990, 1, 1));
        user.setJoinPartyDate(LocalDate.of(2020, 1, 1));
        user.setPartyStatus(1);
        user.setOrganizationId(organizationId);
        user.setRoleId(roleId);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    /**
     * 创建测试活动
     */
    public Activity createTestActivity(String title, Integer type, Long organizerId, Long organizationId) {
        Activity activity = new Activity();
        activity.setTitle(title);
        activity.setType(type);
        activity.setContent("测试活动内容");
        activity.setLocation("测试地点");
        activity.setStartTime(LocalDateTime.now().plusDays(1));
        activity.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
        activity.setOrganizerId(organizerId);
        activity.setOrganizationId(organizationId);
        activity.setStatus(1);
        activity.setMaxParticipants(50);
        activity.setIsRequired(false);
        activity.setCreatedAt(LocalDateTime.now());
        activity.setUpdatedAt(LocalDateTime.now());
        return activityRepository.save(activity);
    }

    /**
     * 清理测试数据
     */
    public void cleanupTestData() {
        activityRepository.deleteAll();
        userRepository.deleteAll();
        organizationRepository.deleteAll();
        roleRepository.deleteAll();
    }
}