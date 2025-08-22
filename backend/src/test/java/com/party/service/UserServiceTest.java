package com.party.service;

import com.party.entity.User;
import com.party.repository.UserRepository;
import com.party.service.impl.UserServiceImpl;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 用户服务测试类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setRealName("测试用户");
        testUser.setIdCard("110101199001011234");
        testUser.setPhone("13800138000");
        testUser.setEmail("test@example.com");
        testUser.setGender(1);
        testUser.setBirthDate(LocalDate.of(1990, 1, 1));
        testUser.setJoinPartyDate(LocalDate.of(2020, 1, 1));
        testUser.setPartyStatus(3); // 正式党员
        testUser.setOrganizationId(1L);
        testUser.setRoleId(2L);
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testCreateUser() {
        // Given
        when(userRepository.existsByUsername(testUser.getUsername())).thenReturn(false);
        when(userRepository.existsByIdCard(testUser.getIdCard())).thenReturn(false);
        when(userRepository.existsByPhone(testUser.getPhone())).thenReturn(false);
        when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.createUser(testUser);

        // Then
        assertNotNull(result);
        assertEquals(testUser.getUsername(), result.getUsername());
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void testCreateUserWithDuplicateUsername() {
        // Given
        when(userRepository.existsByUsername(testUser.getUsername())).thenReturn(true);

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.createUser(testUser));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testUpdateUser() {
        // Given
        User updateData = new User();
        updateData.setRealName("新名字");
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.updateUser(testUser.getId(), updateData);

        // Then
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testUpdateNonExistentUser() {
        // Given
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.updateUser(testUser.getId(), testUser));
    }

    @Test
    void testDeleteUser() {
        // Given
        when(userRepository.existsById(testUser.getId())).thenReturn(true);

        // When
        userService.deleteUser(testUser.getId());

        // Then
        verify(userRepository).deleteById(testUser.getId());
    }

    @Test
    void testDeleteNonExistentUser() {
        // Given
        when(userRepository.existsById(testUser.getId())).thenReturn(false);

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.deleteUser(testUser.getId()));
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void testFindById() {
        // Given
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findById(testUser.getId());

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser.getId(), result.get().getId());
    }

    @Test
    void testFindByUsername() {
        // Given
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByUsername(testUser.getUsername());

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser.getUsername(), result.get().getUsername());
    }

    @Test
    void testFindAll() {
        // Given
        List<User> users = Arrays.asList(testUser);
        Page<User> userPage = new PageImpl<>(users);
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.findAll(pageable)).thenReturn(userPage);

        // When
        Page<User> result = userService.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testUser.getId(), result.getContent().get(0).getId());
    }

    @Test
    void testActivateUser() {
        // Given
        testUser.setIsActive(false);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.activateUser(testUser.getId());

        // Then
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testDeactivateUser() {
        // Given
        testUser.setIsActive(true);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.deactivateUser(testUser.getId());

        // Then
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testChangePassword() {
        // Given
        String oldPassword = "password123";
        String newPassword = "newPassword123";
        String encodedOldPassword = "encodedPassword123";
        testUser.setPassword(encodedOldPassword);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(oldPassword, encodedOldPassword)).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        userService.changePassword(testUser.getId(), oldPassword, newPassword);

        // Then
        verify(passwordEncoder).matches(oldPassword, encodedOldPassword);
        verify(passwordEncoder).encode(newPassword);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testExistsByUsername() {
        // Given
        when(userRepository.existsByUsername(testUser.getUsername())).thenReturn(true);

        // When
        boolean result = userService.existsByUsername(testUser.getUsername());

        // Then
        assertTrue(result);
    }

    @Test
    void testExistsByIdCard() {
        // Given
        when(userRepository.existsByIdCard(testUser.getIdCard())).thenReturn(true);

        // When
        boolean result = userService.existsByIdCard(testUser.getIdCard());

        // Then
        assertTrue(result);
    }

    @Test
    void testExistsByPhone() {
        // Given
        when(userRepository.existsByPhone(testUser.getPhone())).thenReturn(true);

        // When
        boolean result = userService.existsByPhone(testUser.getPhone());

        // Then
        assertTrue(result);
    }

    @Test
    void testExistsByEmail() {
        // Given
        when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(true);

        // When
        boolean result = userService.existsByEmail(testUser.getEmail());

        // Then
        assertTrue(result);
    }
}