package com.party.repository;

import com.party.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 活动Repository接口 - 测试用简化版本
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long>, JpaSpecificationExecutor<Activity> {
    
    List<Activity> findByOrganizationId(Long organizationId);
    
    List<Activity> findByOrganizerId(Long organizerId);
    
    List<Activity> findByStatus(Integer status);
    
    List<Activity> findByType(Integer type);
    
    @Query("SELECT a FROM Activity a WHERE a.startTime >= :startTime AND a.endTime <= :endTime")
    List<Activity> findByTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT a FROM Activity a WHERE a.title LIKE %:keyword% OR a.content LIKE %:keyword%")
    List<Activity> findByKeyword(@Param("keyword") String keyword);
    
    List<Activity> findByTitleContaining(String title);
    
    boolean existsByTitle(String title);
    
    long countByOrganizationId(Long organizationId);
    
    long countByStatus(Integer status);
    
    @Query("SELECT a FROM Activity a WHERE a.createdAt >= :date ORDER BY a.createdAt DESC")
    List<Activity> findRecentActivities(@Param("date") LocalDateTime date, Pageable pageable);
    
    @Query("SELECT a FROM Activity a WHERE a.startTime > :currentTime ORDER BY a.startTime ASC")
    List<Activity> findUpcomingActivities(@Param("currentTime") LocalDateTime currentTime, Pageable pageable);
    
    Page<Activity> findAll(Specification<Activity> spec, Pageable pageable);
}