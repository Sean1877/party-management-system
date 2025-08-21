import { test, expect } from '@playwright/test';
import { TEST_CONFIG, TEST_DATA } from '../config/test-config.js';

test.describe('活动管理模块测试', () => {
  
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

  test('TC-ACTIVITY-001: 活动创建功能测试', async ({ page }) => {
    // 1. 活动组织者登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入活动管理页面
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    // 3. 点击"创建活动"按钮
    await page.click('[data-testid="create-activity-button"]');
    await page.waitForSelector('.activity-form-dialog');
    
    // 4. 填写活动基本信息
    await page.fill('input[name="title"]', TEST_DATA.ACTIVITY.VALID.title);
    await page.selectOption('select[name="type"]', String(TEST_DATA.ACTIVITY.VALID.type));
    await page.fill('textarea[name="content"]', TEST_DATA.ACTIVITY.VALID.content);
    await page.fill('input[name="location"]', TEST_DATA.ACTIVITY.VALID.location);
    await page.fill('input[name="startTime"]', TEST_DATA.ACTIVITY.VALID.startTime);
    await page.fill('input[name="endTime"]', TEST_DATA.ACTIVITY.VALID.endTime);
    await page.fill('input[name="maxParticipants"]', String(TEST_DATA.ACTIVITY.VALID.maxParticipants));
    
    // 5. 设置活动参与限制
    if (TEST_DATA.ACTIVITY.VALID.isRequired) {
      await page.check('input[name="isRequired"]');
    }
    
    // 6. 点击"发布"按钮
    await page.click('[data-testid="publish-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    await expect(page.locator(TEST_CONFIG.SELECTORS.TABLE)).toContainText(TEST_DATA.ACTIVITY.VALID.title);
    
    // 验证活动状态为"已发布"
    const statusText = await page.textContent('.el-table__row:first-child .status-cell');
    expect(statusText).toContain('已发布');
  });

  test('TC-ACTIVITY-002: 活动报名功能测试', async ({ page }) => {
    // 1. 党员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.USER.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.USER.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入活动列表页面
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    // 3. 选择一个可报名的活动
    const firstActivity = page.locator('.el-table__row:first-child');
    const activityTitle = await firstActivity.locator('.title-cell').textContent();
    
    await firstActivity.click('[data-testid="view-activity-button"]');
    await page.waitForSelector('.activity-detail-dialog');
    
    // 4. 点击"报名"按钮
    await page.click('[data-testid="join-activity-button"]');
    await page.waitForSelector('.join-confirmation-dialog');
    
    // 5. 确认报名信息
    await expect(page.locator('.join-confirmation-dialog')).toContainText(activityTitle);
    await page.click('[data-testid="confirm-join-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 6. 验证报名状态
    await page.waitForTimeout(1000);
    await page.click('[data-testid="refresh-button"]');
    await page.waitForLoadState('networkidle');
    
    // 重新进入活动详情查看报名状态
    await page.click('.el-table__row:first-child [data-testid="view-activity-button"]');
    await page.waitForSelector('.activity-detail-dialog');
    
    const statusText = await page.textContent('.join-status');
    expect(statusText).toContain('已报名');
    
    // 验证活动参与人数相应增加
    const participantCount = await page.textContent('.participant-count');
    expect(parseInt(participantCount)).toBeGreaterThan(0);
  });

  test('TC-ACTIVITY-003: 活动签到功能测试', async ({ page }) => {
    // 1. 活动管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入活动详情页面
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    await page.click('.el-table__row:first-child [data-testid="view-activity-button"]');
    await page.waitForSelector('.activity-detail-dialog');
    
    // 3. 点击"开始签到"按钮
    await page.click('[data-testid="start-checkin-button"]');
    await page.waitForSelector('.checkin-management-dialog');
    
    // 4. 生成签到二维码
    await expect(page.locator('.qrcode-container')).toBeVisible();
    await expect(page.locator('.checkin-code')).toBeVisible();
    
    // 5. 模拟党员扫码签到（通过直接调用签到接口）
    await page.click('[data-testid="manual-checkin-button"]');
    await page.waitForSelector('.manual-checkin-dialog');
    
    // 选择党员进行手动签到
    await page.selectOption('select[name="userId"]', '1');
    await page.click('[data-testid="confirm-checkin-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 6. 查看签到统计结果
    await page.click('[data-testid="view-checkin-stats-button"]');
    await page.waitForSelector('.checkin-stats-dialog');
    
    // 验证签到统计数据
    const statsContent = await page.textContent('.checkin-stats-dialog');
    expect(statsContent).toContain('总人数');
    expect(statsContent).toContain('已签到');
    expect(statsContent).toContain('未签到');
    
    // 验证签到率计算
    const checkinRate = await page.textContent('.checkin-rate');
    expect(checkinRate).toBeTruthy();
  });

  test('TC-ACTIVITY-004: 活动参与统计分析测试', async ({ page }) => {
    // 1. 活动管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入活动详情页面
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    await page.click('.el-table__row:first-child [data-testid="view-activity-button"]');
    await page.waitForSelector('.activity-detail-dialog');
    
    // 3. 查看参与统计信息
    await page.click('[data-testid="view-participation-stats-button"]');
    await page.waitForSelector('.participation-stats-dialog');
    
    // 预期结果验证
    await expect(page.locator('.participation-stats-dialog')).toBeVisible();
    
    // 验证统计数据实时更新
    const statsContent = await page.textContent('.participation-stats-dialog');
    expect(statsContent).toContain('报名人数');
    expect(statsContent).toContain('实际参与');
    expect(statsContent).toContain('参与率');
    
    // 4. 导出参与统计报表
    await page.click('[data-testid="export-participation-report-button"]');
    await page.waitForTimeout(2000);
    
    // 验证导出功能正常工作
    await expect(page.locator(TEST_CONFIG.SELECTORS.ERROR_MESSAGE)).not.toBeVisible();
    
    // 5. 查看参与率分析
    await page.click('[data-testid="view-participation-analysis-button"]');
    await page.waitForSelector('.participation-analysis-dialog');
    
    // 验证参与率分析结果正确
    const analysisContent = await page.textContent('.participation-analysis-dialog');
    expect(analysisContent).toContain('参与率分析');
    expect(analysisContent).toContain('组织参与率对比');
    expect(analysisContent).toContain('历史趋势');
  });

  test('TC-ACTIVITY-005: 活动效果评价功能测试', async ({ page }) => {
    // 1. 参与者登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.USER.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.USER.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入已结束的活动页面
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    // 选择已结束的活动
    await page.selectOption('select[name="statusFilter"]', 'finished');
    await page.click('[data-testid="search-button"]');
    await page.waitForLoadState('networkidle');
    
    // 3. 点击"评价活动"按钮
    await page.click('.el-table__row:first-child [data-testid="rate-activity-button"]');
    await page.waitForSelector('.activity-rating-dialog');
    
    // 4. 选择满意度评分
    await page.click('[data-testid="rating-5"]'); // 5星评分
    
    // 5. 填写评价意见
    await page.fill('textarea[name="feedback"]', '活动组织得很好，内容丰富，收获很大。');
    
    // 6. 提交评价
    await page.click('[data-testid="submit-rating-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 7. 验证评价统计
    await page.click('[data-testid="view-rating-stats-button"]');
    await page.waitForSelector('.rating-stats-dialog');
    
    // 验证评分和意见记录完整
    const ratingContent = await page.textContent('.rating-stats-dialog');
    expect(ratingContent).toContain('平均评分');
    expect(ratingContent).toContain('评价人数');
    expect(ratingContent).toContain('5星');
    
    // 8. 活动组织者查看评价
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL(TEST_CONFIG.PAGES.LOGIN);
    
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 进入活动管理查看评价
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    await page.click('.el-table__row:first-child [data-testid="view-activity-button"]');
    await page.waitForSelector('.activity-detail-dialog');
    
    await page.click('[data-testid="view-activity-ratings-button"]');
    await page.waitForSelector('.activity-ratings-dialog');
    
    // 验证活动组织者收到评价通知
    await expect(page.locator('.activity-ratings-dialog')).toContainText('最新评价');
    await expect(page.locator('.activity-ratings-dialog')).toContainText('活动组织得很好');
  });

  test('TC-ACTIVITY-006: 活动资料管理测试', async ({ page }) => {
    // 1. 活动组织者登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入活动详情页面
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    await page.click('.el-table__row:first-child [data-testid="view-activity-button"]');
    await page.waitForSelector('.activity-detail-dialog');
    
    // 3. 添加活动资料上传功能
    await page.click('[data-testid="manage-materials-button"]');
    await page.waitForSelector('.materials-management-dialog');
    
    // 4. 上传活动资料
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-data/activity-material.pdf');
    
    // 填写资料信息
    await page.fill('input[name="materialTitle"]', '活动议程');
    await page.selectOption('select[name="materialType"]', 'agenda');
    await page.fill('textarea[name="materialDescription"]', '本次活动的详细议程安排');
    
    // 保存资料
    await page.click('[data-testid="save-material-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 5. 实现资料管理
    await expect(page.locator('.materials-list')).toContainText('活动议程');
    
    // 6. 创建资料查看功能
    await page.click('[data-testid="view-material-button"]');
    await page.waitForSelector('.material-viewer-dialog');
    await expect(page.locator('.material-viewer-dialog')).toBeVisible();
    
    // 7. 添加资料分类管理
    await page.click('[data-testid="manage-categories-button"]');
    await page.waitForSelector('.categories-management-dialog');
    
    // 添加新分类
    await page.click('[data-testid="add-category-button"]');
    await page.fill('input[name="categoryName"]', '学习资料');
    await page.fill('input[name="categoryDescription"]', '各类学习相关资料');
    await page.click('[data-testid="save-category-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 验证分类创建成功
    await expect(page.locator('.categories-list')).toContainText('学习资料');
  });

  test('TC-ACTIVITY-007: 活动状态管理测试', async ({ page }) => {
    // 1. 活动组织者登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入活动管理页面
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForSelector('.activity-management');
    
    // 3. 选择一个活动进行状态变更
    await page.click('.el-table__row:first-child [data-testid="edit-activity-button"]');
    await page.waitForSelector('.activity-form-dialog');
    
    // 4. 修改活动状态为"进行中"
    await page.selectOption('select[name="status"]', '2');
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 验证状态变更
    const statusText = await page.textContent('.el-table__row:first-child .status-cell');
    expect(statusText).toContain('进行中');
    
    // 5. 测试活动取消功能
    await page.click('.el-table__row:first-child [data-testid="cancel-activity-button"]');
    await page.waitForSelector('.cancel-confirmation-dialog');
    
    // 填写取消原因
    await page.fill('textarea[name="cancelReason"]', '因天气原因取消活动');
    await page.click('[data-testid="confirm-cancel-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 验证活动状态为"已取消"
    const cancelledStatus = await page.textContent('.el-table__row:first-child .status-cell');
    expect(cancelledStatus).toContain('已取消');
    
    // 6. 验证已取消活动不能进行报名
    await page.click('.el-table__row:first-child [data-testid="view-activity-button"]');
    await page.waitForSelector('.activity-detail-dialog');
    
    // 确认报名按钮不可用
    const joinButton = page.locator('[data-testid="join-activity-button"]');
    await expect(joinButton).toBeDisabled();
  });
});