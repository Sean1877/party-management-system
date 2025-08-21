package com.party.service.impl;

import com.party.entity.Activity;
import com.party.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 活动服务实现类 - 测试用简化版本
 */
@Service
public class ActivityServiceImpl {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    public Activity createActivity(Activity activity) {
        if (activity.getStatus() == null) {
            activity.setStatus(1); // 默认状态为计划中
        }
        if (activity.getIsRequired() == null) {
            activity.setIsRequired(false); // 默认非必须参加
        }
        activity.setCreatedAt(LocalDateTime.now());
        activity.setUpdatedAt(LocalDateTime.now());
        return activityRepository.save(activity);
    }
    
    public Activity updateActivity(Activity activity) {
        if (!activityRepository.existsById(activity.getId())) {
            throw new RuntimeException("Activity not found with id: " + activity.getId());
        }
        activity.setUpdatedAt(LocalDateTime.now());
        return activityRepository.save(activity);
    }
    
    public void deleteActivity(Long id) {
        if (!activityRepository.existsById(id)) {
            throw new RuntimeException("Activity not found with id: " + id);
        }
        activityRepository.deleteById(id);
    }
    
    public Optional<Activity> findById(Long id) {
        return activityRepository.findById(id);
    }
    
    public Page<Activity> findAll(Pageable pageable) {
        return activityRepository.findAll(pageable);
    }
    
    public List<Activity> findByOrganizationId(Long organizationId) {
        return activityRepository.findByOrganizationId(organizationId);
    }
    
    public List<Activity> findByOrganizerId(Long organizerId) {
        return activityRepository.findByOrganizerId(organizerId);
    }
    
    public List<Activity> findByStatus(Integer status) {
        return activityRepository.findByStatus(status);
    }
    
    public List<Activity> findByType(Integer type) {
        return activityRepository.findByType(type);
    }
    
    public Page<Activity> findByConditions(String keyword, Integer type, Integer status, 
                                          Long organizationId, LocalDateTime startTime, 
                                          LocalDateTime endTime, Pageable pageable) {
        Specification<Activity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (keyword != null && !keyword.trim().isEmpty()) {
                Predicate titlePredicate = criteriaBuilder.like(root.get("title"), "%" + keyword + "%");
                Predicate contentPredicate = criteriaBuilder.like(root.get("content"), "%" + keyword + "%");
                predicates.add(criteriaBuilder.or(titlePredicate, contentPredicate));
            }
            
            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }
            
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            
            if (organizationId != null) {
                predicates.add(criteriaBuilder.equal(root.get("organizationId"), organizationId));
            }
            
            if (startTime != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startTime"), startTime));
            }
            
            if (endTime != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endTime"), endTime));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        return activityRepository.findAll(spec, pageable);
    }
    
    public List<Activity> findByTitleContaining(String title) {
        return activityRepository.findByTitleContaining(title);
    }
    
    public boolean existsByTitle(String title) {
        return activityRepository.existsByTitle(title);
    }
    
    public void batchDeleteActivities(List<Long> ids) {
        for (Long id : ids) {
            if (activityRepository.existsById(id)) {
                activityRepository.deleteById(id);
            }
        }
    }
    
    public Activity updateActivityStatus(Long id, int status) {
        Optional<Activity> activityOpt = activityRepository.findById(id);
        if (activityOpt.isPresent()) {
            Activity activity = activityOpt.get();
            activity.setStatus(status);
            activity.setUpdatedAt(LocalDateTime.now());
            return activityRepository.save(activity);
        }
        throw new RuntimeException("Activity not found with id: " + id);
    }
    
    public long countByOrganizationId(Long organizationId) {
        return activityRepository.countByOrganizationId(organizationId);
    }
    
    public long countByStatus(Integer status) {
        return activityRepository.countByStatus(status);
    }
    
    public List<Activity> findRecentActivities(int limit) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Pageable pageable = PageRequest.of(0, limit);
        return activityRepository.findRecentActivities(oneWeekAgo, pageable);
    }
    
    public List<Activity> findUpcomingActivities(int limit) {
        LocalDateTime now = LocalDateTime.now();
        Pageable pageable = PageRequest.of(0, limit);
        return activityRepository.findUpcomingActivities(now, pageable);
    }
}