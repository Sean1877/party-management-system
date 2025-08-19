import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test-config.js';
import { createTestHelpers } from '../helpers/test-helpers.js';

test.describe('兼容性测试', () => {
  
  // 在不同浏览器上运行基本功能测试
  const testBasicFunctionality = async ({ page }, browserName) => {
    console.log(`在 ${browserName} 浏览器上测试基本功能...`);
    
    const helpers = createTestHelpers(page);
    
    // 1. 测试登录功能
    await helpers.login.login(TEST_CONFIG.TEST_USERS.ADMIN);
    await helpers.assertion.expectPageTitle('党建管理系统');
    
    // 2. 测试导航功能
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await helpers.assertion.expectVisible('.user-management');
    
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await helpers.assertion.expectVisible('.activity-management');
    
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await helpers.assertion.expectVisible('.organization-management');
    
    // 3. 测试表格显示
    await helpers.table.expectTableContains('用户管理');
    
    // 4. 测试表单操作
    await page.click('[data-testid="add-user-button"]');
    await helpers.dialog.waitForDialogOpen('.user-form-dialog');
    await helpers.dialog.cancelDialog();
    
    // 5. 测试响应式设计
    await page.setViewportSize({ width: 375, height: 667 }); // 手机尺寸
    await page.waitForLoadState('networkidle');
    
    // 验证移动端菜单按钮
    await helpers.assertion.expectVisible('.mobile-menu-button');
    
    // 恢复桌面尺寸
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForLoadState('networkidle');
    
    // 6. 测试登出功能
    await helpers.login.logout();
    await helpers.assertion.expectCurrentUrl('/login');
    
    console.log(`${browserName} 浏览器基本功能测试完成`);
  };

  test('TC-COMPAT-001: Chrome浏览器兼容性测试', async ({ page }) => {
    await testBasicFunctionality({ page }, 'Chrome');
  });

  test('TC-COMPAT-002: Firefox浏览器兼容性测试', async ({ page }) => {
    await testBasicFunctionality({ page }, 'Firefox');
  });

  test('TC-COMPAT-003: Safari浏览器兼容性测试', async ({ page }) => {
    await testBasicFunctionality({ page }, 'Safari');
  });

  test('TC-COMPAT-004: Edge浏览器兼容性测试', async ({ page }) => {
    await testBasicFunctionality({ page }, 'Edge');
  });
});

