import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test-config.js';

/**
 * 登录相关的通用测试工具
 */
export class LoginHelper {
  constructor(page) {
    this.page = page;
  }
  
  /**
   * 执行登录操作
   * @param {Object} credentials - 登录凭据
   * @param {boolean} expectSuccess - 是否期望登录成功
   */
  async login(credentials = TEST_CONFIG.TEST_USERS.ADMIN, expectSuccess = true) {
    await this.page.goto(TEST_CONFIG.PAGES.LOGIN);
    
    // 等待登录页面加载
    await this.page.waitForSelector('input[name="username"]');
    await this.page.waitForSelector('input[name="password"]');
    
    // 填写登录信息
    await this.page.fill('input[name="username"]', credentials.username);
    await this.page.fill('input[name="password"]', credentials.password);
    
    // 点击登录按钮
    await this.page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    
    if (expectSuccess) {
      // 等待登录成功
      await this.page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
      await this.page.waitForSelector('.dashboard');
    } else {
      // 等待错误消息显示
      await this.page.waitForSelector(TEST_CONFIG.SELECTORS.ERROR_MESSAGE);
    }
  }
  
  /**
   * 执行登出操作
   */
  async logout() {
    if (await this.page.locator(TEST_CONFIG.SELECTORS.LOGOUT_BUTTON).isVisible()) {
      await this.page.click(TEST_CONFIG.SELECTORS.LOGOUT_BUTTON);
      await this.page.waitForURL(TEST_CONFIG.PAGES.LOGIN);
    }
  }
  
  /**
   * 验证登录状态
   * @param {boolean} isLoggedIn - 是否期望已登录
   */
  async verifyLoginStatus(isLoggedIn = true) {
    if (isLoggedIn) {
      await expect(this.page.locator('.dashboard')).toBeVisible();
      await expect(this.page.locator(TEST_CONFIG.SELECTORS.LOGOUT_BUTTON)).toBeVisible();
    } else {
      await expect(this.page.locator('.login-form')).toBeVisible();
    }
  }
}

/**
 * 表单相关的通用测试工具
 */
export class FormHelper {
  constructor(page) {
    this.page = page;
  }
  
  /**
   * 填写表单
   * @param {Object} data - 表单数据
   * @param {Object} fieldMappings - 字段映射关系
   */
  async fillForm(data, fieldMappings = {}) {
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined || value === '') continue;
      
      const selector = fieldMappings[key] || `[name="${key}"]`;
      const input = this.page.locator(selector);
      
      if (await input.isVisible()) {
        const inputType = await input.getAttribute('type');
        
        if (inputType === 'checkbox' || inputType === 'radio') {
          if (value) await input.check();
          else await input.uncheck();
        } else if (input.tagName() === 'SELECT') {
          await input.selectOption(String(value));
        } else {
          await input.fill(String(value));
        }
      }
    }
  }
  
  /**
   * 验证表单验证错误
   * @param {Array<string>} expectedErrors - 期望的错误消息
   */
  async expectFormValidationErrors(expectedErrors = []) {
    const errorElements = await this.page.locator('.el-form-item__error, .error-message').all();
    const actualErrors = [];
    
    for (const element of errorElements) {
      if (await element.isVisible()) {
        const errorText = await element.textContent();
        actualErrors.push(errorText.trim());
      }
    }
    
    for (const expectedError of expectedErrors) {
      expect(actualErrors.some(error => error.includes(expectedError))).toBeTruthy();
    }
  }
  
  /**
   * 上传文件
   * @param {string} selector - 文件输入选择器
   * @param {string} filePath - 文件路径
   */
  async uploadFile(selector, filePath) {
    const fileInput = this.page.locator(selector);
    await fileInput.setInputFiles(filePath);
  }
  
  /**
   * 提交表单
   * @param {string} submitButtonSelector - 提交按钮选择器
   */
  async submitForm(submitButtonSelector = TEST_CONFIG.SELECTORS.SUBMIT_BUTTON) {
    await this.page.click(submitButtonSelector);
  }
}

/**
 * 表格相关的通用测试工具
 */
export class TableHelper {
  constructor(page) {
    this.page = page;
  }
  
  /**
   * 等待表格加载完成
   */
  async waitForTableLoad() {
    await this.page.waitForSelector(TEST_CONFIG.SELECTORS.TABLE);
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * 获取表格行数
   * @returns {number} 表格行数
   */
  async getRowCount() {
    await this.waitForTableLoad();
    const rows = await this.page.locator(TEST_CONFIG.SELECTORS.TABLE_ROW).count();
    return rows;
  }
  
  /**
   * 验证表格包含指定文本
   * @param {string} text - 要查找的文本
   */
  async expectTableContains(text) {
    await this.waitForTableLoad();
    const tableContent = await this.page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(tableContent).toContain(text);
  }
  
  /**
   * 点击表格中的操作按钮
   * @param {number} rowIndex - 行索引（从0开始）
   * @param {string} buttonSelector - 按钮选择器
   */
  async clickRowButton(rowIndex, buttonSelector) {
    await this.waitForTableLoad();
    const row = this.page.locator(TEST_CONFIG.SELECTORS.TABLE_ROW).nth(rowIndex);
    await row.click(buttonSelector);
  }
  
  /**
   * 搜索表格
   * @param {Object} searchData - 搜索数据
   */
  async search(searchData = {}) {
    for (const [key, value] of Object.entries(searchData)) {
      const selector = `[name="${key}"]`;
      const input = this.page.locator(selector);
      
      if (await input.isVisible()) {
        await input.fill(String(value));
      }
    }
    
    await this.page.click('[data-testid="search-button"]');
    await this.page.waitForLoadState('networkidle');
  }
}

/**
 * 对话框相关的通用测试工具
 */
export class DialogHelper {
  constructor(page) {
    this.page = page;
  }
  
