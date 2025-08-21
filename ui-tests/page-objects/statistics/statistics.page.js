import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 统计分析页面对象模型
 * 封装统计分析页面的元素定位和操作方法
 */
export class StatisticsPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get statisticsContainer() {
    return this.page.locator('[data-testid="statistics-container"]');
  }

  get pageTitle() {
    return this.page.locator('[data-testid="page-title"]');
  }

  // 筛选控件
  get dateRangeFilter() {
    return this.page.locator('[data-testid="date-range-filter"]');
  }

  get organizationFilter() {
    return this.page.locator('[data-testid="organization-filter"]');
  }

  get statisticsTypeFilter() {
    return this.page.locator('[data-testid="statistics-type-filter"]');
  }

  get refreshButton() {
    return this.page.locator('[data-testid="refresh-button"]');
  }

  get exportButton() {
    return this.page.locator('[data-testid="export-button"]');
  }

  get resetFiltersButton() {
    return this.page.locator('[data-testid="reset-filters-button"]');
  }

  // 概览统计卡片
  get overviewSection() {
    return this.page.locator('[data-testid="overview-section"]');
  }

  get totalUsersCard() {
    return this.page.locator('[data-testid="total-users-card"]');
  }

  get totalOrganizationsCard() {
    return this.page.locator('[data-testid="total-organizations-card"]');
  }

  get totalActivitiesCard() {
    return this.page.locator('[data-testid="total-activities-card"]');
  }

  get totalFeeAmountCard() {
    return this.page.locator('[data-testid="total-fee-amount-card"]');
  }

  get activeUsersCard() {
    return this.page.locator('[data-testid="active-users-card"]');
  }

  get pendingActivitiesCard() {
    return this.page.locator('[data-testid="pending-activities-card"]');
  }

  get unpaidFeesCard() {
    return this.page.locator('[data-testid="unpaid-fees-card"]');
  }

  get systemHealthCard() {
    return this.page.locator('[data-testid="system-health-card"]');
  }

  // 用户统计图表
  get userStatisticsSection() {
    return this.page.locator('[data-testid="user-statistics-section"]');
  }

  get userGrowthChart() {
    return this.page.locator('[data-testid="user-growth-chart"]');
  }

  get userDistributionChart() {
    return this.page.locator('[data-testid="user-distribution-chart"]');
  }

  get userActivityChart() {
    return this.page.locator('[data-testid="user-activity-chart"]');
  }

  get userRoleChart() {
    return this.page.locator('[data-testid="user-role-chart"]');
  }

  // 组织统计图表
  get organizationStatisticsSection() {
    return this.page.locator('[data-testid="organization-statistics-section"]');
  }

  get organizationHierarchyChart() {
    return this.page.locator('[data-testid="organization-hierarchy-chart"]');
  }

  get organizationSizeChart() {
    return this.page.locator('[data-testid="organization-size-chart"]');
  }

  get organizationTypeChart() {
    return this.page.locator('[data-testid="organization-type-chart"]');
  }

  get organizationGrowthChart() {
    return this.page.locator('[data-testid="organization-growth-chart"]');
  }

  // 活动统计图表
  get activityStatisticsSection() {
    return this.page.locator('[data-testid="activity-statistics-section"]');
  }

  get activityTrendChart() {
    return this.page.locator('[data-testid="activity-trend-chart"]');
  }

  get activityTypeChart() {
    return this.page.locator('[data-testid="activity-type-chart"]');
  }

  get activityParticipationChart() {
    return this.page.locator('[data-testid="activity-participation-chart"]');
  }

  get activityStatusChart() {
    return this.page.locator('[data-testid="activity-status-chart"]');
  }

  get monthlyActivityChart() {
    return this.page.locator('[data-testid="monthly-activity-chart"]');
  }

  // 党费统计图表
  get feeStatisticsSection() {
    return this.page.locator('[data-testid="fee-statistics-section"]');
  }

  get feeCollectionChart() {
    return this.page.locator('[data-testid="fee-collection-chart"]');
  }

  get feePaymentTrendChart() {
    return this.page.locator('[data-testid="fee-payment-trend-chart"]');
  }

  get feeByOrganizationChart() {
    return this.page.locator('[data-testid="fee-by-organization-chart"]');
  }

  get feeComplianceChart() {
    return this.page.locator('[data-testid="fee-compliance-chart"]');
  }

  get monthlyFeeChart() {
    return this.page.locator('[data-testid="monthly-fee-chart"]');
  }

  // 系统统计图表
  get systemStatisticsSection() {
    return this.page.locator('[data-testid="system-statistics-section"]');
  }

  get loginStatisticsChart() {
    return this.page.locator('[data-testid="login-statistics-chart"]');
  }

  get operationLogChart() {
    return this.page.locator('[data-testid="operation-log-chart"]');
  }

  get systemPerformanceChart() {
    return this.page.locator('[data-testid="system-performance-chart"]');
  }

  get errorRateChart() {
    return this.page.locator('[data-testid="error-rate-chart"]');
  }

  // 数据表格
  get dataTableSection() {
    return this.page.locator('[data-testid="data-table-section"]');
  }

  get dataTable() {
    return this.page.locator('[data-testid="data-table"]');
  }

  get tableHeader() {
    return this.page.locator('[data-testid="table-header"]');
  }

  get tableBody() {
    return this.page.locator('[data-testid="table-body"]');
  }

  get tableRow() {
    return this.page.locator('[data-testid="table-row"]');
  }

  // 分页
  get pagination() {
    return this.page.locator('[data-testid="pagination"]');
  }

  get pageInfo() {
    return this.page.locator('[data-testid="page-info"]');
  }

  get pageSizeSelector() {
    return this.page.locator('[data-testid="page-size-selector"]');
  }

  // 图表控制
  get chartTypeSelector() {
    return this.page.locator('[data-testid="chart-type-selector"]');
  }

  get chartOptionsButton() {
    return this.page.locator('[data-testid="chart-options-button"]');
  }

  get fullscreenButton() {
    return this.page.locator('[data-testid="fullscreen-button"]');
  }

  get downloadChartButton() {
    return this.page.locator('[data-testid="download-chart-button"]');
  }

  // 实时数据
  get realTimeSection() {
    return this.page.locator('[data-testid="real-time-section"]');
  }

  get realTimeToggle() {
    return this.page.locator('[data-testid="real-time-toggle"]');
  }

  get lastUpdateTime() {
    return this.page.locator('[data-testid="last-update-time"]');
  }

  get autoRefreshInterval() {
    return this.page.locator('[data-testid="auto-refresh-interval"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/statistics');
    await this.waitForStatisticsPageLoad();
  }

  async waitForStatisticsPageLoad() {
    await this.statisticsContainer.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
    await this.waitForChartsToLoad();
  }

  async waitForChartsToLoad() {
    // 等待主要图表加载完成
    await this.userGrowthChart.waitFor({ state: 'visible' });
    await this.organizationHierarchyChart.waitFor({ state: 'visible' });
    await this.activityTrendChart.waitFor({ state: 'visible' });
    await this.feeCollectionChart.waitFor({ state: 'visible' });
    
    // 等待图表渲染完成
    await this.page.waitForTimeout(2000);
  }

  // 筛选操作
  async setDateRange(startDate, endDate) {
    await this.dateRangeFilter.click();
    
    const startDateInput = this.page.locator('[data-testid="start-date-input"]');
    await startDateInput.fill(startDate);
    
    const endDateInput = this.page.locator('[data-testid="end-date-input"]');
    await endDateInput.fill(endDate);
    
    const confirmButton = this.page.locator('[data-testid="date-confirm-button"]');
    await confirmButton.click();
    
    await this.waitForLoadingToDisappear();
    await this.waitForChartsToLoad();
  }

  async filterByOrganization(organizationId) {
    await this.organizationFilter.selectOption(organizationId);
    await this.waitForLoadingToDisappear();
    await this.waitForChartsToLoad();
  }

  async filterByStatisticsType(type) {
    await this.statisticsTypeFilter.selectOption(type);
    await this.waitForLoadingToDisappear();
    await this.waitForChartsToLoad();
  }

  async resetFilters() {
    await this.resetFiltersButton.click();
    await this.waitForLoadingToDisappear();
    await this.waitForChartsToLoad();
  }

  async refreshData() {
    await this.refreshButton.click();
    await this.waitForLoadingToDisappear();
    await this.waitForChartsToLoad();
  }

  async exportData() {
    await this.exportButton.click();
    await this.page.waitForTimeout(3000);
  }

  // 图表操作
  async switchChartType(chartElement, chartType) {
    await chartElement.hover();
    const typeSelector = chartElement.locator('[data-testid="chart-type-selector"]');
    await typeSelector.selectOption(chartType);
    await this.page.waitForTimeout(1000);
  }

  async downloadChart(chartElement) {
    await chartElement.hover();
    const downloadButton = chartElement.locator('[data-testid="download-chart-button"]');
    await downloadButton.click();
    await this.page.waitForTimeout(2000);
  }

  async fullscreenChart(chartElement) {
    await chartElement.hover();
    const fullscreenButton = chartElement.locator('[data-testid="fullscreen-button"]');
    await fullscreenButton.click();
    await this.page.waitForTimeout(1000);
  }

  async exitFullscreen() {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);
  }

  // 图表交互
  async clickChartLegend(chartElement, legendItem) {
    const legend = chartElement.locator(`[data-testid="legend-${legendItem}"]`);
    await legend.click();
    await this.page.waitForTimeout(500);
  }

  async hoverChartDataPoint(chartElement, dataPoint) {
    const point = chartElement.locator(`[data-testid="data-point-${dataPoint}"]`);
    await point.hover();
    await this.page.waitForTimeout(500);
  }

  async clickChartDataPoint(chartElement, dataPoint) {
    const point = chartElement.locator(`[data-testid="data-point-${dataPoint}"]`);
    await point.click();
    await this.page.waitForTimeout(500);
  }

  // 实时数据控制
  async enableRealTimeUpdates() {
    const toggle = this.realTimeToggle;
    const isEnabled = await toggle.isChecked();
    if (!isEnabled) {
      await toggle.check();
      await this.page.waitForTimeout(1000);
    }
  }

  async disableRealTimeUpdates() {
    const toggle = this.realTimeToggle;
    const isEnabled = await toggle.isChecked();
    if (isEnabled) {
      await toggle.uncheck();
      await this.page.waitForTimeout(1000);
    }
  }

  async setAutoRefreshInterval(interval) {
    await this.autoRefreshInterval.selectOption(interval);
    await this.page.waitForTimeout(500);
  }

  // 数据获取
  async getOverviewData() {
    return {
      totalUsers: await this.totalUsersCard.locator('[data-testid="card-value"]').textContent(),
      totalOrganizations: await this.totalOrganizationsCard.locator('[data-testid="card-value"]').textContent(),
      totalActivities: await this.totalActivitiesCard.locator('[data-testid="card-value"]').textContent(),
      totalFeeAmount: await this.totalFeeAmountCard.locator('[data-testid="card-value"]').textContent(),
      activeUsers: await this.activeUsersCard.locator('[data-testid="card-value"]').textContent(),
      pendingActivities: await this.pendingActivitiesCard.locator('[data-testid="card-value"]').textContent(),
      unpaidFees: await this.unpaidFeesCard.locator('[data-testid="card-value"]').textContent(),
      systemHealth: await this.systemHealthCard.locator('[data-testid="card-value"]').textContent()
    };
  }

  async getChartData(chartElement) {
    const dataPoints = await chartElement.locator('[data-testid^="data-point-"]').all();
    const data = [];
    
    for (const point of dataPoints) {
      const value = await point.getAttribute('data-value');
      const label = await point.getAttribute('data-label');
      data.push({ label, value });
    }
    
    return data;
  }

  async getTableData() {
    const rows = await this.tableRow.all();
    const data = [];
    
    for (const row of rows) {
      const cells = await row.locator('td').all();
      const rowData = [];
      
      for (const cell of cells) {
        const text = await cell.textContent();
        rowData.push(text.trim());
      }
      
      data.push(rowData);
    }
    
    return data;
  }

  async getLastUpdateTime() {
    return await this.lastUpdateTime.textContent();
  }

  // 分页操作
  async goToPage(pageNumber) {
    const pageButton = this.pagination.locator(`[data-testid="page-${pageNumber}"]`);
    await pageButton.click();
    await this.waitForLoadingToDisappear();
  }

  async changePageSize(size) {
    await this.pageSizeSelector.selectOption(size.toString());
    await this.waitForLoadingToDisappear();
  }

  async getPageInfo() {
    const pageInfoText = await this.pageInfo.textContent();
    const match = pageInfoText.match(/第 (\d+) 页，共 (\d+) 页，总计 (\d+) 条/);
    
    if (match) {
      return {
        currentPage: parseInt(match[1]),
        totalPages: parseInt(match[2]),
        totalItems: parseInt(match[3])
      };
    }
    
    return null;
  }

  // 验证方法
  async expectStatisticsPageVisible() {
    await expect(this.statisticsContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('统计分析');
  }

  async expectOverviewCardsVisible() {
    await expect(this.totalUsersCard).toBeVisible();
    await expect(this.totalOrganizationsCard).toBeVisible();
    await expect(this.totalActivitiesCard).toBeVisible();
    await expect(this.totalFeeAmountCard).toBeVisible();
  }

  async expectUserChartsVisible() {
    await expect(this.userGrowthChart).toBeVisible();
    await expect(this.userDistributionChart).toBeVisible();
    await expect(this.userActivityChart).toBeVisible();
    await expect(this.userRoleChart).toBeVisible();
  }

  async expectOrganizationChartsVisible() {
    await expect(this.organizationHierarchyChart).toBeVisible();
    await expect(this.organizationSizeChart).toBeVisible();
    await expect(this.organizationTypeChart).toBeVisible();
    await expect(this.organizationGrowthChart).toBeVisible();
  }

  async expectActivityChartsVisible() {
    await expect(this.activityTrendChart).toBeVisible();
    await expect(this.activityTypeChart).toBeVisible();
    await expect(this.activityParticipationChart).toBeVisible();
    await expect(this.activityStatusChart).toBeVisible();
  }

  async expectFeeChartsVisible() {
    await expect(this.feeCollectionChart).toBeVisible();
    await expect(this.feePaymentTrendChart).toBeVisible();
    await expect(this.feeByOrganizationChart).toBeVisible();
    await expect(this.feeComplianceChart).toBeVisible();
  }

  async expectSystemChartsVisible() {
    await expect(this.loginStatisticsChart).toBeVisible();
    await expect(this.operationLogChart).toBeVisible();
    await expect(this.systemPerformanceChart).toBeVisible();
    await expect(this.errorRateChart).toBeVisible();
  }

  async expectDataTableVisible() {
    await expect(this.dataTable).toBeVisible();
    await expect(this.tableHeader).toBeVisible();
    await expect(this.tableBody).toBeVisible();
  }

  async expectRealTimeSectionVisible() {
    await expect(this.realTimeSection).toBeVisible();
    await expect(this.realTimeToggle).toBeVisible();
    await expect(this.lastUpdateTime).toBeVisible();
  }

  async expectChartHasData(chartElement) {
    const dataPoints = await chartElement.locator('[data-testid^="data-point-"]').count();
    expect(dataPoints).toBeGreaterThan(0);
  }

  async expectOverviewDataValid(data) {
    expect(data.totalUsers).toMatch(/^\d+$/);
    expect(data.totalOrganizations).toMatch(/^\d+$/);
    expect(data.totalActivities).toMatch(/^\d+$/);
    expect(data.totalFeeAmount).toMatch(/^[\d,]+(\.\d{2})?$/);
  }

  // 性能测试
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.goto();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async measureChartLoadTime() {
    const startTime = Date.now();
    await this.waitForChartsToLoad();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async measureDataRefreshTime() {
    const startTime = Date.now();
    await this.refreshData();
    const endTime = Date.now();
    return endTime - startTime;
  }

  // 响应式测试
  async testResponsiveLayout() {
    const viewports = [
      { width: 1920, height: 1080 }, // 桌面
      { width: 1366, height: 768 },  // 笔记本
      { width: 768, height: 1024 },  // 平板
      { width: 375, height: 667 }    // 手机
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(1000);
      
      // 验证关键元素在不同屏幕尺寸下的可见性
      await expect(this.statisticsContainer).toBeVisible();
      await expect(this.overviewSection).toBeVisible();
    }
  }

  // 辅助方法
  async scrollToChart(chartElement) {
    await chartElement.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async isChartVisible(chartElement) {
    return await chartElement.isVisible();
  }

  async waitForChartAnimation(chartElement) {
    await chartElement.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000); // 等待动画完成
  }

  // 错误处理
  async handleChartLoadError(chartElement) {
    const errorElement = chartElement.locator('[data-testid="chart-error"]');
    const isError = await errorElement.isVisible();
    
    if (isError) {
      const errorMessage = await errorElement.textContent();
      throw new Error(`图表加载失败: ${errorMessage}`);
    }
  }

  // 数据验证
  async validateChartData(chartElement, expectedDataCount) {
    const dataPoints = await chartElement.locator('[data-testid^="data-point-"]').count();
    expect(dataPoints).toBe(expectedDataCount);
  }

  async validateOverviewCards() {
    const cards = [
      this.totalUsersCard,
      this.totalOrganizationsCard,
      this.totalActivitiesCard,
      this.totalFeeAmountCard
    ];

    for (const card of cards) {
      await expect(card).toBeVisible();
      const value = await card.locator('[data-testid="card-value"]').textContent();
      expect(value).toMatch(/^\d+/);
    }
  }
}