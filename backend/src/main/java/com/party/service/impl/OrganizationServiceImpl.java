package com.party.service.impl;

import com.party.entity.Organization;
import com.party.repository.OrganizationRepository;
import com.party.service.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 组织服务实现类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private static final Logger logger = LoggerFactory.getLogger(OrganizationServiceImpl.class);

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public Organization createOrganization(Organization organization) {
        logger.info("创建组织: {}", organization.getName());
        
        // 验证组织编码唯一性
        if (StringUtils.hasText(organization.getCode()) && existsByCode(organization.getCode())) {
            throw new RuntimeException("组织编码已存在: " + organization.getCode());
        }
        
        // 验证父组织存在性
        if (organization.getParentId() != null) {
            Optional<Organization> parentOrg = organizationRepository.findById(organization.getParentId());
            if (!parentOrg.isPresent()) {
                throw new RuntimeException("父组织不存在: ID=" + organization.getParentId());
            }
            
            // 设置层级（父组织层级+1）
            organization.setLevel(parentOrg.get().getLevel() + 1);
        } else {
            // 根组织层级为1
            organization.setLevel(1);
        }
        
        // 设置默认值
        if (organization.getIsActive() == null) {
            organization.setIsActive(true);
        }
        if (organization.getType() == null) {
            organization.setType(1); // 默认为党支部
        }
        
        Organization savedOrganization = organizationRepository.save(organization);
        logger.info("组织创建成功: ID={}, 名称={}", savedOrganization.getId(), savedOrganization.getName());
        return savedOrganization;
    }

    @Override
    public Organization updateOrganization(Long id, Organization organization) {
        logger.info("更新组织: ID={}", id);
        
        Organization existingOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("组织不存在: ID=" + id));
        
        // 验证组织编码唯一性（排除当前组织）
        if (StringUtils.hasText(organization.getCode()) && 
            !organization.getCode().equals(existingOrganization.getCode()) && 
            existsByCode(organization.getCode())) {
            throw new RuntimeException("组织编码已存在: " + organization.getCode());
        }
        
        // 验证父组织变更的合法性
        if (organization.getParentId() != null && 
            !Objects.equals(organization.getParentId(), existingOrganization.getParentId())) {
            
            // 不能将组织设置为自己的子组织
            if (!validateOrganizationHierarchy(id, organization.getParentId())) {
                throw new RuntimeException("不能将组织设置为自己的子组织");
            }
            
            // 验证新父组织存在性
            Optional<Organization> newParentOrg = organizationRepository.findById(organization.getParentId());
            if (!newParentOrg.isPresent()) {
                throw new RuntimeException("新父组织不存在: ID=" + organization.getParentId());
            }
            
            // 更新层级
            organization.setLevel(newParentOrg.get().getLevel() + 1);
        }
        
        // 更新字段
        if (StringUtils.hasText(organization.getName())) {
            existingOrganization.setName(organization.getName());
        }
        if (StringUtils.hasText(organization.getCode())) {
            existingOrganization.setCode(organization.getCode());
        }
        if (organization.getType() != null) {
            existingOrganization.setType(organization.getType());
        }
        if (organization.getParentId() != null) {
            existingOrganization.setParentId(organization.getParentId());
            existingOrganization.setLevel(organization.getLevel());
        }
        if (organization.getSecretaryId() != null) {
            existingOrganization.setSecretaryId(organization.getSecretaryId());
        }
        if (StringUtils.hasText(organization.getDescription())) {
            existingOrganization.setDescription(organization.getDescription());
        }
        if (StringUtils.hasText(organization.getAddress())) {
            existingOrganization.setAddress(organization.getAddress());
        }
        if (StringUtils.hasText(organization.getContactPhone())) {
            existingOrganization.setContactPhone(organization.getContactPhone());
        }
        if (organization.getEstablishedDate() != null) {
            existingOrganization.setEstablishedDate(organization.getEstablishedDate());
        }
        if (organization.getIsActive() != null) {
            existingOrganization.setIsActive(organization.getIsActive());
        }
        
        Organization updatedOrganization = organizationRepository.save(existingOrganization);
        
        // 如果层级发生变化，需要更新所有子组织的层级
        if (organization.getLevel() != null && !organization.getLevel().equals(existingOrganization.getLevel())) {
            updateChildOrganizationsLevel(id);
        }
        
        logger.info("组织更新成功: ID={}, 名称={}", updatedOrganization.getId(), updatedOrganization.getName());
        return updatedOrganization;
    }

    @Override
    public void deleteOrganization(Long id) {
        logger.info("删除组织: ID={}", id);
        
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("组织不存在: ID=" + id));
        
        // 检查是否有子组织
        List<Organization> childOrganizations = organizationRepository.findByParentId(id);
        if (!childOrganizations.isEmpty()) {
            throw new RuntimeException("该组织下还有子组织，无法删除");
        }
        
        // 检查是否有成员
        if (organization.getMemberCount() > 0) {
            throw new RuntimeException("该组织下还有成员，无法删除");
        }
        
        organizationRepository.deleteById(id);
        logger.info("组织删除成功: ID={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Organization> findById(Long id) {
        return organizationRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Organization> findByCode(String code) {
        return organizationRepository.findByCode(code);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findAll() {
        return organizationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Organization> findAll(Pageable pageable) {
        return organizationRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Organization> findByConditions(String name, Integer type, Integer level, 
                                              Boolean isActive, Pageable pageable) {
        return organizationRepository.findByConditions(name, type, level, isActive, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findByParentId(Long parentId) {
        return organizationRepository.findByParentId(parentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findByType(Integer type) {
        return organizationRepository.findByType(type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findByLevel(Integer level) {
        return organizationRepository.findByLevel(level);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findBySecretaryId(Long secretaryId) {
        return organizationRepository.findBySecretaryId(secretaryId);
    }

    @Override
    public void activateOrganization(Long id) {
        logger.info("激活组织: ID={}", id);
        
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("组织不存在: ID=" + id));
        
        organization.setIsActive(true);
        organizationRepository.save(organization);
        
        logger.info("组织激活成功: ID={}", id);
    }

    @Override
    public void deactivateOrganization(Long id) {
        logger.info("停用组织: ID={}", id);
        
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("组织不存在: ID=" + id));
        
        organization.setIsActive(false);
        organizationRepository.save(organization);
        
        logger.info("组织停用成功: ID={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return organizationRepository.existsByCode(code);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findByNameContaining(String name) {
        return organizationRepository.findByNameContaining(name);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> getOrganizationTree() {
        List<Organization> allOrganizations = organizationRepository.findAll();
        return buildOrganizationTree(allOrganizations, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> getAllChildOrganizations(Long organizationId) {
        return organizationRepository.findAllChildOrganizations(organizationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> getAllParentOrganizations(Long organizationId) {
        return organizationRepository.findAllParentOrganizations(organizationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> countByType() {
        return organizationRepository.countByType();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> countByLevel() {
        return organizationRepository.countByLevel();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findOrganizationsWithMembers() {
        return organizationRepository.findOrganizationsWithMembers();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findOrganizationsWithoutMembers() {
        return organizationRepository.findOrganizationsWithoutMembers();
    }

    @Override
    public List<Organization> batchCreateOrganizations(List<Organization> organizations) {
        logger.info("批量创建组织: 数量={}", organizations.size());
        
        List<Organization> createdOrganizations = new ArrayList<>();
        for (Organization organization : organizations) {
            try {
                Organization createdOrganization = createOrganization(organization);
                createdOrganizations.add(createdOrganization);
            } catch (Exception e) {
                logger.error("批量创建组织失败: 名称={}, 错误={}", organization.getName(), e.getMessage());
                // 继续处理其他组织
            }
        }
        
        logger.info("批量创建组织完成: 成功={}, 总数={}", createdOrganizations.size(), organizations.size());
        return createdOrganizations;
    }

    @Override
    public List<Organization> batchUpdateOrganizations(List<Organization> organizations) {
        logger.info("批量更新组织: 数量={}", organizations.size());
        
        List<Organization> updatedOrganizations = new ArrayList<>();
        for (Organization organization : organizations) {
            try {
                Organization updatedOrganization = updateOrganization(organization.getId(), organization);
                updatedOrganizations.add(updatedOrganization);
            } catch (Exception e) {
                logger.error("批量更新组织失败: ID={}, 错误={}", organization.getId(), e.getMessage());
                // 继续处理其他组织
            }
        }
        
        logger.info("批量更新组织完成: 成功={}, 总数={}", updatedOrganizations.size(), organizations.size());
        return updatedOrganizations;
    }

    @Override
    public void batchDeleteOrganizations(List<Long> organizationIds) {
        logger.info("批量删除组织: 数量={}", organizationIds.size());
        
        int successCount = 0;
        for (Long organizationId : organizationIds) {
            try {
                deleteOrganization(organizationId);
                successCount++;
            } catch (Exception e) {
                logger.error("批量删除组织失败: ID={}, 错误={}", organizationId, e.getMessage());
                // 继续处理其他组织
            }
        }
        
        logger.info("批量删除组织完成: 成功={}, 总数={}", successCount, organizationIds.size());
    }

    @Override
    public void moveOrganization(Long organizationId, Long newParentId) {
        logger.info("移动组织: ID={}, 新父组织ID={}", organizationId, newParentId);
        
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("组织不存在: ID=" + organizationId));
        
        // 验证层级结构
        if (!validateOrganizationHierarchy(organizationId, newParentId)) {
            throw new RuntimeException("不能将组织移动到自己的子组织下");
        }
        
        // 计算新层级
        Integer newLevel;
        if (newParentId == null) {
            newLevel = 1; // 根组织
        } else {
            Organization newParent = organizationRepository.findById(newParentId)
                    .orElseThrow(() -> new RuntimeException("新父组织不存在: ID=" + newParentId));
            newLevel = newParent.getLevel() + 1;
        }
        
        organization.setParentId(newParentId);
        organization.setLevel(newLevel);
        organizationRepository.save(organization);
        
        // 更新所有子组织的层级
        updateChildOrganizationsLevel(organizationId);
        
        logger.info("组织移动成功: ID={}", organizationId);
    }

    @Override
    public void setOrganizationSecretary(Long organizationId, Long secretaryId) {
        logger.info("设置组织书记: 组织ID={}, 书记ID={}", organizationId, secretaryId);
        
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("组织不存在: ID=" + organizationId));
        
        organization.setSecretaryId(secretaryId);
        organizationRepository.save(organization);
        
        logger.info("组织书记设置成功: 组织ID={}, 书记ID={}", organizationId, secretaryId);
    }

    @Override
    @Transactional(readOnly = true)
    public Object getOrganizationStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总组织数
        long totalOrganizations = organizationRepository.count();
        statistics.put("totalOrganizations", totalOrganizations);
        
        // 激活组织数
        long activeOrganizations = organizationRepository.findByIsActive(true).size();
        statistics.put("activeOrganizations", activeOrganizations);
        
        // 各类型组织统计
        List<Object[]> typeStats = organizationRepository.countByType();
        Map<String, Long> typeStatsMap = new HashMap<>();
        for (Object[] stat : typeStats) {
            Integer type = (Integer) stat[0];
            Long count = (Long) stat[1];
            String typeText = getOrganizationTypeText(type);
            typeStatsMap.put(typeText, count);
        }
        statistics.put("typeStats", typeStatsMap);
        
        // 各层级组织统计
        List<Object[]> levelStats = organizationRepository.countByLevel();
        Map<String, Long> levelStatsMap = new HashMap<>();
        for (Object[] stat : levelStats) {
            Integer level = (Integer) stat[0];
            Long count = (Long) stat[1];
            levelStatsMap.put("第" + level + "级", count);
        }
        statistics.put("levelStats", levelStatsMap);
        
        // 有成员的组织数
        long organizationsWithMembers = organizationRepository.findOrganizationsWithMembers().size();
        statistics.put("organizationsWithMembers", organizationsWithMembers);
        
        // 没有成员的组织数
        long organizationsWithoutMembers = organizationRepository.findOrganizationsWithoutMembers().size();
        statistics.put("organizationsWithoutMembers", organizationsWithoutMembers);
        
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findByIdIn(List<Long> organizationIds) {
        return organizationRepository.findByIdIn(organizationIds);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateOrganizationHierarchy(Long organizationId, Long parentId) {
        if (parentId == null) {
            return true; // 设置为根组织总是有效的
        }
        
        if (organizationId.equals(parentId)) {
            return false; // 不能设置自己为父组织
        }
        
        // 检查是否会形成循环引用
        List<Organization> childOrganizations = getAllChildOrganizations(organizationId);
        return childOrganizations.stream().noneMatch(child -> child.getId().equals(parentId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findRootOrganizations() {
        return organizationRepository.findByParentIdIsNull();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> findLeafOrganizations() {
        List<Organization> allOrganizations = organizationRepository.findAll();
        return allOrganizations.stream()
                .filter(org -> !org.hasChildren())
                .collect(Collectors.toList());
    }

    /**
     * 构建组织树结构
     */
    private List<Organization> buildOrganizationTree(List<Organization> allOrganizations, Long parentId) {
        return allOrganizations.stream()
                .filter(org -> Objects.equals(org.getParentId(), parentId))
                .peek(org -> {
                    List<Organization> children = buildOrganizationTree(allOrganizations, org.getId());
                    org.setChildOrganizations(children);
                })
                .collect(Collectors.toList());
    }

    /**
     * 更新子组织层级
     */
    private void updateChildOrganizationsLevel(Long parentId) {
        List<Organization> childOrganizations = organizationRepository.findByParentId(parentId);
        Organization parent = organizationRepository.findById(parentId).orElse(null);
        
        if (parent != null) {
            for (Organization child : childOrganizations) {
                child.setLevel(parent.getLevel() + 1);
                organizationRepository.save(child);
                // 递归更新子组织的子组织
                updateChildOrganizationsLevel(child.getId());
            }
        }
    }

    /**
     * 获取组织类型文本
     */
    private String getOrganizationTypeText(Integer type) {
        if (type == null) return "未知";
        switch (type) {
            case 1: return "党支部";
            case 2: return "党总支";
            case 3: return "党委";
            case 4: return "党工委";
            default: return "未知";
        }
    }
}