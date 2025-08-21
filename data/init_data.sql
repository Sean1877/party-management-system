-- 党建管理系统初始数据脚本
-- 创建时间: 2024

USE party_management_system;

-- 插入系统配置数据
INSERT INTO system_configs (config_key, config_value, config_type, category, description, is_system) VALUES
('system.name', '党建管理系统', 'STRING', 'SYSTEM', '系统名称', TRUE),
('system.version', '1.0.0', 'STRING', 'SYSTEM', '系统版本', TRUE),
('system.logo', '/images/logo.png', 'STRING', 'SYSTEM', '系统Logo路径', TRUE),
('party.fee.default_rate', '0.005', 'NUMBER', 'PARTY_FEE', '默认党费缴费比例(0.5%)', FALSE),
('party.fee.min_amount', '0.20', 'NUMBER', 'PARTY_FEE', '最低党费金额', FALSE),
('activity.max_participants', '100', 'NUMBER', 'ACTIVITY', '活动默认最大参与人数', FALSE),
('notification.email.enabled', 'true', 'BOOLEAN', 'NOTIFICATION', '是否启用邮件通知', FALSE),
('notification.sms.enabled', 'false', 'BOOLEAN', 'NOTIFICATION', '是否启用短信通知', FALSE),
('security.password.min_length', '8', 'NUMBER', 'SECURITY', '密码最小长度', TRUE),
('security.session.timeout', '3600', 'NUMBER', 'SECURITY', '会话超时时间(秒)', TRUE);

