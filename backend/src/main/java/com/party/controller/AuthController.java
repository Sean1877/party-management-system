package com.party.controller;

import com.party.entity.User;
import com.party.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 认证控制器
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证管理", description = "用户认证相关的API接口")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录认证")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            logger.info("用户登录尝试: {}", username);
            
            if (username == null || password == null) {
                response.put("success", false);
                response.put("message", "用户名和密码不能为空");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // 查找用户
            Optional<User> userOptional = userService.findByUsername(username);
            if (!userOptional.isPresent()) {
                response.put("success", false);
                response.put("message", "用户名或密码错误");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            User user = userOptional.get();
            
            // 检查用户是否激活
            if (!user.getIsActive()) {
                response.put("success", false);
                response.put("message", "用户账户已被停用");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // 验证密码
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("success", false);
                response.put("message", "用户名或密码错误");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // 登录成功，返回用户信息（不包含密码）
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("realName", user.getRealName());
            userInfo.put("email", user.getEmail());
            userInfo.put("phone", user.getPhone());
            userInfo.put("organizationId", user.getOrganizationId());
            userInfo.put("partyStatus", user.getPartyStatus());
            userInfo.put("isActive", user.getIsActive());
            
            // 添加角色信息
            Map<String, Object> roleInfo = new HashMap<>();
            roleInfo.put("id", 1L);
            roleInfo.put("name", "管理员");
            roleInfo.put("permissions", java.util.Arrays.asList("user:read", "user:write", "activity:read", "activity:write"));
            userInfo.put("role", roleInfo);
            
            response.put("success", true);
            response.put("message", "登录成功");
            response.put("data", userInfo);
            response.put("token", "mock-jwt-token-" + user.getId()); // Mock JWT token
            
            logger.info("用户登录成功: {}", username);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("登录失败: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 用户登出
     */
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "用户登出")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "登出成功");
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的信息")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        
        // 这里是Mock实现，实际项目中应该解析JWT token
        if (token == null || !token.startsWith("Bearer mock-jwt-token-")) {
            response.put("success", false);
            response.put("message", "未登录或token无效");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            // 从token中提取用户ID（Mock实现）
            String userId = token.replace("Bearer mock-jwt-token-", "");
            Long id = Long.parseLong(userId);
            
            Optional<User> userOptional = userService.findById(id);
            if (!userOptional.isPresent()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            User user = userOptional.get();
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("realName", user.getRealName());
            userInfo.put("email", user.getEmail());
            userInfo.put("phone", user.getPhone());
            userInfo.put("organizationId", user.getOrganizationId());
            userInfo.put("partyStatus", user.getPartyStatus());
            userInfo.put("isActive", user.getIsActive());
            
            response.put("success", true);
            response.put("data", userInfo);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("获取用户信息失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取用户信息失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}