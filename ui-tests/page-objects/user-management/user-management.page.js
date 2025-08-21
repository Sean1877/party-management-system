import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 用户管理页面对象模型
 * 封装用户管理页面的元素定位和操作方法
 */
export class UserManagementPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get userManagementContainer() {
    return this.page.locator('[data-testid="user-management-container"]');
  }

  get pageTitle() {
    return this.page.locator('[data-testid="page-title"]');
  }

  // 搜索和筛选
  get searchInput() {
    return this.page.locator('[data-testid="user-search-input"]');
  }

  get searchButton() {
    return this.page.locator('[data-testid="search-button"]');
  }

  get clearSearchButton() {
    return this.page.locator('[data-testid="clear-search-button"]');
  }

  get statusFilter() {
    return this.page.locator('[data-testid="status-filter"]');
  }

  get roleFilter() {
    return this.page.locator('[data-testid="role-filter"]');
  }

  get organizationFilter() {
    return this.page.locator('[data-testid="organization-filter"]');
  }

  get dateRangeFilter() {
    return this.page.locator('[data-testid="date-range-filter"]');
  }

  get resetFiltersButton() {
    return this.page.locator('[data-testid="reset-filters-button"]');
  }

  // 操作按钮
  get addUserButton() {
    return this.page.locator('[data-testid="add-user-button"]');
  }

  get batchDeleteButton() {
    return this.page.locator('[data-testid="batch-delete-button"]');
  }

  get batchExportButton() {
    return this.page.locator('[data-testid="batch-export-button"]');
  }

  get importUsersButton() {
    return this.page.locator('[data-testid="import-users-button"]');
  }

  get refreshButton() {
    return this.page.locator('[data-testid="refresh-button"]');
  }

  // 用户表格
  get userTable() {
    return this.page.locator('[data-testid="user-table"]');
  }

  get tableHeader() {
    return this.page.locator('[data-testid="table-header"]');
  }

  get tableBody() {
    return this.page.locator('[data-testid="table-body"]');
  }

  get userRow() {
    return this.page.locator('[data-testid="user-row"]');
  }

  get selectAllCheckbox() {
    return this.page.locator('[data-testid="select-all-checkbox"]');
  }

  get userCheckbox() {
    return this.page.locator('[data-testid="user-checkbox"]');
  }

  // 表格列
  get userIdColumn() {
    return this.page.locator('[data-testid="user-id-column"]');
  }

  get usernameColumn() {
    return this.page.locator('[data-testid="username-column"]');
  }

  get realNameColumn() {
    return this.page.locator('[data-testid="real-name-column"]');
  }

  get emailColumn() {
    return this.page.locator('[data-testid="email-column"]');
  }

  get phoneColumn() {
    return this.page.locator('[data-testid="phone-column"]');
  }

  get roleColumn() {
    return this.page.locator('[data-testid="role-column"]');
  }

  get organizationColumn() {
    return this.page.locator('[data-testid="organization-column"]');
  }

  get statusColumn() {
    return this.page.locator('[data-testid="status-column"]');
  }

  get createTimeColumn() {
    return this.page.locator('[data-testid="create-time-column"]');
  }

  get actionsColumn() {
    return this.page.locator('[data-testid="actions-column"]');
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

  get resetPasswordButton() {
    return this.page.locator('[data-testid="reset-password-button"]');
  }

  get toggleStatusButton() {
    return this.page.locator('[data-testid="toggle-status-button"]');
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

  // 用户详情模态框
  get userDetailModal() {
    return this.page.locator('[data-testid="user-detail-modal"]');
  }

  get userDetailCloseButton() {
    return this.page.locator('[data-testid="user-detail-close-button"]');
  }

  // 用户表单模态框
  get userFormModal() {
    return this.page.locator('[data-testid="user-form-modal"]');
  }

  get userFormCloseButton() {
    return this.page.locator('[data-testid="user-form-close-button"]');
  }

  get userFormSubmitButton() {
    return this.page.locator('[data-testid="user-form-submit-button"]');
  }

  get userFormCancelButton() {
    return this.page.locator('[data-testid="user-form-cancel-button"]');
  }

  // 表单字段
  get usernameInput() {
    return this.page.locator('[data-testid="username-input"]');
  }

  get realNameInput() {
    return this.page.locator('[data-testid="real-name-input"]');
  }

  get emailInput() {
    return this.page.locator('[data-testid="email-input"]');
  }

  get phoneInput() {
    return this.page.locator('[data-testid="phone-input"]');
  }

  get passwordInput() {
    return this.page.locator('[data-testid="password-input"]');
  }

  get confirmPasswordInput() {
    return this.page.locator('[data-testid="confirm-password-input"]');
  }

  get roleSelect() {
    return this.page.locator('[data-testid="role-select"]');
  }

  get organizationSelect() {
    return this.page.locator('[data-testid="organization-select"]');
  }

  get statusSelect() {
    return this.page.locator('[data-testid="status-select"]');
  }

  get remarkTextarea() {
    return this.page.locator('[data-testid="remark-textarea"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/users');
    await this.waitForUserManagementPageLoad();
  }

  async waitForUserManagementPageLoad() {
    await this.userManagementContainer.waitFor({ state: 'visible' });
    await this.userTable.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
  }

  // 搜索和筛选操作
  async searchUsers(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async clearSearch() {
    await this.clearSearchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
    await this.waitForLoadingToDisappear();
  }

  async filterByRole(role) {
    await this.roleFilter.selectOption(role);
    await this.waitForLoadingToDisappear();
  }

  async filterByOrganization(organizationId) {
    await this.organizationFilter.selectOption(organizationId);
    await this.waitForLoadingToDisappear();
  }

  async setDateRangeFilter(startDate, endDate) {
    await this.dateRangeFilter.click();
    
    // 选择开始日期
    const startDateInput = this.page.locator('[data-testid="start-date-input"]');
    await startDateInput.fill(startDate);
    
    // 选择结束日期
    const endDateInput = this.page.locator('[data-testid="end-date-input"]');
    await endDateInput.fill(endDate);
    
    // 确认选择
    const confirmButton = this.page.locator('[data-testid="date-confirm-button"]');
    await confirmButton.click();
    
    await this.waitForLoadingToDisappear();
  }

  async resetFilters() {
    await this.resetFiltersButton.click();
    await this.waitForLoadingToDisappear();
  }

  // 用户操作
  async addUser(userData) {
    await this.addUserButton.click();
    await this.waitForElement(this.userFormModal);
    await this.fillUserForm(userData);
    await this.userFormSubmitButton.click();
    await this.waitForElementToDisappear(this.userFormModal);
    await this.expectSuccessMessage('用户添加成功');
  }

  async editUser(userId, userData) {
    const editButton = this.getUserRowEditButton(userId);
    await editButton.click();
    await this.waitForElement(this.userFormModal);
    await this.fillUserForm(userData);
    await this.userFormSubmitButton.click();
    await this.waitForElementToDisappear(this.userFormModal);
    await this.expectSuccessMessage('用户更新成功');
  }

  async deleteUser(userId) {
    const deleteButton = this.getUserRowDeleteButton(userId);
    await deleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('用户删除成功');
  }

  async viewUserDetail(userId) {
    const viewButton = this.getUserRowViewButton(userId);
    await viewButton.click();
    await this.waitForElement(this.userDetailModal);
  }

  async resetUserPassword(userId) {
    const resetButton = this.getUserRowResetPasswordButton(userId);
    await resetButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('密码重置成功');
  }

  async toggleUserStatus(userId) {
    const toggleButton = this.getUserRowToggleStatusButton(userId);
    await toggleButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('状态更新成功');
  }

  // 批量操作
  async selectAllUsers() {
    await this.selectAllCheckbox.check();
  }

  async unselectAllUsers() {
    await this.selectAllCheckbox.uncheck();
  }

  async selectUser(userId) {
    const checkbox = this.getUserRowCheckbox(userId);
    await checkbox.check();
  }

  async unselectUser(userId) {
    const checkbox = this.getUserRowCheckbox(userId);
    await checkbox.uncheck();
  }

  async batchDeleteUsers() {
    await this.batchDeleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('批量删除成功');
  }

  async batchExportUsers() {
    await this.batchExportButton.click();
    // 等待下载完成
    await this.page.waitForTimeout(2000);
  }

  async importUsers(filePath) {
    await this.importUsersButton.click();
    
    const fileInput = this.page.locator('[data-testid="import-file-input"]');
    await fileInput.setInputFiles(filePath);
    
    const importButton = this.page.locator('[data-testid="import-confirm-button"]');
    await importButton.click();
    
    await this.expectSuccessMessage('用户导入成功');
  }

  // 表单操作
  async fillUserForm(userData) {
    if (userData.username) {
      await this.usernameInput.fill(userData.username);
    }
    if (userData.realName) {
      await this.realNameInput.fill(userData.realName);
    }
    if (userData.email) {
      await this.emailInput.fill(userData.email);
    }
    if (userData.phone) {
      await this.phoneInput.fill(userData.phone);
    }
    if (userData.password) {
      await this.passwordInput.fill(userData.password);
    }
    if (userData.confirmPassword) {
      await this.confirmPasswordInput.fill(userData.confirmPassword);
    }
    if (userData.role) {
      await this.roleSelect.selectOption(userData.role);
    }
    if (userData.organizationId) {
      await this.organizationSelect.selectOption(userData.organizationId);
    }
    if (userData.status) {
      await this.statusSelect.selectOption(userData.status);
    }
    if (userData.remark) {
      await this.remarkTextarea.fill(userData.remark);
    }
  }

  async clearUserForm() {
    await this.usernameInput.clear();
    await this.realNameInput.clear();
    await this.emailInput.clear();
    await this.phoneInput.clear();
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();
    await this.remarkTextarea.clear();
  }

  async closeUserForm() {
    await this.userFormCloseButton.click();
    await this.waitForElementToDisappear(this.userFormModal);
  }

  async closeUserDetail() {
    await this.userDetailCloseButton.click();
    await this.waitForElementToDisappear(this.userDetailModal);
  }

  // 表格数据获取
  async getUserCount() {
    const rows = await this.userRow.all();
    return rows.length;
  }

  async getUserData(userId) {
    const row = this.getUserRow(userId);
    
    return {
      id: await row.locator('[data-testid="user-id"]').textContent(),
      username: await row.locator('[data-testid="username"]').textContent(),
      realName: await row.locator('[data-testid="real-name"]').textContent(),
      email: await row.locator('[data-testid="email"]').textContent(),
      phone: await row.locator('[data-testid="phone"]').textContent(),
      role: await row.locator('[data-testid="role"]').textContent(),
      organization: await row.locator('[data-testid="organization"]').textContent(),
      status: await row.locator('[data-testid="status"]').textContent(),
      createTime: await row.locator('[data-testid="create-time"]').textContent()
    };
  }

  async getAllUsersData() {
    const users = [];
    const rows = await this.userRow.all();
    
    for (const row of rows) {
      const userId = await row.locator('[data-testid="user-id"]').textContent();
      const userData = await this.getUserData(userId);
      users.push(userData);
    }
    
    return users;
  }

  // 分页操作
  async goToPage(pageNumber) {
    await this.goToPageNumber(pageNumber);
    await this.waitForLoadingToDisappear();
  }

  async changePageSize(size) {
    await this.pageSizeSelector.selectOption(size.toString());
    await this.waitForLoadingToDisappear();
  }

  async getPageInfo() {
    const text = await this.pageInfo.textContent();
    const match = text.match(/第 (\d+) 页，共 (\d+) 页，总计 (\d+) 条/);
    
    if (match) {
      return {
        currentPage: parseInt(match[1]),
        totalPages: parseInt(match[2]),
        totalItems: parseInt(match[3])
      };
    }
    
    return null;
  }

  // 排序操作
  async sortByColumn(columnName, direction = 'asc') {
    const column = this.page.locator(`[data-testid="${columnName}-column-header"]`);
    await column.click();
    
    if (direction === 'desc') {
      await column.click(); // 再次点击切换到降序
    }
    
    await this.waitForLoadingToDisappear();
  }

  // 辅助方法
  getUserRow(userId) {
    return this.page.locator(`[data-testid="user-row-${userId}"]`);
  }

  getUserRowCheckbox(userId) {
    return this.getUserRow(userId).locator('[data-testid="user-checkbox"]');
  }

  getUserRowViewButton(userId) {
    return this.getUserRow(userId).locator('[data-testid="view-button"]');
  }

  getUserRowEditButton(userId) {
    return this.getUserRow(userId).locator('[data-testid="edit-button"]');
  }

  getUserRowDeleteButton(userId) {
    return this.getUserRow(userId).locator('[data-testid="delete-button"]');
  }

  getUserRowResetPasswordButton(userId) {
    return this.getUserRow(userId).locator('[data-testid="reset-password-button"]');
  }

  getUserRowToggleStatusButton(userId) {
    return this.getUserRow(userId).locator('[data-testid="toggle-status-button"]');
  }

  // 验证方法
  async expectUserManagementPageVisible() {
    await expect(this.userManagementContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('用户管理');
    await expect(this.userTable).toBeVisible();
  }

  async expectUserInTable(userData) {
    const row = this.page.locator(`[data-testid="user-row"]`).filter({
      hasText: userData.username
    });
    await expect(row).toBeVisible();
    
    if (userData.realName) {
      await expect(row).toContainText(userData.realName);
    }
    if (userData.email) {
      await expect(row).toContainText(userData.email);
    }
  }

  async expectUserNotInTable(username) {
    const row = this.page.locator(`[data-testid="user-row"]`).filter({
      hasText: username
    });
    await expect(row).not.toBeVisible();
  }

  async expectUserFormVisible() {
    await expect(this.userFormModal).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.realNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
  }

  async expectUserDetailVisible() {
    await expect(this.userDetailModal).toBeVisible();
  }

  async expectSelectedUsersCount(count) {
    const selectedCheckboxes = await this.userCheckbox.filter({ checked: true }).count();
    expect(selectedCheckboxes).toBe(count);
  }

  // 刷新页面
  async refreshPage() {
    await this.refreshButton.click();
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
    await this.searchUsers(keyword);
    const endTime = Date.now();
    return endTime - startTime;
  }
}