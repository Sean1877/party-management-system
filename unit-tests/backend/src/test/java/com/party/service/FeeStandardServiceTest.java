package com.party.service;

import com.party.entity.FeeStandard;
import com.party.repository.FeeStandardRepository;
import com.party.service.impl.FeeStandardServiceImpl;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 党费标准服务测试类
 */
@ExtendWith(MockitoExtension.class)
class FeeStandardServiceTest {

    @Mock
    private FeeStandardRepository feeStandardRepository;

    @InjectMocks
    private FeeStandardServiceImpl feeStandardService;

    private FeeStandard testFeeStandard;

    @BeforeEach
    void setUp() {
        testFeeStandard = new FeeStandard();
        testFeeStandard.setId(1L);
        testFeeStandard.setName("普通党员标准");
        testFeeStandard.setDescription("适用于普通党员的党费缴费标准");
        testFeeStandard.setMinIncome(new BigDecimal("3000"));
        testFeeStandard.setMaxIncome(new BigDecimal("5000"));
        testFeeStandard.setFeeRate(new BigDecimal("0.005"));
        testFeeStandard.setFixedAmount(new BigDecimal("0"));
        testFeeStandard.setStatus("ACTIVE");
        testFeeStandard.setCreatedAt(LocalDateTime.now());
        testFeeStandard.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testFindAll() {
        // Given
        List<FeeStandard> standards = Arrays.asList(testFeeStandard);
        when(feeStandardRepository.findAll()).thenReturn(standards);

        // When
        List<FeeStandard> result = feeStandardService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testFeeStandard.getName(), result.get(0).getName());
        verify(feeStandardRepository, times(1)).findAll();
    }

    @Test
    void testFindById() {
        // Given
        when(feeStandardRepository.findById(1L)).thenReturn(Optional.of(testFeeStandard));

        // When
        Optional<FeeStandard> result = feeStandardService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testFeeStandard.getName(), result.get().getName());
        verify(feeStandardRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        when(feeStandardRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<FeeStandard> result = feeStandardService.findById(999L);

        // Then
        assertFalse(result.isPresent());
        verify(feeStandardRepository, times(1)).findById(999L);
    }

    @Test
    void testFindByStatus() {
        // Given
        List<FeeStandard> activeStandards = Arrays.asList(testFeeStandard);
        when(feeStandardRepository.findByStatus("ACTIVE")).thenReturn(activeStandards);

        // When
        List<FeeStandard> result = feeStandardService.findByStatus("ACTIVE");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ACTIVE", result.get(0).getStatus());
        verify(feeStandardRepository, times(1)).findByStatus("ACTIVE");
    }

    @Test
    void testFindByIncomeRange() {
        // Given
        BigDecimal income = new BigDecimal("4000");
        List<FeeStandard> matchingStandards = Arrays.asList(testFeeStandard);
        when(feeStandardRepository.findByIncomeRange(income)).thenReturn(matchingStandards);

        // When
        List<FeeStandard> result = feeStandardService.findByIncomeRange(income);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(feeStandardRepository, times(1)).findByIncomeRange(income);
    }

    @Test
    void testSave() {
        // Given
        when(feeStandardRepository.save(any(FeeStandard.class))).thenReturn(testFeeStandard);

        // When
        FeeStandard result = feeStandardService.save(testFeeStandard);

        // Then
        assertNotNull(result);
        assertEquals(testFeeStandard.getName(), result.getName());
        verify(feeStandardRepository, times(1)).save(testFeeStandard);
    }

    @Test
    void testUpdate() {
        // Given
        FeeStandard updatedStandard = new FeeStandard();
        updatedStandard.setId(1L);
        updatedStandard.setName("更新后的标准");
        updatedStandard.setDescription("更新后的描述");
        
        when(feeStandardRepository.findById(1L)).thenReturn(Optional.of(testFeeStandard));
        when(feeStandardRepository.save(any(FeeStandard.class))).thenReturn(updatedStandard);

        // When
        Optional<FeeStandard> result = feeStandardService.update(1L, updatedStandard);

        // Then
        assertTrue(result.isPresent());
        assertEquals("更新后的标准", result.get().getName());
        verify(feeStandardRepository, times(1)).findById(1L);
        verify(feeStandardRepository, times(1)).save(any(FeeStandard.class));
    }

    @Test
    void testUpdateNotFound() {
        // Given
        FeeStandard updatedStandard = new FeeStandard();
        when(feeStandardRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<FeeStandard> result = feeStandardService.update(999L, updatedStandard);

        // Then
        assertFalse(result.isPresent());
        verify(feeStandardRepository, times(1)).findById(999L);
        verify(feeStandardRepository, never()).save(any(FeeStandard.class));
    }

    @Test
    void testDeleteById() {
        // Given
        when(feeStandardRepository.existsById(1L)).thenReturn(true);
        doNothing().when(feeStandardRepository).deleteById(1L);

        // When
        boolean result = feeStandardService.deleteById(1L);

        // Then
        assertTrue(result);
        verify(feeStandardRepository, times(1)).existsById(1L);
        verify(feeStandardRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        when(feeStandardRepository.existsById(999L)).thenReturn(false);

        // When
        boolean result = feeStandardService.deleteById(999L);

        // Then
        assertFalse(result);
        verify(feeStandardRepository, times(1)).existsById(999L);
        verify(feeStandardRepository, never()).deleteById(999L);
    }

    @Test
    void testFindAllWithPagination() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<FeeStandard> page = new PageImpl<>(Arrays.asList(testFeeStandard), pageable, 1);
        when(feeStandardRepository.findAll(pageable)).thenReturn(page);

        // When
        Page<FeeStandard> result = feeStandardService.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        verify(feeStandardRepository, times(1)).findAll(pageable);
    }

    @Test
    void testCalculateFeeAmount() {
        // Given
        BigDecimal income = new BigDecimal("4000");
        BigDecimal expectedFee = income.multiply(testFeeStandard.getFeeRate());

        // When
        BigDecimal result = feeStandardService.calculateFeeAmount(testFeeStandard, income);

        // Then
        assertEquals(expectedFee, result);
    }

    @Test
    void testCalculateFeeAmountWithFixedAmount() {
        // Given
        testFeeStandard.setFixedAmount(new BigDecimal("50"));
        testFeeStandard.setFeeRate(new BigDecimal("0"));
        BigDecimal income = new BigDecimal("4000");

        // When
        BigDecimal result = feeStandardService.calculateFeeAmount(testFeeStandard, income);

        // Then
        assertEquals(new BigDecimal("50"), result);
    }
}