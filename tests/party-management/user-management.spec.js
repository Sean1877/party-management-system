import { test, expect } from '@playwright/test';
import { TEST_CONFIG, TEST_DATA } from '../config/test-config.js';

test.describe('党员管理模块测试', () => {
  
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

  test('TC-USER-001: 党员信息添加功能测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    
    // 等待登录成功
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党员管理页面
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForSelector('.user-management');
    
    // 3. 点击"添加党员"按钮
    await page.click('[data-testid="add-user-button"]');
    await page.waitForSelector('.user-form-dialog');
    
    // 4. 填写党员基本信息
    await page.fill('input[name="username"]', TEST_DATA.USER.VALID.username);
    await page.fill('input[name="password"]', TEST_DATA.USER.VALID.password);
    await page.fill('input[name="realName"]', TEST_DATA.USER.VALID.realName);
    await page.fill('input[name="idCard"]', TEST_DATA.USER.VALID.idCard);
    await page.fill('input[name="phone"]', TEST_DATA.USER.VALID.phone);
    await page.fill('input[name="email"]', TEST_DATA.USER.VALID.email);
    await page.selectOption('select[name="gender"]', String(TEST_DATA.USER.VALID.gender));
    await page.fill('input[name="birthDate"]', TEST_DATA.USER.VALID.birthDate);
    await page.fill('input[name="joinPartyDate"]', TEST_DATA.USER.VALID.joinPartyDate);
    await page.selectOption('select[name="partyStatus"]', String(TEST_DATA.USER.VALID.partyStatus));
    
    // 5. 点击"保存"按钮
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    await expect(page.locator(TEST_CONFIG.SELECTORS.TABLE)).toContainText(TEST_DATA.USER.VALID.realName);
  });

  test('TC-USER-002: 党员信息字段验证测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党员管理页面
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForSelector('.user-management');
    
    // 3. 点击"添加党员"按钮
    await page.click('[data-testid="add-user-button"]');
    await page.waitForSelector('.user-form-dialog');
    
    // 4. 不填写必填字段，直接点击保存
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果验证
    await expect(page.locator('.el-form-item__error')).toBeVisible();
    const errorMessages = await page.locator('.el-form-item__error').allTextContents();
    expect(errorMessages.some(msg => msg.includes('不能为空'))).toBeTruthy();
  });

  test('TC-USER-003: 党员信息多条件查询测试', async ({ page }) => {
    // 1. 用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党员管理页面
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForSelector('.user-management');
    
    // 3. 在查询条件中输入党员姓名
    await page.fill('input[name="searchName"]', '张');
    
    // 4. 选择党组织筛选条件
    await page.selectOption('select[name="searchOrganization"]', '1');
    
    // 5. 设置入党时间范围
    await page.fill('input[name="startDate"]', '2020-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    
    // 6. 点击"查询"按钮
    await page.click('[data-testid="search-button"]');
    
    // 等待查询结果
    await page.waitForLoadState('networkidle');
    
    // 预期结果验证
    const tableContent = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(tableContent).toBeTruthy(); // 确保有查询结果
  });

  test('TC-USER-004: 党员信息批量导入导出测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党员管理页面
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForSelector('.user-management');
    
    // 3. 点击"导入"按钮
    await page.click('[data-testid="import-button"]');
    await page.waitForSelector('.import-dialog');
    
    // 4. 选择包含党员信息的Excel文件（模拟）
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-data/users-template.xlsx');
    
    // 5. 点击"确认导入"按钮
    await page.click('[data-testid="confirm-import-button"]');
    
    // 等待导入完成
    await page.waitForTimeout(2000);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 6. 导出功能测试
    await page.click('[data-testid="export-button"]');
    await page.waitForTimeout(1000);
    
    // 验证导出成功（这里主要验证没有错误）
    await expect(page.locator(TEST_CONFIG.SELECTORS.ERROR_MESSAGE)).not.toBeVisible();
  });

  test('TC-USER-005: 党员状态变更测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党员管理页面
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForSelector('.user-management');
    
    // 3. 选择一个党员记录（第一个）
    await page.click('.el-table__row:first-child [data-testid="edit-button"]');
    await page.waitForSelector('.user-form-dialog');
    
    // 4. 修改党员状态
    await page.selectOption('select[name="partyStatus"]', '2'); // 改为预备党员
    
    // 5. 点击"保存"按钮
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 验证状态变更历史记录
    await page.click('.el-table__row:first-child [data-testid="history-button"]');
    await page.waitForSelector('.history-dialog');
    await expect(page.locator('.history-dialog')).toContainText('状态变更');
  });

  test('TC-USER-006: 党员转正流程测试', async ({ page }) => {
    // 1. 预备党员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.USER.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.USER.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入个人中心
    await page.click('[data-testid="profile-link"]');
    await page.waitForSelector('.profile-page');
    
    // 3. 点击"申请转正"按钮
    await page.click('[data-testid="apply-promotion-button"]');
    await page.waitForSelector('.promotion-form-dialog');
    
    // 4. 填写转正申请材料
    await page.fill('textarea[name="applicationContent"]', '我申请转正，请组织审批。');
    await page.fill('input[name="applicationDate"]', '2024-01-15');
    
    // 5. 提交申请
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 6. 管理员登录审批
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL(TEST_CONFIG.PAGES.LOGIN);
    
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 7. 进入待审批页面
    await page.goto('/approvals');
    await page.waitForSelector('.approvals-page');
    
    // 8. 审批申请
    await page.click('.el-table__row:first-child [data-testid="approve-button"]');
    await page.waitForSelector('.approval-dialog');
    await page.fill('textarea[name="approvalComment"]', '同意转正。');
    await page.click('[data-testid="approve-confirm-button"]');
    
    // 最终验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
  });

  test('TC-USER-007: 党员多维度统计分析测试', async ({ page }) => {
    // 1. 用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入统计分析页面
    await page.goto('/statistics');
    await page.waitForSelector('.statistics-page');
    
    // 3. 选择"党员统计"模块
    await page.click('[data-testid="user-statistics-tab"]');
    await page.waitForSelector('.user-statistics');
    
    // 4. 选择统计维度（年龄）
    await page.selectOption('select[name="statisticsDimension"]', 'age');
    await page.click('[data-testid="generate-statistics-button"]');
    
    // 等待统计图表生成
    await page.waitForTimeout(2000);
    
    // 预期结果验证
    await expect(page.locator('.chart-container')).toBeVisible();
    
    // 5. 设置统计时间范围
    await page.fill('input[name="statisticsStartDate"]', '2023-01-01');
    await page.fill('input[name="statisticsEndDate"]', '2024-12-31');
    await page.click('[data-testid="generate-statistics-button"]');
    
    // 等待统计结果更新
    await page.waitForTimeout(2000);
    
    // 6. 点击"生成统计"按钮
    await page.click('[data-testid="generate-statistics-button"]');
    
    // 验证图表导出功能
    await page.click('[data-testid="export-chart-button"]');
    await page.waitForTimeout(1000);
    
    // 最终验证
    await expect(page.locator('.chart-container')).toBeVisible();
  });
});