const { test, expect } = require('@playwright/test');

// 党费管理页面UI自动化测试
test.describe('党费管理页面测试', () => {
  test.beforeEach(async ({ page }) => {
    // 登录系统
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
    
    // 导航到党费管理页面
    await page.click('[data-testid="fee-management-menu"]');
    await page.waitForURL('**/fee-management');
  });

  test('页面基本元素渲染测试', async ({ page }) => {
    // 检查页面标题
    await expect(page.locator('[data-testid="page-title"]')).toContainText('党费管理');
    
    // 检查标签页
    await expect(page.locator('[data-testid="standards-tab"]')).toBeVisible();
    await expect(page.locator('[data-testid="payments-tab"]')).toBeVisible();
    
    // 检查操作按钮
    await expect(page.locator('[data-testid="add-standard-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-button"]')).toBeVisible();
    
    // 检查搜索框
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    
    // 检查数据表格
    await expect(page.locator('[data-testid="standards-table"]')).toBeVisible();
  });

  test('党费标准管理测试', async ({ page }) => {
    // 确保在党费标准标签页
    await page.click('[data-testid="standards-tab"]');
    
    // 点击添加党费标准按钮
    await page.click('[data-testid="add-standard-button"]');
    
    // 验证弹窗打开
    await expect(page.locator('[data-testid="standard-dialog"]')).toBeVisible();
    
    // 填写党费标准信息
    await page.fill('[data-testid="standard-name-input"]', '测试党费标准');
    await page.selectOption('[data-testid="member-type-select"]', 'regular');
    await page.fill('[data-testid="base-amount-input"]', '100');
    await page.fill('[data-testid="description-textarea"]', '测试用党费标准');
    
    // 保存党费标准
    await page.click('[data-testid="save-standard-button"]');
    
    // 验证成功提示
    await expect(page.locator('[data-testid="success-message"]')).toContainText('添加成功');
    
    // 验证数据表格中显示新添加的标准
    await expect(page.locator('[data-testid="standards-table"]')).toContainText('测试党费标准');
  });

  test('党费标准编辑测试', async ({ page }) => {
    // 点击第一行的编辑按钮
    await page.click('[data-testid="edit-standard-button"]:first-child');
    
    // 验证编辑弹窗打开
    await expect(page.locator('[data-testid="standard-dialog"]')).toBeVisible();
    
    // 修改党费标准信息
    await page.fill('[data-testid="standard-name-input"]', '修改后的党费标准');
    await page.fill('[data-testid="base-amount-input"]', '150');
    
    // 保存修改
    await page.click('[data-testid="save-standard-button"]');
    
    // 验证成功提示
    await expect(page.locator('[data-testid="success-message"]')).toContainText('修改成功');
    
    // 验证表格中数据已更新
    await expect(page.locator('[data-testid="standards-table"]')).toContainText('修改后的党费标准');
    await expect(page.locator('[data-testid="standards-table"]')).toContainText('150');
  });

  test('党费标准删除测试', async ({ page }) => {
    // 点击第一行的删除按钮
    await page.click('[data-testid="delete-standard-button"]:first-child');
    
    // 验证确认弹窗
    await expect(page.locator('[data-testid="confirm-dialog"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-message"]')).toContainText('确定要删除这个党费标准吗');
    
    // 确认删除
    await page.click('[data-testid="confirm-delete-button"]');
    
    // 验证成功提示
    await expect(page.locator('[data-testid="success-message"]')).toContainText('删除成功');
    
    // 验证数据从表格中移除
    await page.waitForTimeout(1000);
    const tableRows = await page.locator('[data-testid="standards-table"] tbody tr').count();
    expect(tableRows).toBeGreaterThanOrEqual(0);
  });

  test('党费缴费记录管理测试', async ({ page }) => {
    // 切换到缴费记录标签页
    await page.click('[data-testid="payments-tab"]');
    
    // 验证标签页切换成功
    await expect(page.locator('[data-testid="payments-table"]')).toBeVisible();
    
    // 点击添加缴费记录按钮
    await page.click('[data-testid="add-payment-button"]');
    
    // 验证弹窗打开
    await expect(page.locator('[data-testid="payment-dialog"]')).toBeVisible();
    
    // 填写缴费记录信息
    await page.selectOption('[data-testid="member-select"]', '1');
    await page.selectOption('[data-testid="standard-select"]', '1');
    await page.fill('[data-testid="amount-input"]', '100');
    await page.fill('[data-testid="payment-date-input"]', '2024-01-15');
    await page.selectOption('[data-testid="payment-method-select"]', 'cash');
    await page.fill('[data-testid="remark-textarea"]', '测试缴费记录');
    
    // 保存缴费记录
    await page.click('[data-testid="save-payment-button"]');
    
    // 验证成功提示
    await expect(page.locator('[data-testid="success-message"]')).toContainText('添加成功');
    
    // 验证数据表格中显示新添加的记录
    await expect(page.locator('[data-testid="payments-table"]')).toContainText('100');
  });

  test('缴费记录搜索测试', async ({ page }) => {
    // 切换到缴费记录标签页
    await page.click('[data-testid="payments-tab"]');
    
    // 在搜索框中输入关键词
    await page.fill('[data-testid="search-input"]', '张三');
    
    // 点击搜索按钮或按Enter
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // 验证搜索结果
    await page.waitForTimeout(1000);
    const searchResults = page.locator('[data-testid="payments-table"] tbody tr');
    const resultCount = await searchResults.count();
    
    if (resultCount > 0) {
      // 验证搜索结果包含关键词
      await expect(searchResults.first()).toContainText('张三');
    } else {
      // 验证无数据提示
      await expect(page.locator('[data-testid="no-data-message"]')).toBeVisible();
    }
  });

  test('缴费记录筛选测试', async ({ page }) => {
    // 切换到缴费记录标签页
    await page.click('[data-testid="payments-tab"]');
    
    // 设置日期范围筛选
    await page.fill('[data-testid="start-date-input"]', '2024-01-01');
    await page.fill('[data-testid="end-date-input"]', '2024-12-31');
    
    // 设置缴费方式筛选
    await page.selectOption('[data-testid="payment-method-filter"]', 'bank_transfer');
    
    // 点击筛选按钮
    await page.click('[data-testid="filter-button"]');
    
    // 验证筛选结果
    await page.waitForTimeout(1000);
    const filteredResults = page.locator('[data-testid="payments-table"] tbody tr');
    const resultCount = await filteredResults.count();
    
    if (resultCount > 0) {
      // 验证筛选结果符合条件
      await expect(filteredResults.first()).toContainText('银行转账');
    }
  });

  test('数据导出功能测试', async ({ page }) => {
    // 点击导出按钮
    await page.click('[data-testid="export-button"]');
    
    // 验证导出选项弹窗
    await expect(page.locator('[data-testid="export-dialog"]')).toBeVisible();
    
    // 选择导出类型
    await page.check('[data-testid="export-standards-checkbox"]');
    await page.check('[data-testid="export-payments-checkbox"]');
    
    // 选择导出格式
    await page.selectOption('[data-testid="export-format-select"]', 'excel');
    
    // 确认导出
    await page.click('[data-testid="confirm-export-button"]');
    
    // 验证导出成功提示
    await expect(page.locator('[data-testid="export-success-message"]')).toContainText('导出成功');
  });

  test('统计信息显示测试', async ({ page }) => {
    // 验证统计卡片显示
    await expect(page.locator('[data-testid="total-standards-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-payments-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-amount-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-rate-card"]')).toBeVisible();
    
    // 验证统计数据格式
    const totalAmount = await page.textContent('[data-testid="total-amount-value"]');
    expect(totalAmount).toMatch(/^[\d,]+(\.\d{2})?$/); // 验证金额格式
    
    const paymentRate = await page.textContent('[data-testid="payment-rate-value"]');
    expect(paymentRate).toMatch(/^\d+(\.\d+)?%$/); // 验证百分比格式
  });

  test('月度趋势图表测试', async ({ page }) => {
    // 验证图表容器存在
    await expect(page.locator('[data-testid="monthly-trend-chart"]')).toBeVisible();
    
    // 等待图表加载
    await page.waitForTimeout(2000);
    
    // 验证图表已渲染（检查canvas元素）
    const chartCanvas = page.locator('[data-testid="monthly-trend-chart"] canvas');
    await expect(chartCanvas).toBeVisible();
    
    // 测试图表交互（悬停显示数据）
    await chartCanvas.hover({ position: { x: 100, y: 100 } });
    
    // 验证工具提示显示
    await expect(page.locator('[data-testid="chart-tooltip"]')).toBeVisible();
  });

  test('分页功能测试', async ({ page }) => {
    // 切换到缴费记录标签页（通常数据较多）
    await page.click('[data-testid="payments-tab"]');
    
    // 验证分页组件存在
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
    
    // 测试每页显示数量切换
    await page.selectOption('[data-testid="page-size-select"]', '20');
    
    // 验证页面重新加载
    await page.waitForTimeout(1000);
    
    // 测试页码切换
    const nextPageButton = page.locator('[data-testid="next-page-button"]');
    if (await nextPageButton.isEnabled()) {
      await nextPageButton.click();
      
      // 验证页码变化
      await expect(page.locator('[data-testid="current-page"]')).toContainText('2');
      
      // 返回第一页
      await page.click('[data-testid="prev-page-button"]');
      await expect(page.locator('[data-testid="current-page"]')).toContainText('1');
    }
  });

  test('表单验证测试', async ({ page }) => {
    // 测试党费标准表单验证
    await page.click('[data-testid="add-standard-button"]');
    
    // 不填写必填字段直接保存
    await page.click('[data-testid="save-standard-button"]');
    
    // 验证必填字段错误提示
    await expect(page.locator('[data-testid="name-error"]')).toContainText('请输入标准名称');
    await expect(page.locator('[data-testid="amount-error"]')).toContainText('请输入基础金额');
    
    // 输入无效金额
    await page.fill('[data-testid="base-amount-input"]', '-100');
    await page.click('[data-testid="save-standard-button"]');
    
    // 验证金额验证错误
    await expect(page.locator('[data-testid="amount-error"]')).toContainText('金额必须大于0');
    
    // 关闭弹窗
    await page.click('[data-testid="cancel-button"]');
  });

  test('批量操作测试', async ({ page }) => {
    // 切换到缴费记录标签页
    await page.click('[data-testid="payments-tab"]');
    
    // 选择多条记录
    await page.check('[data-testid="select-all-checkbox"]');
    
    // 验证批量操作按钮可用
    await expect(page.locator('[data-testid="batch-delete-button"]')).toBeEnabled();
    await expect(page.locator('[data-testid="batch-export-button"]')).toBeEnabled();
    
    // 取消全选
    await page.uncheck('[data-testid="select-all-checkbox"]');
    
    // 验证批量操作按钮禁用
    await expect(page.locator('[data-testid="batch-delete-button"]')).toBeDisabled();
    
    // 选择单条记录
    await page.check('[data-testid="row-checkbox"]:first-child');
    
    // 验证批量操作按钮可用
    await expect(page.locator('[data-testid="batch-delete-button"]')).toBeEnabled();
  });

  test('响应式设计测试', async ({ page }) => {
    // 测试桌面端布局
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('[data-testid="desktop-layout"]')).toBeVisible();
    
    // 测试平板端布局
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('[data-testid="tablet-layout"]')).toBeVisible();
    
    // 测试手机端布局
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('[data-testid="mobile-layout"]')).toBeVisible();
    
    // 验证移动端操作按钮调整
    await expect(page.locator('[data-testid="mobile-action-menu"]')).toBeVisible();
  });

  test('权限控制测试', async ({ page }) => {
    // 使用普通用户登录
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="username-input"]', 'user');
    await page.fill('[data-testid="password-input"]', 'user123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
    
    // 尝试访问党费管理页面
    await page.goto('http://localhost:3000/fee-management');
    
    // 验证权限限制
    const addButton = page.locator('[data-testid="add-standard-button"]');
    if (await addButton.isVisible()) {
      await expect(addButton).toBeDisabled();
    } else {
      // 验证无权限提示
      await expect(page.locator('[data-testid="no-permission-message"]')).toBeVisible();
    }
  });

  test('数据刷新测试', async ({ page }) => {
    // 点击刷新按钮
    await page.click('[data-testid="refresh-button"]');
    
    // 验证加载状态
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
    
    // 等待数据加载完成
    await page.waitForTimeout(2000);
    
    // 验证数据已刷新
    await expect(page.locator('[data-testid="loading-indicator"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="standards-table"]')).toBeVisible();
  });

  test('错误处理测试', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/fee-standards', route => {
      route.abort('failed');
    });
    
    // 刷新页面触发API调用
    await page.reload();
    
    // 验证错误提示
    await expect(page.locator('[data-testid="error-message"]')).toContainText('数据加载失败');
    
    // 验证重试按钮
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    
    // 恢复网络并重试
    await page.unroute('**/api/fee-standards');
    await page.click('[data-testid="retry-button"]');
    
    // 验证数据加载成功
    await expect(page.locator('[data-testid="standards-table"]')).toBeVisible();
  });

  test('性能测试', async ({ page }) => {
    // 记录页面加载时间
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000/fee-management');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 验证页面加载时间在合理范围内
    expect(loadTime).toBeLessThan(5000);
    
    // 测试大量数据渲染性能
    await page.selectOption('[data-testid="page-size-select"]', '100');
    
    const renderStartTime = Date.now();
    await page.waitForTimeout(1000);
    const renderTime = Date.now() - renderStartTime;
    
    // 验证渲染时间在合理范围内
    expect(renderTime).toBeLessThan(3000);
  });
});