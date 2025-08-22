package com.party.service;

import com.party.entity.Activity;
import com.party.repository.ActivityRepository;
import com.party.service.impl.ActivityServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 活动服务测试类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @InjectMocks
    private ActivityServiceImpl activityService;

    private Activity testActivity;

    @BeforeEach
    void setUp() {
        testActivity = new Activity();
        testActivity.setId(1L);
        testActivity.setTitle("党史学习教育专题讲座");
        testActivity.setType(4); // 党课
        testActivity.setContent("深入学习党的百年奋斗历程");
        testActivity.setLocation("会议室A");
        testActivity.setStartTime(LocalDateTime.now().plusDays(1));
        testActivity.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
        testActivity.setOrganizerId(1L);
        testActivity.setOrganizationId(1L);
        testActivity.setStatus(1); // 计划中
        testActivity.setMaxParticipants(50);
        testActivity.setIsRequired(false);
        testActivity.setCreatedAt(LocalDateTime.now());
        testActivity.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testCreateActivity() {
        // Given
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        // When
        Activity result = activityService.createActivity(testActivity);

        // Then
        assertNotNull(result);
        assertEquals(testActivity.getTitle(), result.getTitle());
        assertEquals(1, result.getStatus()); // 默认状态为计划中
        assertEquals(false, result.getIsRequired()); // 默认非必须参加
        verify(activityRepository).save(any(Activity.class));
    }

    @Test
    void testCreateActivityWithDefaults() {
        // Given
        Activity newActivity = new Activity();
        newActivity.setTitle("测试活动");
        newActivity.setType(1);
        // 不设置status和isRequired，测试默认值
        
        when(activityRepository.save(any(Activity.class))).thenReturn(newActivity);

        // When
        Activity result = activityService.createActivity(newActivity);

        // Then
        assertNotNull(result);
        verify(activityRepository).save(any(Activity.class));
    }

    @Test
    void testUpdateActivity() {
        // Given
        when(activityRepository.existsById(testActivity.getId())).thenReturn(true);
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        // When
        Activity result = activityService.updateActivity(testActivity);

        // Then
        assertNotNull(result);
        assertEquals(testActivity.getId(), result.getId());
        verify(activityRepository).save(testActivity);
    }

    @Test
    void testUpdateNonExistentActivity() {
        // Given
        when(activityRepository.existsById(testActivity.getId())).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> activityService.updateActivity(testActivity));
        verify(activityRepository, never()).save(any(Activity.class));
    }

    @Test
    void testDeleteActivity() {
        // Given
        when(activityRepository.existsById(testActivity.getId())).thenReturn(true);

        // When
        activityService.deleteActivity(testActivity.getId());

        // Then
        verify(activityRepository).deleteById(testActivity.getId());
    }

    @Test
    void testDeleteNonExistentActivity() {
        // Given
        when(activityRepository.existsById(testActivity.getId())).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> activityService.deleteActivity(testActivity.getId()));
        verify(activityRepository, never()).deleteById(any());
    }

    @Test
    void testFindById() {
        // Given
        when(activityRepository.findById(testActivity.getId())).thenReturn(Optional.of(testActivity));

        // When
        Optional<Activity> result = activityService.findById(testActivity.getId());

        // Then
        assertTrue(result.isPresent());
        assertEquals(testActivity.getId(), result.get().getId());
    }

    @Test
    void testFindAll() {
        // Given
        List<Activity> activities = Arrays.asList(testActivity);
        Page<Activity> activityPage = new PageImpl<>(activities);
        Pageable pageable = PageRequest.of(0, 10);
        when(activityRepository.findAll(pageable)).thenReturn(activityPage);

        // When
        Page<Activity> result = activityService.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testActivity.getId(), result.getContent().get(0).getId());
    }

    @Test
    void testFindByConditions() {
        // Given
        List<Activity> activities = Arrays.asList(testActivity);
        Page<Activity> activityPage = new PageImpl<>(activities);
        Pageable pageable = PageRequest.of(0, 10);
        when(activityRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(activityPage);

        // When
        Page<Activity> result = activityService.findByConditions(
            "党史", 4, 1, 1L, 
            LocalDateTime.now(), LocalDateTime.now().plusDays(7), 
            pageable
        );

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(activityRepository).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    void testFindByOrganizationId() {
        // Given
        List<Activity> activities = Arrays.asList(testActivity);
        when(activityRepository.findByOrganizationId(1L)).thenReturn(activities);

        // When
        List<Activity> result = activityService.findByOrganizationId(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testActivity.getId(), result.get(0).getId());
    }

    @Test
    void testFindByOrganizerId() {
        // Given
        List<Activity> activities = Arrays.asList(testActivity);
        when(activityRepository.findByOrganizerId(1L)).thenReturn(activities);

        // When
        List<Activity> result = activityService.findByOrganizerId(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testActivity.getId(), result.get(0).getId());
    }

    @Test
    void testFindUpcomingActivities() {
        // Given
        List<Activity> activities = Arrays.asList(testActivity);
        when(activityRepository.findUpcomingActivities(any(LocalDateTime.class), any(LocalDateTime.class)))
            .thenReturn(activities);

        // When
        List<Activity> result = activityService.findUpcomingActivities(5);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(activityRepository).findUpcomingActivities(any(LocalDateTime.class), any(LocalDateTime.class));
    }


    @Test
    void testCountByOrganizationId() {
        // Given
        when(activityRepository.countByOrganizationId(1L)).thenReturn(5L);

        // When
        Long result = activityService.countByOrganizationId(1L);

        // Then
        assertEquals(5L, result);
    }

    @Test
    void testCountByStatus() {
        // Given
        when(activityRepository.countByStatus(1)).thenReturn(3L);

        // When
        Long result = activityService.countByStatus(1);

        // Then
        assertEquals(3L, result);
    }


    @Test
    void testBatchDeleteActivities() {
        // Given
        List<Long> ids = Arrays.asList(1L, 2L, 3L);
        when(activityRepository.existsById(1L)).thenReturn(true);
        when(activityRepository.existsById(2L)).thenReturn(true);
        when(activityRepository.existsById(3L)).thenReturn(false);

        // When
        activityService.batchDeleteActivities(ids);

        // Then
        verify(activityRepository).deleteById(1L);
        verify(activityRepository).deleteById(2L);
        verify(activityRepository, never()).deleteById(3L); // 不存在的不删除
    }

    @Test
    void testUpdateActivityStatus() {
        // Given
        when(activityRepository.findById(testActivity.getId())).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        // When
        activityService.updateActivityStatus(testActivity.getId(), 2);

        // Then
        verify(activityRepository).save(any(Activity.class));
    }

    @Test
    void testUpdateActivityStatusNotFound() {
        // Given
        when(activityRepository.findById(testActivity.getId())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            activityService.updateActivityStatus(testActivity.getId(), 2));
        verify(activityRepository, never()).save(any(Activity.class));
    }
}