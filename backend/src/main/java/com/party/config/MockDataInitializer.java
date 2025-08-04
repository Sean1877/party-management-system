package com.party.config;

import com.party.entity.Activity;
import com.party.entity.ActivityParticipant;
import com.party.entity.Organization;
import com.party.entity.Role;
import com.party.entity.User;
import com.party.repository.ActivityParticipantRepository;
import com.party.repository.ActivityRepository;
import com.party.repository.OrganizationRepository;
import com.party.repository.RoleRepository;
import com.party.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Mock数据初始化器
 * 用于初始化演示数据，避免真实数据库连接
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Component
public class MockDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MockDataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityParticipantRepository activityParticipantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("开始初始化Mock演示数据...");
        
        // 初始化角色数据
        initRoles();
        
        // 初始化组织数据
        initOrganizations();
        
        // 初始化用户数据
        initUsers();
        
        // 初始化活动数据
        initActivities();
        
        // 初始化活动参与者数据
        initActivityParticipants();
        
        logger.info("Mock演示数据初始化完成！");
    }

    /**
     * 初始化角色数据
     */
    private void initRoles() {
        if (roleRepository.count() > 0) {
            logger.info("角色数据已存在，跳过初始化");
            return;
        }

        List<Role> roles = Arrays.asList(
            new Role("超级管理员", "SUPER_ADMIN", "系统超级管理员，拥有所有权限"),
            new Role("系统管理员", "ADMIN", "系统管理员，负责系统管理和维护"),
            new Role("党委书记", "PARTY_SECRETARY", "党委书记，负责党委工作"),
            new Role("支部书记", "BRANCH_SECRETARY", "党支部书记，负责支部工作"),
            new Role("组织委员", "ORGANIZATION_MEMBER", "组织委员，负责组织工作"),
            new Role("宣传委员", "PUBLICITY_MEMBER", "宣传委员，负责宣传工作"),
            new Role("普通党员", "PARTY_MEMBER", "普通党员"),
            new Role("预备党员", "PROBATIONARY_MEMBER", "预备党员"),
            new Role("入党积极分子", "ACTIVIST", "入党积极分子")
        );

        roleRepository.saveAll(roles);
        logger.info("初始化了 {} 个角色", roles.size());
    }

    /**
     * 初始化组织数据
     */
    private void initOrganizations() {
        if (organizationRepository.count() > 0) {
            logger.info("组织数据已存在，跳过初始化");
            return;
        }

        // 创建根组织 - 党委
        Organization partyCommittee = new Organization();
        partyCommittee.setName("中共某某单位委员会");
        partyCommittee.setCode("PARTY_001");
        partyCommittee.setType(1); // 党委
        partyCommittee.setLevel(1);
        partyCommittee.setDescription("单位党委，负责全单位党建工作");
        partyCommittee.setAddress("北京市朝阳区某某街道123号");
        partyCommittee.setContactPhone("010-12345678");
        partyCommittee.setEstablishDate(LocalDate.of(2020, 1, 1));
        partyCommittee = organizationRepository.save(partyCommittee);

        // 创建党总支
        Organization generalBranch1 = new Organization();
        generalBranch1.setName("第一党总支");
        generalBranch1.setCode("BRANCH_001");
        generalBranch1.setType(2); // 党总支
        generalBranch1.setParentId(partyCommittee.getId());
        generalBranch1.setLevel(2);
        generalBranch1.setDescription("第一党总支，负责行政部门党建工作");
        generalBranch1.setAddress("北京市朝阳区某某街道123号A座");
        generalBranch1.setContactPhone("010-12345679");
        generalBranch1.setEstablishDate(LocalDate.of(2020, 3, 1));
        generalBranch1 = organizationRepository.save(generalBranch1);

        Organization generalBranch2 = new Organization();
        generalBranch2.setName("第二党总支");
        generalBranch2.setCode("BRANCH_002");
        generalBranch2.setType(2); // 党总支
        generalBranch2.setParentId(partyCommittee.getId());
        generalBranch2.setLevel(2);
        generalBranch2.setDescription("第二党总支，负责业务部门党建工作");
        generalBranch2.setAddress("北京市朝阳区某某街道123号B座");
        generalBranch2.setContactPhone("010-12345680");
        generalBranch2.setEstablishDate(LocalDate.of(2020, 3, 15));
        generalBranch2 = organizationRepository.save(generalBranch2);

        // 创建党支部
        List<Organization> branches = Arrays.asList(
            createBranch("行政管理党支部", "SUB_001", generalBranch1.getId(), "负责行政管理工作的党支部"),
            createBranch("人力资源党支部", "SUB_002", generalBranch1.getId(), "负责人力资源工作的党支部"),
            createBranch("财务管理党支部", "SUB_003", generalBranch1.getId(), "负责财务管理工作的党支部"),
            createBranch("技术研发党支部", "SUB_004", generalBranch2.getId(), "负责技术研发工作的党支部"),
            createBranch("市场营销党支部", "SUB_005", generalBranch2.getId(), "负责市场营销工作的党支部"),
            createBranch("客户服务党支部", "SUB_006", generalBranch2.getId(), "负责客户服务工作的党支部")
        );

        organizationRepository.saveAll(branches);
        logger.info("初始化了 {} 个组织", 2 + 2 + branches.size()); // 党委 + 党总支 + 党支部
    }

    /**
     * 创建党支部
     */
    private Organization createBranch(String name, String code, Long parentId, String description) {
        Organization branch = new Organization();
        branch.setName(name);
        branch.setCode(code);
        branch.setType(3); // 党支部
        branch.setParentId(parentId);
        branch.setLevel(3);
        branch.setDescription(description);
        branch.setEstablishDate(LocalDate.of(2020, 6, 1));
        return branch;
    }

    /**
     * 初始化用户数据
     */
    private void initUsers() {
        if (userRepository.count() > 0) {
            logger.info("用户数据已存在，跳过初始化");
            return;
        }

        // 获取组织和角色
        List<Organization> organizations = organizationRepository.findAll();
        List<Role> roles = roleRepository.findAll();

        // 创建管理员用户
        User admin = createUser("admin", "管理员", "110101199001011234", "13800138000", 
                               "admin@example.com", 1, LocalDate.of(1990, 1, 1), 
                               LocalDate.of(2018, 7, 1), 1, 
                               organizations.get(0).getId(), roles.get(0).getId());
        
        // 创建党委书记
        User partySecretary = createUser("secretary", "张书记", "110101198001011234", "13800138001", 
                                       "secretary@example.com", 1, LocalDate.of(1980, 1, 1), 
                                       LocalDate.of(2010, 7, 1), 1, 
                                       organizations.get(0).getId(), roles.get(2).getId());
        
        // 创建支部书记们
        List<User> branchSecretaries = Arrays.asList(
            createUser("branch_sec1", "李支书", "110101198501011234", "13800138002", 
                      "branch1@example.com", 2, LocalDate.of(1985, 1, 1), 
                      LocalDate.of(2015, 7, 1), 1, 
                      organizations.get(3).getId(), roles.get(3).getId()),
            createUser("branch_sec2", "王支书", "110101198601011234", "13800138003", 
                      "branch2@example.com", 1, LocalDate.of(1986, 1, 1), 
                      LocalDate.of(2016, 7, 1), 1, 
                      organizations.get(4).getId(), roles.get(3).getId()),
            createUser("branch_sec3", "赵支书", "110101198701011234", "13800138004", 
                      "branch3@example.com", 2, LocalDate.of(1987, 1, 1), 
                      LocalDate.of(2017, 7, 1), 1, 
                      organizations.get(5).getId(), roles.get(3).getId())
        );
        
        // 创建普通党员
        List<User> members = Arrays.asList(
            createUser("member001", "陈党员", "110101199001021234", "13800138005", 
                      "member1@example.com", 1, LocalDate.of(1990, 1, 2), 
                      LocalDate.of(2019, 7, 1), 1, 
                      organizations.get(3).getId(), roles.get(6).getId()),
            createUser("member002", "刘党员", "110101199101021234", "13800138006", 
                      "member2@example.com", 2, LocalDate.of(1991, 1, 2), 
                      LocalDate.of(2020, 7, 1), 1, 
                      organizations.get(4).getId(), roles.get(6).getId()),
            createUser("member003", "杨党员", "110101199201021234", "13800138007", 
                      "member3@example.com", 1, LocalDate.of(1992, 1, 2), 
                      LocalDate.of(2021, 7, 1), 1, 
                      organizations.get(5).getId(), roles.get(6).getId()),
            createUser("member004", "周党员", "110101199301021234", "13800138008", 
                      "member4@example.com", 2, LocalDate.of(1993, 1, 2), 
                      LocalDate.of(2022, 7, 1), 1, 
                      organizations.get(6).getId(), roles.get(6).getId()),
            createUser("member005", "吴党员", "110101199401021234", "13800138009", 
                      "member5@example.com", 1, LocalDate.of(1994, 1, 2), 
                      LocalDate.of(2023, 7, 1), 1, 
                      organizations.get(7).getId(), roles.get(6).getId())
        );
        
        // 创建预备党员
        List<User> probationaryMembers = Arrays.asList(
            createUser("prob001", "徐预备", "110101199501021234", "13800138010", 
                      "prob1@example.com", 2, LocalDate.of(1995, 1, 2), 
                      LocalDate.of(2023, 7, 1), 2, 
                      organizations.get(3).getId(), roles.get(7).getId()),
            createUser("prob002", "孙预备", "110101199601021234", "13800138011", 
                      "prob2@example.com", 1, LocalDate.of(1996, 1, 2), 
                      LocalDate.of(2023, 9, 1), 2, 
                      organizations.get(4).getId(), roles.get(7).getId())
        );
        
        // 创建入党积极分子
        List<User> activists = Arrays.asList(
            createUser("act001", "马积极", "110101199701021234", "13800138012", 
                      "act1@example.com", 1, LocalDate.of(1997, 1, 2), 
                      null, 3, 
                      organizations.get(5).getId(), roles.get(8).getId()),
            createUser("act002", "朱积极", "110101199801021234", "13800138013", 
                      "act2@example.com", 2, LocalDate.of(1998, 1, 2), 
                      null, 3, 
                      organizations.get(6).getId(), roles.get(8).getId()),
            createUser("act003", "胡积极", "110101199901021234", "13800138014", 
                      "act3@example.com", 1, LocalDate.of(1999, 1, 2), 
                      null, 3, 
                      organizations.get(7).getId(), roles.get(8).getId())
        );

        // 保存所有用户
        userRepository.save(admin);
        userRepository.save(partySecretary);
        userRepository.saveAll(branchSecretaries);
        userRepository.saveAll(members);
        userRepository.saveAll(probationaryMembers);
        userRepository.saveAll(activists);
        
        // 设置组织书记
        updateOrganizationSecretary(organizations.get(0).getId(), partySecretary.getId());
        for (int i = 0; i < branchSecretaries.size() && i + 3 < organizations.size(); i++) {
            updateOrganizationSecretary(organizations.get(i + 3).getId(), branchSecretaries.get(i).getId());
        }

        logger.info("初始化了 {} 个用户", 1 + 1 + branchSecretaries.size() + members.size() + probationaryMembers.size() + activists.size());
    }

    /**
     * 创建用户
     */
    private User createUser(String username, String realName, String idCard, String phone, 
                           String email, Integer gender, LocalDate birthDate, 
                           LocalDate joinPartyDate, Integer partyStatus, 
                           Long organizationId, Long roleId) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode("123456")); // 默认密码
        user.setRealName(realName);
        user.setIdCard(idCard);
        user.setPhone(phone);
        user.setEmail(email);
        user.setGender(gender);
        user.setBirthDate(birthDate);
        user.setJoinPartyDate(joinPartyDate);
        user.setPartyStatus(partyStatus);
        user.setOrganizationId(organizationId);
        user.setRoleId(roleId);
        user.setIsActive(true);
        return user;
    }
    
    /**
     * 更新组织书记
     */
    private void updateOrganizationSecretary(Long organizationId, Long secretaryId) {
        organizationRepository.findById(organizationId).ifPresent(org -> {
            org.setSecretaryId(secretaryId);
            organizationRepository.save(org);
        });
    }

    /**
     * 初始化活动数据
     */
    private void initActivities() {
        if (activityRepository.count() > 0) {
            logger.info("活动数据已存在，跳过初始化");
            return;
        }

        List<Activity> activities = Arrays.asList(
            new Activity("支部大会 - 学习党的二十大精神", 1, 
                "深入学习贯彻党的二十大精神，全面理解新时代中国特色社会主义思想的核心要义。",
                "会议室A", 
                LocalDateTime.now().plusDays(3).withHour(14).withMinute(0),
                LocalDateTime.now().plusDays(3).withHour(16).withMinute(0),
                1L, 1L),
            
            new Activity("支委会 - 组织生活规划", 2,
                "讨论下季度组织生活安排，制定党员教育培训计划。",
                "会议室B",
                LocalDateTime.now().plusDays(7).withHour(9).withMinute(0),
                LocalDateTime.now().plusDays(7).withHour(11).withMinute(0),
                2L, 1L),
            
            new Activity("党小组会 - 民主评议党员", 3,
                "开展民主评议党员活动，总结个人思想工作情况。",
                "党员活动室",
                LocalDateTime.now().plusDays(10).withHour(19).withMinute(0),
                LocalDateTime.now().plusDays(10).withHour(21).withMinute(0),
                3L, 2L),
            
            new Activity("党课 - 党史学习教育", 4,
                "回顾党的光辉历程，学习党史中的重要事件和人物。",
                "大会议室",
                LocalDateTime.now().plusDays(14).withHour(14).withMinute(30),
                LocalDateTime.now().plusDays(14).withHour(16).withMinute(30),
                1L, 1L),
            
            new Activity("主题党日 - 志愿服务活动", 5,
                "组织党员开展社区志愿服务，践行为人民服务的宗旨。",
                "社区服务中心",
                LocalDateTime.now().plusDays(21).withHour(8).withMinute(0),
                LocalDateTime.now().plusDays(21).withHour(12).withMinute(0),
                2L, 2L),
            
            new Activity("支部大会 - 发展党员讨论", 1,
                "讨论入党积极分子转为发展对象的相关事宜。",
                "会议室A",
                LocalDateTime.now().minusDays(7).withHour(14).withMinute(0),
                LocalDateTime.now().minusDays(7).withHour(16).withMinute(0),
                3L, 1L)
        );
        
        // 设置活动状态
        activities.get(0).setStatus(1); // 计划中
        activities.get(0).setMaxParticipants(20);
        activities.get(0).setIsRequired(true);
        
        activities.get(1).setStatus(1); // 计划中
        activities.get(1).setMaxParticipants(10);
        activities.get(1).setIsRequired(false);
        
        activities.get(2).setStatus(1); // 计划中
        activities.get(2).setMaxParticipants(15);
        activities.get(2).setIsRequired(true);
        
        activities.get(3).setStatus(1); // 计划中
        activities.get(3).setMaxParticipants(50);
        activities.get(3).setIsRequired(false);
        
        activities.get(4).setStatus(1); // 计划中
        activities.get(4).setMaxParticipants(30);
        activities.get(4).setIsRequired(false);
        
        activities.get(5).setStatus(3); // 已结束
        activities.get(5).setMaxParticipants(20);
        activities.get(5).setIsRequired(true);
        
        activityRepository.saveAll(activities);
        logger.info("初始化活动数据完成，共创建 {} 个活动", activities.size());
    }

    /**
     * 初始化活动参与者数据
     */
    private void initActivityParticipants() {
        if (activityParticipantRepository.count() > 0) {
            logger.info("活动参与者数据已存在，跳过初始化");
            return;
        }

        List<ActivityParticipant> participants = new ArrayList<>();
        
        // 为第一个活动（支部大会）添加参与者
        participants.add(new ActivityParticipant(1L, 1L, 1)); // 管理员 已报名
        participants.add(new ActivityParticipant(1L, 2L, 1)); // 张书记 已报名
        participants.add(new ActivityParticipant(1L, 3L, 1)); // 李支书 已报名
        participants.add(new ActivityParticipant(1L, 4L, 1)); // 王支书 已报名
        
        // 为第二个活动（支委会）添加参与者
        participants.add(new ActivityParticipant(2L, 2L, 1)); // 张书记 已报名
        participants.add(new ActivityParticipant(2L, 3L, 1)); // 李支书 已报名
        participants.add(new ActivityParticipant(2L, 4L, 1)); // 王支书 已报名
        
        // 为第三个活动（党小组会）添加参与者
        participants.add(new ActivityParticipant(3L, 3L, 1)); // 李支书 已报名
        participants.add(new ActivityParticipant(3L, 6L, 1)); // 陈党员 已报名
        participants.add(new ActivityParticipant(3L, 7L, 1)); // 刘党员 已报名
        participants.add(new ActivityParticipant(3L, 8L, 1)); // 杨党员 已报名
        
        // 为第四个活动（党课）添加参与者
        participants.add(new ActivityParticipant(4L, 1L, 1)); // 管理员 已报名
        participants.add(new ActivityParticipant(4L, 2L, 1)); // 张书记 已报名
        participants.add(new ActivityParticipant(4L, 6L, 1)); // 陈党员 已报名
        participants.add(new ActivityParticipant(4L, 7L, 1)); // 刘党员 已报名
        participants.add(new ActivityParticipant(4L, 11L, 1)); // 徐预备 已报名
        
        // 为第五个活动（主题党日）添加参与者
        participants.add(new ActivityParticipant(5L, 2L, 1)); // 张书记 已报名
        participants.add(new ActivityParticipant(5L, 6L, 1)); // 陈党员 已报名
        participants.add(new ActivityParticipant(5L, 8L, 1)); // 杨党员 已报名
        
        // 为第六个活动（已结束的支部大会）添加参与者，包含不同状态
        ActivityParticipant p1 = new ActivityParticipant(6L, 2L, 2); // 张书记 已签到
        p1.setSignInTime(LocalDateTime.now().minusDays(7).withHour(13).withMinute(55));
        participants.add(p1);
        
        ActivityParticipant p2 = new ActivityParticipant(6L, 3L, 2); // 李支书 已签到
        p2.setSignInTime(LocalDateTime.now().minusDays(7).withHour(14).withMinute(5));
        participants.add(p2);
        
        ActivityParticipant p3 = new ActivityParticipant(6L, 6L, 3); // 陈党员 请假
        p3.setNotes("因公出差，无法参加");
        participants.add(p3);
        
        participants.add(new ActivityParticipant(6L, 7L, 4)); // 刘党员 缺席
        
        ActivityParticipant p5 = new ActivityParticipant(6L, 8L, 2); // 杨党员 已签到
        p5.setSignInTime(LocalDateTime.now().minusDays(7).withHour(14).withMinute(10));
        participants.add(p5);
        
        activityParticipantRepository.saveAll(participants);
        logger.info("初始化活动参与者数据完成，共创建 {} 个参与记录", participants.size());
    }
}