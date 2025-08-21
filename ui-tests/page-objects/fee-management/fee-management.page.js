import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 党费管理页面对象模型
 * 封装党费管理页面的元素定位和操作方法
 */
export class FeeManagementPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get feeManagementContainer() {
    return this.page.locator('[data-testid="fee-management-container"]');
  }

  get pageTitle() {
    return this.page.locator('[data-testid="page-title"]');
  }

  // 标签页
  get feeStandardTab() {
    return this.page.locator('[data-testid="fee-standard-tab"]');
  }

  get feePaymentTab() {
    return this.page.locator('[data-testid="fee-payment-tab"]');
  }

  get feeStatisticsTab() {
    return this.page.locator('[data-testid="fee-statistics-tab"]');
  }

  // 党费标准管理区域
  get feeStandardContainer() {
    return this.page.locator('[data-testid="fee-standard-container"]');
  }

  // 搜索和筛选（党费标准）
  get standardSearchInput() {
    return this.page.locator('[data-testid="standard-search-input"]');
  }

  get standardSearchButton() {
    return this.page.locator('[data-testid="standard-search-button"]');
  }

  get standardClearSearchButton() {
    return this.page.locator('[data-testid="standard-clear-search-button"]');
  }

  get standardStatusFilter() {
    return this.page.locator('[data-testid="standard-status-filter"]');
  }

  get standardDateRangeFilter() {
    return this.page.locator('[data-testid="standard-date-range-filter"]');
  }

  get standardResetFiltersButton() {
    return this.page.locator('[data-testid="standard-reset-filters-button"]');
  }

  // 操作按钮（党费标准）
  get addStandardButton() {
    return this.page.locator('[data-testid="add-standard-button"]');
  }

  get batchDeleteStandardsButton() {
    return this.page.locator('[data-testid="batch-delete-standards-button"]');
  }

  get exportStandardsButton() {
    return this.page.locator('[data-testid="export-standards-button"]');
  }

  get refreshStandardsButton() {
    return this.page.locator('[data-testid="refresh-standards-button"]');
  }

  // 党费标准表格
  get standardTable() {
    return this.page.locator('[data-testid="standard-table"]');
  }

  get standardTableHeader() {
    return this.page.locator('[data-testid="standard-table-header"]');
  }

  get standardTableBody() {
    return this.page.locator('[data-testid="standard-table-body"]');
  }

  get standardRow() {
    return this.page.locator('[data-testid="standard-row"]');
  }

  get standardSelectAllCheckbox() {
    return this.page.locator('[data-testid="standard-select-all-checkbox"]');
  }

  get standardCheckbox() {
    return this.page.locator('[data-testid="standard-checkbox"]');
  }

  // 党费缴费管理区域
  get feePaymentContainer() {
    return this.page.locator('[data-testid="fee-payment-container"]');
  }

  // 搜索和筛选（党费缴费）
  get paymentSearchInput() {
    return this.page.locator('[data-testid="payment-search-input"]');
  }

  get paymentSearchButton() {
    return this.page.locator('[data-testid="payment-search-button"]');
  }

  get paymentClearSearchButton() {
    return this.page.locator('[data-testid="payment-clear-search-button"]');
  }

  get paymentUserFilter() {
    return this.page.locator('[data-testid="payment-user-filter"]');
  }

  get paymentStatusFilter() {
    return this.page.locator('[data-testid="payment-status-filter"]');
  }

  get paymentMethodFilter() {
    return this.page.locator('[data-testid="payment-method-filter"]');
  }

  get paymentDateRangeFilter() {
    return this.page.locator('[data-testid="payment-date-range-filter"]');
  }

  get paymentResetFiltersButton() {
    return this.page.locator('[data-testid="payment-reset-filters-button"]');
  }

  // 操作按钮（党费缴费）
  get addPaymentButton() {
    return this.page.locator('[data-testid="add-payment-button"]');
  }

  get batchDeletePaymentsButton() {
    return this.page.locator('[data-testid="batch-delete-payments-button"]');
  }

  get exportPaymentsButton() {
    return this.page.locator('[data-testid="export-payments-button"]');
  }

  get importPaymentsButton() {
    return this.page.locator('[data-testid="import-payments-button"]');
  }

  get refreshPaymentsButton() {
    return this.page.locator('[data-testid="refresh-payments-button"]');
  }

  get generateReportButton() {
    return this.page.locator('[data-testid="generate-report-button"]');
  }

  // 党费缴费表格
  get paymentTable() {
    return this.page.locator('[data-testid="payment-table"]');
  }

  get paymentTableHeader() {
    return this.page.locator('[data-testid="payment-table-header"]');
  }

  get paymentTableBody() {
    return this.page.locator('[data-testid="payment-table-body"]');
  }

  get paymentRow() {
    return this.page.locator('[data-testid="payment-row"]');
  }

  get paymentSelectAllCheckbox() {
    return this.page.locator('[data-testid="payment-select-all-checkbox"]');
  }

  get paymentCheckbox() {
    return this.page.locator('[data-testid="payment-checkbox"]');
  }

  // 党费统计区域
  get feeStatisticsContainer() {
    return this.page.locator('[data-testid="fee-statistics-container"]');
  }

  get statisticsDateRangeFilter() {
    return this.page.locator('[data-testid="statistics-date-range-filter"]');
  }

  get statisticsOrganizationFilter() {
    return this.page.locator('[data-testid="statistics-organization-filter"]');
  }

  get statisticsRefreshButton() {
    return this.page.locator('[data-testid="statistics-refresh-button"]');
  }

  get statisticsExportButton() {
    return this.page.locator('[data-testid="statistics-export-button"]');
  }

  // 统计卡片
  get totalAmountCard() {
    return this.page.locator('[data-testid="total-amount-card"]');
  }

  get paidAmountCard() {
    return this.page.locator('[data-testid="paid-amount-card"]');
  }

  get unpaidAmountCard() {
    return this.page.locator('[data-testid="unpaid-amount-card"]');
  }

  get paymentRateCard() {
    return this.page.locator('[data-testid="payment-rate-card"]');
  }

  // 统计图表
  get paymentTrendChart() {
    return this.page.locator('[data-testid="payment-trend-chart"]');
  }

  get organizationPaymentChart() {
    return this.page.locator('[data-testid="organization-payment-chart"]');
  }

  get monthlyPaymentChart() {
    return this.page.locator('[data-testid="monthly-payment-chart"]');
  }

  // 操作按钮（行内）
  get viewButton() {
    return this.page.locator('[data-testid="view-button"]');
  }

  get editButton() {
    return this.page.locator('[data-testid="edit-button"]');
  }

  get deleteButton() {
    return this.page.locator('[data-testid="delete-button"]');
  }

  get activateButton() {
    return this.page.locator('[data-testid="activate-button"]');
  }

  get deactivateButton() {
    return this.page.locator('[data-testid="deactivate-button"]');
  }

  get confirmPaymentButton() {
    return this.page.locator('[data-testid="confirm-payment-button"]');
  }

  get cancelPaymentButton() {
    return this.page.locator('[data-testid="cancel-payment-button"]');
  }

  // 分页
  get standardPagination() {
    return this.page.locator('[data-testid="standard-pagination"]');
  }

  get paymentPagination() {
    return this.page.locator('[data-testid="payment-pagination"]');
  }

  get pageInfo() {
    return this.page.locator('[data-testid="page-info"]');
  }

  get pageSizeSelector() {
    return this.page.locator('[data-testid="page-size-selector"]');
  }

  // 党费标准表单模态框
  get standardFormModal() {
    return this.page.locator('[data-testid="standard-form-modal"]');
  }

  get standardFormCloseButton() {
    return this.page.locator('[data-testid="standard-form-close-button"]');
  }

  get standardFormSubmitButton() {
    return this.page.locator('[data-testid="standard-form-submit-button"]');
  }

  get standardFormCancelButton() {
    return this.page.locator('[data-testid="standard-form-cancel-button"]');
  }

  // 党费标准表单字段
  get standardNameInput() {
    return this.page.locator('[data-testid="standard-name-input"]');
  }

  get standardAmountInput() {
    return this.page.locator('[data-testid="standard-amount-input"]');
  }

  get standardTypeSelect() {
    return this.page.locator('[data-testid="standard-type-select"]');
  }

  get standardStatusSelect() {
    return this.page.locator('[data-testid="standard-status-select"]');
  }

  get standardEffectiveDateInput() {
    return this.page.locator('[data-testid="standard-effective-date-input"]');
  }

  get standardExpiryDateInput() {
    return this.page.locator('[data-testid="standard-expiry-date-input"]');
  }

  get standardDescriptionTextarea() {
    return this.page.locator('[data-testid="standard-description-textarea"]');
  }

  get standardRemarkTextarea() {
    return this.page.locator('[data-testid="standard-remark-textarea"]');
  }

  // 党费缴费表单模态框
  get paymentFormModal() {
    return this.page.locator('[data-testid="payment-form-modal"]');
  }

  get paymentFormCloseButton() {
    return this.page.locator('[data-testid="payment-form-close-button"]');
  }

  get paymentFormSubmitButton() {
    return this.page.locator('[data-testid="payment-form-submit-button"]');
  }

  get paymentFormCancelButton() {
    return this.page.locator('[data-testid="payment-form-cancel-button"]');
  }

  // 党费缴费表单字段
  get paymentUserSelect() {
    return this.page.locator('[data-testid="payment-user-select"]');
  }

  get paymentStandardSelect() {
    return this.page.locator('[data-testid="payment-standard-select"]');
  }

  get paymentAmountInput() {
    return this.page.locator('[data-testid="payment-amount-input"]');
  }

  get paymentMethodSelect() {
    return this.page.locator('[data-testid="payment-method-select"]');
  }

  get paymentDateInput() {
    return this.page.locator('[data-testid="payment-date-input"]');
  }

  get paymentStatusSelect() {
    return this.page.locator('[data-testid="payment-status-select"]');
  }

  get paymentPeriodInput() {
    return this.page.locator('[data-testid="payment-period-input"]');
  }

  get paymentRemarkTextarea() {
    return this.page.locator('[data-testid="payment-remark-textarea"]');
  }

  // 详情模态框
  get detailModal() {
    return this.page.locator('[data-testid="detail-modal"]');
  }

  get detailCloseButton() {
    return this.page.locator('[data-testid="detail-close-button"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/fees');
    await this.waitForFeeManagementPageLoad();
  }

  async waitForFeeManagementPageLoad() {
    await this.feeManagementContainer.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
  }

  // 标签页切换
  async switchToFeeStandardTab() {
    await this.feeStandardTab.click();
    await this.waitForElement(this.feeStandardContainer);
  }

  async switchToFeePaymentTab() {
    await this.feePaymentTab.click();
    await this.waitForElement(this.feePaymentContainer);
  }

  async switchToFeeStatisticsTab() {
    await this.feeStatisticsTab.click();
    await this.waitForElement(this.feeStatisticsContainer);
  }

  // 党费标准管理操作
  async searchStandards(keyword) {
    await this.standardSearchInput.fill(keyword);
    await this.standardSearchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async clearStandardSearch() {
    await this.standardClearSearchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async filterStandardsByStatus(status) {
    await this.standardStatusFilter.selectOption(status);
    await this.waitForLoadingToDisappear();
  }

  async setStandardDateRangeFilter(startDate, endDate) {
    await this.standardDateRangeFilter.click();
    
    const startDateInput = this.page.locator('[data-testid="standard-start-date-input"]');
    await startDateInput.fill(startDate);
    
    const endDateInput = this.page.locator('[data-testid="standard-end-date-input"]');
    await endDateInput.fill(endDate);
    
    const confirmButton = this.page.locator('[data-testid="standard-date-confirm-button"]');
    await confirmButton.click();
    
    await this.waitForLoadingToDisappear();
  }

  async resetStandardFilters() {
    await this.standardResetFiltersButton.click();
    await this.waitForLoadingToDisappear();
  }

  async addStandard(standardData) {
    await this.addStandardButton.click();
    await this.waitForElement(this.standardFormModal);
    await this.fillStandardForm(standardData);
    await this.standardFormSubmitButton.click();
    await this.waitForElementToDisappear(this.standardFormModal);
    await this.expectSuccessMessage('党费标准添加成功');
  }

  async editStandard(standardId, standardData) {
    const editButton = this.getStandardRowEditButton(standardId);
    await editButton.click();
    await this.waitForElement(this.standardFormModal);
    await this.fillStandardForm(standardData);
    await this.standardFormSubmitButton.click();
    await this.waitForElementToDisappear(this.standardFormModal);
    await this.expectSuccessMessage('党费标准更新成功');
  }

  async deleteStandard(standardId) {
    const deleteButton = this.getStandardRowDeleteButton(standardId);
    await deleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('党费标准删除成功');
  }

  async viewStandardDetail(standardId) {
    const viewButton = this.getStandardRowViewButton(standardId);
    await viewButton.click();
    await this.waitForElement(this.detailModal);
  }

  async activateStandard(standardId) {
    const activateButton = this.getStandardRowActivateButton(standardId);
    await activateButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('党费标准激活成功');
  }

  async deactivateStandard(standardId) {
    const deactivateButton = this.getStandardRowDeactivateButton(standardId);
    await deactivateButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('党费标准停用成功');
  }

  // 党费缴费管理操作
  async searchPayments(keyword) {
    await this.paymentSearchInput.fill(keyword);
    await this.paymentSearchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async clearPaymentSearch() {
    await this.paymentClearSearchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async filterPaymentsByUser(userId) {
    await this.paymentUserFilter.selectOption(userId);
    await this.waitForLoadingToDisappear();
  }

  async filterPaymentsByStatus(status) {
    await this.paymentStatusFilter.selectOption(status);
    await this.waitForLoadingToDisappear();
  }

  async filterPaymentsByMethod(method) {
    await this.paymentMethodFilter.selectOption(method);
    await this.waitForLoadingToDisappear();
  }

  async setPaymentDateRangeFilter(startDate, endDate) {
    await this.paymentDateRangeFilter.click();
    
    const startDateInput = this.page.locator('[data-testid="payment-start-date-input"]');
    await startDateInput.fill(startDate);
    
    const endDateInput = this.page.locator('[data-testid="payment-end-date-input"]');
    await endDateInput.fill(endDate);
    
    const confirmButton = this.page.locator('[data-testid="payment-date-confirm-button"]');
    await confirmButton.click();
    
    await this.waitForLoadingToDisappear();
  }

  async resetPaymentFilters() {
    await this.paymentResetFiltersButton.click();
    await this.waitForLoadingToDisappear();
  }

  async addPayment(paymentData) {
    await this.addPaymentButton.click();
    await this.waitForElement(this.paymentFormModal);
    await this.fillPaymentForm(paymentData);
    await this.paymentFormSubmitButton.click();
    await this.waitForElementToDisappear(this.paymentFormModal);
    await this.expectSuccessMessage('党费缴费记录添加成功');
  }

  async editPayment(paymentId, paymentData) {
    const editButton = this.getPaymentRowEditButton(paymentId);
    await editButton.click();
    await this.waitForElement(this.paymentFormModal);
    await this.fillPaymentForm(paymentData);
    await this.paymentFormSubmitButton.click();
    await this.waitForElementToDisappear(this.paymentFormModal);
    await this.expectSuccessMessage('党费缴费记录更新成功');
  }

  async deletePayment(paymentId) {
    const deleteButton = this.getPaymentRowDeleteButton(paymentId);
    await deleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('党费缴费记录删除成功');
  }

  async viewPaymentDetail(paymentId) {
    const viewButton = this.getPaymentRowViewButton(paymentId);
    await viewButton.click();
    await this.waitForElement(this.detailModal);
  }

  async confirmPayment(paymentId) {
    const confirmButton = this.getPaymentRowConfirmButton(paymentId);
    await confirmButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('党费缴费确认成功');
  }

  async cancelPayment(paymentId) {
    const cancelButton = this.getPaymentRowCancelButton(paymentId);
    await cancelButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('党费缴费取消成功');
  }

  // 批量操作
  async selectAllStandards() {
    await this.standardSelectAllCheckbox.check();
  }

  async unselectAllStandards() {
    await this.standardSelectAllCheckbox.uncheck();
  }

  async selectStandard(standardId) {
    const checkbox = this.getStandardRowCheckbox(standardId);
    await checkbox.check();
  }

  async unselectStandard(standardId) {
    const checkbox = this.getStandardRowCheckbox(standardId);
    await checkbox.uncheck();
  }

  async batchDeleteStandards() {
    await this.batchDeleteStandardsButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('批量删除成功');
  }

  async exportStandards() {
    await this.exportStandardsButton.click();
    await this.page.waitForTimeout(2000);
  }

  async selectAllPayments() {
    await this.paymentSelectAllCheckbox.check();
  }

  async unselectAllPayments() {
    await this.paymentSelectAllCheckbox.uncheck();
  }

  async selectPayment(paymentId) {
    const checkbox = this.getPaymentRowCheckbox(paymentId);
    await checkbox.check();
  }

  async unselectPayment(paymentId) {
    const checkbox = this.getPaymentRowCheckbox(paymentId);
    await checkbox.uncheck();
  }

  async batchDeletePayments() {
    await this.batchDeletePaymentsButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('批量删除成功');
  }

  async exportPayments() {
    await this.exportPaymentsButton.click();
    await this.page.waitForTimeout(2000);
  }

  async importPayments(filePath) {
    await this.importPaymentsButton.click();
    
    const fileInput = this.page.locator('[data-testid="import-file-input"]');
    await fileInput.setInputFiles(filePath);
    
    const importButton = this.page.locator('[data-testid="import-confirm-button"]');
    await importButton.click();
    
    await this.expectSuccessMessage('党费缴费记录导入成功');
  }

  async generateReport() {
    await this.generateReportButton.click();
    await this.page.waitForTimeout(3000);
  }

  // 统计功能
  async setStatisticsDateRange(startDate, endDate) {
    await this.statisticsDateRangeFilter.click();
    
    const startDateInput = this.page.locator('[data-testid="statistics-start-date-input"]');
    await startDateInput.fill(startDate);
    
    const endDateInput = this.page.locator('[data-testid="statistics-end-date-input"]');
    await endDateInput.fill(endDate);
    
    const confirmButton = this.page.locator('[data-testid="statistics-date-confirm-button"]');
    await confirmButton.click();
    
    await this.waitForLoadingToDisappear();
  }

  async filterStatisticsByOrganization(organizationId) {
    await this.statisticsOrganizationFilter.selectOption(organizationId);
    await this.waitForLoadingToDisappear();
  }

  async refreshStatistics() {
    await this.statisticsRefreshButton.click();
    await this.waitForLoadingToDisappear();
  }

  async exportStatistics() {
    await this.statisticsExportButton.click();
    await this.page.waitForTimeout(2000);
  }

  // 表单操作
  async fillStandardForm(standardData) {
    if (standardData.name) {
      await this.standardNameInput.fill(standardData.name);
    }
    if (standardData.amount) {
      await this.standardAmountInput.fill(standardData.amount.toString());
    }
    if (standardData.type) {
      await this.standardTypeSelect.selectOption(standardData.type);
    }
    if (standardData.status) {
      await this.standardStatusSelect.selectOption(standardData.status);
    }
    if (standardData.effectiveDate) {
      await this.standardEffectiveDateInput.fill(standardData.effectiveDate);
    }
    if (standardData.expiryDate) {
      await this.standardExpiryDateInput.fill(standardData.expiryDate);
    }
    if (standardData.description) {
      await this.standardDescriptionTextarea.fill(standardData.description);
    }
    if (standardData.remark) {
      await this.standardRemarkTextarea.fill(standardData.remark);
    }
  }

  async fillPaymentForm(paymentData) {
    if (paymentData.userId) {
      await this.paymentUserSelect.selectOption(paymentData.userId);
    }
    if (paymentData.standardId) {
      await this.paymentStandardSelect.selectOption(paymentData.standardId);
    }
    if (paymentData.amount) {
      await this.paymentAmountInput.fill(paymentData.amount.toString());
    }
    if (paymentData.method) {
      await this.paymentMethodSelect.selectOption(paymentData.method);
    }
    if (paymentData.paymentDate) {
      await this.paymentDateInput.fill(paymentData.paymentDate);
    }
    if (paymentData.status) {
      await this.paymentStatusSelect.selectOption(paymentData.status);
    }
    if (paymentData.period) {
      await this.paymentPeriodInput.fill(paymentData.period);
    }
    if (paymentData.remark) {
      await this.paymentRemarkTextarea.fill(paymentData.remark);
    }
  }

  async clearStandardForm() {
    await this.standardNameInput.clear();
    await this.standardAmountInput.clear();
    await this.standardDescriptionTextarea.clear();
    await this.standardRemarkTextarea.clear();
  }

  async clearPaymentForm() {
    await this.paymentAmountInput.clear();
    await this.paymentPeriodInput.clear();
    await this.paymentRemarkTextarea.clear();
  }

  async closeStandardForm() {
    await this.standardFormCloseButton.click();
    await this.waitForElementToDisappear(this.standardFormModal);
  }

  async closePaymentForm() {
    await this.paymentFormCloseButton.click();
    await this.waitForElementToDisappear(this.paymentFormModal);
  }

  async closeDetail() {
    await this.detailCloseButton.click();
    await this.waitForElementToDisappear(this.detailModal);
  }

  // 数据获取
  async getStandardCount() {
    const rows = await this.standardRow.all();
    return rows.length;
  }

  async getPaymentCount() {
    const rows = await this.paymentRow.all();
    return rows.length;
  }

  async getStatisticsData() {
    return {
      totalAmount: await this.totalAmountCard.locator('[data-testid="card-value"]').textContent(),
      paidAmount: await this.paidAmountCard.locator('[data-testid="card-value"]').textContent(),
      unpaidAmount: await this.unpaidAmountCard.locator('[data-testid="card-value"]').textContent(),
      paymentRate: await this.paymentRateCard.locator('[data-testid="card-value"]').textContent()
    };
  }

  // 分页操作
  async goToStandardPage(pageNumber) {
    const pagination = this.standardPagination;
    const pageButton = pagination.locator(`[data-testid="page-${pageNumber}"]`);
    await pageButton.click();
    await this.waitForLoadingToDisappear();
  }

  async goToPaymentPage(pageNumber) {
    const pagination = this.paymentPagination;
    const pageButton = pagination.locator(`[data-testid="page-${pageNumber}"]`);
    await pageButton.click();
    await this.waitForLoadingToDisappear();
  }

  // 辅助方法
  getStandardRow(standardId) {
    return this.page.locator(`[data-testid="standard-row-${standardId}"]`);
  }

  getStandardRowCheckbox(standardId) {
    return this.getStandardRow(standardId).locator('[data-testid="standard-checkbox"]');
  }

  getStandardRowViewButton(standardId) {
    return this.getStandardRow(standardId).locator('[data-testid="view-button"]');
  }

  getStandardRowEditButton(standardId) {
    return this.getStandardRow(standardId).locator('[data-testid="edit-button"]');
  }

  getStandardRowDeleteButton(standardId) {
    return this.getStandardRow(standardId).locator('[data-testid="delete-button"]');
  }

  getStandardRowActivateButton(standardId) {
    return this.getStandardRow(standardId).locator('[data-testid="activate-button"]');
  }

  getStandardRowDeactivateButton(standardId) {
    return this.getStandardRow(standardId).locator('[data-testid="deactivate-button"]');
  }

  getPaymentRow(paymentId) {
    return this.page.locator(`[data-testid="payment-row-${paymentId}"]`);
  }

  getPaymentRowCheckbox(paymentId) {
    return this.getPaymentRow(paymentId).locator('[data-testid="payment-checkbox"]');
  }

  getPaymentRowViewButton(paymentId) {
    return this.getPaymentRow(paymentId).locator('[data-testid="view-button"]');
  }

  getPaymentRowEditButton(paymentId) {
    return this.getPaymentRow(paymentId).locator('[data-testid="edit-button"]');
  }

  getPaymentRowDeleteButton(paymentId) {
    return this.getPaymentRow(paymentId).locator('[data-testid="delete-button"]');
  }

  getPaymentRowConfirmButton(paymentId) {
    return this.getPaymentRow(paymentId).locator('[data-testid="confirm-payment-button"]');
  }

  getPaymentRowCancelButton(paymentId) {
    return this.getPaymentRow(paymentId).locator('[data-testid="cancel-payment-button"]');
  }

  // 验证方法
  async expectFeeManagementPageVisible() {
    await expect(this.feeManagementContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('党费管理');
  }

  async expectFeeStandardTabActive() {
    await expect(this.feeStandardTab).toHaveClass(/active/);
    await expect(this.feeStandardContainer).toBeVisible();
  }

  async expectFeePaymentTabActive() {
    await expect(this.feePaymentTab).toHaveClass(/active/);
    await expect(this.feePaymentContainer).toBeVisible();
  }

  async expectFeeStatisticsTabActive() {
    await expect(this.feeStatisticsTab).toHaveClass(/active/);
    await expect(this.feeStatisticsContainer).toBeVisible();
  }

  async expectStandardFormVisible() {
    await expect(this.standardFormModal).toBeVisible();
    await expect(this.standardNameInput).toBeVisible();
    await expect(this.standardAmountInput).toBeVisible();
  }

  async expectPaymentFormVisible() {
    await expect(this.paymentFormModal).toBeVisible();
    await expect(this.paymentUserSelect).toBeVisible();
    await expect(this.paymentAmountInput).toBeVisible();
  }

  async expectDetailVisible() {
    await expect(this.detailModal).toBeVisible();
  }

  async expectStatisticsCardsVisible() {
    await expect(this.totalAmountCard).toBeVisible();
    await expect(this.paidAmountCard).toBeVisible();
    await expect(this.unpaidAmountCard).toBeVisible();
    await expect(this.paymentRateCard).toBeVisible();
  }

  async expectChartsVisible() {
    await expect(this.paymentTrendChart).toBeVisible();
    await expect(this.organizationPaymentChart).toBeVisible();
    await expect(this.monthlyPaymentChart).toBeVisible();
  }

  // 刷新页面
  async refreshStandards() {
    await this.refreshStandardsButton.click();
    await this.waitForLoadingToDisappear();
  }

  async refreshPayments() {
    await this.refreshPaymentsButton.click();
    await this.waitForLoadingToDisappear();
  }

  // 性能测试
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.goto();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async measureSearchTime(keyword) {
    const startTime = Date.now();
    await this.searchStandards(keyword);
    const endTime = Date.now();
    return endTime - startTime;
  }
}