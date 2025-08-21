package com.party.repository;

import com.party.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户Repository接口 - 测试用简化版本
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByIdCard(String idCard);
    
    boolean existsByPhone(String phone);
    
    boolean existsByEmail(String email);
    
    Page<User> findByOrganizationId(Long organizationId, Pageable pageable);
    
    Page<User> findByPartyStatus(Integer partyStatus, Pageable pageable);
    
    Page<User> findByIsActive(Boolean isActive, Pageable pageable);
}