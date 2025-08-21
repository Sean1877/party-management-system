import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 仪表板页面对象模型
 * 封装仪表板页面的元素定位和操作方法
 */
export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get dashboardContainer() {
    return this.page.locator('[data-testid="dashboard-container"]');
  }

  get welcomeMessage() {
    return this.page.locator('[data-testid="welcome-message"]');
  }

  get userAvatar() {
    return this.page.locator('[data-testid="user-avatar"]');
  }

  get userName() {
    return this.page.locator('[data-testid="user-name"]');
  }

  get logoutButton() {
    return this.page.locator('[data-testid="logout-button"]');
  }

  // 统计卡片
  get totalUsersCard() {
    return this.page.locator('[data-testid="total-users-card"]');
  }

  get totalOrganizationsCard() {
    return this.page.locator('[data-testid="total-organizations-card"]');
  }

  get totalActivitiesCard() {
    return this.page.locator('[data-testid="total-activities-card"]');
  }

  get totalFeesCard() {
    return this.page.locator('[data-testid="total-fees-card"]');
  }

  get activeUsersCard() {
    return this.page.locator('[data-testid="active-users-card"]');
  }

  get pendingActivitiesCard() {
    return this.page.locator('[data-testid="pending-activities-card"]');
  }

  // 图表区域
  get userGrowthChart() {
    return this.page.locator('[data-testid="user-growth-chart"]');
  }

  get activityChart() {
    return this.page.locator('[data-testid="activity-chart"]');
  }

  get feeChart() {
    return this.page.locator('[data-testid="fee-chart"]');
  }

  get organizationChart() {
    return this.page.locator('[data-testid="organization-chart"]');
  }

  // 快速操作区域
  get quickActionsPanel() {
    return this.page.locator('[data-testid="quick-actions-panel"]');
  }

  get addUserButton() {
    return this.page.locator('[data-testid="add-user-button"]');
  }

  get addOrganizationButton() {
    return this.page.locator('[data-testid="add-organization-button"]');
  }

  get addActivityButton() {
    return this.page.locator('[data-testid="add-activity-button"]');
  }

  get viewReportsButton() {
    return this.page.locator('[data-testid="view-reports-button"]');
  }

  // 最近活动列表
  get recentActivitiesList() {
    return this.page.locator('[data-testid="recent-activities-list"]');
  }

  get recentActivityItem() {
    return this.page.locator('[data-testid="recent-activity-item"]');
  }

  // 通知区域
  get notificationPanel() {
    return this.page.locator('[data-testid="notification-panel"]');
  }

  get notificationItem() {
    return this.page.locator('[data-testid="notification-item"]');
  }

  get notificationBadge() {
    return this.page.locator('[data-testid="notification-badge"]');
  }

  // 导航菜单
  get sidebarMenu() {
    return this.page.locator('[data-testid="sidebar-menu"]');
  }

  get userManagementMenu() {
    return this.page.locator('[data-testid="user-management-menu"]');
  }

  get organizationManagementMenu() {
    return this.page.locator('[data-testid="organization-management-menu"]');
  }

  get activityManagementMenu() {
    return this.page.locator('[data-testid="activity-management-menu"]');
  }

  get feeManagementMenu() {
    return this.page.locator('[data-testid="fee-management-menu"]');
  }

  get statisticsMenu() {
    return this.page.locator('[data-testid="statistics-menu"]');
  }

  get systemSettingsMenu() {
    return this.page.locator('[data-testid="system-settings-menu"]');
  }

  // 搜索功能
  get globalSearchInput() {
    return this.page.locator('[data-testid="global-search-input"]');
  }

  get searchButton() {
    return this.page.locator('[data-testid="search-button"]');
  }

  get searchResults() {
    return this.page.locator('[data-testid="search-results"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/dashboard');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    await this.dashboardContainer.waitFor({ state: 'visible' });
    await this.welcomeMessage.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
    // 等待统计数据加载
    await this.totalUsersCard.waitFor({ state: 'visible' });
  }

  // 用户操作
  async logout() {
    await this.userAvatar.click();
    await this.logoutButton.click();
    await this.waitForURL('**/login');
  }

  async getUserName() {
    return await this.userName.textContent();
  }

  async getWelcomeMessage() {
    return await this.welcomeMessage.textContent();
  }

  // 统计数据获取
  async getStatisticsData() {
    await this.waitForDashboardLoad();
    
    return {
      totalUsers: await this.getCardValue(this.totalUsersCard),
      totalOrganizations: await this.getCardValue(this.totalOrganizationsCard),
      totalActivities: await this.getCardValue(this.totalActivitiesCard),
      totalFees: await this.getCardValue(this.totalFeesCard),
      activeUsers: await this.getCardValue(this.activeUsersCard),
      pendingActivities: await this.getCardValue(this.pendingActivitiesCard)
    };
  }

  async getCardValue(cardLocator) {
    const valueElement = cardLocator.locator('[data-testid="card-value"]');
    const text = await valueElement.textContent();
    return parseInt(text.replace(/[^0-9]/g, '')) || 0;
  }

  async getCardTitle(cardLocator) {
    const titleElement = cardLocator.locator('[data-testid="card-title"]');
    return await titleElement.textContent();
  }

  // 快速操作
  async clickAddUser() {
    await this.addUserButton.click();
    await this.waitForURL('**/users/add');
  }

  async clickAddOrganization() {
    await this.addOrganizationButton.click();
    await this.waitForURL('**/organizations/add');
  }

  async clickAddActivity() {
    await this.addActivityButton.click();
    await this.waitForURL('**/activities/add');
  }

  async clickViewReports() {
    await this.viewReportsButton.click();
    await this.waitForURL('**/reports');
  }

  // 导航操作
  async navigateToUserManagement() {
    await this.userManagementMenu.click();
    await this.waitForURL('**/users');
  }

  async navigateToOrganizationManagement() {
    await this.organizationManagementMenu.click();
    await this.waitForURL('**/organizations');
  }

  async navigateToActivityManagement() {
    await this.activityManagementMenu.click();
    await this.waitForURL('**/activities');
  }

  async navigateToFeeManagement() {
    await this.feeManagementMenu.click();
    await this.waitForURL('**/fees');
  }

  async navigateToStatistics() {
    await this.statisticsMenu.click();
    await this.waitForURL('**/statistics');
  }

  async navigateToSystemSettings() {
    await this.systemSettingsMenu.click();
    await this.waitForURL('**/settings');
  }

  // 搜索功能
  async performGlobalSearch(query) {
    await this.globalSearchInput.fill(query);
    await this.searchButton.click();
    await this.waitForElement(this.searchResults);
  }

  async getSearchResults() {
    const results = [];
    const items = await this.searchResults.locator('[data-testid="search-result-item"]').all();
    
    for (const item of items) {
      const title = await item.locator('[data-testid="result-title"]').textContent();
      const type = await item.locator('[data-testid="result-type"]').textContent();
      const url = await item.getAttribute('href');
      results.push({ title, type, url });
    }
    
    return results;
  }

  // 最近活动
  async getRecentActivities() {
    const activities = [];
    const items = await this.recentActivityItem.all();
    
    for (const item of items) {
      const title = await item.locator('[data-testid="activity-title"]').textContent();
      const time = await item.locator('[data-testid="activity-time"]').textContent();
      const type = await item.locator('[data-testid="activity-type"]').textContent();
      activities.push({ title, time, type });
    }
    
    return activities;
  }

  async clickRecentActivity(index) {
    const items = await this.recentActivityItem.all();
    if (index < items.length) {
      await items[index].click();
    }
  }

  // 通知功能
  async getNotificationCount() {
    if (await this.notificationBadge.isVisible()) {
      const text = await this.notificationBadge.textContent();
      return parseInt(text) || 0;
    }
    return 0;
  }

  async getNotifications() {
    const notifications = [];
    const items = await this.notificationItem.all();
    
    for (const item of items) {
      const title = await item.locator('[data-testid="notification-title"]').textContent();
      const message = await item.locator('[data-testid="notification-message"]').textContent();
      const time = await item.locator('[data-testid="notification-time"]').textContent();
      const isRead = await item.locator('[data-testid="notification-read"]').isVisible();
      notifications.push({ title, message, time, isRead });
    }
    
    return notifications;
  }

  async markNotificationAsRead(index) {
    const items = await this.notificationItem.all();
    if (index < items.length) {
      const markReadButton = items[index].locator('[data-testid="mark-read-button"]');
      if (await markReadButton.isVisible()) {
        await markReadButton.click();
      }
    }
  }

  // 图表交互
  async waitForChartsToLoad() {
    await this.userGrowthChart.waitFor({ state: 'visible' });
    await this.activityChart.waitFor({ state: 'visible' });
    await this.feeChart.waitFor({ state: 'visible' });
    await this.organizationChart.waitFor({ state: 'visible' });
  }

  async isChartVisible(chartType) {
    const charts = {
      'user-growth': this.userGrowthChart,
      'activity': this.activityChart,
      'fee': this.feeChart,
      'organization': this.organizationChart
    };
    
    const chart = charts[chartType];
    return chart ? await chart.isVisible() : false;
  }

  async clickChartLegend(chartType, legendItem) {
    const charts = {
      'user-growth': this.userGrowthChart,
      'activity': this.activityChart,
      'fee': this.feeChart,
      'organization': this.organizationChart
    };
    
    const chart = charts[chartType];
    if (chart) {
      const legend = chart.locator(`[data-testid="chart-legend-${legendItem}"]`);
      await legend.click();
    }
  }

  // 验证方法
  async expectDashboardVisible() {
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.sidebarMenu).toBeVisible();
  }

  async expectWelcomeMessage(userName) {
    await expect(this.welcomeMessage).toContainText(userName);
  }

  async expectStatisticsCardsVisible() {
    await expect(this.totalUsersCard).toBeVisible();
    await expect(this.totalOrganizationsCard).toBeVisible();
    await expect(this.totalActivitiesCard).toBeVisible();
    await expect(this.totalFeesCard).toBeVisible();
  }

  async expectQuickActionsVisible() {
    await expect(this.quickActionsPanel).toBeVisible();
    await expect(this.addUserButton).toBeVisible();
    await expect(this.addOrganizationButton).toBeVisible();
    await expect(this.addActivityButton).toBeVisible();
  }

  async expectChartsVisible() {
    await expect(this.userGrowthChart).toBeVisible();
    await expect(this.activityChart).toBeVisible();
    await expect(this.feeChart).toBeVisible();
    await expect(this.organizationChart).toBeVisible();
  }

  async expectNavigationMenuVisible() {
    await expect(this.sidebarMenu).toBeVisible();
    await expect(this.userManagementMenu).toBeVisible();
    await expect(this.organizationManagementMenu).toBeVisible();
    await expect(this.activityManagementMenu).toBeVisible();
    await expect(this.feeManagementMenu).toBeVisible();
  }

  async expectStatisticsData(expectedData) {
    const actualData = await this.getStatisticsData();
    
    if (expectedData.totalUsers !== undefined) {
      expect(actualData.totalUsers).toBeGreaterThanOrEqual(expectedData.totalUsers);
    }
    if (expectedData.totalOrganizations !== undefined) {
      expect(actualData.totalOrganizations).toBeGreaterThanOrEqual(expectedData.totalOrganizations);
    }
    if (expectedData.totalActivities !== undefined) {
      expect(actualData.totalActivities).toBeGreaterThanOrEqual(expectedData.totalActivities);
    }
  }

  // 响应式测试
  async testResponsiveLayout() {
    // 测试桌面布局
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.expectDashboardVisible();
    await this.expectStatisticsCardsVisible();
    
    // 测试平板布局
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.expectDashboardVisible();
    
    // 测试手机布局
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.expectDashboardVisible();
  }

  // 性能测试
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.goto();
    await this.waitForChartsToLoad();
    const endTime = Date.now();
    return endTime - startTime;
  }

  // 刷新数据
  async refreshDashboard() {
    await this.page.reload();
    await this.waitForDashboardLoad();
  }

  async refreshStatistics() {
    const refreshButton = this.page.locator('[data-testid="refresh-statistics-button"]');
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      await this.waitForLoadingToDisappear();
    }
  }
}