-- 插入默认管理员用户
INSERT INTO users (username, password, real_name, phone, email, role, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAjRC', '系统管理员', '13800138000', 'admin@party.gov.cn', 'ADMIN', 'ACTIVE'),
('secretary', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAjRC', '党委书记', '13800138001', 'secretary@party.gov.cn', 'PARTY_SECRETARY', 'ACTIVE'),
('member1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAjRC', '张三', '13800138002', 'zhangsan@party.gov.cn', 'MEMBER', 'ACTIVE'),
('member2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAjRC', '李四', '13800138003', 'lisi@party.gov.cn', 'MEMBER', 'ACTIVE'),
('member3', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAjRC', '王五', '13800138004', 'wangwu@party.gov.cn', 'MEMBER', 'ACTIVE');

-- 插入党组织数据
INSERT INTO organizations (name, type, parent_id, secretary_id, description, established_date, status) VALUES
('中共某某单位委员会', 'PARTY_COMMITTEE', NULL, 2, '单位党委', '2020-01-01', 'ACTIVE'),
('第一党支部', 'PARTY_BRANCH', 1, 3, '第一党支部', '2020-02-01', 'ACTIVE'),
('第二党支部', 'PARTY_BRANCH', 1, 4, '第二党支部', '2020-02-01', 'ACTIVE'),
('青年党小组', 'PARTY_GROUP', 2, 5, '青年党小组', '2020-03-01', 'ACTIVE');

-- 插入党员数据
INSERT INTO party_members (user_id, organization_id, member_number, join_date, member_type, status) VALUES
(2, 1, 'DY202001001', '2018-07-01', 'FORMAL', 'ACTIVE'),
(3, 2, 'DY202001002', '2019-07-01', 'FORMAL', 'ACTIVE'),
(4, 3, 'DY202001003', '2020-07-01', 'FORMAL', 'ACTIVE'),
(5, 4, 'DY202001004', '2021-07-01', 'PROBATIONARY', 'ACTIVE');

-- 插入党费标准数据
INSERT INTO fee_standards (name, income_min, income_max, fee_rate, fixed_amount, description, effective_date, status) VALUES
('基本工资标准', 0.00, 3000.00, 0.005, NULL, '月收入3000元以下按0.5%缴纳', '2024-01-01', 'ACTIVE'),
('中等收入标准', 3000.01, 5000.00, 0.01, NULL, '月收入3000-5000元按1%缴纳', '2024-01-01', 'ACTIVE'),
('高收入标准', 5000.01, 10000.00, 0.015, NULL, '月收入5000-10000元按1.5%缴纳', '2024-01-01', 'ACTIVE'),
('特高收入标准', 10000.01, NULL, 0.02, NULL, '月收入10000元以上按2%缴纳', '2024-01-01', 'ACTIVE'),
('最低标准', 0.00, NULL, NULL, 0.20, '最低党费标准0.2元', '2024-01-01', 'ACTIVE');

-- 插入党费缴纳记录示例数据
INSERT INTO fee_payments (member_id, standard_id, payment_year, payment_month, amount, payment_date, payment_method, collector_id, status) VALUES
(1, 2, 2024, 1, 40.00, '2024-01-15', 'BANK_TRANSFER', 1, 'PAID'),
(1, 2, 2024, 2, 40.00, '2024-02-15', 'BANK_TRANSFER', 1, 'PAID'),
(1, 2, 2024, 3, 40.00, '2024-03-15', 'BANK_TRANSFER', 1, 'PAID'),
(2, 1, 2024, 1, 15.00, '2024-01-15', 'CASH', 1, 'PAID'),
(2, 1, 2024, 2, 15.00, '2024-02-15', 'CASH', 1, 'PAID'),
(2, 1, 2024, 3, 15.00, '2024-03-15', 'CASH', 1, 'PAID'),
(3, 3, 2024, 1, 75.00, '2024-01-15', 'ONLINE', 1, 'PAID'),
(3, 3, 2024, 2, 75.00, '2024-02-15', 'ONLINE', 1, 'PAID'),
(4, 1, 2024, 1, 15.00, '2024-01-15', 'CASH', 1, 'PAID'),
(4, 1, 2024, 2, 15.00, '2024-02-15', 'CASH', 1, 'PAID');

-- 插入党建活动示例数据
INSERT INTO activities (title, content, activity_type, organizer_id, organization_id, start_time, end_time, location, max_participants, registration_deadline, status) VALUES
('学习党的二十大精神专题会议', '深入学习贯彻党的二十大精神，结合工作实际进行讨论交流', 'STUDY', 2, 1, '2024-04-15 14:00:00', '2024-04-15 16:00:00', '会议室A', 50, '2024-04-14 18:00:00', 'PUBLISHED'),
('志愿服务活动', '组织党员参与社区志愿服务活动', 'VOLUNTEER', 3, 2, '2024-04-20 09:00:00', '2024-04-20 12:00:00', '社区服务中心', 30, '2024-04-18 18:00:00', 'PUBLISHED'),
('党员大会', '召开季度党员大会，总结工作，部署下阶段任务', 'MEETING', 2, 1, '2024-04-25 15:00:00', '2024-04-25 17:00:00', '大会议室', 100, '2024-04-23 18:00:00', 'DRAFT'),
('建党节庆祝活动', '庆祝中国共产党成立103周年', 'CELEBRATION', 2, 1, '2024-07-01 10:00:00', '2024-07-01 12:00:00', '文化广场', 200, '2024-06-28 18:00:00', 'DRAFT');

-- 插入活动参与记录示例数据
INSERT INTO activity_participants (activity_id, user_id, attendance_status, feedback, rating) VALUES
(1, 2, 'ATTENDED', '学习内容丰富，收获很大', 5),
(1, 3, 'ATTENDED', '对工作很有指导意义', 5),
(1, 4, 'ATTENDED', '希望多组织这样的学习活动', 4),
(1, 5, 'ABSENT', NULL, NULL),
(2, 3, 'ATTENDED', '志愿服务很有意义', 5),
(2, 4, 'ATTENDED', '希望能定期组织', 4),
(2, 5, 'REGISTERED', NULL, NULL);

-- 插入操作日志示例数据
INSERT INTO operation_logs (user_id, operation_type, operation_module, operation_description, target_id, target_type, ip_address, status) VALUES
(1, 'LOGIN', 'AUTH', '管理员登录系统', NULL, NULL, '192.168.1.100', 'SUCCESS'),
(1, 'CREATE', 'USER', '创建用户: 张三', 3, 'USER', '192.168.1.100', 'SUCCESS'),
(1, 'CREATE', 'ORGANIZATION', '创建组织: 第一党支部', 2, 'ORGANIZATION', '192.168.1.100', 'SUCCESS'),
(2, 'LOGIN', 'AUTH', '党委书记登录系统', NULL, NULL, '192.168.1.101', 'SUCCESS'),
(2, 'CREATE', 'ACTIVITY', '创建活动: 学习党的二十大精神专题会议', 1, 'ACTIVITY', '192.168.1.101', 'SUCCESS'),
(3, 'LOGIN', 'AUTH', '党员张三登录系统', NULL, NULL, '192.168.1.102', 'SUCCESS'),
(3, 'REGISTER', 'ACTIVITY', '报名参加活动: 学习党的二十大精神专题会议', 1, 'ACTIVITY', '192.168.1.102', 'SUCCESS');