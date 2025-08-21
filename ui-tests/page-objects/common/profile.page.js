import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 个人中心页面对象模型
 * 封装个人中心页面的元素定位和操作方法
 */
export class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get profileContainer() {
    return this.page.locator('[data-testid="profile-container"]');
  }

  get pageTitle() {
    return this.page.locator('[data-testid="page-title"]');
  }

  // 侧边栏导航
  get profileNavigation() {
    return this.page.locator('[data-testid="profile-navigation"]');
  }

  get basicInfoNav() {
    return this.page.locator('[data-testid="basic-info-nav"]');
  }

  get securityNav() {
    return this.page.locator('[data-testid="security-nav"]');
  }

  get notificationNav() {
    return this.page.locator('[data-testid="notification-nav"]');
  }

  get activityLogNav() {
    return this.page.locator('[data-testid="activity-log-nav"]');
  }

  get preferencesNav() {
    return this.page.locator('[data-testid="preferences-nav"]');
  }

  // 基本信息区域
  get basicInfoSection() {
    return this.page.locator('[data-testid="basic-info-section"]');
  }

  get avatarContainer() {
    return this.page.locator('[data-testid="avatar-container"]');
  }

  get avatarImage() {
    return this.page.locator('[data-testid="avatar-image"]');
  }

  get avatarUploadButton() {
    return this.page.locator('[data-testid="avatar-upload-button"]');
  }

  get avatarUploadInput() {
    return this.page.locator('[data-testid="avatar-upload-input"]');
  }

  get removeAvatarButton() {
    return this.page.locator('[data-testid="remove-avatar-button"]');
  }

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

  get genderSelect() {
    return this.page.locator('[data-testid="gender-select"]');
  }

  get birthdateInput() {
    return this.page.locator('[data-testid="birthdate-input"]');
  }

  get idCardInput() {
    return this.page.locator('[data-testid="id-card-input"]');
  }

  get addressInput() {
    return this.page.locator('[data-testid="address-input"]');
  }

  get bioTextarea() {
    return this.page.locator('[data-testid="bio-textarea"]');
  }

  get organizationDisplay() {
    return this.page.locator('[data-testid="organization-display"]');
  }

  get roleDisplay() {
    return this.page.locator('[data-testid="role-display"]');
  }

  get joinDateDisplay() {
    return this.page.locator('[data-testid="join-date-display"]');
  }

  get statusDisplay() {
    return this.page.locator('[data-testid="status-display"]');
  }

  // 安全设置区域
  get securitySection() {
    return this.page.locator('[data-testid="security-section"]');
  }

  get changePasswordSection() {
    return this.page.locator('[data-testid="change-password-section"]');
  }

  get currentPasswordInput() {
    return this.page.locator('[data-testid="current-password-input"]');
  }

  get newPasswordInput() {
    return this.page.locator('[data-testid="new-password-input"]');
  }

  get confirmPasswordInput() {
    return this.page.locator('[data-testid="confirm-password-input"]');
  }

  get changePasswordButton() {
    return this.page.locator('[data-testid="change-password-button"]');
  }

  get passwordStrengthIndicator() {
    return this.page.locator('[data-testid="password-strength-indicator"]');
  }

  get twoFactorSection() {
    return this.page.locator('[data-testid="two-factor-section"]');
  }

  get enableTwoFactorToggle() {
    return this.page.locator('[data-testid="enable-two-factor-toggle"]');
  }

  get twoFactorQrCode() {
    return this.page.locator('[data-testid="two-factor-qr-code"]');
  }

  get twoFactorSecretKey() {
    return this.page.locator('[data-testid="two-factor-secret-key"]');
  }

  get twoFactorVerificationInput() {
    return this.page.locator('[data-testid="two-factor-verification-input"]');
  }

  get verifyTwoFactorButton() {
    return this.page.locator('[data-testid="verify-two-factor-button"]');
  }

  get backupCodesSection() {
    return this.page.locator('[data-testid="backup-codes-section"]');
  }

  get generateBackupCodesButton() {
    return this.page.locator('[data-testid="generate-backup-codes-button"]');
  }

  get backupCodesList() {
    return this.page.locator('[data-testid="backup-codes-list"]');
  }

  get downloadBackupCodesButton() {
    return this.page.locator('[data-testid="download-backup-codes-button"]');
  }

  get sessionManagementSection() {
    return this.page.locator('[data-testid="session-management-section"]');
  }

  get activeSessionsList() {
    return this.page.locator('[data-testid="active-sessions-list"]');
  }

  get terminateAllSessionsButton() {
    return this.page.locator('[data-testid="terminate-all-sessions-button"]');
  }

  // 通知设置区域
  get notificationSection() {
    return this.page.locator('[data-testid="notification-section"]');
  }

  get emailNotificationToggle() {
    return this.page.locator('[data-testid="email-notification-toggle"]');
  }

  get smsNotificationToggle() {
    return this.page.locator('[data-testid="sms-notification-toggle"]');
  }

  get pushNotificationToggle() {
    return this.page.locator('[data-testid="push-notification-toggle"]');
  }

  get systemNotificationToggle() {
    return this.page.locator('[data-testid="system-notification-toggle"]');
  }

  get activityNotificationToggle() {
    return this.page.locator('[data-testid="activity-notification-toggle"]');
  }

  get feeNotificationToggle() {
    return this.page.locator('[data-testid="fee-notification-toggle"]');
  }

  get organizationNotificationToggle() {
    return this.page.locator('[data-testid="organization-notification-toggle"]');
  }

  get notificationFrequencySelect() {
    return this.page.locator('[data-testid="notification-frequency-select"]');
  }

  get quietHoursToggle() {
    return this.page.locator('[data-testid="quiet-hours-toggle"]');
  }

  get quietHoursStartInput() {
    return this.page.locator('[data-testid="quiet-hours-start-input"]');
  }

  get quietHoursEndInput() {
    return this.page.locator('[data-testid="quiet-hours-end-input"]');
  }

  // 活动日志区域
  get activityLogSection() {
    return this.page.locator('[data-testid="activity-log-section"]');
  }

  get activityLogTable() {
    return this.page.locator('[data-testid="activity-log-table"]');
  }

  get activityLogTableHeader() {
    return this.page.locator('[data-testid="activity-log-table-header"]');
  }

  get activityLogTableBody() {
    return this.page.locator('[data-testid="activity-log-table-body"]');
  }

  get activityLogRows() {
    return this.page.locator('[data-testid="activity-log-row"]');
  }

  get activityLogFilterSection() {
    return this.page.locator('[data-testid="activity-log-filter-section"]');
  }

  get activityTypeFilter() {
    return this.page.locator('[data-testid="activity-type-filter"]');
  }

  get activityDateRangeFilter() {
    return this.page.locator('[data-testid="activity-date-range-filter"]');
  }

  get activitySearchInput() {
    return this.page.locator('[data-testid="activity-search-input"]');
  }

  get clearActivityFiltersButton() {
    return this.page.locator('[data-testid="clear-activity-filters-button"]');
  }

  get exportActivityLogButton() {
    return this.page.locator('[data-testid="export-activity-log-button"]');
  }

  // 偏好设置区域
  get preferencesSection() {
    return this.page.locator('[data-testid="preferences-section"]');
  }

  get languageSelect() {
    return this.page.locator('[data-testid="language-select"]');
  }

  get timezoneSelect() {
    return this.page.locator('[data-testid="timezone-select"]');
  }

  get themeSelect() {
    return this.page.locator('[data-testid="theme-select"]');
  }

  get dateFormatSelect() {
    return this.page.locator('[data-testid="date-format-select"]');
  }

  get timeFormatSelect() {
    return this.page.locator('[data-testid="time-format-select"]');
  }

  get pageSizeSelect() {
    return this.page.locator('[data-testid="page-size-select"]');
  }

  get autoSaveToggle() {
    return this.page.locator('[data-testid="auto-save-toggle"]');
  }

  get showTooltipsToggle() {
    return this.page.locator('[data-testid="show-tooltips-toggle"]');
  }

  get compactModeToggle() {
    return this.page.locator('[data-testid="compact-mode-toggle"]');
  }

  get animationsToggle() {
    return this.page.locator('[data-testid="animations-toggle"]');
  }

  // 操作按钮
  get saveButton() {
    return this.page.locator('[data-testid="save-button"]');
  }

  get cancelButton() {
    return this.page.locator('[data-testid="cancel-button"]');
  }

  get resetButton() {
    return this.page.locator('[data-testid="reset-button"]');
  }

  get editButton() {
    return this.page.locator('[data-testid="edit-button"]');
  }

  // 模态框
  get confirmModal() {
    return this.page.locator('[data-testid="confirm-modal"]');
  }

  get avatarCropModal() {
    return this.page.locator('[data-testid="avatar-crop-modal"]');
  }

  get backupCodesModal() {
    return this.page.locator('[data-testid="backup-codes-modal"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/profile');
    await this.waitForProfilePageLoad();
  }

  async waitForProfilePageLoad() {
    await this.profileContainer.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
  }

  // 导航操作
  async navigateToBasicInfo() {
    await this.basicInfoNav.click();
    await this.waitForElement(this.basicInfoSection);
  }

  async navigateToSecurity() {
    await this.securityNav.click();
    await this.waitForElement(this.securitySection);
  }

  async navigateToNotification() {
    await this.notificationNav.click();
    await this.waitForElement(this.notificationSection);
  }

  async navigateToActivityLog() {
    await this.activityLogNav.click();
    await this.waitForElement(this.activityLogSection);
  }

  async navigateToPreferences() {
    await this.preferencesNav.click();
    await this.waitForElement(this.preferencesSection);
  }

  // 基本信息操作
  async updateBasicInfo(info) {
    await this.navigateToBasicInfo();
    
    if (info.realName) {
      await this.realNameInput.fill(info.realName);
    }
    if (info.email) {
      await this.emailInput.fill(info.email);
    }
    if (info.phone) {
      await this.phoneInput.fill(info.phone);
    }
    if (info.gender) {
      await this.genderSelect.selectOption(info.gender);
    }
    if (info.birthdate) {
      await this.birthdateInput.fill(info.birthdate);
    }
    if (info.idCard) {
      await this.idCardInput.fill(info.idCard);
    }
    if (info.address) {
      await this.addressInput.fill(info.address);
    }
    if (info.bio) {
      await this.bioTextarea.fill(info.bio);
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('基本信息更新成功');
  }

  async uploadAvatar(filePath) {
    await this.avatarUploadInput.setInputFiles(filePath);
    await this.waitForElement(this.avatarCropModal);
    
    // 假设有裁剪确认按钮
    const cropConfirmButton = this.avatarCropModal.locator('[data-testid="crop-confirm-button"]');
    await cropConfirmButton.click();
    
    await this.expectSuccessMessage('头像上传成功');
  }

  async removeAvatar() {
    await this.removeAvatarButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('头像删除成功');
  }

  // 安全设置操作
  async changePassword(currentPassword, newPassword) {
    await this.navigateToSecurity();
    
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    
    await this.changePasswordButton.click();
    await this.expectSuccessMessage('密码修改成功');
  }

  async enableTwoFactor(verificationCode) {
    await this.navigateToSecurity();
    
    await this.enableTwoFactorToggle.check();
    await this.waitForElement(this.twoFactorQrCode);
    
    await this.twoFactorVerificationInput.fill(verificationCode);
    await this.verifyTwoFactorButton.click();
    
    await this.expectSuccessMessage('双因子认证启用成功');
  }

  async disableTwoFactor() {
    await this.navigateToSecurity();
    
    await this.enableTwoFactorToggle.uncheck();
    await this.confirmDialog();
    
    await this.expectSuccessMessage('双因子认证已禁用');
  }

  async generateBackupCodes() {
    await this.generateBackupCodesButton.click();
    await this.waitForElement(this.backupCodesModal);
    
    const codes = await this.getBackupCodes();
    
    // 关闭模态框
    const closeButton = this.backupCodesModal.locator('[data-testid="close-button"]');
    await closeButton.click();
    
    return codes;
  }

  async downloadBackupCodes() {
    await this.downloadBackupCodesButton.click();
    await this.page.waitForTimeout(2000);
  }

  async terminateSession(sessionId) {
    const terminateButton = this.getSessionTerminateButton(sessionId);
    await terminateButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('会话已终止');
  }

  async terminateAllSessions() {
    await this.terminateAllSessionsButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('所有会话已终止');
  }

  // 通知设置操作
  async updateNotificationSettings(settings) {
    await this.navigateToNotification();
    
    if (settings.emailNotification !== undefined) {
      if (settings.emailNotification) {
        await this.emailNotificationToggle.check();
      } else {
        await this.emailNotificationToggle.uncheck();
      }
    }
    if (settings.smsNotification !== undefined) {
      if (settings.smsNotification) {
        await this.smsNotificationToggle.check();
      } else {
        await this.smsNotificationToggle.uncheck();
      }
    }
    if (settings.pushNotification !== undefined) {
      if (settings.pushNotification) {
        await this.pushNotificationToggle.check();
      } else {
        await this.pushNotificationToggle.uncheck();
      }
    }
    if (settings.systemNotification !== undefined) {
      if (settings.systemNotification) {
        await this.systemNotificationToggle.check();
      } else {
        await this.systemNotificationToggle.uncheck();
      }
    }
    if (settings.activityNotification !== undefined) {
      if (settings.activityNotification) {
        await this.activityNotificationToggle.check();
      } else {
        await this.activityNotificationToggle.uncheck();
      }
    }
    if (settings.feeNotification !== undefined) {
      if (settings.feeNotification) {
        await this.feeNotificationToggle.check();
      } else {
        await this.feeNotificationToggle.uncheck();
      }
    }
    if (settings.organizationNotification !== undefined) {
      if (settings.organizationNotification) {
        await this.organizationNotificationToggle.check();
      } else {
        await this.organizationNotificationToggle.uncheck();
      }
    }
    if (settings.frequency) {
      await this.notificationFrequencySelect.selectOption(settings.frequency);
    }
    if (settings.quietHours !== undefined) {
      if (settings.quietHours) {
        await this.quietHoursToggle.check();
      } else {
        await this.quietHoursToggle.uncheck();
      }
    }
    if (settings.quietHoursStart) {
      await this.quietHoursStartInput.fill(settings.quietHoursStart);
    }
    if (settings.quietHoursEnd) {
      await this.quietHoursEndInput.fill(settings.quietHoursEnd);
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('通知设置保存成功');
  }

  // 活动日志操作
  async filterActivityLog(filters) {
    await this.navigateToActivityLog();
    
    if (filters.type) {
      await this.activityTypeFilter.selectOption(filters.type);
    }
    if (filters.dateRange) {
      await this.activityDateRangeFilter.fill(filters.dateRange);
    }
    if (filters.search) {
      await this.activitySearchInput.fill(filters.search);
    }
    
    await this.page.waitForTimeout(1000);
  }

  async clearActivityFilters() {
    await this.clearActivityFiltersButton.click();
    await this.page.waitForTimeout(1000);
  }

  async exportActivityLog() {
    await this.exportActivityLogButton.click();
    await this.page.waitForTimeout(3000);
  }

  // 偏好设置操作
  async updatePreferences(preferences) {
    await this.navigateToPreferences();
    
    if (preferences.language) {
      await this.languageSelect.selectOption(preferences.language);
    }
    if (preferences.timezone) {
      await this.timezoneSelect.selectOption(preferences.timezone);
    }
    if (preferences.theme) {
      await this.themeSelect.selectOption(preferences.theme);
    }
    if (preferences.dateFormat) {
      await this.dateFormatSelect.selectOption(preferences.dateFormat);
    }
    if (preferences.timeFormat) {
      await this.timeFormatSelect.selectOption(preferences.timeFormat);
    }
    if (preferences.pageSize) {
      await this.pageSizeSelect.selectOption(preferences.pageSize);
    }
    if (preferences.autoSave !== undefined) {
      if (preferences.autoSave) {
        await this.autoSaveToggle.check();
      } else {
        await this.autoSaveToggle.uncheck();
      }
    }
    if (preferences.showTooltips !== undefined) {
      if (preferences.showTooltips) {
        await this.showTooltipsToggle.check();
      } else {
        await this.showTooltipsToggle.uncheck();
      }
    }
    if (preferences.compactMode !== undefined) {
      if (preferences.compactMode) {
        await this.compactModeToggle.check();
      } else {
        await this.compactModeToggle.uncheck();
      }
    }
    if (preferences.animations !== undefined) {
      if (preferences.animations) {
        await this.animationsToggle.check();
      } else {
        await this.animationsToggle.uncheck();
      }
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('偏好设置保存成功');
  }

  // 通用操作
  async saveChanges() {
    await this.saveButton.click();
    await this.expectSuccessMessage('保存成功');
  }

  async cancelChanges() {
    await this.cancelButton.click();
  }

  async resetCurrentSection() {
    await this.resetButton.click();
    await this.confirmDialog();
  }

  async enableEditMode() {
    await this.editButton.click();
  }

  // 辅助方法
  getSessionRow(sessionId) {
    return this.page.locator(`[data-testid="session-row-${sessionId}"]`);
  }

  getSessionTerminateButton(sessionId) {
    return this.getSessionRow(sessionId).locator('[data-testid="terminate-session-button"]');
  }

  async getBackupCodes() {
    const codeElements = await this.backupCodesList.locator('[data-testid="backup-code"]').all();
    const codes = [];
    for (const element of codeElements) {
      codes.push(await element.textContent());
    }
    return codes;
  }

  async getActivityLogData() {
    const rows = await this.activityLogRows.all();
    const data = [];
    
    for (const row of rows) {
      const activity = {
        time: await row.locator('[data-testid="activity-time"]').textContent(),
        type: await row.locator('[data-testid="activity-type"]').textContent(),
        description: await row.locator('[data-testid="activity-description"]').textContent(),
        ip: await row.locator('[data-testid="activity-ip"]').textContent(),
        device: await row.locator('[data-testid="activity-device"]').textContent()
      };
      data.push(activity);
    }
    
    return data;
  }

  async getActiveSessions() {
    const sessionRows = await this.activeSessionsList.locator('[data-testid="session-row"]').all();
    const sessions = [];
    
    for (const row of sessionRows) {
      const session = {
        id: await row.getAttribute('data-session-id'),
        device: await row.locator('[data-testid="session-device"]').textContent(),
        location: await row.locator('[data-testid="session-location"]').textContent(),
        lastActive: await row.locator('[data-testid="session-last-active"]').textContent(),
        current: await row.locator('[data-testid="session-current"]').isVisible()
      };
      sessions.push(session);
    }
    
    return sessions;
  }

  // 验证方法
  async expectProfilePageVisible() {
    await expect(this.profileContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('个人中心');
  }

  async expectBasicInfoSectionVisible() {
    await expect(this.basicInfoSection).toBeVisible();
    await expect(this.avatarContainer).toBeVisible();
  }

  async expectSecuritySectionVisible() {
    await expect(this.securitySection).toBeVisible();
    await expect(this.changePasswordSection).toBeVisible();
  }

  async expectNotificationSectionVisible() {
    await expect(this.notificationSection).toBeVisible();
    await expect(this.emailNotificationToggle).toBeVisible();
  }

  async expectActivityLogSectionVisible() {
    await expect(this.activityLogSection).toBeVisible();
    await expect(this.activityLogTable).toBeVisible();
  }

  async expectPreferencesSectionVisible() {
    await expect(this.preferencesSection).toBeVisible();
    await expect(this.languageSelect).toBeVisible();
  }

  async expectTwoFactorEnabled() {
    await expect(this.enableTwoFactorToggle).toBeChecked();
    await expect(this.twoFactorQrCode).toBeVisible();
  }

  async expectTwoFactorDisabled() {
    await expect(this.enableTwoFactorToggle).not.toBeChecked();
    await expect(this.twoFactorQrCode).not.toBeVisible();
  }

  async expectAvatarVisible() {
    await expect(this.avatarImage).toBeVisible();
  }

  async expectNavigationVisible() {
    await expect(this.profileNavigation).toBeVisible();
    await expect(this.basicInfoNav).toBeVisible();
    await expect(this.securityNav).toBeVisible();
    await expect(this.notificationNav).toBeVisible();
  }

  async expectPasswordStrength(level) {
    const strengthText = await this.passwordStrengthIndicator.textContent();
    expect(strengthText).toContain(level);
  }

  // 数据获取
  async getCurrentUserInfo() {
    return {
      username: await this.usernameInput.inputValue(),
      realName: await this.realNameInput.inputValue(),
      email: await this.emailInput.inputValue(),
      phone: await this.phoneInput.inputValue(),
      gender: await this.genderSelect.inputValue(),
      birthdate: await this.birthdateInput.inputValue(),
      idCard: await this.idCardInput.inputValue(),
      address: await this.addressInput.inputValue(),
      bio: await this.bioTextarea.inputValue(),
      organization: await this.organizationDisplay.textContent(),
      role: await this.roleDisplay.textContent(),
      joinDate: await this.joinDateDisplay.textContent(),
      status: await this.statusDisplay.textContent()
    };
  }

  async getCurrentNotificationSettings() {
    return {
      emailNotification: await this.emailNotificationToggle.isChecked(),
      smsNotification: await this.smsNotificationToggle.isChecked(),
      pushNotification: await this.pushNotificationToggle.isChecked(),
      systemNotification: await this.systemNotificationToggle.isChecked(),
      activityNotification: await this.activityNotificationToggle.isChecked(),
      feeNotification: await this.feeNotificationToggle.isChecked(),
      organizationNotification: await this.organizationNotificationToggle.isChecked(),
      frequency: await this.notificationFrequencySelect.inputValue(),
      quietHours: await this.quietHoursToggle.isChecked(),
      quietHoursStart: await this.quietHoursStartInput.inputValue(),
      quietHoursEnd: await this.quietHoursEndInput.inputValue()
    };
  }

  async getCurrentPreferences() {
    return {
      language: await this.languageSelect.inputValue(),
      timezone: await this.timezoneSelect.inputValue(),
      theme: await this.themeSelect.inputValue(),
      dateFormat: await this.dateFormatSelect.inputValue(),
      timeFormat: await this.timeFormatSelect.inputValue(),
      pageSize: await this.pageSizeSelect.inputValue(),
      autoSave: await this.autoSaveToggle.isChecked(),
      showTooltips: await this.showTooltipsToggle.isChecked(),
      compactMode: await this.compactModeToggle.isChecked(),
      animations: await this.animationsToggle.isChecked()
    };
  }

  // 性能测试
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.goto();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async measureAvatarUploadTime(filePath) {
    const startTime = Date.now();
    await this.uploadAvatar(filePath);
    const endTime = Date.now();
    return endTime - startTime;
  }

  async measurePasswordChangeTime(currentPassword, newPassword) {
    const startTime = Date.now();
    await this.changePassword(currentPassword, newPassword);
    const endTime = Date.now();
    return endTime - startTime;
  }
}