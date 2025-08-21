# 党建管理系统 - UI自动化测试

本目录包含党建管理系统的UI自动化测试，使用Playwright框架实现端到端测试。

## 📁 目录结构

```
ui-tests/
├── page-objects/           # 页面对象模型
│   ├── BasePage.js         # 基础页面对象
│   ├── LoginPage.js        # 登录页面
│   ├── DashboardPage.js    # 仪表板页面
│   ├── UserManagementPage.js      # 用户管理页面
│   ├── OrganizationManagementPage.js  # 组织管理页面
│   ├── ActivityManagementPage.js      # 活动管理页面
│   ├── FeeManagementPage.js           # 党费管理页面
│   ├── StatisticsPage.js              # 统计分析页面
│   ├── SystemSettingsPage.js         # 系统设置页面
│   ├── ProfilePage.js                 # 个人中心页面
│   └── index.js                       # 页面对象导出文件
├── tests/                   # 测试用例
│   ├── e2e/                # 端到端测试
│   ├── smoke/              # 冒烟测试
│   ├── regression/         # 回归测试
│   ├── performance/        # 性能测试
│   ├── accessibility/      # 可访问性测试
│   └── visual/             # 视觉回归测试
├── fixtures/               # 测试数据和工具
├── utils/                  # 测试工具函数
├── reports/                # 测试报告
├── screenshots/            # 测试截图
├── videos/                 # 测试视频
├── traces/                 # 测试跟踪
├── archives/               # 历史测试结果归档
├── playwright.config.js    # Playwright配置
├── global-setup.js         # 全局设置
├── global-teardown.js      # 全局清理
└── package.json            # 依赖和脚本配置
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd ui-tests
npm install
```

### 2. 安装浏览器

```bash
npm run install-browsers
```

### 3. 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并显示浏览器界面
npm run test:headed

# 运行特定项目的测试
npm run test:chromium
npm run test:firefox
npm run test:webkit

# 运行移动端测试
npm run test:mobile
```

## 🧪 测试类型

### 端到端测试 (E2E)
完整的用户工作流程测试，覆盖主要业务场景。

```bash
npm run test:e2e
```

### 冒烟测试 (Smoke)
快速验证系统基本功能是否正常。

```bash
npm run test:smoke
```

### 回归测试 (Regression)
验证新功能不会破坏现有功能。

```bash
npm run test:regression
```

### 性能测试 (Performance)
测试页面加载时间和响应性能。

```bash
npm run test:performance
```

### 可访问性测试 (Accessibility)
验证应用的可访问性标准。

```bash
npm run test:accessibility
```

### 视觉回归测试 (Visual)
检测UI变化和视觉回归。

```bash
npm run test:visual
```

## 🔧 配置

### 环境变量

创建 `.env` 文件配置测试环境：

```env
# 测试环境URL
BASE_URL=http://localhost:3000

# 测试用户凭据
TEST_ADMIN_USERNAME=admin
TEST_ADMIN_PASSWORD=admin123
TEST_USER_USERNAME=test_user
TEST_USER_PASSWORD=test123

# 数据库配置（如果需要）
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=party_management_test
TEST_DB_USER=test_user
TEST_DB_PASSWORD=test_password

# 其他配置
TEST_TIMEOUT=30000
TEST_RETRIES=2
TEST_WORKERS=4
```

### Playwright配置

主要配置在 `playwright.config.js` 中：

- **浏览器支持**: Chromium, Firefox, WebKit
- **移动端测试**: iOS Safari, Android Chrome
- **并行执行**: 支持多worker并行测试
- **重试机制**: 失败测试自动重试
- **报告生成**: HTML, JSON, JUnit格式
- **截图和视频**: 失败时自动保存

## 📊 测试报告

### 查看HTML报告

```bash
npm run show-report
```

### 查看测试跟踪

```bash
npm run show-trace
```

### 报告类型

- **HTML报告**: `ui-tests/reports/html/index.html`
- **JSON报告**: `ui-tests/reports/results.json`
- **JUnit报告**: `ui-tests/reports/results.xml`
- **测试摘要**: `ui-tests/reports/test-summary.txt`

## 🎯 页面对象模型 (POM)

### 使用示例

```javascript
import { test, expect } from '@playwright/test';
import { TestHelper } from '../page-objects/index.js';

