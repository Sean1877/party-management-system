import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 组织管理页面对象模型
 * 封装组织管理页面的元素定位和操作方法
 */
export class OrganizationManagementPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get organizationManagementContainer() {
    return this.page.locator('[data-testid="organization-management-container"]');
  }

  get pageTitle() {
    return this.page.locator('[data-testid="page-title"]');
  }

  // 搜索和筛选
  get searchInput() {
    return this.page.locator('[data-testid="organization-search-input"]');
  }

  get searchButton() {
    return this.page.locator('[data-testid="search-button"]');
  }

  get clearSearchButton() {
    return this.page.locator('[data-testid="clear-search-button"]');
  }

  get typeFilter() {
    return this.page.locator('[data-testid="type-filter"]');
  }

  get statusFilter() {
    return this.page.locator('[data-testid="status-filter"]');
  }

  get levelFilter() {
    return this.page.locator('[data-testid="level-filter"]');
  }

  get parentOrgFilter() {
    return this.page.locator('[data-testid="parent-org-filter"]');
  }

  get dateRangeFilter() {
    return this.page.locator('[data-testid="date-range-filter"]');
  }

  get resetFiltersButton() {
    return this.page.locator('[data-testid="reset-filters-button"]');
  }

  // 操作按钮
  get addOrganizationButton() {
    return this.page.locator('[data-testid="add-organization-button"]');
  }

  get batchDeleteButton() {
    return this.page.locator('[data-testid="batch-delete-button"]');
  }

  get batchExportButton() {
    return this.page.locator('[data-testid="batch-export-button"]');
  }

  get importOrganizationsButton() {
    return this.page.locator('[data-testid="import-organizations-button"]');
  }

  get refreshButton() {
    return this.page.locator('[data-testid="refresh-button"]');
  }

  get treeViewButton() {
    return this.page.locator('[data-testid="tree-view-button"]');
  }

  get listViewButton() {
    return this.page.locator('[data-testid="list-view-button"]');
  }

  // 组织表格
  get organizationTable() {
    return this.page.locator('[data-testid="organization-table"]');
  }

  get tableHeader() {
    return this.page.locator('[data-testid="table-header"]');
  }

  get tableBody() {
    return this.page.locator('[data-testid="table-body"]');
  }

  get organizationRow() {
    return this.page.locator('[data-testid="organization-row"]');
  }

  get selectAllCheckbox() {
    return this.page.locator('[data-testid="select-all-checkbox"]');
  }

  get organizationCheckbox() {
    return this.page.locator('[data-testid="organization-checkbox"]');
  }

  // 组织树形视图
  get organizationTree() {
    return this.page.locator('[data-testid="organization-tree"]');
  }

  get treeNode() {
    return this.page.locator('[data-testid="tree-node"]');
  }

  get expandButton() {
    return this.page.locator('[data-testid="expand-button"]');
  }

  get collapseButton() {
    return this.page.locator('[data-testid="collapse-button"]');
  }

  // 表格列
  get organizationIdColumn() {
    return this.page.locator('[data-testid="organization-id-column"]');
  }

  get organizationNameColumn() {
    return this.page.locator('[data-testid="organization-name-column"]');
  }

  get organizationCodeColumn() {
    return this.page.locator('[data-testid="organization-code-column"]');
  }

  get typeColumn() {
    return this.page.locator('[data-testid="type-column"]');
  }

  get levelColumn() {
    return this.page.locator('[data-testid="level-column"]');
  }

  get parentOrgColumn() {
    return this.page.locator('[data-testid="parent-org-column"]');
  }

  get memberCountColumn() {
    return this.page.locator('[data-testid="member-count-column"]');
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

  get manageMembersButton() {
    return this.page.locator('[data-testid="manage-members-button"]');
  }

  get toggleStatusButton() {
    return this.page.locator('[data-testid="toggle-status-button"]');
  }

  get addSubOrgButton() {
    return this.page.locator('[data-testid="add-sub-org-button"]');
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

  // 组织详情模态框
  get organizationDetailModal() {
    return this.page.locator('[data-testid="organization-detail-modal"]');
  }

  get organizationDetailCloseButton() {
    return this.page.locator('[data-testid="organization-detail-close-button"]');
  }

  // 组织表单模态框
  get organizationFormModal() {
    return this.page.locator('[data-testid="organization-form-modal"]');
  }

  get organizationFormCloseButton() {
    return this.page.locator('[data-testid="organization-form-close-button"]');
  }

  get organizationFormSubmitButton() {
    return this.page.locator('[data-testid="organization-form-submit-button"]');
  }

  get organizationFormCancelButton() {
    return this.page.locator('[data-testid="organization-form-cancel-button"]');
  }

  // 表单字段
  get organizationNameInput() {
    return this.page.locator('[data-testid="organization-name-input"]');
  }

  get organizationCodeInput() {
    return this.page.locator('[data-testid="organization-code-input"]');
  }

  get typeSelect() {
    return this.page.locator('[data-testid="type-select"]');
  }

  get levelSelect() {
    return this.page.locator('[data-testid="level-select"]');
  }

  get parentOrgSelect() {
    return this.page.locator('[data-testid="parent-org-select"]');
  }

  get statusSelect() {
    return this.page.locator('[data-testid="status-select"]');
  }

  get addressInput() {
    return this.page.locator('[data-testid="address-input"]');
  }

  get contactPersonInput() {
    return this.page.locator('[data-testid="contact-person-input"]');
  }

  get contactPhoneInput() {
    return this.page.locator('[data-testid="contact-phone-input"]');
  }

  get contactEmailInput() {
    return this.page.locator('[data-testid="contact-email-input"]');
  }

  get descriptionTextarea() {
    return this.page.locator('[data-testid="description-textarea"]');
  }

  get remarkTextarea() {
    return this.page.locator('[data-testid="remark-textarea"]');
  }

  // 成员管理模态框
  get memberManagementModal() {
    return this.page.locator('[data-testid="member-management-modal"]');
  }

  get memberManagementCloseButton() {
    return this.page.locator('[data-testid="member-management-close-button"]');
  }

  get addMemberButton() {
    return this.page.locator('[data-testid="add-member-button"]');
  }

  get removeMemberButton() {
    return this.page.locator('[data-testid="remove-member-button"]');
  }

  get memberTable() {
    return this.page.locator('[data-testid="member-table"]');
  }

  get memberRow() {
    return this.page.locator('[data-testid="member-row"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/organizations');
    await this.waitForOrganizationManagementPageLoad();
  }

  async waitForOrganizationManagementPageLoad() {
    await this.organizationManagementContainer.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
  }

  // 视图切换
  async switchToTreeView() {
    await this.treeViewButton.click();
    await this.waitForElement(this.organizationTree);
  }

  async switchToListView() {
    await this.listViewButton.click();
    await this.waitForElement(this.organizationTable);
  }

  // 搜索和筛选操作
  async searchOrganizations(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async clearSearch() {
    await this.clearSearchButton.click();
    await this.waitForLoadingToDisappear();
  }

  async filterByType(type) {
    await this.typeFilter.selectOption(type);
    await this.waitForLoadingToDisappear();
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
    await this.waitForLoadingToDisappear();
  }

  async filterByLevel(level) {
    await this.levelFilter.selectOption(level);
    await this.waitForLoadingToDisappear();
  }

  async filterByParentOrg(parentOrgId) {
    await this.parentOrgFilter.selectOption(parentOrgId);
    await this.waitForLoadingToDisappear();
  }

  async setDateRangeFilter(startDate, endDate) {
    await this.dateRangeFilter.click();
    
    const startDateInput = this.page.locator('[data-testid="start-date-input"]');
    await startDateInput.fill(startDate);
    
    const endDateInput = this.page.locator('[data-testid="end-date-input"]');
    await endDateInput.fill(endDate);
    
    const confirmButton = this.page.locator('[data-testid="date-confirm-button"]');
    await confirmButton.click();
    
    await this.waitForLoadingToDisappear();
  }

  async resetFilters() {
    await this.resetFiltersButton.click();
    await this.waitForLoadingToDisappear();
  }

  // 组织操作
  async addOrganization(organizationData) {
    await this.addOrganizationButton.click();
    await this.waitForElement(this.organizationFormModal);
    await this.fillOrganizationForm(organizationData);
    await this.organizationFormSubmitButton.click();
    await this.waitForElementToDisappear(this.organizationFormModal);
    await this.expectSuccessMessage('组织添加成功');
  }

  async editOrganization(organizationId, organizationData) {
    const editButton = this.getOrganizationRowEditButton(organizationId);
    await editButton.click();
    await this.waitForElement(this.organizationFormModal);
    await this.fillOrganizationForm(organizationData);
    await this.organizationFormSubmitButton.click();
    await this.waitForElementToDisappear(this.organizationFormModal);
    await this.expectSuccessMessage('组织更新成功');
  }

  async deleteOrganization(organizationId) {
    const deleteButton = this.getOrganizationRowDeleteButton(organizationId);
    await deleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('组织删除成功');
  }

  async viewOrganizationDetail(organizationId) {
    const viewButton = this.getOrganizationRowViewButton(organizationId);
    await viewButton.click();
    await this.waitForElement(this.organizationDetailModal);
  }

  async toggleOrganizationStatus(organizationId) {
    const toggleButton = this.getOrganizationRowToggleStatusButton(organizationId);
    await toggleButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('状态更新成功');
  }

  async addSubOrganization(parentOrgId, organizationData) {
    const addSubButton = this.getOrganizationRowAddSubOrgButton(parentOrgId);
    await addSubButton.click();
    await this.waitForElement(this.organizationFormModal);
    await this.fillOrganizationForm(organizationData);
    await this.organizationFormSubmitButton.click();
    await this.waitForElementToDisappear(this.organizationFormModal);
    await this.expectSuccessMessage('子组织添加成功');
  }

  // 成员管理
  async manageMembers(organizationId) {
    const manageMembersButton = this.getOrganizationRowManageMembersButton(organizationId);
    await manageMembersButton.click();
    await this.waitForElement(this.memberManagementModal);
  }

  async addMemberToOrganization(userId) {
    await this.addMemberButton.click();
    
    const userSelect = this.page.locator('[data-testid="user-select"]');
    await userSelect.selectOption(userId);
    
    const confirmButton = this.page.locator('[data-testid="add-member-confirm-button"]');
    await confirmButton.click();
    
    await this.expectSuccessMessage('成员添加成功');
  }

  async removeMemberFromOrganization(userId) {
    const removeMemberButton = this.getMemberRowRemoveButton(userId);
    await removeMemberButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('成员移除成功');
  }

  async closeMemberManagement() {
    await this.memberManagementCloseButton.click();
    await this.waitForElementToDisappear(this.memberManagementModal);
  }

  // 批量操作
  async selectAllOrganizations() {
    await this.selectAllCheckbox.check();
  }

  async unselectAllOrganizations() {
    await this.selectAllCheckbox.uncheck();
  }

  async selectOrganization(organizationId) {
    const checkbox = this.getOrganizationRowCheckbox(organizationId);
    await checkbox.check();
  }

  async unselectOrganization(organizationId) {
    const checkbox = this.getOrganizationRowCheckbox(organizationId);
    await checkbox.uncheck();
  }

  async batchDeleteOrganizations() {
    await this.batchDeleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('批量删除成功');
  }

  async batchExportOrganizations() {
    await this.batchExportButton.click();
    await this.page.waitForTimeout(2000);
  }

  async importOrganizations(filePath) {
    await this.importOrganizationsButton.click();
    
    const fileInput = this.page.locator('[data-testid="import-file-input"]');
    await fileInput.setInputFiles(filePath);
    
    const importButton = this.page.locator('[data-testid="import-confirm-button"]');
    await importButton.click();
    
    await this.expectSuccessMessage('组织导入成功');
  }

  // 树形视图操作
  async expandTreeNode(organizationId) {
    const node = this.getTreeNode(organizationId);
    const expandButton = node.locator('[data-testid="expand-button"]');
    if (await expandButton.isVisible()) {
      await expandButton.click();
    }
  }

  async collapseTreeNode(organizationId) {
    const node = this.getTreeNode(organizationId);
    const collapseButton = node.locator('[data-testid="collapse-button"]');
    if (await collapseButton.isVisible()) {
      await collapseButton.click();
    }
  }

  async expandAllTreeNodes() {
    const expandAllButton = this.page.locator('[data-testid="expand-all-button"]');
    if (await expandAllButton.isVisible()) {
      await expandAllButton.click();
    }
  }

  async collapseAllTreeNodes() {
    const collapseAllButton = this.page.locator('[data-testid="collapse-all-button"]');
    if (await collapseAllButton.isVisible()) {
      await collapseAllButton.click();
    }
  }

  // 表单操作
  async fillOrganizationForm(organizationData) {
    if (organizationData.name) {
      await this.organizationNameInput.fill(organizationData.name);
    }
    if (organizationData.code) {
      await this.organizationCodeInput.fill(organizationData.code);
    }
    if (organizationData.type) {
      await this.typeSelect.selectOption(organizationData.type);
    }
    if (organizationData.level) {
      await this.levelSelect.selectOption(organizationData.level);
    }
    if (organizationData.parentOrgId) {
      await this.parentOrgSelect.selectOption(organizationData.parentOrgId);
    }
    if (organizationData.status) {
      await this.statusSelect.selectOption(organizationData.status);
    }
    if (organizationData.address) {
      await this.addressInput.fill(organizationData.address);
    }
    if (organizationData.contactPerson) {
      await this.contactPersonInput.fill(organizationData.contactPerson);
    }
    if (organizationData.contactPhone) {
      await this.contactPhoneInput.fill(organizationData.contactPhone);
    }
    if (organizationData.contactEmail) {
      await this.contactEmailInput.fill(organizationData.contactEmail);
    }
    if (organizationData.description) {
      await this.descriptionTextarea.fill(organizationData.description);
    }
    if (organizationData.remark) {
      await this.remarkTextarea.fill(organizationData.remark);
    }
  }

  async clearOrganizationForm() {
    await this.organizationNameInput.clear();
    await this.organizationCodeInput.clear();
    await this.addressInput.clear();
    await this.contactPersonInput.clear();
    await this.contactPhoneInput.clear();
    await this.contactEmailInput.clear();
    await this.descriptionTextarea.clear();
    await this.remarkTextarea.clear();
  }

  async closeOrganizationForm() {
    await this.organizationFormCloseButton.click();
    await this.waitForElementToDisappear(this.organizationFormModal);
  }

  async closeOrganizationDetail() {
    await this.organizationDetailCloseButton.click();
    await this.waitForElementToDisappear(this.organizationDetailModal);
  }

  // 表格数据获取
  async getOrganizationCount() {
    const rows = await this.organizationRow.all();
    return rows.length;
  }

  async getOrganizationData(organizationId) {
    const row = this.getOrganizationRow(organizationId);
    
    return {
      id: await row.locator('[data-testid="organization-id"]').textContent(),
      name: await row.locator('[data-testid="organization-name"]').textContent(),
      code: await row.locator('[data-testid="organization-code"]').textContent(),
      type: await row.locator('[data-testid="type"]').textContent(),
      level: await row.locator('[data-testid="level"]').textContent(),
      parentOrg: await row.locator('[data-testid="parent-org"]').textContent(),
      memberCount: await row.locator('[data-testid="member-count"]').textContent(),
      status: await row.locator('[data-testid="status"]').textContent(),
      createTime: await row.locator('[data-testid="create-time"]').textContent()
    };
  }

  async getAllOrganizationsData() {
    const organizations = [];
    const rows = await this.organizationRow.all();
    
    for (const row of rows) {
      const organizationId = await row.locator('[data-testid="organization-id"]').textContent();
      const organizationData = await this.getOrganizationData(organizationId);
      organizations.push(organizationData);
    }
    
    return organizations;
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
      await column.click();
    }
    
    await this.waitForLoadingToDisappear();
  }

  // 辅助方法
  getOrganizationRow(organizationId) {
    return this.page.locator(`[data-testid="organization-row-${organizationId}"]`);
  }

  getOrganizationRowCheckbox(organizationId) {
    return this.getOrganizationRow(organizationId).locator('[data-testid="organization-checkbox"]');
  }

  getOrganizationRowViewButton(organizationId) {
    return this.getOrganizationRow(organizationId).locator('[data-testid="view-button"]');
  }

  getOrganizationRowEditButton(organizationId) {
    return this.getOrganizationRow(organizationId).locator('[data-testid="edit-button"]');
  }

  getOrganizationRowDeleteButton(organizationId) {
    return this.getOrganizationRow(organizationId).locator('[data-testid="delete-button"]');
  }

  getOrganizationRowManageMembersButton(organizationId) {
    return this.getOrganizationRow(organizationId).locator('[data-testid="manage-members-button"]');
  }

  getOrganizationRowToggleStatusButton(organizationId) {
    return this.getOrganizationRow(organizationId).locator('[data-testid="toggle-status-button"]');
  }

  getOrganizationRowAddSubOrgButton(organizationId) {
    return this.getOrganizationRow(organizationId).locator('[data-testid="add-sub-org-button"]');
  }

  getTreeNode(organizationId) {
    return this.page.locator(`[data-testid="tree-node-${organizationId}"]`);
  }

  getMemberRow(userId) {
    return this.page.locator(`[data-testid="member-row-${userId}"]`);
  }

  getMemberRowRemoveButton(userId) {
    return this.getMemberRow(userId).locator('[data-testid="remove-member-button"]');
  }

  // 验证方法
  async expectOrganizationManagementPageVisible() {
    await expect(this.organizationManagementContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('组织管理');
  }

  async expectOrganizationInTable(organizationData) {
    const row = this.page.locator(`[data-testid="organization-row"]`).filter({
      hasText: organizationData.name
    });
    await expect(row).toBeVisible();
    
    if (organizationData.code) {
      await expect(row).toContainText(organizationData.code);
    }
    if (organizationData.type) {
      await expect(row).toContainText(organizationData.type);
    }
  }

  async expectOrganizationNotInTable(organizationName) {
    const row = this.page.locator(`[data-testid="organization-row"]`).filter({
      hasText: organizationName
    });
    await expect(row).not.toBeVisible();
  }

  async expectOrganizationFormVisible() {
    await expect(this.organizationFormModal).toBeVisible();
    await expect(this.organizationNameInput).toBeVisible();
    await expect(this.organizationCodeInput).toBeVisible();
  }

  async expectOrganizationDetailVisible() {
    await expect(this.organizationDetailModal).toBeVisible();
  }

  async expectMemberManagementVisible() {
    await expect(this.memberManagementModal).toBeVisible();
    await expect(this.memberTable).toBeVisible();
  }

  async expectTreeViewVisible() {
    await expect(this.organizationTree).toBeVisible();
  }

  async expectListViewVisible() {
    await expect(this.organizationTable).toBeVisible();
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
    await this.searchOrganizations(keyword);
    const endTime = Date.now();
    return endTime - startTime;
  }
}