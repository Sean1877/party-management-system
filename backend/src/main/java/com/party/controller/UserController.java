package com.party.controller;

import com.party.entity.User;
import com.party.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 用户管理控制器
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/users")
@Tag(name = "用户管理", description = "用户相关的API接口")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    /**
     * 创建用户
     */
    @PostMapping
    @Operation(summary = "创建用户", description = "创建新的用户")
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User createdUser = userService.createUser(user);
            response.put("success", true);
            response.put("message", "用户创建成功");
            response.put("data", createdUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("创建用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "创建用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新用户", description = "根据ID更新用户信息")
    public ResponseEntity<Map<String, Object>> updateUser(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Valid @RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User updatedUser = userService.updateUser(id, user);
            response.put("success", true);
            response.put("message", "用户更新成功");
            response.put("data", updatedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "更新用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户", description = "根据ID删除用户")
    public ResponseEntity<Map<String, Object>> deleteUser(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.deleteUser(id);
            response.put("success", true);
            response.put("message", "用户删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("删除用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "删除用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 根据ID获取用户
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情", description = "根据ID获取用户详细信息")
    public ResponseEntity<Map<String, Object>> getUserById(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<User> user = userService.findById(id);
            if (user.isPresent()) {
                response.put("success", true);
                response.put("data", user.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            logger.error("获取用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 分页查询用户
     */
    @GetMapping
    @Operation(summary = "分页查询用户", description = "根据条件分页查询用户列表")
    public ResponseEntity<Map<String, Object>> getUsers(
            @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "排序字段") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "排序方向") @RequestParam(defaultValue = "asc") String sortDir,
            @Parameter(description = "真实姓名（模糊查询）") @RequestParam(required = false) String realName,
            @Parameter(description = "组织ID") @RequestParam(required = false) Long organizationId,
            @Parameter(description = "党员状态") @RequestParam(required = false) Integer partyStatus,
            @Parameter(description = "是否激活") @RequestParam(required = false) Boolean isActive) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<User> users = userService.findByConditions(realName, organizationId, partyStatus, isActive, pageable);
            
            response.put("success", true);
            response.put("data", users.getContent());
            response.put("totalElements", users.getTotalElements());
            response.put("totalPages", users.getTotalPages());
            response.put("currentPage", users.getNumber());
            response.put("pageSize", users.getSize());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("查询用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查询用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 根据用户名查找用户
     */
    @GetMapping("/username/{username}")
    @Operation(summary = "根据用户名查找用户", description = "根据用户名查找用户信息")
    public ResponseEntity<Map<String, Object>> getUserByUsername(
            @Parameter(description = "用户名") @PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<User> user = userService.findByUsername(username);
            if (user.isPresent()) {
                response.put("success", true);
                response.put("data", user.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            logger.error("根据用户名查找用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查找用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 根据组织ID查找用户
     */
    @GetMapping("/organization/{organizationId}")
    @Operation(summary = "根据组织ID查找用户", description = "根据组织ID查找该组织下的所有用户")
    public ResponseEntity<Map<String, Object>> getUsersByOrganization(
            @Parameter(description = "组织ID") @PathVariable Long organizationId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<User> users = userService.findByOrganizationId(organizationId);
            response.put("success", true);
            response.put("data", users);
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("根据组织ID查找用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查找用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 激活用户
     */
    @PutMapping("/{id}/activate")
    @Operation(summary = "激活用户", description = "激活指定ID的用户")
    public ResponseEntity<Map<String, Object>> activateUser(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.activateUser(id);
            response.put("success", true);
            response.put("message", "用户激活成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("激活用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "激活用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 停用用户
     */
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "停用用户", description = "停用指定ID的用户")
    public ResponseEntity<Map<String, Object>> deactivateUser(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.deactivateUser(id);
            response.put("success", true);
            response.put("message", "用户停用成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("停用用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "停用用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 修改密码
     */
    @PutMapping("/{id}/password")
    @Operation(summary = "修改密码", description = "修改用户密码")
    public ResponseEntity<Map<String, Object>> changePassword(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @RequestBody Map<String, String> passwordData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                response.put("success", false);
                response.put("message", "原密码和新密码不能为空");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            userService.changePassword(id, oldPassword, newPassword);
            response.put("success", true);
            response.put("message", "密码修改成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("修改密码失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "修改密码失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 重置密码
     */
    @PutMapping("/{id}/reset-password")
    @Operation(summary = "重置密码", description = "重置用户密码")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @RequestBody Map<String, String> passwordData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String newPassword = passwordData.get("newPassword");
            
            if (newPassword == null) {
                response.put("success", false);
                response.put("message", "新密码不能为空");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            userService.resetPassword(id, newPassword);
            response.put("success", true);
            response.put("message", "密码重置成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("重置密码失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "重置密码失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 批量创建用户
     */
    @PostMapping("/batch")
    @Operation(summary = "批量创建用户", description = "批量创建多个用户")
    public ResponseEntity<Map<String, Object>> batchCreateUsers(
            @Valid @RequestBody List<User> users) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<User> createdUsers = userService.batchCreateUsers(users);
            response.put("success", true);
            response.put("message", "批量创建用户完成");
            response.put("data", createdUsers);
            response.put("successCount", createdUsers.size());
            response.put("totalCount", users.size());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("批量创建用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "批量创建用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 转移用户到新组织
     */
    @PutMapping("/transfer")
    @Operation(summary = "转移用户到新组织", description = "将多个用户转移到新的组织")
    public ResponseEntity<Map<String, Object>> transferUsers(
            @RequestBody Map<String, Object> transferData) {
        Map<String, Object> response = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            List<Long> userIds = (List<Long>) transferData.get("userIds");
            Long newOrganizationId = Long.valueOf(transferData.get("newOrganizationId").toString());
            
            if (userIds == null || userIds.isEmpty()) {
                response.put("success", false);
                response.put("message", "用户ID列表不能为空");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            userService.transferUsersToOrganization(userIds, newOrganizationId);
            response.put("success", true);
            response.put("message", "用户转移成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("转移用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "转移用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 获取用户统计信息
     */
    @GetMapping("/statistics")
    @Operation(summary = "获取用户统计信息", description = "获取用户相关的统计数据")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Object statistics = userService.getUserStatistics();
            response.put("success", true);
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取用户统计信息失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取统计信息失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 搜索用户
     */
    @GetMapping("/search")
    @Operation(summary = "搜索用户", description = "根据真实姓名模糊搜索用户")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @Parameter(description = "搜索关键词") @RequestParam String keyword) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<User> users = userService.findByRealNameContaining(keyword);
            response.put("success", true);
            response.put("data", users);
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("搜索用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "搜索用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取最近注册的用户
     */
    @GetMapping("/recent")
    @Operation(summary = "获取最近注册的用户", description = "获取最近注册的用户列表")
    public ResponseEntity<Map<String, Object>> getRecentUsers(
            @Parameter(description = "限制数量") @RequestParam(defaultValue = "10") int limit) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<User> users = userService.findRecentUsers(limit);
            response.put("success", true);
            response.put("data", users);
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取最近注册用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取最近注册用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取本月生日的用户
     */
    @GetMapping("/birthday-this-month")
    @Operation(summary = "获取本月生日的用户", description = "获取本月生日的用户列表")
    public ResponseEntity<Map<String, Object>> getUsersWithBirthdayThisMonth() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<User> users = userService.findUsersWithBirthdayThisMonth();
            response.put("success", true);
            response.put("data", users);
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取本月生日用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取本月生日用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取本月入党周年的用户
     */
    @GetMapping("/party-anniversary-this-month")
    @Operation(summary = "获取本月入党周年的用户", description = "获取本月入党周年的用户列表")
    public ResponseEntity<Map<String, Object>> getUsersWithPartyAnniversaryThisMonth() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<User> users = userService.findUsersWithPartyAnniversaryThisMonth();
            response.put("success", true);
            response.put("data", users);
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取本月入党周年用户失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取本月入党周年用户失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}