package com.party.controller;

import com.party.entity.User;
import com.party.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 查找用户
            Optional<User> userOpt = userService.findByUsername(loginRequest.getUsername());
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOpt.get();
            
            // 验证密码
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "密码错误");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 生成简单的token（实际项目中应该使用JWT）
            String token = UUID.randomUUID().toString();
            
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", user);
            
            response.put("success", true);
            response.put("message", "登录成功");
            response.put("data", data);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 检查用户名是否已存在
            if (userService.findByUsername(user.getUsername()).isPresent()) {
                response.put("success", false);
                response.put("message", "用户名已存在");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 加密密码
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // 保存用户
            User savedUser = userService.save(user);
            
            response.put("success", true);
            response.put("message", "注册成功");
            response.put("data", savedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "注册失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 简单的token验证（实际项目中应该使用JWT）
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "未授权");
                return ResponseEntity.status(401).body(response);
            }
            
            // 模拟用户信息（实际项目中应该从token解析用户信息）
            User user = userService.findByUsername("testuser").orElse(null);
            if (user == null) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.status(401).body(response);
            }
            
            response.put("success", true);
            response.put("message", "获取成功");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestHeader("Authorization") String authHeader, @RequestBody User updateData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 简单的token验证
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "未授权");
                return ResponseEntity.status(401).body(response);
            }
            
            // 模拟更新用户信息
            User user = userService.findByUsername("testuser").orElse(null);
            if (user == null) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.status(401).body(response);
            }
            
            if (updateData.getRealName() != null) {
                user.setRealName(updateData.getRealName());
            }
            if (updateData.getPhone() != null) {
                user.setPhone(updateData.getPhone());
            }
            
            User updatedUser = userService.save(user);
            
            response.put("success", true);
            response.put("message", "更新成功");
            response.put("data", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PutMapping("/password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestHeader("Authorization") String authHeader, @RequestBody PasswordChangeRequest passwordData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 简单的token验证
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "未授权");
                return ResponseEntity.status(401).body(response);
            }
            
            User user = userService.findByUsername("testuser").orElse(null);
            if (user == null) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.status(401).body(response);
            }
            
            // 验证旧密码
            if (!passwordEncoder.matches(passwordData.getOldPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "原密码错误");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 更新密码
            user.setPassword(passwordEncoder.encode(passwordData.getNewPassword()));
            userService.save(user);
            
            response.put("success", true);
            response.put("message", "密码修改成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "密码修改失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 简单的token验证
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "未授权");
                return ResponseEntity.status(401).body(response);
            }
            
            // 实际项目中应该将token加入黑名单或删除
            response.put("success", true);
            response.put("message", "登出成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "登出失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // 登录请求DTO
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    // 密码修改请求DTO
    public static class PasswordChangeRequest {
        private String oldPassword;
        private String newPassword;
        
        public String getOldPassword() {
            return oldPassword;
        }
        
        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }
        
        public String getNewPassword() {
            return newPassword;
        }
        
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}