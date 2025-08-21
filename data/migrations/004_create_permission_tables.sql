-- 创建权限相关表的迁移脚本
-- 创建时间: 2024-01-20
-- 描述: 创建权限表、角色权限关联表、用户角色关联表

-- 创建权限表
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    code VARCHAR(100) NOT NULL UNIQUE COMMENT '权限代码',
    name VARCHAR(100) NOT NULL COMMENT '权限名称',
    description VARCHAR(500) COMMENT '权限描述',
    module VARCHAR(50) COMMENT '所属模块',
    type VARCHAR(20) COMMENT '权限类型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_code (code),
    INDEX idx_module (module),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 修改角色表结构，移除JSON格式的permissions字段，添加updated_at字段
ALTER TABLE roles 
DROP COLUMN IF EXISTS permissions,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间' AFTER created_at;

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关联ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- 创建用户角色关联表（多对多关系）
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关联ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_role (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 插入系统基础权限数据
INSERT IGNORE INTO permissions (code, name, description, module, type) VALUES
-- 用户管理权限
('user:read', '查看用户', '查看用户信息的权限', '用户管理', 'READ'),
('user:create', '创建用户', '创建新用户的权限', '用户管理', 'CREATE'),
('user:update', '更新用户', '更新用户信息的权限', '用户管理', 'UPDATE'),
('user:delete', '删除用户', '删除用户的权限', '用户管理', 'DELETE'),
('user:export', '导出用户', '导出用户数据的权限', '用户管理', 'EXPORT'),

-- 角色管理权限
('role:read', '查看角色', '查看角色信息的权限', '角色管理', 'READ'),
('role:create', '创建角色', '创建新角色的权限', '角色管理', 'CREATE'),
('role:update', '更新角色', '更新角色信息的权限', '角色管理', 'UPDATE'),
('role:delete', '删除角色', '删除角色的权限', '角色管理', 'DELETE'),
('role:assign', '分配角色', '为用户分配角色的权限', '角色管理', 'ASSIGN'),

-- 权限管理权限
('permission:read', '查看权限', '查看权限信息的权限', '权限管理', 'READ'),
('permission:create', '创建权限', '创建新权限的权限', '权限管理', 'CREATE'),
('permission:update', '更新权限', '更新权限信息的权限', '权限管理', 'UPDATE'),
('permission:delete', '删除权限', '删除权限的权限', '权限管理', 'DELETE'),

-- 组织管理权限
('organization:read', '查看组织', '查看组织信息的权限', '组织管理', 'READ'),
('organization:create', '创建组织', '创建新组织的权限', '组织管理', 'CREATE'),
('organization:update', '更新组织', '更新组织信息的权限', '组织管理', 'UPDATE'),
('organization:delete', '删除组织', '删除组织的权限', '组织管理', 'DELETE'),

-- 党费管理权限
('fee:read', '查看党费', '查看党费信息的权限', '党费管理', 'READ'),
('fee:create', '创建党费', '创建党费记录的权限', '党费管理', 'CREATE'),
('fee:update', '更新党费', '更新党费信息的权限', '党费管理', 'UPDATE'),
('fee:delete', '删除党费', '删除党费记录的权限', '党费管理', 'DELETE'),
('fee:payment', '党费缴纳', '处理党费缴纳的权限', '党费管理', 'PAYMENT'),
('fee:export', '导出党费', '导出党费数据的权限', '党费管理', 'EXPORT'),

-- 活动管理权限
('activity:read', '查看活动', '查看活动信息的权限', '活动管理', 'READ'),
('activity:create', '创建活动', '创建新活动的权限', '活动管理', 'CREATE'),
('activity:update', '更新活动', '更新活动信息的权限', '活动管理', 'UPDATE'),
('activity:delete', '删除活动', '删除活动的权限', '活动管理', 'DELETE'),
('activity:participate', '参与活动', '参与活动的权限', '活动管理', 'PARTICIPATE'),

-- 系统管理权限
('system:config', '系统配置', '系统配置管理的权限', '系统管理', 'CONFIG'),
('system:log', '系统日志', '查看系统日志的权限', '系统管理', 'LOG'),
('system:backup', '系统备份', '系统备份的权限', '系统管理', 'BACKUP'),
('system:monitor', '系统监控', '系统监控的权限', '系统管理', 'MONITOR'),

-- 统计分析权限
('statistics:read', '查看统计', '查看统计数据的权限', '统计分析', 'READ'),
('statistics:export', '导出统计', '导出统计报表的权限', '统计分析', 'EXPORT');

-- 插入系统基础角色数据（如果不存在）
INSERT IGNORE INTO roles (name, code, description, is_active) VALUES
('超级管理员', 'SUPER_ADMIN', '系统超级管理员，拥有所有权限', TRUE),
('管理员', 'ADMIN', '系统管理员，拥有大部分管理权限', TRUE),
('组织管理员', 'ORG_ADMIN', '组织管理员，负责组织内部管理', TRUE),
('普通用户', 'USER', '普通用户，拥有基本权限', TRUE),
('党员', 'PARTY_MEMBER', '党员用户，拥有党员相关权限', TRUE);

-- 为超级管理员角色分配所有权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'SUPER_ADMIN';

-- 为管理员角色分配管理权限（除了系统配置）
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'ADMIN'
AND p.code NOT IN ('system:config', 'system:backup');

-- 为组织管理员分配组织相关权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'ORG_ADMIN'
AND p.module IN ('用户管理', '组织管理', '活动管理', '统计分析')
AND p.type IN ('READ', 'CREATE', 'UPDATE');

-- 为普通用户分配基本查看权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'USER'
AND p.type = 'READ'
AND p.module NOT IN ('系统管理', '权限管理');

-- 为党员用户分配党员相关权限
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'PARTY_MEMBER'
AND (p.type = 'READ' OR (p.module = '党费管理' AND p.code = 'fee:payment') OR (p.module = '活动管理' AND p.code = 'activity:participate'));

-- 为现有用户分配默认角色（如果用户没有角色）
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE r.code = 'USER'
AND u.id NOT IN (SELECT user_id FROM user_roles);

-- 为管理员用户分配管理员角色（假设用户名为admin的是管理员）
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin'
AND r.code = 'SUPER_ADMIN';

COMMIT;