test('用户登录测试', async ({ page }) => {
  const testHelper = new TestHelper(page);
  
  // 登录
  const dashboardPage = await testHelper.login('admin', 'admin123');
  
  // 验证登录成功
  await dashboardPage.expectDashboardVisible();
  
  // 导航到用户管理
  const userPage = await testHelper.navigateToPage('userManagement');
  
  // 创建用户
  await userPage.addUser({
    username: 'test_user',
    realName: '测试用户',
    email: 'test@example.com',
    role: 'member'
  });
  
  // 验证用户创建成功
  await userPage.expectUserInTable('test_user');
});
```

### 页面对象特性

- **统一的基础类**: 所有页面继承自BasePage
- **元素定位**: 使用data-testid属性进行稳定定位
- **等待机制**: 智能等待元素加载和状态变化
- **错误处理**: 统一的错误处理和重试机制
- **性能监控**: 内置页面加载时间测量

## 🛠️ 开发指南

### 编写新测试

1. **创建测试文件**
   ```javascript
   // tests/feature/new-feature.test.js
   import { test, expect } from '@playwright/test';
   import { TestHelper } from '../../page-objects/index.js';
   
   test.describe('新功能测试', () => {
     // 测试用例
   });
   ```

2. **使用页面对象**
   ```javascript
   test('测试用例', async ({ page }) => {
     const testHelper = new TestHelper(page);
     const userPage = await testHelper.navigateToPage('userManagement');
     // 测试逻辑
   });
   ```

3. **添加断言**
   ```javascript
   await expect(page.locator('[data-testid="user-table"]')).toBeVisible();
   await userPage.expectUserInTable('test_user');
   ```

### 创建新页面对象

1. **继承BasePage**
   ```javascript
   import { BasePage } from './BasePage.js';
   
   export class NewPage extends BasePage {
     constructor(page) {
       super(page);
       // 定义页面元素
     }
   }
   ```

2. **定义元素定位器**
   ```javascript
   get submitButton() {
     return this.page.locator('[data-testid="submit-button"]');
   }
   ```

3. **实现页面方法**
   ```javascript
   async submitForm(data) {
     await this.fillForm(data);
     await this.submitButton.click();
     await this.waitForResponse();
   }
   ```

### 测试数据管理

1. **使用测试工厂**
   ```javascript
   const userData = await testHelper.createTestUser({
     role: 'admin',
     organization: 'test_org'
   });
   ```

2. **清理测试数据**
   ```javascript
   test.afterEach(async () => {
     await testHelper.cleanupTestData();
   });
   ```

## 🔍 调试

### 调试模式

```bash
# 启动调试模式
npm run test:debug

# 使用UI模式
npm run test:ui
```

### 生成测试代码

```bash
# 录制测试
npm run codegen

# 针对本地应用录制
npm run codegen:localhost
```

### 查看测试跟踪

```bash
# 查看最新的测试跟踪
npm run show-trace
```

## 📈 持续集成

### GitHub Actions

```yaml
name: UI Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd ui-tests
          npm ci
      - name: Install Playwright
        run: |
          cd ui-tests
          npm run install-browsers
      - name: Run tests
        run: |
          cd ui-tests
          npm run ci
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: ui-tests/reports/
```

### Docker支持

```bash
# 在Docker中运行测试
npm run docker:test
```

## 🧹 维护

### 清理测试结果

```bash
# 清理当前测试结果
npm run clean

# 清理所有历史结果
npm run clean:all
```

### 代码质量

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 代码格式化
npm run format

# 验证代码质量
npm run validate
```

### 健康检查

```bash
# 运行健康检查测试
npm run health-check
```

## 📚 最佳实践

### 1. 测试设计原则

- **独立性**: 每个测试应该独立运行
- **可重复性**: 测试结果应该一致
- **清晰性**: 测试意图应该明确
- **维护性**: 易于维护和更新

### 2. 元素定位

- 优先使用 `data-testid` 属性
- 避免使用CSS类名和复杂选择器
- 使用语义化的测试ID

### 3. 等待策略

- 使用智能等待而非固定延时
- 等待网络请求完成
- 等待元素状态变化

### 4. 错误处理

- 提供清晰的错误信息
- 在失败时保存截图和视频
- 实现适当的重试机制

### 5. 性能考虑

- 并行运行测试
- 复用浏览器上下文
- 优化测试数据准备

## 🆘 故障排除

### 常见问题

1. **浏览器启动失败**
   ```bash
   npm run install-browsers
   npm run install-deps
   ```

2. **元素定位失败**
   - 检查元素是否存在
   - 验证选择器是否正确
   - 确认页面是否完全加载

3. **测试超时**
   - 增加超时时间配置
   - 检查网络连接
   - 优化等待策略

4. **测试不稳定**
   - 添加适当的等待
   - 检查测试数据依赖
   - 确保测试独立性

### 获取帮助

-