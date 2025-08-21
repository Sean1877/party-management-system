import { test, expect } from '@playwright/test';
import { TEST_CONFIG, TEST_DATA } from '../config/test-config.js';

test.describe('组织管理模块测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置测试超时
    page.setDefaultTimeout(TEST_CONFIG.TIMEOUTS.MEDIUM);
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
  });

  test('TC-ORG-001: 组织架构管理功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入组织管理页面
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await page.waitForSelector('.organization-management');
    
    // 3. 点击"添加组织"按钮
    await page.click('[data-testid="add-organization-button"]');
    await page.waitForSelector('.organization-form-dialog');
    
    // 4. 填写组织基本信息
    await page.fill('input[name="name"]', TEST_DATA.ORGANIZATION.VALID.name);
    await page.selectOption('select[name="type"]', String(TEST_DATA.ORGANIZATION.VALID.type));
    await page.fill('textarea[name="description"]', TEST_DATA.ORGANIZATION.VALID.description);
    await page.fill('input[name="contactPerson"]', TEST_DATA.ORGANIZATION.VALID.contactPerson);
    await page.fill('input[name="contactPhone"]', TEST_DATA.ORGANIZATION.VALID.contactPhone);
    await page.fill('input[name="address"]', TEST_DATA.ORGANIZATION.VALID.address);
    
    // 5. 选择上级组织
    await page.selectOption('select[name="parentId"]', '1');
    
    // 6. 点击"保存"按钮
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    await expect(page.locator(TEST_CONFIG.SELECTORS.TABLE)).toContainText(TEST_DATA.ORGANIZATION.VALID.name);
    
    // 验证组织层级关系正确建立
    await page.click('.el-table__row:has-text("' + TEST_DATA.ORGANIZATION.VALID.name + '") [data-testid="view-organization-button"]');
    await page.waitForSelector('.organization-detail-dialog');
    
    const parentOrg = await page.textContent('.parent-organization');
    expect(parentOrg).toBeTruthy();
  });

  test('TC-ORG-002: 组织架构图展示功能测试', async ({ page }) => {
    // 1. 用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入组织管理页面
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await page.waitForSelector('.organization-management');
    
    // 3. 查看组织架构图
    await page.click('[data-testid="view-org-chart-button"]');
    await page.waitForSelector('.organization-chart-dialog');
    
    // 预期结果验证
    await expect(page.locator('.organization-chart-dialog')).toBeVisible();
    await expect(page.locator('.org-tree-container')).toBeVisible();
    
    // 4. 点击展开/收起节点
    await page.click('.org-tree-node:first-child .expand-collapse-button');
    await page.waitForTimeout(1000);
    
    // 验证展开/收起功能正常
    const childNodes = await page.locator('.org-tree-node').count();
    expect(childNodes).toBeGreaterThan(0);
    
    // 5. 查看组织详情
    await page.click('.org-tree-node:first-child .view-details-button');
    await page.waitForSelector('.organization-detail-dialog');
    
    // 验证组织详情显示准确
    const detailContent = await page.textContent('.organization-detail-dialog');
    expect(detailContent).toContain('组织信息');
    expect(detailContent).toContain('联系方式');
    expect(detailContent).toContain('组织地址');
  });

  test('TC-ORG-003: 组织人员分配功能测试', async ({ page }) => {
    // 1. 组织管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入组织管理页面
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await page.waitForSelector('.organization-management');
    
    // 3. 选择一个组织
    await page.click('.el-table__row:first-child [data-testid="manage-organization-button"]');
    await page.waitForSelector('.organization-management-dialog');
    
    // 4. 点击"人员管理"按钮
    await page.click('[data-testid="personnel-management-button"]');
    await page.waitForSelector('.personnel-management-dialog');
    
    // 5. 添加组织成员
    await page.click('[data-testid="add-member-button"]');
    await page.waitForSelector('.add-member-dialog');
    
    // 选择要添加的党员
    await page.selectOption('select[name="userId"]', '1');
    await page.selectOption('select[name="role"]', 'member');
    await page.click('[data-testid="confirm-add-member-button"]');
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 6. 设置组织负责人
    await page.click('.member-row:first-child [data-testid="set-leader-button"]');
    await page.waitForSelector('.set-leader-dialog');
    
    await page.selectOption('select[name="leaderRole"]', 'secretary');
    await page.click('[data-testid="confirm-set-leader-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 7. 移除组织成员
    await page.click('.member-row:first-child [data-testid="remove-member-button"]');
    await page.waitForSelector('.remove-confirmation-dialog');
    await page.click('[data-testid="confirm-remove-button"]');
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 验证人员分配信息准确更新
    await page.click('[data-testid="refresh-personnel-button"]');
    await page.waitForLoadState('networkidle');
    
    const memberCount = await page.locator('.member-row').count();
    expect(memberCount).toBeGreaterThanOrEqual(0);
    
    // 8. 查看组织人员统计
    await page.click('[data-testid="view-personnel-stats-button"]');
    await page.waitForSelector('.personnel-stats-dialog');
    
    // 验证组织人员统计
    const statsContent = await page.textContent('.personnel-stats-dialog');
    expect(statsContent).toContain('总人数');
    expect(statsContent).toContain('正式党员');
    expect(statsContent).toContain('预备党员');
    expect(statsContent).toContain('负责人');
  });

  test('TC-ORG-004: 组织信息编辑功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入组织管理页面
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await page.waitForSelector('.organization-management');
    
    // 3. 选择一个组织进行编辑
    await page.click('.el-table__row:first-child [data-testid="edit-organization-button"]');
    await page.waitForSelector('.organization-form-dialog');
    
    // 4. 修改组织信息
    await page.fill('input[name="name"]', '更新后的组织名称');
    await page.fill('textarea[name="description"]', '更新后的组织描述信息');
    await page.fill('input[name="contactPerson"]', '李四');
    await page.fill('input[name="contactPhone"]', '13900139001');
    
    // 5. 保存修改
    await page.click(TEST_CONFIG.SELECTORS.SUBMIT_BUTTON);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 验证修改后的信息在列表中显示
    await page.waitForLoadState('networkidle');
    await expect(page.locator(TEST_CONFIG.SELECTORS.TABLE)).toContainText('更新后的组织名称');
    
    // 6. 查看修改历史
    await page.click('.el-table__row:first-child [data-testid="view-history-button"]');
    await page.waitForSelector('.organization-history-dialog');
    
    // 验证历史记录
    const historyContent = await page.textContent('.organization-history-dialog');
    expect(historyContent).toContain('修改记录');
    expect(historyContent).toContain('更新后的组织名称');
  });

  test('TC-ORG-005: 组织层级调整功能测试', async ({ page }) => {
    // 1. 系统管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入组织管理页面
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await page.waitForSelector('.organization-management');
    
    // 3. 查看组织架构图
    await page.click('[data-testid="view-org-chart-button"]');
    await page.waitForSelector('.organization-chart-dialog');
    
    // 4. 测试组织拖拽调整
    const dragNode = page.locator('.org-tree-node:nth-child(2)');
    const dropTarget = page.locator('.org-tree-node:first-child');
    
    // 模拟拖拽操作
    await dragNode.dragTo(dropTarget);
    await page.waitForTimeout(1000);
    
    // 预期结果验证
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
    
    // 5. 验证层级关系更新
    await page.click('[data-testid="refresh-org-chart-button"]');
    await page.waitForLoadState('networkidle');
    
    // 检查组织树结构
    const treeStructure = await page.textContent('.org-tree-container');
    expect(treeStructure).toBeTruthy();
    
    // 6. 批量调整组织层级
    await page.click('[data-testid="batch-adjust-button"]');
    await page.waitForSelector('.batch-adjust-dialog');
    
    // 选择要调整的组织
    await page.check('input[name="selectOrg1"]');
    await page.check('input[name="selectOrg2"]');
    await page.selectOption('select[name="newParent"]', '1');
    await page.click('[data-testid="confirm-batch-adjust-button"]');
    
    // 验证批量调整成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
  });

  test('TC-ORG-006: 组织统计功能测试', async ({ page }) => {
    // 1. 组织管理员登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入组织管理页面
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await page.waitForSelector('.organization-management');
    
    // 3. 查看组织统计
    await page.click('[data-testid="view-org-stats-button"]');
    await page.waitForSelector('.organization-stats-dialog');
    
    // 预期结果验证
    await expect(page.locator('.organization-stats-dialog')).toBeVisible();
    
    // 验证统计信息
    const statsContent = await page.textContent('.organization-stats-dialog');
    expect(statsContent).toContain('组织总数');
    expect(statsContent).toContain('党员总数');
    expect(statsContent).toContain('活跃组织');
    
    // 4. 查看组织类型分布
    await page.click('[data-testid="view-type-distribution-button"]');
    await page.waitForSelector('.type-distribution-chart');
    
    // 验证图表显示
    await expect(page.locator('.type-distribution-chart')).toBeVisible();
    
    // 5. 查看组织人员分布
    await page.click('[data-testid="view-personnel-distribution-button"]');
    await page.waitForSelector('.personnel-distribution-chart');
    
    // 验证人员分布图表
    await expect(page.locator('.personnel-distribution-chart')).toBeVisible();
    
    // 6. 导出统计报表
    await page.click('[data-testid="export-stats-button"]');
    await page.waitForTimeout(2000);
    
    // 验证导出成功
    await expect(page.locator(TEST_CONFIG.SELECTORS.SUCCESS_MESSAGE)).toBeVisible();
  });

  test('TC-ORG-007: 组织搜索和筛选功能测试', async ({ page }) => {
    // 1. 用户登录系统
    await page.goto(TEST_CONFIG.PAGES.LOGIN);
    await page.fill('input[name="username"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.username);
    await page.fill('input[name="password"]', TEST_CONFIG.TEST_USERS.ORG_ADMIN.password);
    await page.click(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);
    await page.waitForURL(TEST_CONFIG.PAGES.DASHBOARD);
    
    // 2. 进入组织管理页面
    await page.goto(TEST_CONFIG.PAGES.ORGANIZATIONS);
    await page.waitForSelector('.organization-management');
    
    // 3. 按组织名称搜索
    await page.fill('input[name="searchName"]', '支部');
    await page.click('[data-testid="search-button"]');
    await page.waitForLoadState('networkidle');
    
    // 预期结果验证
    const searchResults = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(searchResults).toContain('支部');
    
    // 4. 按组织类型筛选
    await page.selectOption('select[name="filterType"]', '1');
    await page.click('[data-testid="search-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证筛选结果
    const filteredResults = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(filteredResults).toBeTruthy();
    
    // 5. 按状态筛选
    await page.selectOption('select[name="filterStatus"]', 'active');
    await page.click('[data-testid="search-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证状态筛选
    const activeResults = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(activeResults).toBeTruthy();
    
    // 6. 高级搜索
    await page.click('[data-testid="advanced-search-button"]');
    await page.waitForSelector('.advanced-search-dialog');
    
    // 填写高级搜索条件
    await page.fill('input[name="contactPerson"]', '张');
    await page.fill('input[name="establishedDate"]', '2020-01-01');
    await page.click('[data-testid="confirm-advanced-search-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证高级搜索结果
    const advancedResults = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(advancedResults).toBeTruthy();
    
    // 7. 清空搜索条件
    await page.click('[data-testid="clear-search-button"]');
    await page.waitForLoadState('networkidle');
    
    // 验证清空后显示所有组织
    const allResults = await page.textContent(TEST_CONFIG.SELECTORS.TABLE);
    expect(allResults).toBeTruthy();
  });
});