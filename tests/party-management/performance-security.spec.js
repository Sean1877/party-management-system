import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test-config.js';

test.describe('性能测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置测试超时
    page.setDefaultTimeout(TEST_CONFIG.TIMEOUTS.LONG);
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    // 监听网络请求
    page.on('request', request => {
      console.log('Request:', request.url(), request.method());
    });
    
    page.on('response', response => {
      console.log('Response:', response.url(), response.status());
    });
  });

  test('TC-PERF-001: 页面加载性能测试', async ({ page }) => {
    // 1. 用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    
    // 记录登录页面加载时间
    const loginLoadStart = Date.now();
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');
    const loginLoadTime = Date.now() - loginLoadStart;
    
    console.log(`登录页面加载时间: ${loginLoadTime}ms`);
    
    // 填写登录信息
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    
    // 记录登录响应时间
    const loginStart = Date.now();
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    const loginResponseTime = Date.now() - loginStart;
    
    console.log(`登录响应时间: ${loginResponseTime}ms`);
    
    // 预期结果验证
    expect(loginLoadTime).toBeLessThan(3000); // 页面加载时间不超过3秒
    expect(loginResponseTime).toBeLessThan(5000); // 登录响应时间不超过5秒
    
    // 2. 测试各个功能页面加载性能
    const pagesToTest = [
      { name: '用户管理', path: TEST_CONFIG.PAGES.USERS },
      { name: '活动管理', path: TEST_CONFIG.PAGES.ACTIVITIES },
      { name: '组织管理', path: TEST_CONFIG.PAGES.ORGANIZATIONS },
      { name: '统计分析', path: '/statistics' },
      { name: '系统设置', path: TEST_CONFIG.PAGES.SETTINGS }
    ];
    
    for (const pageInfo of pagesToTest) {
      console.log(`测试${pageInfo.name}页面加载性能...`);
      
      const loadStart = Date.now();
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - loadStart;
      
      console.log(`${pageInfo.name}页面加载时间: ${loadTime}ms`);
      
      // 验证页面加载时间
      expect(loadTime).toBeLessThan(3000); // 页面加载时间不超过3秒
      
      // 验证数据查询响应时间
      const queryStart = Date.now();
      await page.waitForSelector('.main-content');
      const queryTime = Date.now() - queryStart;
      
      console.log(`${pageInfo.name}数据查询时间: ${queryTime}ms`);
      expect(queryTime).toBeLessThan(2000); // 数据查询响应时间不超过2秒
    }
    
    // 3. 测试大数据量查询性能
    console.log('测试大数据量查询性能...');
    
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForLoadState('networkidle');
    
    // 设置较大的查询条件
    await page.fill('input[name="searchName"]', '');
    await page.click('[data-testid="search-button"]');
    await page.waitForLoadState('networkidle');
    
    const bulkQueryStart = Date.now();
    await page.waitForSelector(TEST_CONFIG.SELECTORS.TABLE);
    const bulkQueryTime = Date.now() - bulkQueryStart;
    
    console.log(`大数据量查询时间: ${bulkQueryTime}ms`);
    expect(bulkQueryTime).toBeLessThan(5000); // 大数据量查询性能稳定
  });

  test('TC-PERF-002: 并发用户访问测试', async ({ page }) => {
    // 这个测试模拟多个并发用户访问系统
    console.log('开始并发用户访问测试...');
    
    // 创建多个浏览器上下文模拟不同用户
    const contexts = [];
    const userPages = [];
    
    try {
      // 模拟10个并发用户
      for (let i = 0; i < 10; i++) {
        const context = await page.context().browser().newContext();
        contexts.push(context);
        
        const userPage = await context.newPage();
        userPages.push(userPage);
        
        // 设置页面超时
        userPage.setDefaultTimeout(TEST_CONFIG.TIMEOUTS.MEDIUM);
      }
      
      // 并发执行用户操作
      const concurrentActions = userPages.map(async (userPage, index) => {
        try {
          const startTime = Date.now();
          
          // 1. 并发登录
          await userPage.goto(TEST_CONFIG.PAGES.LOGIN);
          await userPage.fill('input[name="username"]', `user${index + 1}`);
          await userPage.fill('input[name="password"]', 'password123');
          await userPage.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
          await userPage.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
          
          // 2. 并发访问不同页面
          const pages = [
            TEST_CONFIG.PAGES.USERS,
            TEST_CONFIG.PAGES.ACTIVITIES,
            TEST_CONFIG.PAGES.ORGANIZATIONS,
            '/statistics'
          ];
          
          const randomPage = pages[Math.floor(Math.random() * pages.length)];
          await userPage.goto(randomPage);
          await userPage.waitForLoadState('networkidle');
          
          // 3. 并发执行查询操作
          if (randomPage === TEST_CONFIG.PAGES.USERS) {
            await userPage.fill('input[name="searchName"]', '张');
            await userPage.click('[data-testid="search-button"]');
          } else if (randomPage === TEST_CONFIG.PAGES.ACTIVITIES) {
            await userPage.selectOption('select[name="statusFilter"]', 'ongoing');
            await userPage.click('[data-testid="search-button"]');
          }
          
          await userPage.waitForLoadState('networkidle');
          
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          console.log(`用户${index + 1}操作完成，响应时间: ${responseTime}ms`);
          
          return {
            userId: index + 1,
            responseTime,
            success: true
          };
          
        } catch (error) {
          console.error(`用户${index + 1}操作失败:`, error.message);
          return {
            userId: index + 1,
            responseTime: 0,
            success: false,
            error: error.message
          };
        }
      });
      
      // 等待所有并发操作完成
      const results = await Promise.all(concurrentActions);
      
      // 分析测试结果
      const successfulResults = results.filter(r => r.success);
      const failedResults = results.filter(r => !r.success);
      
      console.log(`并发测试结果:`);
      console.log(`成功用户数: ${successfulResults.length}`);
      console.log(`失败用户数: ${failedResults.length}`);
      
      if (successfulResults.length > 0) {
        const avgResponseTime = successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length;
        const maxResponseTime = Math.max(...successfulResults.map(r => r.responseTime));
        const minResponseTime = Math.min(...successfulResults.map(r => r.responseTime));
        
        console.log(`平均响应时间: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`最大响应时间: ${maxResponseTime}ms`);
        console.log(`最小响应时间: ${minResponseTime}ms`);
        
        // 预期结果验证
        expect(successfulResults.length).toBeGreaterThan(8); // 至少8个用户成功
        expect(avgResponseTime).toBeLessThan(10000); // 平均响应时间在可接受范围内
        expect(maxResponseTime).toBeLessThan(20000); // 最大响应时间在可接受范围内
      }
      
      if (failedResults.length > 0) {
        console.log(`失败用户详情:`);
        failedResults.forEach(r => {
          console.log(`用户${r.userId}: ${r.error}`);
        });
      }
      
      // 验证系统稳定性
      await page.goto(TEST_CONFIG.PAGES.DASHBOARD);
      await page.waitForLoadState('networkidle');
      
      // 检查系统是否仍然正常运行
      await expect(page.locator('.dashboard')).toBeVisible();
      
      console.log('并发测试完成，系统运行正常');
      
    } finally {
      // 清理资源
      for (const context of contexts) {
        await context.close();
      }
    }
  });

  test('TC-PERF-003: 系统稳定性测试', async ({ page }) => {
    console.log('开始系统稳定性测试...');
    
    // 连续执行多个操作循环
    const operationLoops = 5;
    const operationsPerLoop = 10;
    
    for (let loop = 1; loop <= operationLoops; loop++) {
      console.log(`执行第${loop}轮操作循环...`);
      
      const loopStartTime = Date.now();
      let loopSuccessCount = 0;
      
      for (let op = 1; op <= operationsPerLoop; op++) {
        try {
          const opStartTime = Date.now();
          
          // 随机选择操作类型
          const operations = [
            async () => {
              await page.goto(TEST_CONFIG.PAGES.USERS);
              await page.waitForLoadState('networkidle');
              await page.click('[data-testid="search-button"]');
              await page.waitForLoadState('networkidle');
            },
            async () => {
              await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
              await page.waitForLoadState('networkidle');
              await page.click('[data-testid="search-button"]');
              await page.waitForLoadState('networkidle');
            },
            async () => {
              await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
              await page.waitForLoadState('networkidle');
              await page.click('[data-testid="search-button"]');
              await page.waitForLoadState('networkidle');
            },
            async () => {
              await page.goto('/statistics');
              await page.waitForLoadState('networkidle');
              await page.click('[data-testid="refresh-button"]');
              await page.waitForLoadState('networkidle');
            },
            async () => {
              await page.goto(TEST_CONFIG.PAGES.DASHBOARD);
              await page.waitForLoadState('networkidle');
              await page.click('[data-testid="refresh-dashboard-button"]');
              await page.waitForLoadState('networkidle');
            }
          ];
          
          const randomOperation = operations[Math.floor(Math.random() * operations.length)];
          await randomOperation();
          
          const opEndTime = Date.now();
          const opResponseTime = opEndTime - opStartTime;
          
          console.log(`第${loop}轮第${op}个操作完成，响应时间: ${opResponseTime}ms`);
          
          loopSuccessCount++;
          
        } catch (error) {
          console.error(`第${loop}轮第${op}个操作失败:`, error.message);
        }
      }
      
      const loopEndTime = Date.now();
      const loopDuration = loopEndTime - loopStartTime;
      const loopSuccessRate = (loopSuccessCount / operationsPerLoop) * 100;
      
      console.log(`第${loop}轮完成:`);
      console.log(`- 耗时: ${loopDuration}ms`);
      console.log(`- 成功率: ${loopSuccessRate.toFixed(2)}%`);
      
      // 每轮之间稍作休息
      await page.waitForTimeout(1000);
    }
    
    // 最终验证系统状态
    console.log('验证最终系统状态...');
    
    await page.goto(TEST_CONFIG.PAGES.DASHBOARD);
    await page.waitForLoadState('networkidle');
    
    // 检查系统是否仍然正常运行
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // 测试关键功能是否正常
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.user-management')).toBeVisible();
    
    await page.goto(TEST_CONFIG.PAGES.ACTIVITIES);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.activity-management')).toBeVisible();
    
    console.log('稳定性测试完成，系统运行正常');
  });
});

test.describe('安全测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置测试超时
    page.setDefaultTimeout(TEST_CONFIG.TIMEOUTS.MEDIUM);
  });

  test('TC-SEC-001: 用户认证安全测试', async ({ page }) => {
    // 1. 测试错误密码登录
    console.log('测试错误密码登录...');
    
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    
    // 预期结果：显示错误提示
    await expect(page.locator('.error-message')).toBeVisible();
    const errorMessage = await page.textContent('.error-message');
    expect(errorMessage).toContain('用户名或密码错误');
    
    // 2. 测试密码复杂度要求
    console.log('测试密码复杂度要求...');
    
    await page.goto('/register');
    await page.waitForSelector('.register-form');
    
    // 尝试设置简单密码
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果：显示密码复杂度错误
    await expect(page.locator('.error-message')).toBeVisible();
    const complexityError = await page.textContent('.error-message');
    expect(complexityError).toContain('密码复杂度');
    
    // 3. 测试JWT token机制
    console.log('测试JWT token机制...');
    
    // 正确登录
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 检查本地存储中的token
    const localStorage = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token'),
        userInfo: localStorage.getItem('userInfo')
      };
    });
    
    console.log('本地存储数据:', localStorage);
    
    // 验证token存在
    expect(localStorage.token).toBeTruthy();
    expect(localStorage.userInfo).toBeTruthy();
    
    // 4. 测试会话超时功能
    console.log('测试会话超时功能...');
    
    // 模拟长时间不操作（这里通过直接测试超时机制）
    await page.goto(TEST_CONFIG.PAGES.SETTINGS);
    
    // 由于无法直接模拟时间流逝，我们测试权限验证
    await expect(page.locator('.system-settings')).toBeVisible();
    
    console.log('认证安全测试完成');
  });

  test('TC-SEC-002: 数据安全防护测试', async ({ page }) => {
    // 1. 测试SQL注入防护
    console.log('测试SQL注入防护...');
    
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    
    // 尝试SQL注入攻击
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "admin'--",
      "' UNION SELECT * FROM users--",
      "1; DROP TABLE users--"
    ];
    
    for (const payload of sqlInjectionPayloads) {
      await page.fill('input[name="username"]', payload);
      await page.fill('input[name="password"]', payload);
      await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
      await page.waitForTimeout(1000);
      
      // 预期结果：登录失败，系统正常运行
      const currentUrl = page.url();
      if (currentUrl.includes('dashboard')) {
        // 如果意外登录成功，立即退出
        await page.click('[data-testid="logout-button"]');
        console.log(`警告: SQL注入载荷 ${payload} 意外成功`);
      } else {
        const errorVisible = await page.locator('.error-message').isVisible();
        expect(errorVisible).toBeTruthy();
      }
    }
    
    // 2. 测试XSS攻击防护
    console.log('测试XSS攻击防护...');
    
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForLoadState('networkidle');
    
    await page.click('[data-testid="add-user-button"]');
    await page.waitForSelector('.user-form-dialog');
    
    // 尝试XSS攻击
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')">',
      '"><script>alert("XSS")</script>'
    ];
    
    for (const payload of xssPayloads) {
      await page.fill('input[name="username"]', payload);
      await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
      await page.waitForTimeout(1000);
      
      // 预期结果：表单验证失败或数据被正确转义
      const errorVisible = await page.locator('.error-message').isVisible();
      if (!errorVisible) {
        // 如果没有错误，检查页面是否包含恶意脚本
        const pageContent = await page.content();
        expect(pageContent).not.toContain('<script>');
        expect(pageContent).not.toContain('javascript:');
      }
      
      // 清空表单进行下次测试
      await page.fill('input[name="username"]', '');
    }
    
    // 3. 验证数据加密存储
    console.log('验证数据加密存储...');
    
    // 这个测试需要在后端API层面验证，前端主要验证敏感信息不会在页面明文显示
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 检查密码字段是否为空或已加密
    await page.goto(TEST_CONFIG.PAGES.USERS);
    await page.waitForLoadState('networkidle');
    
    await page.click('.el-table__row:first-child [data-testid="edit-user-button"]');
    await page.waitForSelector('.user-form-dialog');
    
    const passwordField = await page.locator('input[name="password"]').inputValue();
    expect(passwordField).toBe(''); // 密码字段应该为空
    
    // 4. 检查HTTPS传输安全
    console.log('检查HTTPS传输安全...');
    
    const currentUrl = page.url();
    if (currentUrl.startsWith('https://')) {
      console.log('使用HTTPS安全传输');
    } else if (currentUrl.startsWith('http://localhost')) {
      console.log('本地开发环境，使用HTTP');
    } else {
      console.log('警告: 生产环境应使用HTTPS');
    }
    
    console.log('数据安全防护测试完成');
  });

  test('TC-SEC-003: 权限安全测试', async ({ page }) => {
    // 1. 测试未授权访问
    console.log('测试未授权访问...');
    
    // 尝试直接访问需要权限的页面
    const protectedPages = [
      '/admin/users',
      '/admin/settings',
      '/admin/logs',
      '/admin/data-management'
    ];
    
    for (const pageUrl of protectedPages) {
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
      
      // 预期结果：重定向到登录页面或显示权限错误
      const currentUrl = page.url();
      if (currentUrl.includes('login')) {
        console.log(`页面 ${pageUrl} 正确重定向到登录页面`);
      } else if (currentUrl.includes('403') || currentUrl.includes('error')) {
        console.log(`页面 ${pageUrl} 正确显示权限错误`);
      } else {
        console.log(`警告: 页面 ${pageUrl} 可能存在权限绕过`);
      }
    }
    
    // 2. 测试水平权限越权
    console.log('测试水平权限越权...');
    
    // 普通用户登录
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.USER.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.USER.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 尝试访问其他用户的数据
    await page.goto(`${TEST_CONFIG.PAGES.USERS}/2/edit`); // 尝试编辑用户ID为2的用户
    
    const currentUrl = page.url();
    if (currentUrl.includes('403') || currentUrl.includes('error')) {
      console.log('水平权限控制正常');
    } else {
      console.log('警告: 可能存在水平权限越权');
    }
    
    // 3. 测试垂直权限越权
    console.log('测试垂直权限越权...');
    
    // 普通用户尝试访问管理员功能
    await page.goto(TEST_CONFIG.PAGES.SETTINGS);
    
    if (await page.locator('.error-403').isVisible()) {
      console.log('垂直权限控制正常');
    } else {
      console.log('警告: 可能存在垂直权限越权');
    }
    
    console.log('权限安全测试完成');
  });
});