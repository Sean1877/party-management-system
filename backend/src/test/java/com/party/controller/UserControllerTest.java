package com.party.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.party.common.TestDataFactory;
import com.party.entity.User;
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

import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 用户控制器集成测试
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class UserControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private TestDataFactory testDataFactory;
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

        // 创建测试用户
        testUser = testDataFactory.createTestUser("testuser", "测试用户", 1L, 2L);
    }

    @AfterEach
    void tearDown() {
        testDataFactory.cleanupTestData();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetUsers() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/users")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetUserById() throws Exception {
        // Given
        User savedUser = userRepository.save(testUser);

        // When & Then
        mockMvc.perform(get("/api/users/{id}", savedUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value(testUser.getUsername()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateUser() throws Exception {
        // Given
        Map<String, Object> userRequest = new HashMap<>();
        userRequest.put("username", "newuser");
        userRequest.put("password", "password123");
        userRequest.put("realName", "新用户");
        userRequest.put("idCard", "987654321098765432");
        userRequest.put("phone", "13900139000");
        userRequest.put("email", "newuser@example.com");
        userRequest.put("gender", 1);
        userRequest.put("birthDate", "1995-01-01");
        userRequest.put("joinPartyDate", "2022-01-01");
        userRequest.put("partyStatus", 1);
        userRequest.put("organizationId", 1);
        userRequest.put("roleId", 2);

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("newuser"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateUser() throws Exception {
        // Given
        User savedUser = userRepository.save(testUser);
        
        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("username", savedUser.getUsername());
        updateRequest.put("realName", "更新的用户名");
        updateRequest.put("phone", savedUser.getPhone());
        updateRequest.put("email", savedUser.getEmail());
        updateRequest.put("gender", savedUser.getGender());
        updateRequest.put("birthDate", savedUser.getBirthDate().toString());
        updateRequest.put("joinPartyDate", savedUser.getJoinPartyDate().toString());
        updateRequest.put("partyStatus", savedUser.getPartyStatus());
        updateRequest.put("organizationId", savedUser.getOrganizationId());
        updateRequest.put("roleId", savedUser.getRoleId());

        // When & Then
        mockMvc.perform(put("/api/users/{id}", savedUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.realName").value("更新的用户名"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteUser() throws Exception {
        // Given
        User savedUser = userRepository.save(testUser);

        // When & Then
        mockMvc.perform(delete("/api/users/{id}", savedUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testActivateUser() throws Exception {
        // Given
        testUser.setIsActive(false);
        User savedUser = userRepository.save(testUser);

        // When & Then
        mockMvc.perform(put("/api/users/{id}/activate", savedUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeactivateUser() throws Exception {
        // Given
        testUser.setIsActive(true);
        User savedUser = userRepository.save(testUser);

        // When & Then
        mockMvc.perform(put("/api/users/{id}/deactivate", savedUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetUsersWithUserRole() throws Exception {
        // When & Then - 普通用户访问用户列表应该被拒绝
        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetUsersWithoutAuthentication() throws Exception {
        // When & Then - 未认证用户访问应该被拒绝
        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetNonExistentUser() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/users/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}