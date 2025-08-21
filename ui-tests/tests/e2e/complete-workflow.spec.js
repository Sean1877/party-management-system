/**
 * 完整工作流程端到端测试
 * 测试党建管理系统的主要业务流程
 */

import { test, expect } from '@playwright/test';
import { TestHelper } from '../../page-objects/index.js';

test.describe('党建管理系统 - 完整工作流程测试', () => {
  let testHelper;
  let pageManager;
  
  test.beforeEach(async ({ page }) => {
    testHelper = new TestHelper(page);
    pageManager = testHelper.getPageManager();
  });
  
  test.afterEach(async () => {
    // 清理测试数据
    await testHelper.cleanupTestData();
  });
  
  test('完整的管理员工作流程', async () => {
    // 1. 登录系统
    const dashboardPage = await testHelper.login('admin', 'admin123');
    await expect(dashboardPage.page).toHaveTitle(/党建管理系统/);
    
    // 验证仪表板加载
    await dashboardPage.expectDashboardVisible();
    
    // 2. 创建组织
    const organizationPage = await testHelper.navigateToPage('organizationManagement');
    await organizationPage.expectOrganizationManagementPageVisible();
    
    const orgData = {
      name: `测试党支部_${Date.now()}`,
      type: 'branch',
      description: '这是一个测试创建的党支部',
      status: 'active'
    };
    
    await organizationPage.addOrganization(orgData);
    await organizationPage.expectOrganizationInTable(orgData.name);
    
    // 3. 创建用户
    const userPage = await testHelper.navigateToPage('userManagement');
    await userPage.expectUserManagementPageVisible();
    
    const userData = {
      username: `test_member_${Date.now()}`,
      realName: '测试党员',
      email: `test${Date.now()}@example.com`,
      phone: '13800138000',
      role: 'member',
      organization: orgData.name,
      status: 'active'
    };
    
    await userPage.addUser(userData);
    await userPage.expectUserInTable(userData.username);
    
    // 4. 创建活动
    const activityPage = await testHelper.navigateToPage('activityManagement');
    await activityPage.expectActivityManagementPageVisible();
    
    const activityData = {
      title: `党员学习活动_${Date.now()}`,
      type: 'study',
      description: '这是一个测试创建的学习活动',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      location: '党员活动室',
      organization: orgData.name,
      status: 'published'
    };
    
    await activityPage.addActivity(activityData);
    await activityPage.expectActivityInTable(activityData.title);
    
    // 5. 管理活动参与者
    await activityPage.manageParticipants(activityData.title);
    await activityPage.expectParticipantManagementVisible();
    
    // 添加参与者
    await activityPage.addParticipantToActivity(userData.realName);
    
    // 关闭参与者管理
    await activityPage.closeParticipantManagement();
    
    // 6. 设置党费标准
    const feePage = await testHelper.navigateToPage('feeManagement');
    await feePage.expectFeeManagementPageVisible();
    
    const feeStandardData = {
      name: `测试党费标准_${Date.now()}`,
      amount: 50.00,
      description: '这是一个测试的党费标准',
      status: 'active'
    };
    
    await feePage.addFeeStandard(feeStandardData);
    await feePage.expectFeeStandardInTable(feeStandardData.name);
    
    // 7. 记录党费缴纳
    await feePage.switchToFeePaymentsTab();
    
    const paymentData = {
      user: userData.realName,
      standard: feeStandardData.name,
      amount: 50.00,
      method: 'cash',
      status: 'confirmed'
    };
    
    await feePage.addFeePayment(paymentData);
    await feePage.expectFeePaymentInTable(userData.realName);
    
    // 8. 查看统计数据
    const statisticsPage = await testHelper.navigateToPage('statistics');
    await statisticsPage.expectStatisticsPageVisible();
    
    // 等待统计数据加载
    await statisticsPage.waitForChartsToLoad();
    
    // 验证统计卡片
    await statisticsPage.expectOverviewCardsVisible();
    await statisticsPage.expectUserStatisticsVisible();
    await statisticsPage.expectActivityStatisticsVisible();
    await statisticsPage.expectFeeStatisticsVisible();
    
    // 9. 检查系统设置
    const settingsPage = await testHelper.navigateToPage('systemSettings');
    await settingsPage.expectSystemSettingsPageVisible();
    
    // 查看基本设置
    await settingsPage.navigateToBasicSettings();
    
    // 查看安全设置
    await settingsPage.navigateToSecuritySettings();
    
    // 10. 查看个人中心
    const profilePage = await testHelper.navigateToPage('profile');
    await profilePage.expectProfilePageVisible();
    
    // 查看基本信息
    await profilePage.navigateToBasicInfo();
    
    // 查看活动日志
    await profilePage.navigateToActivityLog();
    
    // 11. 登出系统
    await testHelper.logout();
    
    // 验证返回到登录页面
    const loginPage = pageManager.getPage('login');
    await loginPage.expectLoginPageVisible();
  });
  
  test('普通用户工作流程', async () => {
    // 1. 以普通用户身份登录
    const dashboardPage = await testHelper.login('test_user', 'test123');
    
    // 2. 查看仪表板
    await dashboardPage.expectDashboardVisible();
    
    // 3. 查看活动列表
    const activityPage = await testHelper.navigateToPage('activityManagement');
    await activityPage.expectActivityManagementPageVisible();
    
    // 普通用户应该只能查看活动，不能创建
    await expect(activityPage.addActivityButton).not.toBeVisible();
    
    // 4. 查看个人党费记录
    const feePage = await testHelper.navigateToPage('feeManagement');
    await feePage.expectFeeManagementPageVisible();
    
    // 切换到党费缴纳记录
    await feePage.switchToFeePaymentsTab();
    
    // 5. 查看个人中心
    const profilePage = await testHelper.navigateToPage('profile');
    await profilePage.expectProfilePageVisible();
    
    // 6. 登出
    await testHelper.logout();
  });
  
  test('数据搜索和过滤功能', async () => {
    // 登录
    await testHelper.login('admin', 'admin123');
    
    // 测试用户管理的搜索功能
    const userPage = await testHelper.navigateToPage('userManagement');
    await userPage.expectUserManagementPageVisible();
    
    // 搜索用户
    await userPage.searchUsers('admin');
    await userPage.expectUserInTable('admin');
    
    // 清除搜索
    await userPage.clearSearch();
    
    // 按角色过滤
    await userPage.filterByRole('admin');
    
    // 重置过滤器
    await userPage.resetFilters();
    
    // 测试活动管理的搜索功能
    const activityPage = await testHelper.navigateToPage('activityManagement');
    await activityPage.expectActivityManagementPageVisible();
    
    // 搜索活动
    await activityPage.searchActivities('学习');
    
    // 按类型过滤
    await activityPage.filterByType('study');
    
    // 按状态过滤
    await activityPage.filterByStatus('published');
    
    // 重置过滤器
    await activityPage.resetFilters();
    
    // 测试党费管理的搜索功能
    const feePage = await testHelper.navigateToPage('feeManagement');
    await feePage.expectFeeManagementPageVisible();
    
    // 搜索党费标准
    await feePage.searchFeeStandards('测试');
    
    // 切换到缴费记录
    await feePage.switchToFeePaymentsTab();
    
    // 按状态过滤缴费记录
    await feePage.filterPaymentsByStatus('confirmed');
  });
  
  test('响应式设计测试', async ({ page }) => {
    testHelper = new TestHelper(page);
    
    // 登录
    await testHelper.login('admin', 'admin123');
    
    // 测试不同屏幕尺寸
    const viewports = [
      { width: 1920, height: 1080, name: '桌面大屏' },
      { width: 1366, height: 768, name: '桌面标准' },
      { width: 768, height: 1024, name: '平板' },
      { width: 375, height: 667, name: '手机' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // 测试仪表板在不同尺寸下的显示
      const dashboardPage = pageManager.getPage('dashboard');
      await dashboardPage.expectDashboardVisible();
      
      // 测试用户管理页面
      const userPage = await testHelper.navigateToPage('userManagement');
      await userPage.expectUserManagementPageVisible();
      
      // 在移动端测试侧边栏
      if (viewport.width < 768) {
        // 移动端应该有菜单按钮
        await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      }
      
      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}) 测试通过`);
    }
  });
  
  test('性能测试', async ({ page }) => {
    testHelper = new TestHelper(page);
    
    // 测试页面加载性能
    const performanceMetrics = {};
    
    // 登录页面加载时间
    const loginPage = pageManager.getPage('login');
    performanceMetrics.loginPageLoad = await loginPage.measurePageLoadTime();
    
    // 登录过程时间
    const loginStart = Date.now();
    await testHelper.login('admin', 'admin123');
    performanceMetrics.loginProcess = Date.now() - loginStart;
    
    // 仪表板加载时间
    const dashboardPage = pageManager.getPage('dashboard');
    performanceMetrics.dashboardPageLoad = await dashboardPage.measurePageLoadTime();
    
    // 用户管理页面加载时间
    const userPage = await testHelper.navigateToPage('userManagement');
    performanceMetrics.userPageLoad = await userPage.measurePageLoadTime();
    
    // 搜索性能
    performanceMetrics.userSearch = await userPage.measureSearchTime('admin');
    
    // 活动管理页面加载时间
    const activityPage = await testHelper.navigateToPage('activityManagement');
    performanceMetrics.activityPageLoad = await activityPage.measurePageLoadTime();
    
    // 统计页面加载时间
    const statisticsPage = await testHelper.navigateToPage('statistics');
    performanceMetrics.statisticsPageLoad = await statisticsPage.measurePageLoadTime();
    
    // 输出性能指标
    console.log('📊 性能测试结果:');
    Object.entries(performanceMetrics).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}ms`);
    });
    
    // 性能断言（根据实际情况调整阈值）
    expect(performanceMetrics.loginPageLoad).toBeLessThan(3000);
    expect(performanceMetrics.loginProcess).toBeLessThan(5000);
    expect(performanceMetrics.dashboardPageLoad).toBeLessThan(3000);
    expect(performanceMetrics.userPageLoad).toBeLessThan(3000);
    expect(performanceMetrics.userSearch).toBeLessThan(2000);
    expect(performanceMetrics.activityPageLoad).toBeLessThan(3000);
    expect(performanceMetrics.statisticsPageLoad).toBeLessThan(5000);
  });
  
  test('错误处理测试', async () => {
    // 测试无效登录
    const loginPage = pageManager.getPage('login');
    await loginPage.goto();
    
    await loginPage.login('invalid_user', 'invalid_password');
    await loginPage.expectLoginError();
    
    // 正确登录
    await testHelper.login('admin', 'admin123');
    
    // 测试创建重复用户
    const userPage = await testHelper.navigateToPage('userManagement');
    
    const duplicateUserData = {
      username: 'admin', // 已存在的用户名
      realName: '重复用户',
      email: 'duplicate@example.com',
      phone: '13800138001',
      role: 'member',
      status: 'active'
    };
    
    await userPage.addUser(duplicateUserData);
    // 应该显示错误信息
    await expect(page.locator('.error-message')).toBeVisible();
    
    // 测试无效的表单提交
    await userPage.clickAddUser();
    await userPage.fillUserForm({
      username: '', // 空用户名
      realName: '测试用户',
      email: 'invalid-email', // 无效邮箱
      phone: '123', // 无效电话
      role: 'member'
    });
    
    await userPage.submitUserForm();
    // 应该显示验证错误
    await expect(page.locator('.validation-error')).toBeVisible();
  });
});