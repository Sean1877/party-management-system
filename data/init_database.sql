-- 党建管理系统数据库初始化脚本
-- 创建时间: 2024

-- 创建数据库
CREATE DATABASE IF NOT EXISTS party_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE party_management_system;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    real_name VARCHAR(100) NOT NULL COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    role ENUM('ADMIN', 'PARTY_SECRETARY', 'MEMBER') NOT NULL DEFAULT 'MEMBER' COMMENT '角色',
    status ENUM('ACTIVE', 'INACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='用户表';

-- 党组织表
CREATE TABLE IF NOT EXISTS organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL COMMENT '组织名称',
    type ENUM('PARTY_COMMITTEE', 'PARTY_BRANCH', 'PARTY_GROUP') NOT NULL COMMENT '组织类型',
    parent_id BIGINT COMMENT '上级组织ID',
    secretary_id BIGINT COMMENT '书记ID',
    description TEXT COMMENT '组织描述',
    established_date DATE COMMENT '成立日期',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (parent_id) REFERENCES organizations(id),
    FOREIGN KEY (secretary_id) REFERENCES users(id)
) COMMENT='党组织表';

-- 党员表
CREATE TABLE IF NOT EXISTS party_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    organization_id BIGINT NOT NULL COMMENT '所属组织ID',
    member_number VARCHAR(50) UNIQUE COMMENT '党员编号',
    join_date DATE COMMENT '入党日期',
    probation_start_date DATE COMMENT '预备期开始日期',
    probation_end_date DATE COMMENT '预备期结束日期',
    member_type ENUM('FORMAL', 'PROBATIONARY', 'APPLICANT') NOT NULL DEFAULT 'APPLICANT' COMMENT '党员类型',
    status ENUM('ACTIVE', 'TRANSFERRED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
) COMMENT='党员表';

-- 党费标准表
CREATE TABLE IF NOT EXISTS fee_standards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '标准名称',
    income_min DECIMAL(10,2) NOT NULL COMMENT '收入下限',
    income_max DECIMAL(10,2) COMMENT '收入上限',
    fee_rate DECIMAL(5,4) NOT NULL COMMENT '缴费比例',
    fixed_amount DECIMAL(10,2) COMMENT '固定金额',
    description TEXT COMMENT '标准描述',
    effective_date DATE NOT NULL COMMENT '生效日期',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='党费标准表';

-- 党费缴纳记录表
CREATE TABLE IF NOT EXISTS fee_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL COMMENT '党员ID',
    standard_id BIGINT NOT NULL COMMENT '缴费标准ID',
    payment_year INT NOT NULL COMMENT '缴费年份',
    payment_month INT NOT NULL COMMENT '缴费月份',
    amount DECIMAL(10,2) NOT NULL COMMENT '缴费金额',
    payment_date DATE NOT NULL COMMENT '缴费日期',
    payment_method ENUM('CASH', 'BANK_TRANSFER', 'ONLINE') NOT NULL DEFAULT 'CASH' COMMENT '缴费方式',
    collector_id BIGINT COMMENT '收费人ID',
    remarks TEXT COMMENT '备注',
    status ENUM('PAID', 'OVERDUE', 'EXEMPTED') NOT NULL DEFAULT 'PAID' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (member_id) REFERENCES party_members(id),
    FOREIGN KEY (standard_id) REFERENCES fee_standards(id),
    FOREIGN KEY (collector_id) REFERENCES users(id),
    UNIQUE KEY uk_member_year_month (member_id, payment_year, payment_month)
) COMMENT='党费缴纳记录表';

-- 党建活动表
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '活动标题',
    content TEXT COMMENT '活动内容',
    activity_type ENUM('MEETING', 'STUDY', 'VOLUNTEER', 'CELEBRATION', 'OTHER') NOT NULL COMMENT '活动类型',
    organizer_id BIGINT NOT NULL COMMENT '组织者ID',
    organization_id BIGINT NOT NULL COMMENT '主办组织ID',
    start_time DATETIME NOT NULL COMMENT '开始时间',
    end_time DATETIME NOT NULL COMMENT '结束时间',
    location VARCHAR(200) COMMENT '活动地点',
    max_participants INT COMMENT '最大参与人数',
    registration_deadline DATETIME COMMENT '报名截止时间',
    status ENUM('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (organizer_id) REFERENCES users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
) COMMENT='党建活动表';

-- 活动参与记录表
CREATE TABLE IF NOT EXISTS activity_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_id BIGINT NOT NULL COMMENT '活动ID',
    user_id BIGINT NOT NULL COMMENT '参与者ID',
    registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
    attendance_status ENUM('REGISTERED', 'ATTENDED', 'ABSENT', 'CANCELLED') NOT NULL DEFAULT 'REGISTERED' COMMENT '参与状态',
    feedback TEXT COMMENT '反馈意见',
    rating INT COMMENT '评分(1-5)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY uk_activity_user (activity_id, user_id)
) COMMENT='活动参与记录表';

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT NOT NULL COMMENT '配置值',
    config_type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') NOT NULL DEFAULT 'STRING' COMMENT '配置类型',
    category VARCHAR(50) NOT NULL COMMENT '配置分类',
    description VARCHAR(500) COMMENT '配置描述',
    is_system BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否系统配置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='系统配置表';

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT COMMENT '操作用户ID',
    operation_type VARCHAR(50) NOT NULL COMMENT '操作类型',
    operation_module VARCHAR(50) NOT NULL COMMENT '操作模块',
    operation_description TEXT NOT NULL COMMENT '操作描述',
    target_id BIGINT COMMENT '操作目标ID',
    target_type VARCHAR(50) COMMENT '操作目标类型',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    request_params TEXT COMMENT '请求参数',
    response_result TEXT COMMENT '响应结果',
    execution_time INT COMMENT '执行时间(毫秒)',
    status ENUM('SUCCESS', 'FAILURE', 'ERROR') NOT NULL DEFAULT 'SUCCESS' COMMENT '操作状态',
    error_message TEXT COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='操作日志表';

-- 创建索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_organizations_parent_id ON organizations(parent_id);
CREATE INDEX idx_party_members_user_id ON party_members(user_id);
CREATE INDEX idx_party_members_organization_id ON party_members(organization_id);
CREATE INDEX idx_fee_payments_member_id ON fee_payments(member_id);
CREATE INDEX idx_fee_payments_year_month ON fee_payments(payment_year, payment_month);
CREATE INDEX idx_activities_organizer_id ON activities(organizer_id);
CREATE INDEX idx_activities_organization_id ON activities(organization_id);
CREATE INDEX idx_activities_start_time ON activities(start_time);
CREATE INDEX idx_operation_logs_user_id ON operation_logs(user_id);
CREATE INDEX idx_operation_logs_created_at ON operation_logs(created_at);
CREATE INDEX idx_operation_logs_module ON operation_logs(operation_module);