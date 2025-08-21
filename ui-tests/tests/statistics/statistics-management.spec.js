import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test-config.js';

test.describe('统计分析模块测试', () => {
  
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

  test('TC-STATS-001: 综合统计仪表盘功能测试', async ({ page }) => {
    // 1. 管理者登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入统计仪表盘页面
    await page.goto('/statistics/dashboard');
    await page.waitForSelector('.statistics-dashboard');
    
    // 3. 查看各项统计数据
    await expect(page.locator('.dashboard-overview')).toBeVisible();
    
    // 预期结果验证
    const overviewStats = await page.textContent('.dashboard-overview');
    expect(overviewStats).toContain('党员总数');
    expect(overviewStats).toContain('组织总数');
    expect(overviewStats).toContain('活动总数');
    expect(overviewStats).toContain('本月新增');
    
    // 4. 切换不同时间维度
    await page.selectOption('select[name="timeDimension"]', 'monthly');
    await page.click('[data-testid="refresh-dashboard-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证月度统计
    const monthlyStats = await page.textContent('.dashboard-overview');
    expect(monthlyStats).toBeTruthy();
    
    // 5. 切换到季度统计
    await page.selectOption('select[name="timeDimension"]', 'quarterly');
    await page.click('[data-testid="refresh-dashboard-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证季度统计
    const quarterlyStats = await page.textContent('.dashboard-overview');
    expect(quarterlyStats).toBeTruthy();
    
    // 6. 切换到年度统计
    await page.selectOption('select[name="timeDimension"]', 'yearly');
    await page.click('[data-testid="refresh-dashboard-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证年度统计
    const yearlyStats = await page.textContent('.dashboard-overview');
    expect(yearlyStats).toBeTruthy();
    
    // 7. 验证图表展示清晰直观
    await expect(page.locator('.chart-container')).toBeVisible();
    await expect(page.locator('.trend-chart')).toBeVisible();
    await expect(page.locator('.distribution-chart')).toBeVisible();
    
    // 8. 导出统计报表
    await page.click('[data-testid="export-dashboard-report-button"]');
    await page.waitForTimeout(3000);
    
    // 验证导出功能正常工作
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
  });

  test('TC-STATS-002: 党员统计分析功能测试', async ({ page }) => {
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
    await expect(page.locator('.age-distribution-chart')).toBeVisible();
    
    // 验证年龄分布数据
    const ageChartContent = await page.textContent('.age-distribution-chart');
    expect(ageChartContent).toBeTruthy();
    
    // 5. 切换到性别统计
    await page.selectOption('select[name="statisticsDimension"]', 'gender');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 验证性别统计
    await expect(page.locator('.gender-distribution-chart')).toBeVisible();
    
    const genderChartContent = await page.textContent('.gender-distribution-chart');
    expect(genderChartContent).toContain('男');
    expect(genderChartContent).toContain('女');
    
    // 6. 切换到学历统计
    await page.selectOption('select[name="statisticsDimension"]', 'education');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 验证学历统计
    await expect(page.locator('.education-distribution-chart')).toBeVisible();
    
    const educationChartContent = await page.textContent('.education-distribution-chart');
    expect(educationChartContent).toBeTruthy();
    
    // 7. 设置统计时间范围
    await page.fill('input[name="statisticsStartDate"]', '2023-01-01');
    await page.fill('input[name="statisticsEndDate"]', '2024-12-31');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 8. 验证图表导出功能
    await page.click('[data-testid="export-chart-button"]');
    await page.waitForTimeout(2000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 9. 查看详细数据表格
    await page.click('[data-testid="view-detailed-data-button"]');
    await page.waitForSelector('.detailed-data-table');
    
    // 验证数据表格
    const tableContent = await page.textContent('.detailed-data-table');
    expect(tableContent).toContain('年龄段');
    expect(tableContent).toContain('人数');
    expect(tableContent).toContain('占比');
  });

  test('TC-STATS-003: 活动统计分析功能测试', async ({ page }) => {
    // 1. 用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入统计分析页面
    await page.goto('/statistics');
    await page.waitForSelector('.statistics-page');
    
    // 3. 选择"活动统计"模块
    await page.click('[data-testid="activity-statistics-tab"]');
    await page.waitForSelector('.activity-statistics');
    
    // 4. 选择统计维度（活动类型）
    await page.selectOption('select[name="statisticsDimension"]', 'type');
    await page.click('[data-testid="generate-statistics-button"]');
    
    // 等待统计图表生成
    await page.waitForTimeout(2000);
    
    // 预期结果验证
    await expect(page.locator('.activity-type-chart')).toBeVisible();
    
    // 验证活动类型分布
    const typeChartContent = await page.textContent('.activity-type-chart');
    expect(typeChartContent).toContain('支部党员大会');
    expect(typeChartContent).toContain('支部委员会');
    expect(typeChartContent).toContain('党小组会');
    expect(typeChartContent).toContain('党课');
    expect(typeChartContent).toContain('主题党日活动');
    
    // 5. 切换到参与率统计
    await page.selectOption('select[name="statisticsDimension"]', 'participation');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 验证参与率统计
    await expect(page.locator('.participation-rate-chart')).toBeVisible();
    
    const participationContent = await page.textContent('.participation-rate-chart');
    expect(participationContent).toContain('参与率');
    expect(participationContent).toContain('平均参与率');
    
    // 6. 切换到时间趋势统计
    await page.selectOption('select[name="statisticsDimension"]', 'trend');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 验证时间趋势
    await expect(page.locator('.activity-trend-chart')).toBeVisible();
    
    const trendContent = await page.textContent('.activity-trend-chart');
    expect(trendContent).toContain('活动数量');
    expect(trendContent).toContain('时间趋势');
    
    // 7. 设置统计时间范围
    await page.fill('input[name="statisticsStartDate"]', '2024-01-01');
    await page.fill('input[name="statisticsEndDate"]', '2024-12-31');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 8. 导出活动统计报表
    await page.click('[data-testid="export-activity-report-button"]');
    await page.waitForTimeout(2000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 9. 查看活动效果分析
    await page.click('[data-testid="view-activity-effectiveness-button"]');
    await page.waitForSelector('.activity-effectiveness-dialog');
    
    // 验证效果分析
    const effectivenessContent = await page.textContent('.activity-effectiveness-dialog');
    expect(effectivenessContent).toContain('活动评分');
    expect(effectivenessContent).toContain('满意度');
    expect(effectivenessContent).toContain('效果分析');
  });

  test('TC-STATS-004: 组织统计分析功能测试', async ({ page }) => {
    // 1. 用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入统计分析页面
    await page.goto('/statistics');
    await page.waitForSelector('.statistics-page');
    
    // 3. 选择"组织统计"模块
    await page.click('[data-testid="organization-statistics-tab"]');
    await page.waitForSelector('.organization-statistics');
    
    // 4. 选择统计维度（组织类型）
    await page.selectOption('select[name="statisticsDimension"]', 'type');
    await page.click('[data-testid="generate-statistics-button"]');
    
    // 等待统计图表生成
    await page.waitForTimeout(2000);
    
    // 预期结果验证
    await expect(page.locator('.organization-type-chart')).toBeVisible();
    
    // 验证组织类型分布
    const typeChartContent = await page.textContent('.organization-type-chart');
    expect(typeChartContent).toBeTruthy();
    
    // 5. 切换到人员规模统计
    await page.selectOption('select[name="statisticsDimension"]', 'size');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 验证人员规模统计
    await expect(page.locator('.organization-size-chart')).toBeVisible();
    
    const sizeContent = await page.textContent('.organization-size-chart');
    expect(sizeContent).toContain('人员分布');
    expect(sizeContent).toContain('组织规模');
    
    // 6. 切换到层级结构统计
    await page.selectOption('select[name="statisticsDimension"]', 'hierarchy');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2002);
    
    // 验证层级结构
    await expect(page.locator('.organization-hierarchy-chart')).toBeVisible();
    
    const hierarchyContent = await page.textContent('.organization-hierarchy-chart');
    expect(hierarchyContent).toContain('层级分布');
    expect(hierarchyContent).toContain('组织结构');
    
    // 7. 设置统计时间范围
    await page.fill('input[name="statisticsStartDate"]', '2024-01-01');
    await page.fill('input[name="statisticsEndDate"]', '2024-12-31');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 8. 导出组织统计报表
    await page.click('[data-testid="export-organization-report-button"]');
    await page.waitForTimeout(2000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 9. 查看组织发展分析
    await page.click('[data-testid="view-organization-growth-button"]');
    await page.waitForSelector('.organization-growth-dialog');
    
    // 验证发展分析
    const growthContent = await page.textContent('.organization-growth-dialog');
    expect(growthContent).toContain('发展趋势');
    expect(growthContent).toContain('增长率');
    expect(growthContent).toContain('发展分析');
  });

  test('TC-STATS-005: 党费统计分析功能测试', async ({ page }) => {
    // 1. 财务管理人员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入统计分析页面
    await page.goto('/statistics');
    await page.waitForSelector('.statistics-page');
    
    // 3. 选择"党费统计"模块
    await page.click('[data-testid="fee-statistics-tab"]');
    await page.waitForSelector('.fee-statistics');
    
    // 4. 选择统计维度（缴纳情况）
    await page.selectOption('select[name="statisticsDimension"]', 'payment');
    await page.click('[data-testid="generate-statistics-button"]');
    
    // 等待统计图表生成
    await page.waitForTimeout(2000);
    
    // 预期结果验证
    await expect(page.locator('.fee-payment-chart')).toBeVisible();
    
    // 验证缴纳情况统计
    const paymentContent = await page.textContent('.fee-payment-chart');
    expect(paymentContent).toContain('缴纳率');
    expect(paymentContent).toContain('未缴纳');
    expect(paymentContent).toContain('已缴纳');
    
    // 5. 切换到收入统计
    await page.selectOption('select[name="statisticsDimension"]', 'income');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 验证收入统计
    await expect(page.locator('.fee-income-chart')).toBeVisible();
    
    const incomeContent = await page.textContent('.fee-income-chart');
    expect(incomeContent).toContain('党费收入');
    expect(incomeContent).toContain('收入趋势');
    
    // 6. 切换到支出统计
    await page.selectOption('select[name="statisticsDimension"]', 'expense');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 验证支出统计
    await expect(page.locator('.fee-expense-chart')).toBeVisible();
    
    const expenseContent = await page.textContent('.fee-expense-chart');
    expect(expenseContent).toContain('党费支出');
    expect(expenseContent).toContain('支出分布');
    
    // 7. 设置统计时间范围
    await page.fill('input[name="statisticsStartDate"]', '2024-01-01');
    await page.fill('input[name="statisticsEndDate"]', '2024-12-31');
    await page.click('[data-testid="generate-statistics-button"]');
    await page.waitForTimeout(2000);
    
    // 8. 导出党费统计报表
    await page.click('[data-testid="export-fee-report-button"]');
    await page.waitForTimeout(2000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 9. 查看财务分析
    await page.click('[data-testid="view-financial-analysis-button"]');
    await page.waitForSelector('.financial-analysis-dialog');
    
    // 验证财务分析
    const analysisContent = await page.textContent('.financial-analysis-dialog');
    expect(analysisContent).toContain('收支对比');
    expect(analysisContent).toContain('结余分析');
    expect(analysisContent).toContain('财务状况');
  });

  test('TC-STATS-006: 自定义报表功能测试', async ({ page }) => {
    // 1. 管理者登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入统计分析页面
    await page.goto('/statistics');
    await page.waitForSelector('.statistics-page');
    
    // 3. 选择"自定义报表"模块
    await page.click('[data-testid="custom-report-tab"]');
    await page.waitForSelector('.custom-report');
    
    // 4. 创建新报表
    await page.click('[data-testid="create-custom-report-button"]');
    await page.waitForSelector('.custom-report-dialog');
    
    // 5. 配置报表参数
    await page.fill('input[name="reportName"]', '党员活动参与度分析');
    await page.selectOption('select[name="reportType"]', 'combined');
    await page.check('input[name="includeUserStats"]');
    await page.check('input[name="includeActivityStats"]');
    await page.uncheck('input[name="includeFeeStats"]');
    
    // 设置时间范围
    await page.fill('input[name="reportStartDate"]', '2024-01-01');
    await page.fill('input[name="reportEndDate"]', '2024-12-31');
    
    // 选择图表类型
    await page.selectOption('select[name="chartType"]', 'mixed');
    
    // 6. 生成报表
    await page.click('[data-testid="generate-custom-report-button"]');
    await page.waitForTimeout(3000);
    
    // 预期结果验证
    await expect(page.locator('.custom-report-result')).toBeVisible();
    
    // 验证报表内容
    const reportContent = await page.textContent('.custom-report-result');
    expect(reportContent).toContain('党员活动参与度分析');
    expect(reportContent).toContain('统计时间');
    expect(reportContent).toContain('数据概览');
    
    // 7. 保存报表模板
    await page.click('[data-testid="save-report-template-button"]');
    await page.waitForSelector('.save-template-dialog');
    
    await page.fill('input[name="templateName"]', '党员活动参与度模板');
    await page.fill('input[name="templateDescription"]', '分析党员参与活动的情况和趋势');
    await page.check('input[name="isPublic"]');
    
    await page.click('[data-testid="confirm-save-template-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 8. 导出自定义报表
    await page.click('[data-testid="export-custom-report-button"]');
    await page.waitForTimeout(3000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 9. 查看保存的报表模板
    await page.click('[data-testid="view-saved-templates-button"]');
    await page.waitForSelector('.saved-templates-dialog');
    
    // 验证模板保存
    const templatesContent = await page.textContent('.saved-templates-dialog');
    expect(templatesContent).toContain('党员活动参与度模板');
    expect(templatesContent).toContain('分析党员参与活动的情况和趋势');
  });
});