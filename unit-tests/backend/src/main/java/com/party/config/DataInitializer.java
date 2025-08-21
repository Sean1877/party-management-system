package com.party.config;

import com.party.entity.User;
import com.party.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 创建管理员用户
        if (!userService.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRealName("系统管理员");
            admin.setEmail("admin@example.com");
            admin.setPhone("13800000000");
            admin.setIdCard("110101199001010001");
            admin.setMemberType("admin");
            admin.setJoinDate(LocalDate.now());
            admin.setIsActive(true);
            userService.save(admin);
            System.out.println("管理员用户创建成功: admin/admin123");
        }

        // 创建测试用户
        if (!userService.existsByUsername("testuser")) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setPassword(passwordEncoder.encode("test123"));
            testUser.setRealName("测试用户");
            testUser.setEmail("test@example.com");
            testUser.setPhone("13800000001");
            testUser.setIdCard("110101199001010002");
            testUser.setMemberType("regular");
            testUser.setJoinDate(LocalDate.now());
            testUser.setIsActive(true);
            userService.save(testUser);
            System.out.println("测试用户创建成功: testuser/test123");
        }
    }
}