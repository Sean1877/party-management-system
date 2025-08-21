import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 活动管理页面对象模型
 * 封装活动管理页面的元素定位和操作方法
 */
export class ActivityManagementPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get activityManagementContainer() {
    return this.page.locator('[data-testid="activity-management-container"]');
  }

  get pageTitle() {
    return this.page.locator('[data-testid="page-title"]');
  }

  // 搜索和筛选
  get searchInput() {
    return this.page.locator('[data-testid="activity-search-input"]');
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

  get organizationFilter() {
    return this.page.locator('[data-testid="organization-filter"]');
  }

  get dateRangeFilter() {
    return this.page.locator('[data-testid="date-range-filter"]');
  }

  get locationFilter() {
    return this.page.locator('[data-testid="location-filter"]');
  }

  get resetFiltersButton() {
    return this.page.locator('[data-testid="reset-filters-button"]');
  }

  // 操作按钮
  get addActivityButton() {
    return this.page.locator('[data-testid="add-activity-button"]');
  }

  get batchDeleteButton() {
    return this.page.locator('[data-testid="batch-delete-button"]');
  }

  get batchExportButton() {
    return this.page.locator('[data-testid="batch-export-button"]');
  }

  get importActivitiesButton() {
    return this.page.locator('[data-testid="import-activities-button"]');
  }

  get refreshButton() {
    return this.page.locator('[data-testid="refresh-button"]');
  }

  get calendarViewButton() {
    return this.page.locator('[data-testid="calendar-view-button"]');
  }

  get listViewButton() {
    return this.page.locator('[data-testid="list-view-button"]');
  }

  get cardViewButton() {
    return this.page.locator('[data-testid="card-view-button"]');
  }

  // 活动表格
  get activityTable() {
    return this.page.locator('[data-testid="activity-table"]');
  }

  get tableHeader() {
    return this.page.locator('[data-testid="table-header"]');
  }

  get tableBody() {
    return this.page.locator('[data-testid="table-body"]');
  }

  get activityRow() {
    return this.page.locator('[data-testid="activity-row"]');
  }

  get selectAllCheckbox() {
    return this.page.locator('[data-testid="select-all-checkbox"]');
  }

  get activityCheckbox() {
    return this.page.locator('[data-testid="activity-checkbox"]');
  }

  // 活动卡片视图
  get activityCardContainer() {
    return this.page.locator('[data-testid="activity-card-container"]');
  }

  get activityCard() {
    return this.page.locator('[data-testid="activity-card"]');
  }

  // 日历视图
  get activityCalendar() {
    return this.page.locator('[data-testid="activity-calendar"]');
  }

  get calendarEvent() {
    return this.page.locator('[data-testid="calendar-event"]');
  }

  get prevMonthButton() {
    return this.page.locator('[data-testid="prev-month-button"]');
  }

  get nextMonthButton() {
    return this.page.locator('[data-testid="next-month-button"]');
  }

  get todayButton() {
    return this.page.locator('[data-testid="today-button"]');
  }

  // 表格列
  get activityIdColumn() {
    return this.page.locator('[data-testid="activity-id-column"]');
  }

  get activityTitleColumn() {
    return this.page.locator('[data-testid="activity-title-column"]');
  }

  get typeColumn() {
    return this.page.locator('[data-testid="type-column"]');
  }

  get organizationColumn() {
    return this.page.locator('[data-testid="organization-column"]');
  }

  get startTimeColumn() {
    return this.page.locator('[data-testid="start-time-column"]');
  }

  get endTimeColumn() {
    return this.page.locator('[data-testid="end-time-column"]');
  }

  get locationColumn() {
    return this.page.locator('[data-testid="location-column"]');
  }

  get participantCountColumn() {
    return this.page.locator('[data-testid="participant-count-column"]');
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

  get manageParticipantsButton() {
    return this.page.locator('[data-testid="manage-participants-button"]');
  }

  get toggleStatusButton() {
    return this.page.locator('[data-testid="toggle-status-button"]');
  }

  get duplicateButton() {
    return this.page.locator('[data-testid="duplicate-button"]');
  }

  get publishButton() {
    return this.page.locator('[data-testid="publish-button"]');
  }

  get cancelButton() {
    return this.page.locator('[data-testid="cancel-button"]');
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

  // 活动详情模态框
  get activityDetailModal() {
    return this.page.locator('[data-testid="activity-detail-modal"]');
  }

  get activityDetailCloseButton() {
    return this.page.locator('[data-testid="activity-detail-close-button"]');
  }

  // 活动表单模态框
  get activityFormModal() {
    return this.page.locator('[data-testid="activity-form-modal"]');
  }

  get activityFormCloseButton() {
    return this.page.locator('[data-testid="activity-form-close-button"]');
  }

  get activityFormSubmitButton() {
    return this.page.locator('[data-testid="activity-form-submit-button"]');
  }

  get activityFormCancelButton() {
    return this.page.locator('[data-testid="activity-form-cancel-button"]');
  }

  // 表单字段
  get titleInput() {
    return this.page.locator('[data-testid="title-input"]');
  }

  get typeSelect() {
    return this.page.locator('[data-testid="type-select"]');
  }

  get organizationSelect() {
    return this.page.locator('[data-testid="organization-select"]');
  }

  get startTimeInput() {
    return this.page.locator('[data-testid="start-time-input"]');
  }

  get endTimeInput() {
    return this.page.locator('[data-testid="end-time-input"]');
  }

  get locationInput() {
    return this.page.locator('[data-testid="location-input"]');
  }

  get maxParticipantsInput() {
    return this.page.locator('[data-testid="max-participants-input"]');
  }

  get statusSelect() {
    return this.page.locator('[data-testid="status-select"]');
  }

  get descriptionTextarea() {
    return this.page.locator('[data-testid="description-textarea"]');
  }

  get requirementsTextarea() {
    return this.page.locator('[data-testid="requirements-textarea"]');
  }

  get remarkTextarea() {
    return this.page.locator('[data-testid="remark-textarea"]');
  }

  get isPublicCheckbox() {
    return this.page.locator('[data-testid="is-public-checkbox"]');
  }

  get allowRegistrationCheckbox() {
    return this.page.locator('[data-testid="allow-registration-checkbox"]');
  }

  get registrationDeadlineInput() {
    return this.page.locator('[data-testid="registration-deadline-input"]');
  }

  // 参与者管理模态框
  get participantManagementModal() {
    return this.page.locator('[data-testid="participant-management-modal"]');
  }

  get participantManagementCloseButton() {
    return this.page.locator('[data-testid="participant-management-close-button"]');
  }

  get addParticipantButton() {
    return this.page.locator('[data-testid="add-participant-button"]');
  }

  get removeParticipantButton() {
    return this.page.locator('[data-testid="remove-participant-button"]');
  }

  get participantTable() {
    return this.page.locator('[data-testid="participant-table"]');
  }

  get participantRow() {
    return this.page.locator('[data-testid="participant-row"]');
  }

  get exportParticipantsButton() {
    return this.page.locator('[data-testid="export-participants-button"]');
  }

  get sendNotificationButton() {
    return this.page.locator('[data-testid="send-notification-button"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/activities');
    await this.waitForActivityManagementPageLoad();
  }

  async waitForActivityManagementPageLoad() {
    await this.activityManagementContainer.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
  }

  // 视图切换
  async switchToListView() {
    await this.listViewButton.click();
    await this.waitForElement(this.activityTable);
  }

  async switchToCardView() {
    await this.cardViewButton.click();
    await this.waitForElement(this.activityCardContainer);
  }

  async switchToCalendarView() {
    await this.calendarViewButton.click();
    await this.waitForElement(this.activityCalendar);
  }

  // 搜索和筛选操作
  async searchActivities(keyword) {
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

  async filterByOrganization(organizationId) {
    await this.organizationFilter.selectOption(organizationId);
    await this.waitForLoadingToDisappear();
  }

  async filterByLocation(location) {
    await this.locationFilter.fill(location);
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

  // 活动操作
  async addActivity(activityData) {
    await this.addActivityButton.click();
    await this.waitForElement(this.activityFormModal);
    await this.fillActivityForm(activityData);
    await this.activityFormSubmitButton.click();
    await this.waitForElementToDisappear(this.activityFormModal);
    await this.expectSuccessMessage('活动添加成功');
  }

  async editActivity(activityId, activityData) {
    const editButton = this.getActivityRowEditButton(activityId);
    await editButton.click();
    await this.waitForElement(this.activityFormModal);
    await this.fillActivityForm(activityData);
    await this.activityFormSubmitButton.click();
    await this.waitForElementToDisappear(this.activityFormModal);
    await this.expectSuccessMessage('活动更新成功');
  }

  async deleteActivity(activityId) {
    const deleteButton = this.getActivityRowDeleteButton(activityId);
    await deleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('活动删除成功');
  }

  async viewActivityDetail(activityId) {
    const viewButton = this.getActivityRowViewButton(activityId);
    await viewButton.click();
    await this.waitForElement(this.activityDetailModal);
  }

  async duplicateActivity(activityId) {
    const duplicateButton = this.getActivityRowDuplicateButton(activityId);
    await duplicateButton.click();
    await this.waitForElement(this.activityFormModal);
  }

  async publishActivity(activityId) {
    const publishButton = this.getActivityRowPublishButton(activityId);
    await publishButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('活动发布成功');
  }

  async cancelActivity(activityId) {
    const cancelButton = this.getActivityRowCancelButton(activityId);
    await cancelButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('活动取消成功');
  }

  async toggleActivityStatus(activityId) {
    const toggleButton = this.getActivityRowToggleStatusButton(activityId);
    await toggleButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('状态更新成功');
  }

  // 参与者管理
  async manageParticipants(activityId) {
    const manageParticipantsButton = this.getActivityRowManageParticipantsButton(activityId);
    await manageParticipantsButton.click();
    await this.waitForElement(this.participantManagementModal);
  }

  async addParticipantToActivity(userId) {
    await this.addParticipantButton.click();
    
    const userSelect = this.page.locator('[data-testid="user-select"]');
    await userSelect.selectOption(userId);
    
    const confirmButton = this.page.locator('[data-testid="add-participant-confirm-button"]');
    await confirmButton.click();
    
    await this.expectSuccessMessage('参与者添加成功');
  }

  async removeParticipantFromActivity(userId) {
    const removeParticipantButton = this.getParticipantRowRemoveButton(userId);
    await removeParticipantButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('参与者移除成功');
  }

  async exportParticipants() {
    await this.exportParticipantsButton.click();
    await this.page.waitForTimeout(2000);
  }

  async sendNotificationToParticipants(message) {
    await this.sendNotificationButton.click();
    
    const messageInput = this.page.locator('[data-testid="notification-message-input"]');
    await messageInput.fill(message);
    
    const sendButton = this.page.locator('[data-testid="send-notification-confirm-button"]');
    await sendButton.click();
    
    await this.expectSuccessMessage('通知发送成功');
  }

  async closeParticipantManagement() {
    await this.participantManagementCloseButton.click();
    await this.waitForElementToDisappear(this.participantManagementModal);
  }

  // 批量操作
  async selectAllActivities() {
    await this.selectAllCheckbox.check();
  }

  async unselectAllActivities() {
    await this.selectAllCheckbox.uncheck();
  }

  async selectActivity(activityId) {
    const checkbox = this.getActivityRowCheckbox(activityId);
    await checkbox.check();
  }

  async unselectActivity(activityId) {
    const checkbox = this.getActivityRowCheckbox(activityId);
    await checkbox.uncheck();
  }

  async batchDeleteActivities() {
    await this.batchDeleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('批量删除成功');
  }

  async batchExportActivities() {
    await this.batchExportButton.click();
    await this.page.waitForTimeout(2000);
  }

  async importActivities(filePath) {
    await this.importActivitiesButton.click();
    
    const fileInput = this.page.locator('[data-testid="import-file-input"]');
    await fileInput.setInputFiles(filePath);
    
    const importButton = this.page.locator('[data-testid="import-confirm-button"]');
    await importButton.click();
    
    await this.expectSuccessMessage('活动导入成功');
  }

  // 日历视图操作
  async navigateToPreviousMonth() {
    await this.prevMonthButton.click();
    await this.waitForLoadingToDisappear();
  }

  async navigateToNextMonth() {
    await this.nextMonthButton.click();
    await this.waitForLoadingToDisappear();
  }

  async navigateToToday() {
    await this.todayButton.click();
    await this.waitForLoadingToDisappear();
  }

  async clickCalendarEvent(activityId) {
    const event = this.page.locator(`[data-testid="calendar-event-${activityId}"]`);
    await event.click();
    await this.waitForElement(this.activityDetailModal);
  }

  // 表单操作
  async fillActivityForm(activityData) {
    if (activityData.title) {
      await this.titleInput.fill(activityData.title);
    }
    if (activityData.type) {
      await this.typeSelect.selectOption(activityData.type);
    }
    if (activityData.organizationId) {
      await this.organizationSelect.selectOption(activityData.organizationId);
    }
    if (activityData.startTime) {
      await this.startTimeInput.fill(activityData.startTime);
    }
    if (activityData.endTime) {
      await this.endTimeInput.fill(activityData.endTime);
    }
    if (activityData.location) {
      await this.locationInput.fill(activityData.location);
    }
    if (activityData.maxParticipants) {
      await this.maxParticipantsInput.fill(activityData.maxParticipants.toString());
    }
    if (activityData.status) {
      await this.statusSelect.selectOption(activityData.status);
    }
    if (activityData.description) {
      await this.descriptionTextarea.fill(activityData.description);
    }
    if (activityData.requirements) {
      await this.requirementsTextarea.fill(activityData.requirements);
    }
    if (activityData.remark) {
      await this.remarkTextarea.fill(activityData.remark);
    }
    if (activityData.isPublic !== undefined) {
      if (activityData.isPublic) {
        await this.isPublicCheckbox.check();
      } else {
        await this.isPublicCheckbox.uncheck();
      }
    }
    if (activityData.allowRegistration !== undefined) {
      if (activityData.allowRegistration) {
        await this.allowRegistrationCheckbox.check();
      } else {
        await this.allowRegistrationCheckbox.uncheck();
      }
    }
    if (activityData.registrationDeadline) {
      await this.registrationDeadlineInput.fill(activityData.registrationDeadline);
    }
  }

  async clearActivityForm() {
    await this.titleInput.clear();
    await this.locationInput.clear();
    await this.maxParticipantsInput.clear();
    await this.descriptionTextarea.clear();
    await this.requirementsTextarea.clear();
    await this.remarkTextarea.clear();
    await this.registrationDeadlineInput.clear();
  }

  async closeActivityForm() {
    await this.activityFormCloseButton.click();
    await this.waitForElementToDisappear(this.activityFormModal);
  }

  async closeActivityDetail() {
    await this.activityDetailCloseButton.click();
    await this.waitForElementToDisappear(this.activityDetailModal);
  }

  // 表格数据获取
  async getActivityCount() {
    const rows = await this.activityRow.all();
    return rows.length;
  }

  async getActivityData(activityId) {
    const row = this.getActivityRow(activityId);
    
    return {
      id: await row.locator('[data-testid="activity-id"]').textContent(),
      title: await row.locator('[data-testid="activity-title"]').textContent(),
      type: await row.locator('[data-testid="type"]').textContent(),
      organization: await row.locator('[data-testid="organization"]').textContent(),
      startTime: await row.locator('[data-testid="start-time"]').textContent(),
      endTime: await row.locator('[data-testid="end-time"]').textContent(),
      location: await row.locator('[data-testid="location"]').textContent(),
      participantCount: await row.locator('[data-testid="participant-count"]').textContent(),
      status: await row.locator('[data-testid="status"]').textContent(),
      createTime: await row.locator('[data-testid="create-time"]').textContent()
    };
  }

  async getAllActivitiesData() {
    const activities = [];
    const rows = await this.activityRow.all();
    
    for (const row of rows) {
      const activityId = await row.locator('[data-testid="activity-id"]').textContent();
      const activityData = await this.getActivityData(activityId);
      activities.push(activityData);
    }
    
    return activities;
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
  getActivityRow(activityId) {
    return this.page.locator(`[data-testid="activity-row-${activityId}"]`);
  }

  getActivityRowCheckbox(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="activity-checkbox"]');
  }

  getActivityRowViewButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="view-button"]');
  }

  getActivityRowEditButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="edit-button"]');
  }

  getActivityRowDeleteButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="delete-button"]');
  }

  getActivityRowManageParticipantsButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="manage-participants-button"]');
  }

  getActivityRowToggleStatusButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="toggle-status-button"]');
  }

  getActivityRowDuplicateButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="duplicate-button"]');
  }

  getActivityRowPublishButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="publish-button"]');
  }

  getActivityRowCancelButton(activityId) {
    return this.getActivityRow(activityId).locator('[data-testid="cancel-button"]');
  }

  getParticipantRow(userId) {
    return this.page.locator(`[data-testid="participant-row-${userId}"]`);
  }

  getParticipantRowRemoveButton(userId) {
    return this.getParticipantRow(userId).locator('[data-testid="remove-participant-button"]');
  }

  // 验证方法
  async expectActivityManagementPageVisible() {
    await expect(this.activityManagementContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('活动管理');
  }

  async expectActivityInTable(activityData) {
    const row = this.page.locator(`[data-testid="activity-row"]`).filter({
      hasText: activityData.title
    });
    await expect(row).toBeVisible();
    
    if (activityData.type) {
      await expect(row).toContainText(activityData.type);
    }
    if (activityData.location) {
      await expect(row).toContainText(activityData.location);
    }
  }

  async expectActivityNotInTable(activityTitle) {
    const row = this.page.locator(`[data-testid="activity-row"]`).filter({
      hasText: activityTitle
    });
    await expect(row).not.toBeVisible();
  }

  async expectActivityFormVisible() {
    await expect(this.activityFormModal).toBeVisible();
    await expect(this.titleInput).toBeVisible();
    await expect(this.typeSelect).toBeVisible();
  }

  async expectActivityDetailVisible() {
    await expect(this.activityDetailModal).toBeVisible();
  }

  async expectParticipantManagementVisible() {
    await expect(this.participantManagementModal).toBeVisible();
    await expect(this.participantTable).toBeVisible();
  }

  async expectListViewVisible() {
    await expect(this.activityTable).toBeVisible();
  }

  async expectCardViewVisible() {
    await expect(this.activityCardContainer).toBeVisible();
  }

  async expectCalendarViewVisible() {
    await expect(this.activityCalendar).toBeVisible();
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
    await this.searchActivities(keyword);
    const endTime = Date.now();
    return endTime - startTime;
  }
}