  /**
   * 等待对话框打开
   * @param {string} dialogSelector - 对话框选择器
   */
  async waitForDialogOpen(dialogSelector) {
    await this.page.waitForSelector(dialogSelector);
    await expect(this.page.locator(dialogSelector)).toBeVisible();
  }
  
  /**
   * 等待对话框关闭
   * @param {string} dialogSelector - 对话框选择器
   */
  async waitForDialogClose(dialogSelector) {
    await this.page.waitForSelector(dialogSelector, { state: 'hidden' });
  }
  
  /**
   * 确认对话框操作
   * @param {string} confirmButtonSelector - 确认按钮选择器
   */
  async confirmDialog(confirmButtonSelector = '[data-testid="confirm-button"]') {
    await this.page.click(confirmButtonSelector);
  }
  
  /**
   * 取消对话框操作
   * @param {string} cancelButtonSelector - 取消按钮选择器
   */
  async cancelDialog(cancelButtonSelector = TEST_CONFIG.SELECTORS.CANCEL_BUTTON) {
    await this.page.click(cancelButtonSelector);
  }
}

/**
 * 断言相关的通用测试工具
 */
export class AssertionHelper {
  constructor(page) {
    this.page = page;
  }
  
  /**
   * 验证成功消息
   * @param {string} expectedMessage - 期望的成功消息
   */
  async expectSuccessMessage(expectedMessage = '') {
    await this.page.waitForSelector(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE);
    const messageElement = this.page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE);
    await expect(messageElement).toBeVisible();
    
    if (expectedMessage) {
      const actualMessage = await messageElement.textContent();
      expect(actualMessage).toContain(expectedMessage);
    }
  }
  
  /**
   * 验证错误消息
   * @param {string} expectedMessage - 期望的错误消息
   */
  async expectErrorMessage(expectedMessage = '') {
    await this.page.waitForSelector(TEST_CONFIG.SELECTORS.ERROR_MESSAGE);
    const messageElement = this.page.locator(TEST_CONFIG.SELECTORS.ERROR_MESSAGE);
    await expect(messageElement).toBeVisible();
    
    if (expectedMessage) {
      const actualMessage = await messageElement.textContent();
      expect(actualMessage).toContain(expectedMessage);
    }
  }
  
  /**
   * 验证页面标题
   * @param {string} expectedTitle - 期望的页面标题
   */
  async expectPageTitle(expectedTitle) {
    const actualTitle = await this.page.title();
    expect(actualTitle).toContain(expectedTitle);
  }
  
  /**
   * 验证当前URL
   * @param {string} expectedPath - 期望的URL路径
   */
  async expectCurrentUrl(expectedPath) {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain(expectedPath);
  }
  
  /**
   * 验证元素可见
   * @param {string} selector - 元素选择器
   */
  async expectVisible(selector) {
    await this.page.waitForSelector(selector);
    await expect(this.page.locator(selector)).toBeVisible();
  }
  
  /**
   * 验证元素隐藏
   * @param {string} selector - 元素选择器
   */
  async expectHidden(selector) {
    await this.page.waitForSelector(selector, { state: 'hidden' });
    await expect(this.page.locator(selector)).toBeHidden();
  }
  
  /**
   * 验证元素禁用
   * @param {string} selector - 元素选择器
   */
  async expectDisabled(selector) {
    await expect(this.page.locator(selector)).toBeDisabled();
  }
  
  /**
   * 验证元素启用
   * @param {string} selector - 元素选择器
   */
  async expectEnabled(selector) {
    await expect(this.page.locator(selector)).toBeEnabled();
  }
}

/**
 * 性能测试相关的通用工具
 */
export class PerformanceHelper {
  constructor(page) {
    this.page = page;
  }
  
  /**
   * 测量页面加载时间
   * @param {string} url - 要加载的URL
   * @returns {number} 加载时间（毫秒）
   */
  async measurePageLoadTime(url) {
    const startTime = Date.now();
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    const endTime = Date.now();
    return endTime - startTime;
  }
  
  /**
   * 测量操作响应时间
   * @param {Function} operation - 要执行的操作
   * @returns {number} 响应时间（毫秒）
   */
  async measureResponseTime(operation) {
    const startTime = Date.now();
    await operation();
    const endTime = Date.now();
    return endTime - startTime;
  }
  
  /**
   * 验证响应时间
   * @param {number} actualTime - 实际时间
   * @param {number} maxTime - 最大允许时间
   * @param {string} operationName - 操作名称
   */
  async expectResponseTime(actualTime, maxTime, operationName) {
    console.log(`${operationName} 响应时间: ${actualTime}ms`);
    expect(actualTime).toBeLessThan(maxTime);
  }
}

/**
 * 导出所有工具类
 */
export const TestHelpers = {
  LoginHelper,
  FormHelper,
  TableHelper,
  DialogHelper,
  AssertionHelper,
  PerformanceHelper
};

/**
 * 创建测试工具实例
 * @param {Page} page - Playwright页面对象
 * @returns {Object} 包含所有工具类实例的对象
 */
export function createTestHelpers(page) {
  return {
    login: new LoginHelper(page),
    form: new FormHelper(page),
    table: new TableHelper(page),
    dialog: new DialogHelper(page),
    assertion: new AssertionHelper(page),
    performance: new PerformanceHelper(page)
  };
}