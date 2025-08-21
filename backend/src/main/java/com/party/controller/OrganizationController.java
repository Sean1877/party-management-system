package com.party.controller;

import com.party.entity.Organization;
import com.party.service.OrganizationService;
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
 * 组织管理控制器
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/organizations")
@Tag(name = "组织管理", description = "组织相关的API接口")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class OrganizationController {

    private static final Logger logger = LoggerFactory.getLogger(OrganizationController.class);

    @Autowired
    private OrganizationService organizationService;

    /**
     * 创建组织
     */
    @PostMapping
    @Operation(summary = "创建组织", description = "创建新的组织")
    public ResponseEntity<Map<String, Object>> createOrganization(@Valid @RequestBody Organization organization) {
        Map<String, Object> response = new HashMap<>();
        try {
            Organization createdOrganization = organizationService.createOrganization(organization);
            response.put("success", true);
            response.put("message", "组织创建成功");
            response.put("data", createdOrganization);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("创建组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "创建组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 更新组织
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新组织", description = "根据ID更新组织信息")
    public ResponseEntity<Map<String, Object>> updateOrganization(
            @Parameter(description = "组织ID") @PathVariable Long id,
            @Valid @RequestBody Organization organization) {
        Map<String, Object> response = new HashMap<>();
        try {
            Organization updatedOrganization = organizationService.updateOrganization(id, organization);
            response.put("success", true);
            response.put("message", "组织更新成功");
            response.put("data", updatedOrganization);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "更新组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 删除组织
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除组织", description = "根据ID删除组织")
    public ResponseEntity<Map<String, Object>> deleteOrganization(
            @Parameter(description = "组织ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            organizationService.deleteOrganization(id);
            response.put("success", true);
            response.put("message", "组织删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("删除组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "删除组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 根据ID获取组织
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取组织详情", description = "根据ID获取组织详细信息")
    public ResponseEntity<Map<String, Object>> getOrganizationById(
            @Parameter(description = "组织ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Organization> organization = organizationService.findById(id);
            if (organization.isPresent()) {
                response.put("success", true);
                response.put("data", organization.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "组织不存在");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            logger.error("获取组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 分页查询组织
     */
    @GetMapping
    @Operation(summary = "分页查询组织", description = "根据条件分页查询组织列表")
    public ResponseEntity<Map<String, Object>> getOrganizations(
            @Parameter(description = "页码，从0开始") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "排序字段") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "排序方向") @RequestParam(defaultValue = "asc") String sortDir,
            @Parameter(description = "组织名称（模糊查询）") @RequestParam(required = false) String name,
            @Parameter(description = "组织类型") @RequestParam(required = false) Integer type,
            @Parameter(description = "组织层级") @RequestParam(required = false) Integer level,
            @Parameter(description = "是否激活") @RequestParam(required = false) Boolean isActive) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<Organization> organizations = organizationService.findByConditions(name, type, level, isActive, pageable);
            
            response.put("success", true);
            response.put("data", organizations.getContent());
            response.put("totalElements", organizations.getTotalElements());
            response.put("totalPages", organizations.getTotalPages());
            response.put("currentPage", organizations.getNumber());
            response.put("pageSize", organizations.getSize());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("查询组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查询组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 根据编码查找组织
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "根据编码查找组织", description = "根据组织编码查找组织信息")
    public ResponseEntity<Map<String, Object>> getOrganizationByCode(
            @Parameter(description = "组织编码") @PathVariable String code) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Organization> organization = organizationService.findByCode(code);
            if (organization.isPresent()) {
                response.put("success", true);
                response.put("data", organization.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "组织不存在");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            logger.error("根据编码查找组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查找组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取组织树结构
     */
    @GetMapping("/tree")
    @Operation(summary = "获取组织树结构", description = "获取完整的组织树结构")
    public ResponseEntity<Map<String, Object>> getOrganizationTree() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> organizationTree = organizationService.getOrganizationTree();
            response.put("success", true);
            response.put("data", organizationTree);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取组织树失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取组织树失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 根据父组织ID查找子组织
     */
    @GetMapping("/parent/{parentId}/children")
    @Operation(summary = "查找子组织", description = "根据父组织ID查找直接子组织")
    public ResponseEntity<Map<String, Object>> getChildOrganizations(
            @Parameter(description = "父组织ID") @PathVariable Long parentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> childOrganizations = organizationService.findByParentId(parentId);
            response.put("success", true);
            response.put("data", childOrganizations);
            response.put("count", childOrganizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("查找子组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查找子组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取所有子组织（递归）
     */
    @GetMapping("/{id}/all-children")
    @Operation(summary = "获取所有子组织", description = "递归获取指定组织的所有子组织")
    public ResponseEntity<Map<String, Object>> getAllChildOrganizations(
            @Parameter(description = "组织ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> allChildOrganizations = organizationService.getAllChildOrganizations(id);
            response.put("success", true);
            response.put("data", allChildOrganizations);
            response.put("count", allChildOrganizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取所有子组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取所有子组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取所有父组织（递归）
     */
    @GetMapping("/{id}/all-parents")
    @Operation(summary = "获取所有父组织", description = "递归获取指定组织的所有父组织")
    public ResponseEntity<Map<String, Object>> getAllParentOrganizations(
            @Parameter(description = "组织ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> allParentOrganizations = organizationService.getAllParentOrganizations(id);
            response.put("success", true);
            response.put("data", allParentOrganizations);
            response.put("count", allParentOrganizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取所有父组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取所有父组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 根据类型查找组织
     */
    @GetMapping("/type/{type}")
    @Operation(summary = "根据类型查找组织", description = "根据组织类型查找组织列表")
    public ResponseEntity<Map<String, Object>> getOrganizationsByType(
            @Parameter(description = "组织类型") @PathVariable Integer type) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> organizations = organizationService.findByType(type);
            response.put("success", true);
            response.put("data", organizations);
            response.put("count", organizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("根据类型查找组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查找组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 根据层级查找组织
     */
    @GetMapping("/level/{level}")
    @Operation(summary = "根据层级查找组织", description = "根据组织层级查找组织列表")
    public ResponseEntity<Map<String, Object>> getOrganizationsByLevel(
            @Parameter(description = "组织层级") @PathVariable Integer level) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> organizations = organizationService.findByLevel(level);
            response.put("success", true);
            response.put("data", organizations);
            response.put("count", organizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("根据层级查找组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "查找组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 激活组织
     */
    @PutMapping("/{id}/activate")
    @Operation(summary = "激活组织", description = "激活指定ID的组织")
    public ResponseEntity<Map<String, Object>> activateOrganization(
            @Parameter(description = "组织ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            organizationService.activateOrganization(id);
            response.put("success", true);
            response.put("message", "组织激活成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("激活组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "激活组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 停用组织
     */
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "停用组织", description = "停用指定ID的组织")
    public ResponseEntity<Map<String, Object>> deactivateOrganization(
            @Parameter(description = "组织ID") @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            organizationService.deactivateOrganization(id);
            response.put("success", true);
            response.put("message", "组织停用成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("停用组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "停用组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 移动组织
     */
    @PutMapping("/{id}/move")
    @Operation(summary = "移动组织", description = "将组织移动到新的父组织下")
    public ResponseEntity<Map<String, Object>> moveOrganization(
            @Parameter(description = "组织ID") @PathVariable Long id,
            @RequestBody Map<String, Object> moveData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long newParentId = moveData.get("newParentId") != null ? 
                Long.valueOf(moveData.get("newParentId").toString()) : null;
            
            organizationService.moveOrganization(id, newParentId);
            response.put("success", true);
            response.put("message", "组织移动成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("移动组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "移动组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 设置组织书记
     */
    @PutMapping("/{id}/secretary")
    @Operation(summary = "设置组织书记", description = "为组织设置书记")
    public ResponseEntity<Map<String, Object>> setOrganizationSecretary(
            @Parameter(description = "组织ID") @PathVariable Long id,
            @RequestBody Map<String, Object> secretaryData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long secretaryId = Long.valueOf(secretaryData.get("secretaryId").toString());
            
            organizationService.setOrganizationSecretary(id, secretaryId);
            response.put("success", true);
            response.put("message", "组织书记设置成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("设置组织书记失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "设置组织书记失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 批量创建组织
     */
    @PostMapping("/batch")
    @Operation(summary = "批量创建组织", description = "批量创建多个组织")
    public ResponseEntity<Map<String, Object>> batchCreateOrganizations(
            @Valid @RequestBody List<Organization> organizations) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> createdOrganizations = organizationService.batchCreateOrganizations(organizations);
            response.put("success", true);
            response.put("message", "批量创建组织完成");
            response.put("data", createdOrganizations);
            response.put("successCount", createdOrganizations.size());
            response.put("totalCount", organizations.size());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("批量创建组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "批量创建组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 获取组织统计信息
     */
    @GetMapping("/statistics")
    @Operation(summary = "获取组织统计信息", description = "获取组织相关的统计数据")
    public ResponseEntity<Map<String, Object>> getOrganizationStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Object statistics = organizationService.getOrganizationStatistics();
            response.put("success", true);
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取组织统计信息失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取统计信息失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 搜索组织
     */
    @GetMapping("/search")
    @Operation(summary = "搜索组织", description = "根据组织名称模糊搜索组织")
    public ResponseEntity<Map<String, Object>> searchOrganizations(
            @Parameter(description = "搜索关键词") @RequestParam String keyword) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> organizations = organizationService.findByNameContaining(keyword);
            response.put("success", true);
            response.put("data", organizations);
            response.put("count", organizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("搜索组织失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "搜索组织失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取根组织列表
     */
    @GetMapping("/roots")
    @Operation(summary = "获取根组织列表", description = "获取所有根组织（没有父组织的组织）")
    public ResponseEntity<Map<String, Object>> getRootOrganizations() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> rootOrganizations = organizationService.findRootOrganizations();
            response.put("success", true);
            response.put("data", rootOrganizations);
            response.put("count", rootOrganizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取根组织列表失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取根组织列表失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 获取叶子组织列表
     */
    @GetMapping("/leaves")
    @Operation(summary = "获取叶子组织列表", description = "获取所有叶子组织（没有子组织的组织）")
    public ResponseEntity<Map<String, Object>> getLeafOrganizations() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Organization> leafOrganizations = organizationService.findLeafOrganizations();
            response.put("success", true);
            response.put("data", leafOrganizations);
            response.put("count", leafOrganizations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取叶子组织列表失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "获取叶子组织列表失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}