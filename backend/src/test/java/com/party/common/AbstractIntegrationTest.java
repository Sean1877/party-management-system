package com.party.common;

import com.party.repository.ActivityRepository;
import com.party.repository.FeePaymentRepository;
import com.party.repository.FeeStandardRepository;
import com.party.repository.OperationLogRepository;
import com.party.repository.OrganizationRepository;
import com.party.repository.RoleRepository;
import com.party.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * 抽象测试基类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Transactional
public abstract class AbstractIntegrationTest {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected OrganizationRepository organizationRepository;

    @Autowired
    protected RoleRepository roleRepository;

    @Autowired
    protected ActivityRepository activityRepository;

    @Autowired
    protected FeePaymentRepository feePaymentRepository;

    @Autowired
    protected FeeStandardRepository feeStandardRepository;

    @Autowired
    protected OperationLogRepository operationLogRepository;

    protected TestDataFactory testDataFactory;

    @BeforeEach
    void setUp() {
        testDataFactory = new TestDataFactory();
        testDataFactory.userRepository = userRepository;
        testDataFactory.organizationRepository = organizationRepository;
        testDataFactory.roleRepository = roleRepository;
        testDataFactory.activityRepository = activityRepository;
    }

    @AfterEach
    void tearDown() {
        // Clean up all test data in reverse order of dependencies
        operationLogRepository.deleteAll();
        feePaymentRepository.deleteAll();
        feeStandardRepository.deleteAll();
        activityRepository.deleteAll();
        userRepository.deleteAll();
        organizationRepository.deleteAll();
        roleRepository.deleteAll();
    }

    /**
     * 清理所有测试数据
     */
    protected void cleanupAllTestData() {
        operationLogRepository.deleteAll();
        feePaymentRepository.deleteAll();
        feeStandardRepository.deleteAll();
        activityRepository.deleteAll();
        userRepository.deleteAll();
        organizationRepository.deleteAll();
        roleRepository.deleteAll();
    }
}