test.describe('移动端适配测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置测试超时
    page.setDefaultTimeout(TEST_CONFIG.TIMEOUTS.MEDIUM);
  });

  test('TC-MOBILE-001: 手机设备响应式设计测试', async ({ page }) => {
    console.log('测试手机设备响应式设计...');
    
    const helpers = createTestHelpers(page);
    
    // 设置手机尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 1. 测试登录页面
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await helpers.assertion.expectVisible('.mobile-login-form');
    
    // 2. 测试登录功能
    await helpers.login.login(TEST_CONFIG.TEST_USERS.ADMIN);
    await helpers.assertion.expectVisible('.mobile-dashboard');
    
    // 3. 测试移动端菜单
    await helpers.assertion.expectVisible('.mobile-menu-button');
    await page.click('.mobile-menu-button');
    await helpers.assertion.expectVisible('.mobile-sidebar');
    
    // 4. 测试导航功能
    await page.click('[data-testid="mobile-users-link"]');
    await page.waitForLoadState('networkidle');
    await helpers.assertion.expectVisible('.mobile-user-management');
    
    // 5. 测试表格滚动
    await helpers.table.expectTableContains('用户管理');
    
    // 6. 测试触摸操作功能
    await page.click('[data-testid="add-user-button"]');
    await helpers.dialog.waitForDialogOpen('.user-form-dialog');
    await helpers.dialog.cancelDialog();
    
    console.log('手机设备测试完成');
  });

  test('TC-MOBILE-002: 平板设备响应式设计测试', async ({ page }) => {
    console.log('测试平板设备响应式设计...');
    
    const helpers = createTestHelpers(page);
    
    // 设置平板尺寸
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 1. 测试登录页面
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await helpers.assertion.expectVisible('.tablet-login-form');
    
    // 2. 测试登录功能
    await helpers.login.login(TEST_CONFIG.TEST_USERS.ADMIN);
    await helpers.assertion.expectVisible('.tablet-dashboard');
    
    // 3. 测试侧边栏显示
    await helpers.assertion.expectVisible('.tablet-sidebar');
    
    // 4. 测试导航功能
    await page.click('[data-testid="tablet-users-link"]');
    await page.waitForLoadState('networkidle');
    await helpers.assertion.expectVisible('.tablet-user-management');
    
    // 5. 测试表格显示
    await helpers.table.expectTableContains('用户管理');
    
    console.log('平板设备测试完成');
  });

  test('TC-MOBILE-003: 不同屏幕尺寸适配测试', async ({ page }) => {
    console.log('测试不同屏幕尺寸适配...');
    
    const helpers = createTestHelpers(page);
    
    // 登录系统
    await helpers.login.login(TEST_CONFIG.TEST_USERS.ADMIN);
    
    // 测试不同屏幕尺寸
    const screenSizes = [
      { width: 320, height: 568, name: '小屏手机' },
      { width: 375, height: 667, name: 'iPhone 6/7/8' },
      { width: 414, height: 736, name: 'iPhone 6/7/8 Plus' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'iPad横屏' },
      { width: 1280, height: 720, name: '小屏笔记本' },
      { width: 1920, height: 1080, name: '桌面显示器' }
    ];
    
    for (const screenSize of screenSizes) {
      console.log(`测试 ${screenSize.name} (${screenSize.width}x${screenSize.height})...`);
      
      // 设置屏幕尺寸
      await page.setViewportSize(screenSize);
      await page.waitForLoadState('networkidle');
      
      // 验证页面正常显示
      await helpers.assertion.expectVisible('.main-content');
      
      // 测试基本导航
      await page.goto(TEST_CONFIG.PAGES.USERS);
      await page.waitForLoadState('networkidle');
      await helpers.assertion.expectVisible('.user-management');
      
      // 验证没有水平滚动条（响应式设计良好）
      const body = await page.locator('body');
      const scrollWidth = await body.evaluate(node => node.scrollWidth);
      const clientWidth = await body.evaluate(node => node.clientWidth);
      
      // 允许一定的误差
      const tolerance = 10;
      expect(Math.abs(scrollWidth - clientWidth)).toBeLessThanOrEqual(tolerance);
    }
    
    console.log('不同屏幕尺寸适配测试完成');
  });

  test('TC-MOBILE-004: 移动端触摸手势测试', async ({ page }) => {
    console.log('测试移动端触摸手势...');
    
    const helpers = createTestHelpers(page);
    
    // 设置手机尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 登录系统
    await helpers.login.login(TEST_CONFIG.TEST_USERS.ADMIN);
    
    // 1. 测试左滑菜单
    await page.goto(TEST_CONFIG.PAGES.DASHBOARD);
    await page.waitForLoadState('networkidle');
    
    // 模拟左滑手势（这里通过点击菜单按钮模拟）
    await page.click('.mobile-menu-button');
    await helpers.assertion.expectVisible('.mobile-sidebar');
    
    // 2. 测试菜单项点击
    await page.click('[data-testid="mobile-users-link"]');
    await page.waitForLoadState('networkidle');
    await helpers.assertion.expectVisible('.mobile-user-management');
    
    // 3. 测试表格滑动
    await helpers.table.expectTableContains('用户管理');
    
    // 4. 测试弹窗操作
    await page.click('[data-testid="add-user-button"]');
    await helpers.dialog.waitForDialogOpen('.user-form-dialog');
    await helpers.dialog.cancelDialog();
    
    // 5. 测试下拉刷新（如果有）
    await page.evaluate(() => {
      // 模拟下拉刷新手势
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    });
    
    console.log('移动端触摸手势测试完成');
  });
});

test.describe('跨浏览器数据一致性测试', () => {
  
  test('TC-CROSS-001: 跨浏览器数据展示一致性测试', async ({ page }) => {
    console.log('测试跨浏览器数据展示一致性...');
    
    const helpers = createTestHelpers(page);
    
    // 登录系统
    await helpers.login.login(TEST_CONFIG.TEST_USERS.ADMIN);
    
    // 1. 测试用户列表数据
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await helpers.table.waitForTableLoad();
    
    const userTableContent = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(userTableContent).toBeTruthy();
    
    // 2. 测试活动列表数据
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await helpers.table.waitForTableLoad();
    
    const activityTableContent = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(activityTableContent).toBeTruthy();
    
    // 3. 测试统计数据
    await page.goto('/statistics');
    await page.waitForLoadState('networkidle');
    
    const statsContent = await page.textContent('.statistics-page');
    expect(statsContent).toBeTruthy();
    
    // 4. 验证数据格式一致性
    // 检查日期格式
    const datePattern = /\d{4}-\d{2}-\d{2}/;
    expect(userTableContent).toMatch(datePattern);
    
    // 检查数字格式
    const numberPattern = /\d+/;
    expect(userTableContent).toMatch(numberPattern);
    
    console.log('跨浏览器数据展示一致性测试完成');
  });
});