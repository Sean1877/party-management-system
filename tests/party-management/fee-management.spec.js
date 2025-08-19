import { test, expect } from '@playwright/test';
import { TEST_CONFIG, TEST_DATA } from '../config/test-config.js';

test.describe('党费管理模块测试', () => {
  
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

  test('TC-FEE-001: 党费缴纳标准设置测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党费管理页面
    await page.goto('/fees');
    await page.waitForSelector('.fee-management');
    
    // 3. 选择"党费标准"模块
    await page.click('[data-testid="fee-standards-tab"]');
    await page.waitForSelector('.fee-standards');
    
    // 4. 点击"添加标准"按钮
    await page.click('[data-testid="add-standard-button"]');
    await page.waitForSelector('.fee-standard-form-dialog');
    
    // 5. 设置收入级别和对应缴纳标准
    await page.fill('input[name="minIncome"]', '5000');
    await page.fill('input[name="maxIncome"]', '8000');
    await page.fill('input[name="feeAmount"]', '50');
    await page.fill('input[name="feePercentage"]', '1');
    
    // 6. 设置标准生效时间
    await page.fill('input[name="effectiveDate"]', '2024-01-01');
    
    // 7. 点击"保存"按钮
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    await expect(page.locator(TEST_CONFIG.SELECTORS.TABLE)).toContainText('5000-8000');
    
    // 验证标准历史记录
    await page.click('[data-testid="view-history-button"]');
    await page.waitForSelector('.history-dialog');
    await expect(page.locator('.history-dialog')).toContainText('党费标准');
  });

  test('TC-FEE-002: 党费缴纳记录管理测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党费管理页面
    await page.goto('/fees');
    await page.waitForSelector('.fee-management');
    
    // 3. 选择"缴纳管理"模块
    await page.click('[data-testid="fee-payment-tab"]');
    await page.waitForSelector('.fee-payment');
    
    // 4. 添加新的缴纳记录
    await page.click('[data-testid="add-payment-button"]');
    await page.waitForSelector('.fee-payment-form-dialog');
    
    // 填写缴纳记录信息
    await page.selectOption('select[name="userId"]', '1');
    await page.fill('input[name="paymentDate"]', '2024-01-15');
    await page.fill('input[name="amount"]', '50');
    await page.selectOption('select[name="paymentMethod"]', 'cash');
    await page.fill('textarea[name="remarks"]', '现金缴纳');
    
    // 保存缴纳记录
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 5. 修改缴纳记录状态
    await page.click('.el-table__row:first-child [data-testid="edit-payment-button"]');
    await page.waitForSelector('.fee-payment-form-dialog');
    await page.selectOption('select[name="status"]', 'confirmed');
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 6. 查询特定党员的缴纳记录
    await page.fill('input[name="searchUserName"]', '张');
    await page.click('[data-testid="search-payment-button"]');
    await page.waitForLoadState('networkidle');
    
    // 预期结果验证
    const tableContent = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(tableContent).toBeTruthy();
  });

  test('TC-FEE-003: 党费缴纳提醒功能测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党费管理页面
    await page.goto('/fees');
    await page.waitForSelector('.fee-management');
    
    // 3. 选择"缴纳管理"模块
    await page.click('[data-testid="fee-payment-tab"]');
    await page.waitForSelector('.fee-payment');
    
    // 4. 点击"发送提醒"按钮
    await page.click('[data-testid="send-reminder-button"]');
    await page.waitForSelector('.reminder-dialog');
    
    // 5. 选择提醒对象
    await page.check('input[name="selectAll"]');
    await page.fill('textarea[name="reminderMessage"]', '请及时缴纳本月党费。');
    
    // 6. 发送提醒
    await page.click('[data-testid="send-reminder-confirm-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 7. 查看提醒发送日志
    await page.click('[data-testid="view-reminder-log-button"]');
    await page.waitForSelector('.reminder-log-dialog');
    await expect(page.locator('.reminder-log-dialog')).toContainText('提醒发送');
    
    // 验证提醒日志记录
    const logContent = await page.textContent('.reminder-log-dialog');
    expect(logContent).toContain('发送时间');
    expect(logContent).toContain('接收人数');
  });

  test('TC-FEE-004: 党费缴纳凭证管理测试', async ({ page }) => {
    // 1. 管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党费管理页面
    await page.goto('/fees');
    await page.waitForSelector('.fee-management');
    
    // 3. 选择"缴纳管理"模块
    await page.click('[data-testid="fee-payment-tab"]');
    await page.waitForSelector('.fee-payment');
    
    // 4. 添加新的缴纳记录并上传凭证
    await page.click('[data-testid="add-payment-button"]');
    await page.waitForSelector('.fee-payment-form-dialog');
    
    // 填写基本信息
    await page.selectOption('select[name="userId"]', '1');
    await page.fill('input[name="paymentDate"]', '2024-01-15');
    await page.fill('input[name="amount"]', '50');
    await page.selectOption('select[name="paymentMethod"]', 'transfer');
    
    // 上传凭证文件
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-data/receipt.jpg');
    
    // 保存记录
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 5. 查看凭证
    await page.click('.el-table__row:first-child [data-testid="view-receipt-button"]');
    await page.waitForSelector('.receipt-viewer-dialog');
    await expect(page.locator('.receipt-viewer-dialog')).toBeVisible();
    
    // 验证凭证显示
    const receiptContent = await page.textContent('.receipt-viewer-dialog');
    expect(receiptContent).toBeTruthy();
  });

  test('TC-FEE-005: 党费收缴统计分析测试', async ({ page }) => {
    // 1. 财务管理人员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党费统计页面
    await page.goto('/fee-statistics');
    await page.waitForSelector('.fee-statistics-page');
    
    // 3. 选择统计时间范围
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    
    // 4. 选择统计维度（时间）
    await page.selectOption('select[name="statisticsDimension"]', 'monthly');
    
    // 5. 点击"生成报表"按钮
    await page.click('[data-testid="generate-report-button"]');
    
    // 等待统计报表生成
    await page.waitForTimeout(3000);
    
    // 预期结果验证
    await expect(page.locator('.statistics-chart')).toBeVisible();
    await expect(page.locator('.statistics-table')).toBeVisible();
    
    // 6. 验证报表数据
    const tableContent = await page.textContent('.statistics-table');
    expect(tableContent).toContain('月份');
    expect(tableContent).toContain('缴纳金额');
    expect(tableContent).toContain('缴纳人数');
    
    // 7. 导出统计报表
    await page.click('[data-testid="export-report-button"]');
    await page.waitForTimeout(2000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 8. 切换统计维度（组织）
    await page.selectOption('select[name="statisticsDimension"]', 'organization');
    await page.click('[data-testid="generate-report-button"]');
    await page.waitForTimeout(2000);
    
    // 验证组织维度统计
    await expect(page.locator('.statistics-chart')).toBeVisible();
  });

  test('TC-FEE-006: 党费收支管理测试', async ({ page }) => {
    // 1. 财务管理人员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入党费管理页面
    await page.goto('/fees');
    await page.waitForSelector('.fee-management');
    
    // 3. 选择"收支管理"模块
    await page.click('[data-testid="fee-income-expense-tab"]');
    await page.waitForSelector('.fee-income-expense');
    
    // 4. 添加收入记录
    await page.click('[data-testid="add-income-button"]');
    await page.waitForSelector('.income-form-dialog');
    
    // 填写收入记录
    await page.fill('input[name="amount"]', '1000');
    await page.selectOption('select[name="type"]', 'membership_fee');
    await page.fill('input[name="date"]', '2024-01-15');
    await page.fill('textarea[name="description"]', '党费收入');
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 5. 添加支出记录
    await page.click('[data-testid="add-expense-button"]');
    await page.waitForSelector('.expense-form-dialog');
    
    // 填写支出记录
    await page.fill('input[name="amount"]', '200');
    await page.selectOption('select[name="type"]', 'activity_expense');
    await page.fill('input[name="date"]', '2024-01-16');
    await page.fill('textarea[name="description"]', '活动支出');
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 6. 查看收支统计
    await page.click('[data-testid="view-summary-button"]');
    await page.waitForSelector('.summary-dialog');
    
    // 验证收支统计
    const summaryContent = await page.textContent('.summary-dialog');
    expect(summaryContent).toContain('总收入');
    expect(summaryContent).toContain('总支出');
    expect(summaryContent).toContain('结余');
    
    // 7. 生成收支报表
    await page.click('[data-testid="generate-summary-report-button"]');
    await page.waitForTimeout(2000);
    
    // 验证报表生成
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
  });
});