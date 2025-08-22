package com.party.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.party.common.TestDataFactory;
import com.party.entity.Activity;
import com.party.entity.User;
import com.party.repository.ActivityRepository;
import com.party.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
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
class ActivityControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private TestDataFactory testDataFactory;
    private Activity testActivity;
    private User testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // 创建测试数据工厂
        testDataFactory = new TestDataFactory();
        testDataFactory.userRepository = userRepository;
        testDataFactory.activityRepository = activityRepository;

        // 创建测试数据
        testUser = testDataFactory.createTestUser("organizer", "活动组织者", 1L, 2L);
        testActivity = testDataFactory.createTestActivity("测试活动", 4, testUser.getId(), 1L);
    }

    @AfterEach
    void tearDown() {
        testDataFactory.cleanupTestData();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetActivities() throws Exception {
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
        activityRequest.put("type", 4);
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
        statusRequest.put("status", 2);

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
        activityRequest.put("type", 3);
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
}