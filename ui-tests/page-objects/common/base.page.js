import { expect } from '@playwright/test';

/**
 * 页面对象模型基类
 * 提供通用的页面操作方法和元素定位
 */
export class BasePage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
    this.timeout = 10000;
  }

  // 通用元素定位器
  get loadingSpinner() {
    return this.page.locator('[data-testid="loading-spinner"]');
  }

  get errorMessage() {
    return this.page.locator('[data-testid="error-message"]');
  }

  get successMessage() {
    return this.page.locator('[data-testid="success-message"]');
  }

  get confirmDialog() {
    return this.page.locator('[data-testid="confirm-dialog"]');
  }

  get confirmButton() {
    return this.page.locator('[data-testid="confirm-button"]');
  }

  get cancelButton() {
    return this.page.locator('[data-testid="cancel-button"]');
  }

  get pageTitle() {
    return this.page.locator('h1, [data-testid="page-title"]');
  }

  get breadcrumb() {
    return this.page.locator('[data-testid="breadcrumb"]');
  }

  // 导航方法
  async goto(path = '') {
    const url = `${this.baseURL}${path}`;
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async goBack() {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  async goForward() {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  async reload() {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  // 等待方法
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.waitForLoadingToDisappear();
  }

  async waitForLoadingToDisappear() {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    } catch (error) {
      // 如果没有loading spinner，忽略错误
    }
  }

  async waitForElement(locator, options = {}) {
    await locator.waitFor({ timeout: this.timeout, ...options });
  }

  async waitForText(text, options = {}) {
    await this.page.waitForFunction(
      (searchText) => document.body.textContent.includes(searchText),
      text,
      { timeout: this.timeout, ...options }
    );
  }

  async waitForURL(pattern, options = {}) {
    await this.page.waitForURL(pattern, { timeout: this.timeout, ...options });
  }

  // 表单操作方法
  async fillForm(formData) {
    for (const [field, value] of Object.entries(formData)) {
      if (value !== null && value !== undefined) {
        const element = this.page.locator(`[data-testid="${field}-input"], [name="${field}"], #${field}`);
        await element.fill(String(value));
      }
    }
  }

  async selectOption(selector, value) {
    await this.page.selectOption(selector, value);
  }

  async uploadFile(selector, filePath) {
    await this.page.setInputFiles(selector, filePath);
  }

  async checkCheckbox(selector, checked = true) {
    const checkbox = this.page.locator(selector);
    if (checked) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  async clickRadio(selector) {
    await this.page.locator(selector).click();
  }

  // 点击操作方法
  async click(selector, options = {}) {
    await this.page.locator(selector).click({ timeout: this.timeout, ...options });
  }

  async doubleClick(selector) {
    await this.page.locator(selector).dblclick();
  }

  async rightClick(selector) {
    await this.page.locator(selector).click({ button: 'right' });
  }

  async hover(selector) {
    await this.page.locator(selector).hover();
  }

  // 输入操作方法
  async type(selector, text, options = {}) {
    await this.page.locator(selector).type(text, { timeout: this.timeout, ...options });
  }

  async fill(selector, text) {
    await this.page.locator(selector).fill(text);
  }

  async clear(selector) {
    await this.page.locator(selector).clear();
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  // 获取信息方法
  async getText(selector) {
    return await this.page.locator(selector).textContent();
  }

  async getValue(selector) {
    return await this.page.locator(selector).inputValue();
  }

  async getAttribute(selector, attribute) {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  async isVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }

  async isEnabled(selector) {
    return await this.page.locator(selector).isEnabled();
  }

  async isChecked(selector) {
    return await this.page.locator(selector).isChecked();
  }

  // 滚动操作方法
  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  // 对话框操作方法
  async acceptDialog() {
    this.page.once('dialog', dialog => dialog.accept());
  }

  async dismissDialog() {
    this.page.once('dialog', dialog => dialog.dismiss());
  }

  async acceptDialogWithText(text) {
    this.page.once('dialog', dialog => dialog.accept(text));
  }

  // 确认对话框操作
  async clickConfirm() {
    await this.confirmButton.click();
    await this.waitForLoadingToDisappear();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  // 消息验证方法
  async expectSuccessMessage(message) {
    await expect(this.successMessage).toBeVisible();
    if (message) {
      await expect(this.successMessage).toContainText(message);
    }
  }

  async expectErrorMessage(message) {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  // 页面验证方法
  async expectPageTitle(title) {
    await expect(this.pageTitle).toContainText(title);
  }

  async expectURL(pattern) {
    await expect(this.page).toHaveURL(pattern);
  }

  async expectElementVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectElementHidden(selector) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async expectElementText(selector, text) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  async expectElementValue(selector, value) {
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  // 表格操作方法
  async getTableRowCount(tableSelector = 'table') {
    return await this.page.locator(`${tableSelector} tbody tr`).count();
  }

  async getTableCellText(row, column, tableSelector = 'table') {
    return await this.page.locator(`${tableSelector} tbody tr:nth-child(${row}) td:nth-child(${column})`).textContent();
  }

  async clickTableCell(row, column, tableSelector = 'table') {
    await this.page.locator(`${tableSelector} tbody tr:nth-child(${row}) td:nth-child(${column})`).click();
  }

  async sortTableByColumn(columnIndex, tableSelector = 'table') {
    await this.page.locator(`${tableSelector} thead th:nth-child(${columnIndex})`).click();
    await this.waitForLoadingToDisappear();
  }

  // 分页操作方法
  async goToNextPage() {
    await this.click('[data-testid="next-page-button"]');
    await this.waitForLoadingToDisappear();
  }

  async goToPreviousPage() {
    await this.click('[data-testid="prev-page-button"]');
    await this.waitForLoadingToDisappear();
  }

  async goToPage(pageNumber) {
    await this.click(`[data-testid="page-${pageNumber}-button"]`);
    await this.waitForLoadingToDisappear();
  }

  async changePageSize(size) {
    await this.selectOption('[data-testid="page-size-select"]', String(size));
    await this.waitForLoadingToDisappear();
  }

  // 搜索和筛选方法
  async search(query) {
    await this.fill('[data-testid="search-input"]', query);
    await this.click('[data-testid="search-button"]');
    await this.waitForLoadingToDisappear();
  }

  async clearSearch() {
    await this.clear('[data-testid="search-input"]');
    await this.click('[data-testid="search-button"]');
    await this.waitForLoadingToDisappear();
  }

  async applyFilter(filterType, value) {
    await this.selectOption(`[data-testid="${filterType}-filter"]`, value);
    await this.waitForLoadingToDisappear();
  }

  async clearFilters() {
    await this.click('[data-testid="clear-filters-button"]');
    await this.waitForLoadingToDisappear();
  }

  // 截图方法
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    await this.page.screenshot({ 
      path: `test-results/screenshots/${filename}`,
      fullPage: true 
    });
    return filename;
  }

  // 调试方法
  async pause() {
    await this.page.pause();
  }

  async log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  }

  // 性能监控方法
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.waitForPageLoad();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async getNetworkRequests() {
    const requests = [];
    this.page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });
    return requests;
  }
}