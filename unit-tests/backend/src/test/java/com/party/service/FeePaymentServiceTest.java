package com.party.service;

import com.party.entity.FeePayment;
import com.party.entity.User;
import com.party.repository.FeePaymentRepository;
import com.party.service.impl.FeePaymentServiceImpl;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 党费缴费记录服务测试类
 */
@ExtendWith(MockitoExtension.class)
class FeePaymentServiceTest {

    @Mock
    private FeePaymentRepository feePaymentRepository;

    @InjectMocks
    private FeePaymentServiceImpl feePaymentService;

    private FeePayment testFeePayment;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setRealName("测试用户");

        testFeePayment = new FeePayment();
        testFeePayment.setId(1L);
        testFeePayment.setUser(testUser);
        testFeePayment.setAmount(new BigDecimal("20.00"));
        testFeePayment.setPaymentDate(LocalDate.now());
        testFeePayment.setPaymentMethod("BANK_TRANSFER");
        testFeePayment.setStatus("PAID");
        testFeePayment.setRemark("按时缴费");
        testFeePayment.setCreatedAt(LocalDateTime.now());
        testFeePayment.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testFindAll() {
        // Given
        List<FeePayment> payments = Arrays.asList(testFeePayment);
        when(feePaymentRepository.findAll()).thenReturn(payments);

        // When
        List<FeePayment> result = feePaymentService.findAll();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testFeePayment.getAmount(), result.get(0).getAmount());
        verify(feePaymentRepository, times(1)).findAll();
    }

    @Test
    void testFindById() {
        // Given
        when(feePaymentRepository.findById(1L)).thenReturn(Optional.of(testFeePayment));

        // When
        Optional<FeePayment> result = feePaymentService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testFeePayment.getAmount(), result.get().getAmount());
        verify(feePaymentRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByIdNotFound() {
        // Given
        when(feePaymentRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<FeePayment> result = feePaymentService.findById(999L);

        // Then
        assertFalse(result.isPresent());
        verify(feePaymentRepository, times(1)).findById(999L);
    }

    @Test
    void testFindByUserId() {
        // Given
        List<FeePayment> userPayments = Arrays.asList(testFeePayment);
        when(feePaymentRepository.findByUserId(1L)).thenReturn(userPayments);

        // When
        List<FeePayment> result = feePaymentService.findByUserId(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser.getId(), result.get(0).getUser().getId());
        verify(feePaymentRepository, times(1)).findByUserId(1L);
    }

    @Test
    void testFindByStatus() {
        // Given
        List<FeePayment> paidPayments = Arrays.asList(testFeePayment);
        when(feePaymentRepository.findByStatus("PAID")).thenReturn(paidPayments);

        // When
        List<FeePayment> result = feePaymentService.findByStatus("PAID");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("PAID", result.get(0).getStatus());
        verify(feePaymentRepository, times(1)).findByStatus("PAID");
    }

    @Test
    void testFindByDateRange() {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();
        List<FeePayment> dateRangePayments = Arrays.asList(testFeePayment);
        when(feePaymentRepository.findByPaymentDateBetween(startDate, endDate))
                .thenReturn(dateRangePayments);

        // When
        List<FeePayment> result = feePaymentService.findByDateRange(startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(feePaymentRepository, times(1)).findByPaymentDateBetween(startDate, endDate);
    }

    @Test
    void testFindByUserIdAndDateRange() {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();
        List<FeePayment> userDatePayments = Arrays.asList(testFeePayment);
        when(feePaymentRepository.findByUserIdAndPaymentDateBetween(1L, startDate, endDate))
                .thenReturn(userDatePayments);

        // When
        List<FeePayment> result = feePaymentService.findByUserIdAndDateRange(1L, startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(feePaymentRepository, times(1)).findByUserIdAndPaymentDateBetween(1L, startDate, endDate);
    }

    @Test
    void testSave() {
        // Given
        when(feePaymentRepository.save(any(FeePayment.class))).thenReturn(testFeePayment);

        // When
        FeePayment result = feePaymentService.save(testFeePayment);

        // Then
        assertNotNull(result);
        assertEquals(testFeePayment.getAmount(), result.getAmount());
        verify(feePaymentRepository, times(1)).save(testFeePayment);
    }

    @Test
    void testUpdate() {
        // Given
        FeePayment updatedPayment = new FeePayment();
        updatedPayment.setId(1L);
        updatedPayment.setAmount(new BigDecimal("25.00"));
        updatedPayment.setStatus("CONFIRMED");
        
        when(feePaymentRepository.findById(1L)).thenReturn(Optional.of(testFeePayment));
        when(feePaymentRepository.save(any(FeePayment.class))).thenReturn(updatedPayment);

        // When
        Optional<FeePayment> result = feePaymentService.update(1L, updatedPayment);

        // Then
        assertTrue(result.isPresent());
        assertEquals(new BigDecimal("25.00"), result.get().getAmount());
        verify(feePaymentRepository, times(1)).findById(1L);
        verify(feePaymentRepository, times(1)).save(any(FeePayment.class));
    }

    @Test
    void testUpdateNotFound() {
        // Given
        FeePayment updatedPayment = new FeePayment();
        when(feePaymentRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<FeePayment> result = feePaymentService.update(999L, updatedPayment);

        // Then
        assertFalse(result.isPresent());
        verify(feePaymentRepository, times(1)).findById(999L);
        verify(feePaymentRepository, never()).save(any(FeePayment.class));
    }

    @Test
    void testDeleteById() {
        // Given
        when(feePaymentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(feePaymentRepository).deleteById(1L);

        // When
        boolean result = feePaymentService.deleteById(1L);

        // Then
        assertTrue(result);
        verify(feePaymentRepository, times(1)).existsById(1L);
        verify(feePaymentRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteByIdNotFound() {
        // Given
        when(feePaymentRepository.existsById(999L)).thenReturn(false);

        // When
        boolean result = feePaymentService.deleteById(999L);

        // Then
        assertFalse(result);
        verify(feePaymentRepository, times(1)).existsById(999L);
        verify(feePaymentRepository, never()).deleteById(999L);
    }

    @Test
    void testFindAllWithPagination() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<FeePayment> page = new PageImpl<>(Arrays.asList(testFeePayment), pageable, 1);
        when(feePaymentRepository.findAll(pageable)).thenReturn(page);

        // When
        Page<FeePayment> result = feePaymentService.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        verify(feePaymentRepository, times(1)).findAll(pageable);
    }

    @Test
    void testCalculateTotalAmountByUser() {
        // Given
        BigDecimal totalAmount = new BigDecimal("100.00");
        when(feePaymentRepository.calculateTotalAmountByUserId(1L)).thenReturn(totalAmount);

        // When
        BigDecimal result = feePaymentService.calculateTotalAmountByUser(1L);

        // Then
        assertEquals(totalAmount, result);
        verify(feePaymentRepository, times(1)).calculateTotalAmountByUserId(1L);
    }

    @Test
    void testCalculateTotalAmountByDateRange() {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();
        BigDecimal totalAmount = new BigDecimal("500.00");
        when(feePaymentRepository.calculateTotalAmountByDateRange(startDate, endDate))
                .thenReturn(totalAmount);

        // When
        BigDecimal result = feePaymentService.calculateTotalAmountByDateRange(startDate, endDate);

        // Then
        assertEquals(totalAmount, result);
        verify(feePaymentRepository, times(1)).calculateTotalAmountByDateRange(startDate, endDate);
    }

    @Test
    void testCountByStatus() {
        // Given
        when(feePaymentRepository.countByStatus("PAID")).thenReturn(10L);

        // When
        Long result = feePaymentService.countByStatus("PAID");

        // Then
        assertEquals(10L, result);
        verify(feePaymentRepository, times(1)).countByStatus("PAID");
    }
}