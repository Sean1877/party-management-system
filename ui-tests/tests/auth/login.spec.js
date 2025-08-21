const { test, expect } = require('@playwright/test');

// 登录页面UI自动化测试
test.describe('登录页面测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问登录页面
    await page.goto('http://localhost:3000/login');
  });

  test('页面元素渲染测试', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/党建管理系统/);
    
    // 检查登录表单元素
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="remember-checkbox"]')).toBeVisible();
    
    // 检查系统Logo和标题
    await expect(page.locator('[data-testid="system-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-title"]')).toContainText('党建管理系统');
    
    // 检查验证码（如果启用）
    const captchaElement = page.locator('[data-testid="captcha-input"]');
    if (await captchaElement.isVisible()) {
      await expect(page.locator('[data-testid="captcha-image"]')).toBeVisible();
      await expect(page.locator('[data-testid="refresh-captcha"]')).toBeVisible();
    }
  });

  test('正常登录流程测试', async ({ page }) => {
    // 输入用户名
    await page.fill('[data-testid="username-input"]', 'admin');
    
    // 输入密码
    await page.fill('[data-testid="password-input"]', 'admin123');
    
    // 勾选记住我
    await page.check('[data-testid="remember-checkbox"]');
    
    // 点击登录按钮
    await page.click('[data-testid="login-button"]');
    
    // 等待页面跳转
    await page.waitForURL('**/dashboard');
    
    // 验证登录成功
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
  });

  test('错误用户名登录测试', async ({ page }) => {
    // 输入错误用户名
    await page.fill('[data-testid="username-input"]', 'wronguser');
    await page.fill('[data-testid="password-input"]', 'admin123');
    
    // 点击登录按钮
    await page.click('[data-testid="login-button"]');
    
    // 验证错误提示
    await expect(page.locator('[data-testid="error-message"]')).toContainText('用户名或密码错误');
    
    // 验证仍在登录页面
    await expect(page.url()).toContain('/login');
  });

  test('错误密码登录测试', async ({ page }) => {
    // 输入错误密码
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // 点击登录按钮
    await page.click('[data-testid="login-button"]');
    
    // 验证错误提示
    await expect(page.locator('[data-testid="error-message"]')).toContainText('用户名或密码错误');
  });

  test('空用户名验证测试', async ({ page }) => {
    // 只输入密码，用户名为空
    await page.fill('[data-testid="password-input"]', 'admin123');
    
    // 点击登录按钮
    await page.click('[data-testid="login-button"]');
    
    // 验证用户名必填提示
    await expect(page.locator('[data-testid="username-error"]')).toContainText('请输入用户名');
  });

  test('空密码验证测试', async ({ page }) => {
    // 只输入用户名，密码为空
    await page.fill('[data-testid="username-input"]', 'admin');
    
    // 点击登录按钮
    await page.click('[data-testid="login-button"]');
    
    // 验证密码必填提示
    await expect(page.locator('[data-testid="password-error"]')).toContainText('请输入密码');
  });

  test('验证码功能测试', async ({ page }) => {
    // 检查验证码是否存在
    const captchaInput = page.locator('[data-testid="captcha-input"]');
    
    if (await captchaInput.isVisible()) {
      // 输入用户名和密码
      await page.fill('[data-testid="username-input"]', 'admin');
      await page.fill('[data-testid="password-input"]', 'admin123');
      
      // 不输入验证码直接登录
      await page.click('[data-testid="login-button"]');
      
      // 验证验证码必填提示
      await expect(page.locator('[data-testid="captcha-error"]')).toContainText('请输入验证码');
      
      // 测试刷新验证码
      const originalSrc = await page.locator('[data-testid="captcha-image"]').getAttribute('src');
      await page.click('[data-testid="refresh-captcha"]');
      
      // 等待验证码刷新
      await page.waitForTimeout(1000);
      
      const newSrc = await page.locator('[data-testid="captcha-image"]').getAttribute('src');
      expect(originalSrc).not.toBe(newSrc);
    }
  });

  test('记住我功能测试', async ({ page }) => {
    // 输入登录信息并勾选记住我
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.check('[data-testid="remember-checkbox"]');
    
    // 登录
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
    
    // 退出登录
    await page.click('[data-testid="logout-button"]');
    await page.waitForURL('**/login');
    
    // 验证用户名是否被记住
    const usernameValue = await page.inputValue('[data-testid="username-input"]');
    expect(usernameValue).toBe('admin');
    
    // 验证记住我复选框状态
    const isChecked = await page.isChecked('[data-testid="remember-checkbox"]');
    expect(isChecked).toBe(true);
  });

  test('密码显示/隐藏功能测试', async ({ page }) => {
    // 输入密码
    await page.fill('[data-testid="password-input"]', 'testpassword');
    
    // 验证密码默认隐藏
    const passwordType = await page.getAttribute('[data-testid="password-input"]', 'type');
    expect(passwordType).toBe('password');
    
    // 点击显示密码按钮
    await page.click('[data-testid="toggle-password"]');
    
    // 验证密码显示
    const newPasswordType = await page.getAttribute('[data-testid="password-input"]', 'type');
    expect(newPasswordType).toBe('text');
    
    // 再次点击隐藏密码
    await page.click('[data-testid="toggle-password"]');
    
    // 验证密码重新隐藏
    const finalPasswordType = await page.getAttribute('[data-testid="password-input"]', 'type');
    expect(finalPasswordType).toBe('password');
  });

  test('键盘操作测试', async ({ page }) => {
    // 输入用户名
    await page.fill('[data-testid="username-input"]', 'admin');
    
    // 按Tab键切换到密码输入框
    await page.press('[data-testid="username-input"]', 'Tab');
    
    // 验证焦点在密码输入框
    await expect(page.locator('[data-testid="password-input"]')).toBeFocused();
    
    // 输入密码
    await page.type('[data-testid="password-input"]', 'admin123');
    
    // 按Enter键提交表单
    await page.press('[data-testid="password-input"]', 'Enter');
    
    // 验证登录成功
    await page.waitForURL('**/dashboard');
  });

  test('响应式设计测试', async ({ page }) => {
    // 测试桌面端
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('[data-testid="login-container"]')).toBeVisible();
    
    // 测试平板端
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="login-container"]')).toBeVisible();
    
    // 测试手机端
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="login-container"]')).toBeVisible();
    
    // 验证移动端布局调整
    const containerClass = await page.getAttribute('[data-testid="login-container"]', 'class');
    expect(containerClass).toContain('mobile');
  });

  test('加载状态测试', async ({ page }) => {
    // 输入登录信息
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    
    // 点击登录按钮
    await page.click('[data-testid="login-button"]');
    
    // 验证加载状态
    await expect(page.locator('[data-testid="login-loading"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeDisabled();
    
    // 等待登录完成
    await page.waitForURL('**/dashboard');
  });

  test('多次登录失败锁定测试', async ({ page }) => {
    // 模拟多次登录失败
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid="username-input"]', 'admin');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');
      
      // 等待错误提示
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      
      // 清空输入框
      await page.fill('[data-testid="password-input"]', '');
    }
    
    // 验证账户锁定提示
    await expect(page.locator('[data-testid="account-locked-message"]')).toContainText('账户已被锁定');
    
    // 验证登录按钮被禁用
    await expect(page.locator('[data-testid="login-button"]')).toBeDisabled();
  });

  test('忘记密码链接测试', async ({ page }) => {
    // 点击忘记密码链接
    await page.click('[data-testid="forgot-password-link"]');
    
    // 验证跳转到忘记密码页面
    await page.waitForURL('**/forgot-password');
    
    // 验证忘记密码页面元素
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="send-code-button"]')).toBeVisible();
  });

  test('注册链接测试', async ({ page }) => {
    // 检查注册链接是否存在
    const registerLink = page.locator('[data-testid="register-link"]');
    
    if (await registerLink.isVisible()) {
      // 点击注册链接
      await registerLink.click();
      
      // 验证跳转到注册页面
      await page.waitForURL('**/register');
      
      // 验证注册页面元素
      await expect(page.locator('[data-testid="register-form"]')).toBeVisible();
    }
  });

  test('浏览器兼容性测试', async ({ page, browserName }) => {
    // 根据不同浏览器进行特定测试
    console.log(`当前浏览器: ${browserName}`);
    
    // 输入登录信息
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    
    // 登录
    await page.click('[data-testid="login-button"]');
    
    // 验证登录成功
    await page.waitForURL('**/dashboard');
    
    // 验证页面正常渲染
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
  });

  test('网络异常处理测试', async ({ page }) => {
    // 模拟网络离线
    await page.context().setOffline(true);
    
    // 尝试登录
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    // 验证网络错误提示
    await expect(page.locator('[data-testid="network-error-message"]')).toContainText('网络连接失败');
    
    // 恢复网络连接
    await page.context().setOffline(false);
    
    // 重试登录
    await page.click('[data-testid="retry-button"]');
    
    // 验证登录成功
    await page.waitForURL('**/dashboard');
  });

  test('安全性测试', async ({ page }) => {
    // 测试SQL注入防护
    await page.fill('[data-testid="username-input"]', "admin'; DROP TABLE users; --");
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    // 验证系统正常处理恶意输入
    await expect(page.locator('[data-testid="error-message"]')).toContainText('用户名或密码错误');
    
    // 测试XSS防护
    await page.fill('[data-testid="username-input"]', '<script>alert("XSS")</script>');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    // 验证脚本未执行
    const alertDialogs = [];
    page.on('dialog', dialog => {
      alertDialogs.push(dialog);
      dialog.dismiss();
    });
    
    expect(alertDialogs.length).toBe(0);
  });

  test('性能测试', async ({ page }) => {
    // 记录页面加载时间
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000/login');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 验证页面加载时间在合理范围内（3秒内）
    expect(loadTime).toBeLessThan(3000);
    
    // 测试登录响应时间
    const loginStartTime = Date.now();
    
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    await page.waitForURL('**/dashboard');
    
    const loginTime = Date.now() - loginStartTime;
    
    // 验证登录响应时间在合理范围内（5秒内）
    expect(loginTime).toBeLessThan(5000);
  });
});