import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test-config.js';

test.describe('系统管理模块测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置测试超时
    page.setDefaultTimeout(TEST_CONFIG.TIMEOUTS.MEDIUM);
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
  });

  test('TC-SYS-001: 用户权限管理功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入用户管理页面
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForSelector('.user-management');
    
    // 3. 选择一个用户
    await page.click('.el-table__row:first-child [data-testid="edit-user-button"]');
    await page.waitForSelector('.user-form-dialog');
    
    // 4. 点击"权限设置"按钮
    await page.click('[data-testid="permission-settings-button"]');
    await page.waitForSelector('.permission-settings-dialog');
    
    // 5. 分配权限
    await page.check('input[name="permission_user_view"]');
    await page.check('input[name="permission_user_edit"]');
    await page.check('input[name="permission_activity_view"]');
    await page.uncheck('input[name="permission_system_admin"]');
    
    // 6. 保存权限设置
    await page.click('[data-testid="save-permissions-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 7. 验证权限设置立即生效
    await page.click('[data-testid="refresh-permissions-button"]');
    await page.waitForLoadState('networkidle');
    
    // 检查权限状态
    const userPermissions = await page.textContent('.user-permissions');
    expect(userPermissions).toContain('用户查看');
    expect(userPermissions).toContain('用户编辑');
    expect(userPermissions).toContain('活动查看');
    expect(userPermissions).not.toContain('系统管理');
    
    // 8. 查看权限变更历史
    await page.click('[data-testid="view-permission-history-button"]');
    await page.waitForSelector('.permission-history-dialog');
    
    // 验证历史记录
    const historyContent = await page.textContent('.permission-history-dialog');
    expect(historyContent).toContain('权限变更');
    expect(historyContent).toContain('分配权限');
    expect(historyContent).toContain('回收权限');
  });

  test('TC-SYS-002: 权限验证功能测试', async ({ page }) => {
    // 测试不同权限用户的访问控制
    
    // 1. 普通用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.USER.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.USER.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 尝试访问系统管理页面
    await page.goto(TEST_CONFIG.PAGES.SETTINGS);
    
    // 预期结果：应该显示权限不足的错误
    await expect(page.locator('.error-403')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('权限不足');
    
    // 3. 验证错误提示信息准确
    const errorMessage = await page.textContent('.error-message');
    expect(errorMessage).toContain('您没有访问此页面的权限');
    
    // 4. 组织管理员登录系统
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL(TEST_CONFIG.PAGES.LOGIN);
    
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 5. 尝试访问用户管理页面
    await page.goto(TEST_CONFIG.PAGES.USERS);
    
    // 预期结果：组织管理员可以访问用户管理
    await expect(page.locator('.user-management')).toBeVisible();
    
    // 6. 系统管理员登录系统
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL(TEST_CONFIG.PAGES.LOGIN);
    
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 7. 访问系统管理页面
    await page.goto(TEST_CONFIG.PAGES.SETTINGS);
    
    // 预期结果：系统管理员可以访问所有功能
    await expect(page.locator('.system-settings')).toBeVisible();
    
    // 8. 验证权限验证机制稳定可靠
    await page.goto('/admin/users');
    await expect(page.locator('.admin-users')).toBeVisible();
    
    await page.goto('/admin/roles');
    await expect(page.locator('.admin-roles')).toBeVisible();
    
    await page.goto('/admin/logs');
    await expect(page.locator('.admin-logs')).toBeVisible();
  });

  test('TC-SYS-003: 系统配置管理功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入系统设置页面
    await page.goto(TEST_CONFIG.PAGES.SETTINGS);
    await page.waitForSelector('.system-settings');
    
    // 3. 修改系统配置参数
    await page.click('[data-testid="basic-settings-tab"]');
    await page.waitForSelector('.basic-settings');
    
    await page.fill('input[name="systemName"]', '党建管理系统');
    await page.fill('input[name="systemDescription"]', '专业的党建工作管理平台');
    await page.fill('input[name="adminEmail"]', 'admin@party.com');
    await page.fill('input[name="sessionTimeout"]', '30');
    
    // 4. 保存配置更改
    await page.click('[data-testid="save-settings-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 5. 验证配置更改立即生效
    await page.waitForLoadState('networkidle');
    
    // 检查页面标题是否更新
    const pageTitle = await page.title();
    expect(pageTitle).toContain('党建管理系统');
    
    // 6. 测试邮件配置
    await page.click('[data-testid="email-settings-tab"]');
    await page.waitForSelector('.email-settings');
    
    await page.fill('input[name="smtpHost"]', 'smtp.party.com');
    await page.fill('input[name="smtpPort"]', '587');
    await page.fill('input[name="smtpUsername"]', 'noreply@party.com');
    await page.fill('input[name="smtpPassword"]', 'password123');
    await page.check('input[name="enableSSL"]');
    
    await page.click('[data-testid="save-email-settings-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 7. 测试文件上传配置
    await page.click('[data-testid="upload-settings-tab"]');
    await page.waitForSelector('.upload-settings');
    
    await page.fill('input[name="maxFileSize"]', '10');
    await page.selectOption('select[name="allowedTypes"]', 'image,pdf,doc,docx');
    await page.fill('input[name="uploadPath"]', '/uploads/');
    
    await page.click('[data-testid="save-upload-settings-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 8. 验证可以查看配置历史
    await page.click('[data-testid="view-config-history-button"]');
    await page.waitForSelector('.config-history-dialog');
    
    // 验证历史记录
    const historyContent = await page.textContent('.config-history-dialog');
    expect(historyContent).toContain('配置修改');
    expect(historyContent).toContain('修改时间');
    expect(historyContent).toContain('修改人');
    
    // 9. 验证系统运行正常
    await page.click('[data-testid="test-system-button"]');
    await page.waitForTimeout(2000);
    
    // 验证系统状态
    const systemStatus = await page.textContent('.system-status');
    expect(systemStatus).toContain('运行正常');
  });

  test('TC-SYS-004: 系统日志管理功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入系统日志页面
    await page.goto('/admin/logs');
    await page.waitForSelector('.system-logs');
    
    // 3. 查看操作日志
    await page.click('[data-testid="operation-logs-tab"]');
    await page.waitForSelector('.operation-logs');
    
    // 预期结果验证
    await expect(page.locator('.operation-logs')).toBeVisible();
    
    // 4. 搜索特定日志
    await page.fill('input[name="searchUser"]', 'admin');
    await page.selectOption('select[name="logType"]', 'user_management');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    
    await page.click('[data-testid="search-logs-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证搜索结果
    const searchResults = await page.textContent('.logs-table');
    expect(searchResults).toBeTruthy();
    
    // 5. 查看系统日志
    await page.click('[data-testid="system-logs-tab"]');
    await page.waitForSelector('.system-logs');
    
    // 验证系统日志显示
    await expect(page.locator('.system-logs')).toBeVisible();
    
    // 6. 查看错误日志
    await page.click('[data-testid="error-logs-tab"]');
    await page.waitForSelector('.error-logs');
    
    // 验证错误日志显示
    await expect(page.locator('.error-logs')).toBeVisible();
    
    // 7. 导出日志
    await page.click('[data-testid="export-logs-button"]');
    await page.waitForSelector('.export-logs-dialog');
    
    // 选择导出选项
    await page.selectOption('select[name="logType"]', 'all');
    await page.fill('input[name="exportStartDate"]', '2024-01-01');
    await page.fill('input[name="exportEndDate"]', '2024-12-31');
    await page.check('input[name="includeErrorLogs"]');
    
    await page.click('[data-testid="confirm-export-button"]');
    await page.waitForTimeout(3000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 8. 日志统计分析
    await page.click('[data-testid="log-analysis-button"]');
    await page.waitForSelector('.log-analysis-dialog');
    
    // 验证统计分析
    const analysisContent = await page.textContent('.log-analysis-dialog');
    expect(analysisContent).toContain('日志统计');
    expect(analysisContent).toContain('操作频率');
    expect(analysisContent).toContain('错误趋势');
    
    // 9. 日志清理
    await page.click('[data-testid="cleanup-logs-button"]');
    await page.waitForSelector('.cleanup-logs-dialog');
    
    // 设置清理条件
    await page.fill('input[name="cleanupBeforeDate"]', '2023-12-31');
    await page.check('input[name="cleanupOperationLogs"]');
    await page.check('input[name="cleanupErrorLogs"]');
    
    await page.click('[data-testid="confirm-cleanup-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
  });

  test('TC-SYS-005: 数据备份恢复功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入数据管理页面
    await page.goto('/admin/data-management');
    await page.waitForSelector('.data-management');
    
    // 3. 创建数据备份
    await page.click('[data-testid="create-backup-button"]');
    await page.waitForSelector('.backup-dialog');
    
    // 选择备份选项
    await page.check('input[name="backupUsers"]');
    await page.check('input[name="backupOrganizations"]');
    await page.check('input[name="backupActivities"]');
    await page.uncheck('input[name="backupLogs"]');
    
    await page.fill('input[name="backupDescription"]', '定期数据备份');
    await page.click('[data-testid="confirm-backup-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 4. 查看备份列表
    await page.click('[data-testid="view-backups-button"]');
    await page.waitForSelector('.backups-list');
    
    // 验证备份记录
    const backupList = await page.textContent('.backups-list');
    expect(backupList).toContain('定期数据备份');
    expect(backupList).toContain('备份时间');
    expect(backupList).toContain('备份大小');
    
    // 5. 下载备份文件
    await page.click('.backup-item:first-child [data-testid="download-backup-button"]');
    await page.waitForTimeout(2000);
    
    // 验证下载功能
    await expect(page.locator(TEST_CONFIG.SELECTORS.ERROR_MESSAGE)).not.toBeVisible();
    
    // 6. 删除备份
    await page.click('.backup-item:first-child [data-testid="delete-backup-button"]');
    await page.waitForSelector('.delete-confirmation-dialog');
    
    await page.click('[data-testid="confirm-delete-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 7. 数据恢复测试（谨慎操作）
    await page.click('[data-testid="restore-data-button"]');
    await page.waitForSelector('.restore-dialog');
    
    // 上传备份文件
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-data/backup-test.sql');
    
    // 填写恢复信息
    await page.fill('input[name="restoreDescription"]', '测试数据恢复');
    await page.check('input[name="confirmRestore"]');
    
    await page.click('[data-testid="confirm-restore-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 8. 验证数据完整性
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForSelector('.user-management');
    
    // 检查用户数据是否正常
    const userTable = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(userTable).toBeTruthy();
  });

  test('TC-SYS-006: 系统监控功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入系统监控页面
    await page.goto('/admin/monitoring');
    await page.waitForSelector('.system-monitoring');
    
    // 3. 查看系统性能监控
    await page.click('[data-testid="performance-monitoring-tab"]');
    await page.waitForSelector('.performance-monitoring');
    
    // 预期结果验证
    await expect(page.locator('.performance-monitoring')).toBeVisible();
    
    // 验证性能指标显示
    const performanceMetrics = await page.textContent('.performance-metrics');
    expect(performanceMetrics).toContain('CPU使用率');
    expect(performanceMetrics).toContain('内存使用率');
    expect(performanceMetrics).toContain('磁盘使用率');
    
    // 4. 查看资源监控
    await page.click('[data-testid="resource-monitoring-tab"]');
    await page.waitForSelector('.resource-monitoring');
    
    // 验证资源监控
    await expect(page.locator('.resource-monitoring')).toBeVisible();
    
    const resourceMetrics = await page.textContent('.resource-metrics');
    expect(resourceMetrics).toContain('数据库连接');
    expect(resourceMetrics).toContain('缓存使用');
    expect(resourceMetrics).toContain('线程池');
    
    // 5. 查看错误监控
    await page.click('[data-testid="error-monitoring-tab"]');
    await page.waitForSelector('.error-monitoring');
    
    // 验证错误监控
    await expect(page.locator('.error-monitoring')).toBeVisible();
    
    const errorMetrics = await page.textContent('.error-metrics');
    expect(errorMetrics).toContain('错误率');
    expect(errorMetrics).toContain('响应时间');
    expect(errorMetrics).toContain('异常统计');
    
    // 6. 查看业务监控
    await page.click('[data-testid="business-monitoring-tab"]');
    await page.waitForSelector('.business-monitoring');
    
    // 验证业务监控
    await expect(page.locator('.business-monitoring')).toBeVisible();
    
    const businessMetrics = await page.textContent('.business-metrics');
    expect(businessMetrics).toContain('用户活跃度');
    expect(businessMetrics).toContain('活动参与率');
    expect(businessMetrics).toContain('系统使用率');
    
    // 7. 设置监控告警
    await page.click('[data-testid="alert-settings-button"]');
    await page.waitForSelector('.alert-settings-dialog');
    
    // 配置告警规则
    await page.fill('input[name="cpuThreshold"]', '80');
    await page.fill('input[name="memoryThreshold"]', '85');
    await page.fill('input[name="errorRateThreshold"]', '5');
    await page.check('input[name="enableEmailAlert"]');
    await page.fill('input[name="alertEmail"]', 'admin@party.com');
    
    await page.click('[data-testid="save-alert-settings-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 8. 查看告警历史
    await page.click('[data-testid="alert-history-button"]');
    await page.waitForSelector('.alert-history-dialog');
    
    // 验证告警历史
    const alertHistory = await page.textContent('.alert-history-dialog');
    expect(alertHistory).toContain('告警时间');
    expect(alertHistory).toContain('告警类型');
    expect(alertHistory).toContain('告警级别');
  });
});