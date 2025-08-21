import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

/**
 * 登录页面对象模型
 * 封装登录页面的元素定位和操作方法
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // 页面元素定位器
  get usernameInput() {
    return this.page.locator('[data-testid="username-input"]');
  }

  get passwordInput() {
    return this.page.locator('[data-testid="password-input"]');
  }

  get loginButton() {
    return this.page.locator('[data-testid="login-button"]');
  }

  get rememberMeCheckbox() {
    return this.page.locator('[data-testid="remember-me-checkbox"]');
  }

  get forgotPasswordLink() {
    return this.page.locator('[data-testid="forgot-password-link"]');
  }

  get registerLink() {
    return this.page.locator('[data-testid="register-link"]');
  }

  get loginForm() {
    return this.page.locator('[data-testid="login-form"]');
  }

  get loginTitle() {
    return this.page.locator('[data-testid="login-title"]');
  }

  get usernameError() {
    return this.page.locator('[data-testid="username-error"]');
  }

  get passwordError() {
    return this.page.locator('[data-testid="password-error"]');
  }

  get loginError() {
    return this.page.locator('[data-testid="login-error"]');
  }

  get captchaInput() {
    return this.page.locator('[data-testid="captcha-input"]');
  }

  get captchaImage() {
    return this.page.locator('[data-testid="captcha-image"]');
  }

  get refreshCaptchaButton() {
    return this.page.locator('[data-testid="refresh-captcha-button"]');
  }

  get showPasswordButton() {
    return this.page.locator('[data-testid="show-password-button"]');
  }

  get languageSelector() {
    return this.page.locator('[data-testid="language-selector"]');
  }

  // 页面操作方法
  async goto() {
    await super.goto('/login');
    await this.waitForLoginPageLoad();
  }

  async waitForLoginPageLoad() {
    await this.loginForm.waitFor({ state: 'visible' });
    await this.loginTitle.waitFor({ state: 'visible' });
    await this.waitForLoadingToDisappear();
  }

  // 登录操作
  async login(username, password, options = {}) {
    const {
      rememberMe = false,
      captcha = null,
      expectSuccess = true
    } = options;

    // 填写用户名
    await this.usernameInput.fill(username);
    
    // 填写密码
    await this.passwordInput.fill(password);
    
    // 记住我选项
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    
    // 验证码（如果需要）
    if (captcha) {
      await this.captchaInput.fill(captcha);
    }
    
    // 点击登录按钮
    await this.loginButton.click();
    
    if (expectSuccess) {
      // 等待跳转到仪表板
      await this.waitForURL('**/dashboard');
    } else {
      // 等待错误消息显示
      await this.waitForElement(this.loginError);
    }
  }

  async quickLogin(userType = 'admin') {
    const credentials = {
      admin: { username: 'admin', password: 'admin123' },
      user: { username: 'user001', password: 'user123' },
      orgAdmin: { username: 'orgadmin', password: 'org123' }
    };

    const cred = credentials[userType];
    if (!cred) {
      throw new Error(`未知的用户类型: ${userType}`);
    }

    await this.login(cred.username, cred.password);
  }

  // 表单验证
  async submitEmptyForm() {
    await this.loginButton.click();
    await this.waitForElement(this.usernameError);
  }

  async submitWithEmptyUsername(password) {
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitForElement(this.usernameError);
  }

  async submitWithEmptyPassword(username) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
    await this.waitForElement(this.passwordError);
  }

  // 密码显示/隐藏
  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  async isPasswordVisible() {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }

  // 验证码操作
  async refreshCaptcha() {
    await this.refreshCaptchaButton.click();
    await this.page.waitForTimeout(1000); // 等待验证码刷新
  }

  async isCaptchaVisible() {
    return await this.captchaImage.isVisible();
  }

  // 链接操作
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.waitForURL('**/forgot-password');
  }

  async clickRegister() {
    await this.registerLink.click();
    await this.waitForURL('**/register');
  }

  // 语言切换
  async changeLanguage(language) {
    await this.languageSelector.selectOption(language);
    await this.page.waitForTimeout(500); // 等待语言切换
  }

  // 验证方法
  async expectLoginFormVisible() {
    await expect(this.loginForm).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginTitle(title = '用户登录') {
    await expect(this.loginTitle).toContainText(title);
  }

  async expectUsernameError(message) {
    await expect(this.usernameError).toBeVisible();
    if (message) {
      await expect(this.usernameError).toContainText(message);
    }
  }

  async expectPasswordError(message) {
    await expect(this.passwordError).toBeVisible();
    if (message) {
      await expect(this.passwordError).toContainText(message);
    }
  }

  async expectLoginError(message) {
    await expect(this.loginError).toBeVisible();
    if (message) {
      await expect(this.loginError).toContainText(message);
    }
  }

  async expectLoginButtonEnabled() {
    await expect(this.loginButton).toBeEnabled();
  }

  async expectLoginButtonDisabled() {
    await expect(this.loginButton).toBeDisabled();
  }

  async expectRememberMeChecked() {
    await expect(this.rememberMeCheckbox).toBeChecked();
  }

  async expectRememberMeUnchecked() {
    await expect(this.rememberMeCheckbox).not.toBeChecked();
  }

  // 获取表单数据
  async getFormData() {
    return {
      username: await this.usernameInput.inputValue(),
      password: await this.passwordInput.inputValue(),
      rememberMe: await this.rememberMeCheckbox.isChecked(),
      captcha: await this.captchaInput.inputValue()
    };
  }

  // 清空表单
  async clearForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    if (await this.rememberMeCheckbox.isChecked()) {
      await this.rememberMeCheckbox.uncheck();
    }
    if (await this.captchaInput.isVisible()) {
      await this.captchaInput.clear();
    }
  }

  // 键盘操作
  async loginWithEnterKey(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');
    await this.waitForURL('**/dashboard');
  }

  async navigateWithTab() {
    await this.usernameInput.focus();
    await this.page.keyboard.press('Tab');
    await expect(this.passwordInput).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.rememberMeCheckbox).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.loginButton).toBeFocused();
  }

  // 安全测试相关
  async attemptSQLInjection() {
    const sqlPayloads = [
      "admin'; DROP TABLE users; --",
      "admin' OR '1'='1",
      "admin' UNION SELECT * FROM users --"
    ];

    for (const payload of sqlPayloads) {
      await this.usernameInput.fill(payload);
      await this.passwordInput.fill('password');
      await this.loginButton.click();
      
      // 应该显示登录失败，而不是系统错误
      await this.expectLoginError();
      await this.clearForm();
    }
  }

  async attemptXSSInjection() {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src=x onerror=alert("XSS")>'
    ];

    for (const payload of xssPayloads) {
      await this.usernameInput.fill(payload);
      await this.passwordInput.fill('password');
      await this.loginButton.click();
      
      // 检查是否有弹窗（XSS攻击成功的标志）
      await this.page.waitForTimeout(1000);
      const dialogs = [];
      this.page.on('dialog', dialog => {
        dialogs.push(dialog);
        dialog.dismiss();
      });
      
      expect(dialogs).toHaveLength(0); // 不应该有弹窗
      await this.clearForm();
    }
  }

  // 性能测试
  async measureLoginTime(username, password) {
    const startTime = Date.now();
    await this.login(username, password);
    const endTime = Date.now();
    return endTime - startTime;
  }

  // 可访问性测试
  async checkAccessibility() {
    // 检查表单标签
    await expect(this.usernameInput).toHaveAttribute('aria-label');
    await expect(this.passwordInput).toHaveAttribute('aria-label');
    
    // 检查错误消息的关联
    if (await this.usernameError.isVisible()) {
      const errorId = await this.usernameError.getAttribute('id');
      await expect(this.usernameInput).toHaveAttribute('aria-describedby', errorId);
    }
  }
}