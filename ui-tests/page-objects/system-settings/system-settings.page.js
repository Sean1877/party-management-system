import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 系统设置页面对象模型
 * 封装系统设置页面的元素定位和操作方法
 */
export class SystemSettingsPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get systemSettingsContainer() {
    return this.page.locator('[data-testid="system-settings-container"]');
  }

  get pageTitle() {
    return this.page.locator('[data-testid="page-title"]');
  }

  // 侧边栏导航
  get settingsNavigation() {
    return this.page.locator('[data-testid="settings-navigation"]');
  }

  get basicSettingsNav() {
    return this.page.locator('[data-testid="basic-settings-nav"]');
  }

  get securitySettingsNav() {
    return this.page.locator('[data-testid="security-settings-nav"]');
  }

  get notificationSettingsNav() {
    return this.page.locator('[data-testid="notification-settings-nav"]');
  }

  get backupSettingsNav() {
    return this.page.locator('[data-testid="backup-settings-nav"]');
  }

  get logSettingsNav() {
    return this.page.locator('[data-testid="log-settings-nav"]');
  }

  get integrationSettingsNav() {
    return this.page.locator('[data-testid="integration-settings-nav"]');
  }

  get advancedSettingsNav() {
    return this.page.locator('[data-testid="advanced-settings-nav"]');
  }

  // 基本设置区域
  get basicSettingsSection() {
    return this.page.locator('[data-testid="basic-settings-section"]');
  }

  get systemNameInput() {
    return this.page.locator('[data-testid="system-name-input"]');
  }

  get systemDescriptionTextarea() {
    return this.page.locator('[data-testid="system-description-textarea"]');
  }

  get systemLogoUpload() {
    return this.page.locator('[data-testid="system-logo-upload"]');
  }

  get systemTimezoneSelect() {
    return this.page.locator('[data-testid="system-timezone-select"]');
  }

  get systemLanguageSelect() {
    return this.page.locator('[data-testid="system-language-select"]');
  }

  get systemThemeSelect() {
    return this.page.locator('[data-testid="system-theme-select"]');
  }

  get maintenanceModeToggle() {
    return this.page.locator('[data-testid="maintenance-mode-toggle"]');
  }

  get maintenanceMessageTextarea() {
    return this.page.locator('[data-testid="maintenance-message-textarea"]');
  }

  // 安全设置区域
  get securitySettingsSection() {
    return this.page.locator('[data-testid="security-settings-section"]');
  }

  get passwordPolicySection() {
    return this.page.locator('[data-testid="password-policy-section"]');
  }

  get minPasswordLengthInput() {
    return this.page.locator('[data-testid="min-password-length-input"]');
  }

  get requireUppercaseToggle() {
    return this.page.locator('[data-testid="require-uppercase-toggle"]');
  }

  get requireLowercaseToggle() {
    return this.page.locator('[data-testid="require-lowercase-toggle"]');
  }

  get requireNumbersToggle() {
    return this.page.locator('[data-testid="require-numbers-toggle"]');
  }

  get requireSpecialCharsToggle() {
    return this.page.locator('[data-testid="require-special-chars-toggle"]');
  }

  get passwordExpiryDaysInput() {
    return this.page.locator('[data-testid="password-expiry-days-input"]');
  }

  get sessionTimeoutInput() {
    return this.page.locator('[data-testid="session-timeout-input"]');
  }

  get maxLoginAttemptsInput() {
    return this.page.locator('[data-testid="max-login-attempts-input"]');
  }

  get lockoutDurationInput() {
    return this.page.locator('[data-testid="lockout-duration-input"]');
  }

  get twoFactorAuthToggle() {
    return this.page.locator('[data-testid="two-factor-auth-toggle"]');
  }

  get ipWhitelistTextarea() {
    return this.page.locator('[data-testid="ip-whitelist-textarea"]');
  }

  // 通知设置区域
  get notificationSettingsSection() {
    return this.page.locator('[data-testid="notification-settings-section"]');
  }

  get emailNotificationToggle() {
    return this.page.locator('[data-testid="email-notification-toggle"]');
  }

  get smsNotificationToggle() {
    return this.page.locator('[data-testid="sms-notification-toggle"]');
  }

  get systemNotificationToggle() {
    return this.page.locator('[data-testid="system-notification-toggle"]');
  }

  get smtpServerInput() {
    return this.page.locator('[data-testid="smtp-server-input"]');
  }

  get smtpPortInput() {
    return this.page.locator('[data-testid="smtp-port-input"]');
  }

  get smtpUsernameInput() {
    return this.page.locator('[data-testid="smtp-username-input"]');
  }

  get smtpPasswordInput() {
    return this.page.locator('[data-testid="smtp-password-input"]');
  }

  get smtpEncryptionSelect() {
    return this.page.locator('[data-testid="smtp-encryption-select"]');
  }

  get senderEmailInput() {
    return this.page.locator('[data-testid="sender-email-input"]');
  }

  get senderNameInput() {
    return this.page.locator('[data-testid="sender-name-input"]');
  }

  get testEmailButton() {
    return this.page.locator('[data-testid="test-email-button"]');
  }

  get testEmailInput() {
    return this.page.locator('[data-testid="test-email-input"]');
  }

  // 备份设置区域
  get backupSettingsSection() {
    return this.page.locator('[data-testid="backup-settings-section"]');
  }

  get autoBackupToggle() {
    return this.page.locator('[data-testid="auto-backup-toggle"]');
  }

  get backupFrequencySelect() {
    return this.page.locator('[data-testid="backup-frequency-select"]');
  }

  get backupTimeInput() {
    return this.page.locator('[data-testid="backup-time-input"]');
  }

  get backupRetentionDaysInput() {
    return this.page.locator('[data-testid="backup-retention-days-input"]');
  }

  get backupLocationInput() {
    return this.page.locator('[data-testid="backup-location-input"]');
  }

  get createBackupButton() {
    return this.page.locator('[data-testid="create-backup-button"]');
  }

  get restoreBackupButton() {
    return this.page.locator('[data-testid="restore-backup-button"]');
  }

  get backupHistoryTable() {
    return this.page.locator('[data-testid="backup-history-table"]');
  }

  get downloadBackupButton() {
    return this.page.locator('[data-testid="download-backup-button"]');
  }

  get deleteBackupButton() {
    return this.page.locator('[data-testid="delete-backup-button"]');
  }

  // 日志设置区域
  get logSettingsSection() {
    return this.page.locator('[data-testid="log-settings-section"]');
  }

  get logLevelSelect() {
    return this.page.locator('[data-testid="log-level-select"]');
  }

  get logRetentionDaysInput() {
    return this.page.locator('[data-testid="log-retention-days-input"]');
  }

  get maxLogFileSizeInput() {
    return this.page.locator('[data-testid="max-log-file-size-input"]');
  }

  get enableAuditLogToggle() {
    return this.page.locator('[data-testid="enable-audit-log-toggle"]');
  }

  get enableErrorLogToggle() {
    return this.page.locator('[data-testid="enable-error-log-toggle"]');
  }

  get enableAccessLogToggle() {
    return this.page.locator('[data-testid="enable-access-log-toggle"]');
  }

  get logExportButton() {
    return this.page.locator('[data-testid="log-export-button"]');
  }

  get clearLogsButton() {
    return this.page.locator('[data-testid="clear-logs-button"]');
  }

  // 集成设置区域
  get integrationSettingsSection() {
    return this.page.locator('[data-testid="integration-settings-section"]');
  }

  get apiSettingsSection() {
    return this.page.locator('[data-testid="api-settings-section"]');
  }

  get enableApiToggle() {
    return this.page.locator('[data-testid="enable-api-toggle"]');
  }

  get apiRateLimitInput() {
    return this.page.locator('[data-testid="api-rate-limit-input"]');
  }

  get apiKeyInput() {
    return this.page.locator('[data-testid="api-key-input"]');
  }

  get generateApiKeyButton() {
    return this.page.locator('[data-testid="generate-api-key-button"]');
  }

  get webhookUrlInput() {
    return this.page.locator('[data-testid="webhook-url-input"]');
  }

  get webhookSecretInput() {
    return this.page.locator('[data-testid="webhook-secret-input"]');
  }

  get testWebhookButton() {
    return this.page.locator('[data-testid="test-webhook-button"]');
  }

  // 高级设置区域
  get advancedSettingsSection() {
    return this.page.locator('[data-testid="advanced-settings-section"]');
  }

  get debugModeToggle() {
    return this.page.locator('[data-testid="debug-mode-toggle"]');
  }

  get cacheEnabledToggle() {
    return this.page.locator('[data-testid="cache-enabled-toggle"]');
  }

  get cacheTtlInput() {
    return this.page.locator('[data-testid="cache-ttl-input"]');
  }

  get clearCacheButton() {
    return this.page.locator('[data-testid="clear-cache-button"]');
  }

  get databaseOptimizeButton() {
    return this.page.locator('[data-testid="database-optimize-button"]');
  }

  get systemInfoButton() {
    return this.page.locator('[data-testid="system-info-button"]');
  }

  get resetSettingsButton() {
    return this.page.locator('[data-testid="reset-settings-button"]');
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

  get applyButton() {
    return this.page.locator('[data-testid="apply-button"]');
  }

  // 模态框
  get confirmModal() {
    return this.page.locator('[data-testid="confirm-modal"]');
  }

  get systemInfoModal() {
    return this.page.locator('[data-testid="system-info-modal"]');
  }

  get backupRestoreModal() {
    return this.page.locator('[data-testid="backup-restore-modal"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/settings');
    await this.waitForSystemSettingsPageLoad();
  }

  async waitForSystemSettingsPageLoad() {
    await this.systemSettingsContainer.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
  }

  // 导航操作
  async navigateToBasicSettings() {
    await this.basicSettingsNav.click();
    await this.waitForElement(this.basicSettingsSection);
  }

  async navigateToSecuritySettings() {
    await this.securitySettingsNav.click();
    await this.waitForElement(this.securitySettingsSection);
  }

  async navigateToNotificationSettings() {
    await this.notificationSettingsNav.click();
    await this.waitForElement(this.notificationSettingsSection);
  }

  async navigateToBackupSettings() {
    await this.backupSettingsNav.click();
    await this.waitForElement(this.backupSettingsSection);
  }

  async navigateToLogSettings() {
    await this.logSettingsNav.click();
    await this.waitForElement(this.logSettingsSection);
  }

  async navigateToIntegrationSettings() {
    await this.integrationSettingsNav.click();
    await this.waitForElement(this.integrationSettingsSection);
  }

  async navigateToAdvancedSettings() {
    await this.advancedSettingsNav.click();
    await this.waitForElement(this.advancedSettingsSection);
  }

  // 基本设置操作
  async updateBasicSettings(settings) {
    await this.navigateToBasicSettings();
    
    if (settings.systemName) {
      await this.systemNameInput.fill(settings.systemName);
    }
    if (settings.systemDescription) {
      await this.systemDescriptionTextarea.fill(settings.systemDescription);
    }
    if (settings.timezone) {
      await this.systemTimezoneSelect.selectOption(settings.timezone);
    }
    if (settings.language) {
      await this.systemLanguageSelect.selectOption(settings.language);
    }
    if (settings.theme) {
      await this.systemThemeSelect.selectOption(settings.theme);
    }
    if (settings.maintenanceMode !== undefined) {
      if (settings.maintenanceMode) {
        await this.maintenanceModeToggle.check();
      } else {
        await this.maintenanceModeToggle.uncheck();
      }
    }
    if (settings.maintenanceMessage) {
      await this.maintenanceMessageTextarea.fill(settings.maintenanceMessage);
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('基本设置保存成功');
  }

  async uploadSystemLogo(filePath) {
    await this.systemLogoUpload.setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
    await this.saveButton.click();
    await this.expectSuccessMessage('系统Logo上传成功');
  }

  // 安全设置操作
  async updatePasswordPolicy(policy) {
    await this.navigateToSecuritySettings();
    
    if (policy.minLength) {
      await this.minPasswordLengthInput.fill(policy.minLength.toString());
    }
    if (policy.requireUppercase !== undefined) {
      if (policy.requireUppercase) {
        await this.requireUppercaseToggle.check();
      } else {
        await this.requireUppercaseToggle.uncheck();
      }
    }
    if (policy.requireLowercase !== undefined) {
      if (policy.requireLowercase) {
        await this.requireLowercaseToggle.check();
      } else {
        await this.requireLowercaseToggle.uncheck();
      }
    }
    if (policy.requireNumbers !== undefined) {
      if (policy.requireNumbers) {
        await this.requireNumbersToggle.check();
      } else {
        await this.requireNumbersToggle.uncheck();
      }
    }
    if (policy.requireSpecialChars !== undefined) {
      if (policy.requireSpecialChars) {
        await this.requireSpecialCharsToggle.check();
      } else {
        await this.requireSpecialCharsToggle.uncheck();
      }
    }
    if (policy.expiryDays) {
      await this.passwordExpiryDaysInput.fill(policy.expiryDays.toString());
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('密码策略保存成功');
  }

  async updateSecuritySettings(settings) {
    await this.navigateToSecuritySettings();
    
    if (settings.sessionTimeout) {
      await this.sessionTimeoutInput.fill(settings.sessionTimeout.toString());
    }
    if (settings.maxLoginAttempts) {
      await this.maxLoginAttemptsInput.fill(settings.maxLoginAttempts.toString());
    }
    if (settings.lockoutDuration) {
      await this.lockoutDurationInput.fill(settings.lockoutDuration.toString());
    }
    if (settings.twoFactorAuth !== undefined) {
      if (settings.twoFactorAuth) {
        await this.twoFactorAuthToggle.check();
      } else {
        await this.twoFactorAuthToggle.uncheck();
      }
    }
    if (settings.ipWhitelist) {
      await this.ipWhitelistTextarea.fill(settings.ipWhitelist);
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('安全设置保存成功');
  }

  // 通知设置操作
  async updateNotificationSettings(settings) {
    await this.navigateToNotificationSettings();
    
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
    if (settings.systemNotification !== undefined) {
      if (settings.systemNotification) {
        await this.systemNotificationToggle.check();
      } else {
        await this.systemNotificationToggle.uncheck();
      }
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('通知设置保存成功');
  }

  async updateSmtpSettings(smtp) {
    await this.navigateToNotificationSettings();
    
    if (smtp.server) {
      await this.smtpServerInput.fill(smtp.server);
    }
    if (smtp.port) {
      await this.smtpPortInput.fill(smtp.port.toString());
    }
    if (smtp.username) {
      await this.smtpUsernameInput.fill(smtp.username);
    }
    if (smtp.password) {
      await this.smtpPasswordInput.fill(smtp.password);
    }
    if (smtp.encryption) {
      await this.smtpEncryptionSelect.selectOption(smtp.encryption);
    }
    if (smtp.senderEmail) {
      await this.senderEmailInput.fill(smtp.senderEmail);
    }
    if (smtp.senderName) {
      await this.senderNameInput.fill(smtp.senderName);
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('SMTP设置保存成功');
  }

  async testEmailSettings(testEmail) {
    await this.testEmailInput.fill(testEmail);
    await this.testEmailButton.click();
    await this.expectSuccessMessage('测试邮件发送成功');
  }

  // 备份设置操作
  async updateBackupSettings(settings) {
    await this.navigateToBackupSettings();
    
    if (settings.autoBackup !== undefined) {
      if (settings.autoBackup) {
        await this.autoBackupToggle.check();
      } else {
        await this.autoBackupToggle.uncheck();
      }
    }
    if (settings.frequency) {
      await this.backupFrequencySelect.selectOption(settings.frequency);
    }
    if (settings.time) {
      await this.backupTimeInput.fill(settings.time);
    }
    if (settings.retentionDays) {
      await this.backupRetentionDaysInput.fill(settings.retentionDays.toString());
    }
    if (settings.location) {
      await this.backupLocationInput.fill(settings.location);
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('备份设置保存成功');
  }

  async createBackup() {
    await this.createBackupButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('备份创建成功');
  }

  async restoreBackup(backupId) {
    const restoreButton = this.getBackupRowRestoreButton(backupId);
    await restoreButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('备份恢复成功');
  }

  async downloadBackup(backupId) {
    const downloadButton = this.getBackupRowDownloadButton(backupId);
    await downloadButton.click();
    await this.page.waitForTimeout(3000);
  }

  async deleteBackup(backupId) {
    const deleteButton = this.getBackupRowDeleteButton(backupId);
    await deleteButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('备份删除成功');
  }

  // 日志设置操作
  async updateLogSettings(settings) {
    await this.navigateToLogSettings();
    
    if (settings.logLevel) {
      await this.logLevelSelect.selectOption(settings.logLevel);
    }
    if (settings.retentionDays) {
      await this.logRetentionDaysInput.fill(settings.retentionDays.toString());
    }
    if (settings.maxFileSize) {
      await this.maxLogFileSizeInput.fill(settings.maxFileSize.toString());
    }
    if (settings.enableAuditLog !== undefined) {
      if (settings.enableAuditLog) {
        await this.enableAuditLogToggle.check();
      } else {
        await this.enableAuditLogToggle.uncheck();
      }
    }
    if (settings.enableErrorLog !== undefined) {
      if (settings.enableErrorLog) {
        await this.enableErrorLogToggle.check();
      } else {
        await this.enableErrorLogToggle.uncheck();
      }
    }
    if (settings.enableAccessLog !== undefined) {
      if (settings.enableAccessLog) {
        await this.enableAccessLogToggle.check();
      } else {
        await this.enableAccessLogToggle.uncheck();
      }
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('日志设置保存成功');
  }

  async exportLogs() {
    await this.logExportButton.click();
    await this.page.waitForTimeout(3000);
  }

  async clearLogs() {
    await this.clearLogsButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('日志清理成功');
  }

  // 集成设置操作
  async updateApiSettings(settings) {
    await this.navigateToIntegrationSettings();
    
    if (settings.enableApi !== undefined) {
      if (settings.enableApi) {
        await this.enableApiToggle.check();
      } else {
        await this.enableApiToggle.uncheck();
      }
    }
    if (settings.rateLimit) {
      await this.apiRateLimitInput.fill(settings.rateLimit.toString());
    }
    if (settings.webhookUrl) {
      await this.webhookUrlInput.fill(settings.webhookUrl);
    }
    if (settings.webhookSecret) {
      await this.webhookSecretInput.fill(settings.webhookSecret);
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('API设置保存成功');
  }

  async generateApiKey() {
    await this.generateApiKeyButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('API密钥生成成功');
  }

  async testWebhook() {
    await this.testWebhookButton.click();
    await this.expectSuccessMessage('Webhook测试成功');
  }

  // 高级设置操作
  async updateAdvancedSettings(settings) {
    await this.navigateToAdvancedSettings();
    
    if (settings.debugMode !== undefined) {
      if (settings.debugMode) {
        await this.debugModeToggle.check();
      } else {
        await this.debugModeToggle.uncheck();
      }
    }
    if (settings.cacheEnabled !== undefined) {
      if (settings.cacheEnabled) {
        await this.cacheEnabledToggle.check();
      } else {
        await this.cacheEnabledToggle.uncheck();
      }
    }
    if (settings.cacheTtl) {
      await this.cacheTtlInput.fill(settings.cacheTtl.toString());
    }
    
    await this.saveButton.click();
    await this.expectSuccessMessage('高级设置保存成功');
  }

  async clearCache() {
    await this.clearCacheButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('缓存清理成功');
  }

  async optimizeDatabase() {
    await this.databaseOptimizeButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('数据库优化成功');
  }

  async viewSystemInfo() {
    await this.systemInfoButton.click();
    await this.waitForElement(this.systemInfoModal);
  }

  async resetAllSettings() {
    await this.resetSettingsButton.click();
    await this.confirmDialog();
    await this.expectSuccessMessage('设置重置成功');
  }

  // 通用操作
  async saveSettings() {
    await this.saveButton.click();
    await this.expectSuccessMessage('设置保存成功');
  }

  async cancelChanges() {
    await this.cancelButton.click();
  }

  async resetCurrentSection() {
    await this.resetButton.click();
    await this.confirmDialog();
  }

  async applySettings() {
    await this.applyButton.click();
    await this.expectSuccessMessage('设置应用成功');
  }

  // 辅助方法
  getBackupRow(backupId) {
    return this.page.locator(`[data-testid="backup-row-${backupId}"]`);
  }

  getBackupRowRestoreButton(backupId) {
    return this.getBackupRow(backupId).locator('[data-testid="restore-backup-button"]');
  }

  getBackupRowDownloadButton(backupId) {
    return this.getBackupRow(backupId).locator('[data-testid="download-backup-button"]');
  }

  getBackupRowDeleteButton(backupId) {
    return this.getBackupRow(backupId).locator('[data-testid="delete-backup-button"]');
  }

  // 验证方法
  async expectSystemSettingsPageVisible() {
    await expect(this.systemSettingsContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('系统设置');
  }

  async expectBasicSettingsSectionVisible() {
    await expect(this.basicSettingsSection).toBeVisible();
    await expect(this.systemNameInput).toBeVisible();
  }

  async expectSecuritySettingsSectionVisible() {
    await expect(this.securitySettingsSection).toBeVisible();
    await expect(this.passwordPolicySection).toBeVisible();
  }

  async expectNotificationSettingsSectionVisible() {
    await expect(this.notificationSettingsSection).toBeVisible();
    await expect(this.emailNotificationToggle).toBeVisible();
  }

  async expectBackupSettingsSectionVisible() {
    await expect(this.backupSettingsSection).toBeVisible();
    await expect(this.autoBackupToggle).toBeVisible();
  }

  async expectLogSettingsSectionVisible() {
    await expect(this.logSettingsSection).toBeVisible();
    await expect(this.logLevelSelect).toBeVisible();
  }

  async expectIntegrationSettingsSectionVisible() {
    await expect(this.integrationSettingsSection).toBeVisible();
    await expect(this.apiSettingsSection).toBeVisible();
  }

  async expectAdvancedSettingsSectionVisible() {
    await expect(this.advancedSettingsSection).toBeVisible();
    await expect(this.debugModeToggle).toBeVisible();
  }

  async expectSystemInfoModalVisible() {
    await expect(this.systemInfoModal).toBeVisible();
  }

  async expectNavigationVisible() {
    await expect(this.settingsNavigation).toBeVisible();
    await expect(this.basicSettingsNav).toBeVisible();
    await expect(this.securitySettingsNav).toBeVisible();
    await expect(this.notificationSettingsNav).toBeVisible();
  }

  // 数据获取
  async getCurrentSettings() {
    return {
      systemName: await this.systemNameInput.inputValue(),
      systemDescription: await this.systemDescriptionTextarea.inputValue(),
      timezone: await this.systemTimezoneSelect.inputValue(),
      language: await this.systemLanguageSelect.inputValue(),
      theme: await this.systemThemeSelect.inputValue(),
      maintenanceMode: await this.maintenanceModeToggle.isChecked()
    };
  }

  async getPasswordPolicy() {
    return {
      minLength: await this.minPasswordLengthInput.inputValue(),
      requireUppercase: await this.requireUppercaseToggle.isChecked(),
      requireLowercase: await this.requireLowercaseToggle.isChecked(),
      requireNumbers: await this.requireNumbersToggle.isChecked(),
      requireSpecialChars: await this.requireSpecialCharsToggle.isChecked(),
      expiryDays: await this.passwordExpiryDaysInput.inputValue()
    };
  }

  async getApiKey() {
    return await this.apiKeyInput.inputValue();
  }

  // 性能测试
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.goto();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async measureSettingsSaveTime() {
    const startTime = Date.now();
    await this.saveSettings();
    const endTime = Date.now();
    return endTime - startTime;
  }
}