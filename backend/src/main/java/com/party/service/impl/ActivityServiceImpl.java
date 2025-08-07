package com.party.service.impl;

import com.party.entity.Activity;
import com.party.repository.ActivityRepository;
import com.party.service.ActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 活动服务实现类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Service
@Transactional
public class ActivityServiceImpl implements ActivityService {

    private static final Logger logger = LoggerFactory.getLogger(ActivityServiceImpl.class);

    @Autowired
    private ActivityRepository activityRepository;

    @Override
    public Activity createActivity(Activity activity) {
        logger.info("创建活动: {}", activity.getTitle());
        
        // 设置默认值
        if (activity.getStatus() == null) {
            activity.setStatus(1); // 默认为计划中
        }
        if (activity.getIsRequired() == null) {
            activity.setIsRequired(false);
        }
        
        return activityRepository.save(activity);
    }

    @Override
    public Activity updateActivity(Activity activity) {
        logger.info("更新活动: {}", activity.getId());
        
        if (!activityRepository.existsById(activity.getId())) {
            throw new RuntimeException("活动不存在");
        }
        
        return activityRepository.save(activity);
    }

    @Override
    public void deleteActivity(Long id) {
        logger.info("删除活动: {}", id);
        
        if (!activityRepository.existsById(id)) {
            throw new RuntimeException("活动不存在");
        }
        
        activityRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Activity> findById(Long id) {
        return activityRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Activity> findAll(Pageable pageable) {
        return activityRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Activity> findByConditions(String title, Integer type, Integer status, 
                                          Long organizationId, LocalDateTime startTime, 
                                          LocalDateTime endTime, Pageable pageable) {
        
        Specification<Activity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // 标题模糊查询
            if (StringUtils.hasText(title)) {
                predicates.add(criteriaBuilder.like(root.get("title"), "%" + title + "%"));
            }
            
            // 活动类型
            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }
            
            // 活动状态
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            
            // 组织ID
            if (organizationId != null) {
                predicates.add(criteriaBuilder.equal(root.get("organizationId"), organizationId));
            }
            
            // 开始时间范围
            if (startTime != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startTime"), startTime));
            }
            
            // 结束时间范围
            if (endTime != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endTime"), endTime));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        return activityRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Activity> findByOrganizationId(Long organizationId) {
        return activityRepository.findByOrganizationId(organizationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Activity> findByOrganizerId(Long organizerId) {
        return activityRepository.findByOrganizerId(organizerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Activity> findUpcomingActivities(int limit) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureTime = now.plusDays(7); // 未来7天内
        
        List<Activity> activities = activityRepository.findUpcomingActivities(now, futureTime);
        
        // 限制返回数量
        if (activities.size() > limit) {
            return activities.subList(0, limit);
        }
        
        return activities;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Activity> findRecentActivities(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Activity> page = activityRepository.findAll(pageable);
        return page.getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByOrganizationId(Long organizationId) {
        return activityRepository.countByOrganizationId(organizationId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByStatus(Integer status) {
        return activityRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTitle(String title) {
        return !activityRepository.findByTitleContaining(title).isEmpty();
    }

    @Override
    public void batchDeleteActivities(List<Long> ids) {
        logger.info("批量删除活动: {}", ids);
        
        for (Long id : ids) {
            if (activityRepository.existsById(id)) {
                activityRepository.deleteById(id);
            }
        }
    }

    @Override
    public void updateActivityStatus(Long id, Integer status) {
        logger.info("更新活动状态: {} -> {}", id, status);
        
        Optional<Activity> activityOpt = activityRepository.findById(id);
        if (activityOpt.isPresent()) {
            Activity activity = activityOpt.get();
            activity.setStatus(status);
            activityRepository.save(activity);
        } else {
            throw new RuntimeException("活动不存在");
        }
    }
}