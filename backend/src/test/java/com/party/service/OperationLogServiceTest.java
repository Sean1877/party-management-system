package com.party.service;

import com.party.entity.OperationLog;
import com.party.repository.OperationLogRepository;
import com.party.service.impl.OperationLogServiceImpl;
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

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OperationLogServiceTest {

    @Mock
    private OperationLogRepository operationLogRepository;

    @InjectMocks
    private OperationLogServiceImpl operationLogService;

    private OperationLog testOperationLog;

    @BeforeEach
    void setUp() {
        testOperationLog = new OperationLog();
        testOperationLog.setId(1L);
        testOperationLog.setUserId(1L);
        testOperationLog.setUsername("testuser");
        testOperationLog.setOperationType("CREATE");
        testOperationLog.setOperationModule("USER");
        testOperationLog.setSuccess(true);
        testOperationLog.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testFindById() {
        // Given
        when(operationLogRepository.findById(1L)).thenReturn(Optional.of(testOperationLog));

        // When
        OperationLog result = operationLogService.findById(1L);

        // Then
        assertNotNull(result);
        assertEquals(testOperationLog.getId(), result.getId());
        verify(operationLogRepository).findById(1L);
    }

    @Test
    void testFindAll() {
        // Given
        List<OperationLog> logs = Arrays.asList(testOperationLog);
        Pageable pageable = PageRequest.of(0, 10);
        Page<OperationLog> page = new PageImpl<>(logs, pageable, 1);
        when(operationLogRepository.findAll(any(Pageable.class))).thenReturn(page);

        // When
        Page<OperationLog> result = operationLogService.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(operationLogRepository).findAll(pageable);
    }

    @Test
    void testFindByUserId() {
        // Given
        List<OperationLog> logs = Arrays.asList(testOperationLog);
        Pageable pageable = PageRequest.of(0, 10);
        Page<OperationLog> page = new PageImpl<>(logs, pageable, 1);
        when(operationLogRepository.findByUserId(1L, pageable)).thenReturn(page);

        // When
        Page<OperationLog> result = operationLogService.findByUserId(1L, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(operationLogRepository).findByUserId(1L, pageable);
    }

    @Test
    void testCountByUserId() {
        // Given
        when(operationLogRepository.countByUserId(1L)).thenReturn(5L);

        // When
        Long result = operationLogService.countByUserId(1L);

        // Then
        assertEquals(5L, result);
        verify(operationLogRepository).countByUserId(1L);
    }

    @Test
    void testDeleteById() {
        // When
        operationLogService.deleteById(1L);

        // Then
        verify(operationLogRepository).deleteById(1L);
    }
}