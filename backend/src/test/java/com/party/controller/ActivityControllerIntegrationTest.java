package com.party;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.party.entity.Activity;
import com.party.entity.User;
import com.party.repository.ActivityRepository;
import com.party.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 活动控制器集成测试
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class ActivityControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private Activity testActivity;
    private User testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();

        // 创建测试用户
        testUser = new User();
        testUser.setUsername("organizer");
        testUser.setPassword("password123");
        testUser.setRealName("活动组织者");
        testUser.setIdCard("110101199001011234");
        testUser.setPhone("13800138000");
        testUser.setEmail("organizer@example.com");
        testUser.setGender(1);
        testUser.setBirthDate(LocalDate.of(1990, 1, 1));
        testUser.setJoinPartyDate(LocalDate.of(2020, 1, 1));
        testUser.setPartyStatus(3);
        testUser.setOrganizationId(1L);
        testUser.setRoleId(2L);
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());
        testUser = userRepository.save(testUser);

        // 创建测试活动
        testActivity = new Activity();
        testActivity.setTitle("测试活动");
        testActivity.setType(4); // 4:党课
        testActivity.setContent("这是一个测试活动");
        testActivity.setLocation("会议室A");
        testActivity.setStartTime(LocalDateTime.now().plusDays(1));
        testActivity.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
        testActivity.setOrganizerId(testUser.getId());
        testActivity.setOrganizationId(1L);
        testActivity.setStatus(1); // 1:计划中
        testActivity.setMaxParticipants(50);
        testActivity.setIsRequired(false);
        testActivity.setCreatedAt(LocalDateTime.now());
        testActivity.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetActivities() throws Exception {
        // Given
        activityRepository.save(testActivity);

        // When & Then
        mockMvc.perform(get("/api/activities")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetActivityById() throws Exception {
        // Given
        Activity savedActivity = activityRepository.save(testActivity);

        // When & Then
        mockMvc.perform(get("/api/activities/{id}", savedActivity.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value(testActivity.getTitle()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateActivity() throws Exception {
        // Given
        Map<String, Object> activityRequest = new HashMap<>();
        activityRequest.put("title", "新活动");
        activityRequest.put("type", 4); // 4:党课
        activityRequest.put("content", "这是一个新的活动");
        activityRequest.put("location", "会议室B");
        activityRequest.put("startTime", LocalDateTime.now().plusDays(2).toString());
        activityRequest.put("endTime", LocalDateTime.now().plusDays(2).plusHours(3).toString());
        activityRequest.put("organizerId", testUser.getId());
        activityRequest.put("organizationId", 1);
        activityRequest.put("maxParticipants", 30);
        activityRequest.put("isRequired", true);

        // When & Then
        mockMvc.perform(post("/api/activities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(activityRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("新活动"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateActivity() throws Exception {
        // Given
        Activity savedActivity = activityRepository.save(testActivity);
        
        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("id", savedActivity.getId());
        updateRequest.put("title", "更新的活动");
        updateRequest.put("type", savedActivity.getType());
        updateRequest.put("content", "更新的活动内容");
        updateRequest.put("location", savedActivity.getLocation());
        updateRequest.put("startTime", savedActivity.getStartTime().toString());
        updateRequest.put("endTime", savedActivity.getEndTime().toString());
        updateRequest.put("organizerId", savedActivity.getOrganizerId());
        updateRequest.put("organizationId", savedActivity.getOrganizationId());
        updateRequest.put("maxParticipants", savedActivity.getMaxParticipants());
        updateRequest.put("isRequired", savedActivity.getIsRequired());

        // When & Then
        mockMvc.perform(put("/api/activities/{id}", savedActivity.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("更新的活动"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteActivity() throws Exception {
        // Given
        Activity savedActivity = activityRepository.save(testActivity);

        // When & Then
        mockMvc.perform(delete("/api/activities/{id}", savedActivity.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetRecentActivities() throws Exception {
        // Given
        activityRepository.save(testActivity);

        // When & Then
        mockMvc.perform(get("/api/activities/recent")
                .param("limit", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetUpcomingActivities() throws Exception {
        // Given
        activityRepository.save(testActivity);

        // When & Then
        mockMvc.perform(get("/api/activities/upcoming")
                .param("organizationId", "1")
                .param("limit", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateActivityStatus() throws Exception {
        // Given
        Activity savedActivity = activityRepository.save(testActivity);
        
        Map<String, Object> statusRequest = new HashMap<>();
        statusRequest.put("status", 2); // 2:进行中

        // When & Then
        mockMvc.perform(put("/api/activities/{id}/status", savedActivity.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetActivitiesWithUserRole() throws Exception {
        // When & Then - 普通用户可以查看活动列表
        mockMvc.perform(get("/api/activities")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetActivitiesWithoutAuthentication() throws Exception {
        // When & Then - 未认证用户访问应该被拒绝
        mockMvc.perform(get("/api/activities")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateActivityWithDuplicateTitle() throws Exception {
        // Given
        activityRepository.save(testActivity);
        
        Map<String, Object> duplicateActivityRequest = new HashMap<>();
        duplicateActivityRequest.put("title", testActivity.getTitle()); // 重复的标题
        duplicateActivityRequest.put("type", 2); // 2:会议
        duplicateActivityRequest.put("content", "重复标题的活动");
        duplicateActivityRequest.put("location", "会议室C");
        duplicateActivityRequest.put("startTime", LocalDateTime.now().plusDays(3).toString());
        duplicateActivityRequest.put("endTime", LocalDateTime.now().plusDays(3).plusHours(1).toString());
        duplicateActivityRequest.put("organizerId", testUser.getId());
        duplicateActivityRequest.put("organizationId", 1);
        duplicateActivityRequest.put("maxParticipants", 20);
        duplicateActivityRequest.put("isRequired", false);

        // When & Then
        mockMvc.perform(post("/api/activities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateActivityRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetNonExistentActivity() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/activities/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testCreateActivityWithUserRole() throws Exception {
        // Given
        Map<String, Object> activityRequest = new HashMap<>();
        activityRequest.put("title", "用户创建的活动");
        activityRequest.put("type", 3); // 3:讨论
        activityRequest.put("content", "普通用户创建的活动");
        activityRequest.put("location", "会议室D");
        activityRequest.put("startTime", LocalDateTime.now().plusDays(4).toString());
        activityRequest.put("endTime", LocalDateTime.now().plusDays(4).plusHours(2).toString());
        activityRequest.put("organizerId", testUser.getId());
        activityRequest.put("organizationId", 1);
        activityRequest.put("maxParticipants", 15);
        activityRequest.put("isRequired", false);

        // When & Then - 普通用户创建活动应该被拒绝
        mockMvc.perform(post("/api/activities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(activityRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testBatchDeleteActivities() throws Exception {
        // Given
        Activity activity1 = activityRepository.save(testActivity);
        
        Activity activity2 = new Activity();
        activity2.setTitle("第二个测试活动");
        activity2.setType(4); // 4:党课
        activity2.setContent("第二个测试活动内容");
        activity2.setLocation("会议室B");
        activity2.setStartTime(LocalDateTime.now().plusDays(2));
        activity2.setEndTime(LocalDateTime.now().plusDays(2).plusHours(1));
        activity2.setOrganizerId(testUser.getId());
        activity2.setOrganizationId(1L);
        activity2.setStatus(1); // 1:计划中
        activity2.setMaxParticipants(30);
        activity2.setIsRequired(true);
        activity2.setCreatedAt(LocalDateTime.now());
        activity2.setUpdatedAt(LocalDateTime.now());
        activity2 = activityRepository.save(activity2);
        
        Map<String, Object> batchDeleteRequest = new HashMap<>();
        batchDeleteRequest.put("ids", new Long[]{activity1.getId(), activity2.getId()});

        // When & Then
        mockMvc.perform(delete("/api/activities/batch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchDeleteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}