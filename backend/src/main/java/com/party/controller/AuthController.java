package com.party.controller;

import com.party.entity.User;
import com.party.service.UserService;
import com.party.utils.JwtUtils;
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
import java.util.Arrays;

/**
 * 认证控制器
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证管理", description = "用户认证相关的API接口")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;

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
            logger.debug("正在查找用户: {}", username);
            Optional<User> userOptional = userService.findByUsername(username);
            if (!userOptional.isPresent()) {
                logger.warn("用户不存在: {}", username);
                response.put("success", false);
                response.put("message", "用户名或密码错误");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            User user = userOptional.get();
            logger.debug("找到用户: id={}, username={}, realName={}, isActive={}", 
                user.getId(), user.getUsername(), user.getRealName(), user.getIsActive());
            
            // 检查用户是否激活
            if (!user.getIsActive()) {
                logger.warn("用户账户已被停用: {}", username);
                response.put("success", false);
                response.put("message", "用户账户已被停用");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // 验证密码
            logger.debug("开始验证密码，用户: {}", username);
            logger.debug("输入密码: [{}]", password);
            logger.debug("输入密码长度: {}", password != null ? password.length() : 0);
            logger.debug("数据库密码哈希: {}", user.getPassword());
            
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
            logger.debug("密码验证结果: {}", passwordMatches);
            
            // 测试用正确密码验证
            boolean testPassword = passwordEncoder.matches("123456", user.getPassword());
            logger.debug("测试密码123456验证结果: {}", testPassword);
            
            if (!passwordMatches) {
                logger.warn("密码验证失败，用户: {}", username);
                response.put("success", false);
                response.put("message", "用户名或密码错误");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            logger.info("密码验证成功，用户: {}", username);
            
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
            
            // 生成真正的JWT token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("roles", Arrays.asList("ADMIN")); // 这里可以根据实际角色设置
            claims.put("organizationId", user.getOrganizationId());
            
            String jwtToken = jwtUtils.generateToken(user.getUsername(), claims);
            
            response.put("success", true);
            response.put("message", "登录成功");
            response.put("data", userInfo);
            response.put("token", jwtToken);
            
            logger.info("用户登录成功: {}", username);
            logger.info("完整响应对象: {}", response);
            logger.info("JWT Token: {}", jwtToken);
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
        
        if (token == null || !token.startsWith("Bearer ")) {
            response.put("success", false);
            response.put("message", "未登录或token无效");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            // 从JWT token中提取用户信息
            String jwtToken = token.substring(7); // 移除"Bearer "前缀
            
            if (!jwtUtils.validateToken(jwtToken)) {
                response.put("success", false);
                response.put("message", "token无效或已过期");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            Long id = jwtUtils.getUserIdFromToken(jwtToken);
            
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