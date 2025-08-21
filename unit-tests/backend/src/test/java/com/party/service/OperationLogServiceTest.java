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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 操作日志服务测试类
 */
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
        testOperationLog.setOperationModule("USER_MANAGEMENT");
        testOperationLog.setOperationDescription("创建新用户");
        testOperationLog.setRequestMethod("POST");
        testOperationLog.setRequestUrl("/api/users");
        testOperationLog.setRequestParams("{\"username\":\"newuser\"}");
        testOperationLog.setResponseStatus(200);
        testOperationLog.setExecutionTime(150L);
        testOperationLog.setIpAddress("192.168.1.100");
        testOperationLog.setUserAgent("Mozilla/5.0");
        testOperationLog.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testFindAll() {
        // Given
        List<OperationLog> logs = Arrays.asList(testOperationLog);
        when(operationLogRepository.findAll()).thenReturn(logs);

        // When
        List<OperationLog> result = operationLogService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testOperationLog.getOperationType(), result.get(0).getOperationType());
        verify(operationLogRepository, times(1)).findAll();
    }

    @Test
    void testFindById() {
        // Given
        when(operationLogRepository.findById(1L)).thenReturn(Optional.of(testOperationLog));

        // When
        Optional<OperationLog> result = operationLogService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testOperationLog.getOperationType(), result.get().getOperationType());
        verify(operationLogRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        when(operationLogRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<OperationLog> result = operationLogService.findById(999L);

        // Then
        assertFalse(result.isPresent());
        verify(operationLogRepository, times(1)).findById(999L);
    }

    @Test
    void testFindByUserId() {
        // Given
        List<OperationLog> userLogs = Arrays.asList(testOperationLog);
        when(operationLogRepository.findByUserId(1L)).thenReturn(userLogs);

        // When
        List<OperationLog> result = operationLogService.findByUserId(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testOperationLog.getUserId(), result.get(0).getUserId());
        verify(operationLogRepository, times(1)).findByUserId(1L);
    }

    @Test
    void testFindByOperationType() {
        // Given
        List<OperationLog> typeLogs = Arrays.asList(testOperationLog);
        when(operationLogRepository.findByOperationType("CREATE")).thenReturn(typeLogs);

        // When
        List<OperationLog> result = operationLogService.findByOperationType("CREATE");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("CREATE", result.get(0).getOperationType());
        verify(operationLogRepository, times(1)).findByOperationType("CREATE");
    }

    @Test
    void testFindByOperationModule() {
        // Given
        List<OperationLog> moduleLogs = Arrays.asList(testOperationLog);
        when(operationLogRepository.findByOperationModule("USER_MANAGEMENT")).thenReturn(moduleLogs);

        // When
        List<OperationLog> result = operationLogService.findByOperationModule("USER_MANAGEMENT");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("USER_MANAGEMENT", result.get(0).getOperationModule());
        verify(operationLogRepository, times(1)).findByOperationModule("USER_MANAGEMENT");
    }

    @Test
    void testFindByDateRange() {
        // Given
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();
        List<OperationLog> dateLogs = Arrays.asList(testOperationLog);
        when(operationLogRepository.findByCreatedAtBetween(startTime, endTime)).thenReturn(dateLogs);

        // When
        List<OperationLog> result = operationLogService.findByDateRange(startTime, endTime);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(operationLogRepository, times(1)).findByCreatedAtBetween(startTime, endTime);
    }

    @Test
    void testFindByIpAddress() {
        // Given
        List<OperationLog> ipLogs = Arrays.asList(testOperationLog);
        when(operationLogRepository.findByIpAddress("192.168.1.100")).thenReturn(ipLogs);

        // When
        List<OperationLog> result = operationLogService.findByIpAddress("192.168.1.100");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("192.168.1.100", result.get(0).getIpAddress());
        verify(operationLogRepository, times(1)).findByIpAddress("192.168.1.100");
    }

    @Test
    void testSave() {
        // Given
        when(operationLogRepository.save(any(OperationLog.class))).thenReturn(testOperationLog);

        // When
        OperationLog result = operationLogService.save(testOperationLog);

        // Then
        assertNotNull(result);
        assertEquals(testOperationLog.getOperationType(), result.getOperationType());
        verify(operationLogRepository, times(1)).save(testOperationLog);
    }

    @Test
    void testSaveAsync() {
        // Given
        when(operationLogRepository.save(any(OperationLog.class))).thenReturn(testOperationLog);

        // When
        operationLogService.saveAsync(testOperationLog);

        // Then
        // 由于是异步方法，我们需要等待一段时间来确保方法执行完成
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        verify(operationLogRepository, times(1)).save(testOperationLog);
    }

    @Test
    void testDeleteById() {
        // Given
        when(operationLogRepository.existsById(1L)).thenReturn(true);
        doNothing().when(operationLogRepository).deleteById(1L);

        // When
        operationLogService.deleteById(1L);

        // Then
        verify(operationLogRepository, times(1)).existsById(1L);
        verify(operationLogRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        when(operationLogRepository.existsById(999L)).thenReturn(false);

        // When
        operationLogService.deleteById(999L);

        // Then
        verify(operationLogRepository, times(1)).existsById(999L);
        verify(operationLogRepository, never()).deleteById(999L);
    }

    @Test
    void testDeleteByDateRange() {
        // Given
        LocalDateTime startTime = LocalDateTime.now().minusDays(30);
        LocalDateTime endTime = LocalDateTime.now().minusDays(7);
        when(operationLogRepository.deleteByCreatedAtBetween(startTime, endTime)).thenReturn(5L);

        // When
        Long result = operationLogService.deleteByDateRange(startTime, endTime);

        // Then
        assertEquals(5L, result);
        verify(operationLogRepository, times(1)).deleteByCreatedAtBetween(startTime, endTime);
    }

    @Test
    void testFindAllWithPagination() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<OperationLog> page = new PageImpl<>(Arrays.asList(testOperationLog), pageable, 1);
        when(operationLogRepository.findAll(pageable)).thenReturn(page);

        // When
        Page<OperationLog> result = operationLogService.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        verify(operationLogRepository, times(1)).findAll(pageable);
    }

    @Test
    void testCountByOperationType() {
        // Given
        when(operationLogRepository.countByOperationType("CREATE")).thenReturn(5L);

        // When
        Long result = operationLogService.countByOperationType("CREATE");

        // Then
        assertEquals(5L, result);
        verify(operationLogRepository, times(1)).countByOperationType("CREATE");
    }

    @Test
    void testCountByOperationModule() {
        // Given
        when(operationLogRepository.countByOperationModule("USER_MANAGEMENT")).thenReturn(10L);

        // When
        Long result = operationLogService.countByOperationModule("USER_MANAGEMENT");

        // Then
        assertEquals(10L, result);
        verify(operationLogRepository, times(1)).countByOperationModule("USER_MANAGEMENT");
    }

    @Test
    void testFindTopOperationsByUser() {
        // Given
        List<Object[]> topOperations = Arrays.asList(
            new Object[]{"CREATE", 10L},
            new Object[]{"UPDATE", 5L}
        );
        when(operationLogRepository.findTopOperationsByUserId(1L, PageRequest.of(0, 10)))
                .thenReturn(topOperations);

        // When
        List<Object[]> result = operationLogService.findTopOperationsByUser(1L, 10);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(operationLogRepository, times(1)).findTopOperationsByUserId(1L, PageRequest.of(0, 10));
    }
}