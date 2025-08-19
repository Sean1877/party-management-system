# 党建管理系统 Playwright 测试套件

## 测试套件概述

本测试套件基于党建管理系统的测试用例文档，采用 Playwright 自动化测试框架，提供了全面的 UI 自动化测试覆盖。

## 测试文件结构

```
tests/
├── config/
│   └── test-config.js                 # 测试配置文件
├── helpers/
│   ├── base-test.js                   # 基础测试类
│   └── test-helpers.js                # 通用测试工具
├── party-management/
│   ├── user-management.spec.js        # 党员管理模块测试
│   ├── fee-management.spec.js         # 党费管理模块测试
│   ├── activity-management.spec.js     # 活动管理模块测试
│   ├── organization-management.spec.js # 组织管理模块测试
│   ├── system-management.spec.js      # 系统管理模块测试
│   ├── statistics-management.spec.js   # 统计分析模块测试
│   ├── performance-security.spec.js    # 性能和安全测试
│   └── compatibility.spec.js          # 兼容性测试
├── fixtures/
│   └── test-data.json                 # 测试数据文件
└── utils/
    ├── data-generator.js              # 测试数据生成器
    └── report-generator.js            # 测试报告生成器
```

## 测试模块说明

### 1. 党员管理模块测试 (user-management.spec.js)
- **TC-USER-001**: 党员信息添加功能测试
- **TC-USER-002**: 党员信息字段验证测试
- **TC-USER-003**: 党员信息多条件查询测试
- **TC-USER-004**: 党员信息批量导入导出测试
- **TC-USER-005**: 党员状态变更测试
- **TC-USER-006**: 党员转正流程测试
- **TC-USER-007**: 党员多维度统计分析测试

### 2. 党费管理模块测试 (fee-management.spec.js)
- **TC-FEE-001**: 党费缴纳标准设置测试
- **TC-FEE-002**: 党费缴纳记录管理测试
- **TC-FEE-003**: 党费缴纳提醒功能测试
- **TC-FEE-004**: 党费缴纳凭证管理测试
- **TC-FEE-005**: 党费收缴统计分析测试
- **TC-FEE-006**: 党费收支管理测试

### 3. 活动管理模块测试 (activity-management.spec.js)
- **TC-ACTIVITY-001**: 活动创建功能测试
- **TC-ACTIVITY-002**: 活动报名功能测试
- **TC-ACTIVITY-003**: 活动签到功能测试
- **TC-ACTIVITY-004**: 活动参与统计分析测试
- **TC-ACTIVITY-005**: 活动效果评价功能测试
- **TC-ACTIVITY-006**: 活动资料管理测试
- **TC-ACTIVITY-007**: 活动状态管理测试

### 4. 组织管理模块测试 (organization-management.spec.js)
- **TC-ORG-001**: 组织架构管理功能测试
- **TC-ORG-002**: 组织架构图展示功能测试
- **TC-ORG-003**: 组织人员分配功能测试
- **TC-ORG-004**: 组织信息编辑功能测试
- **TC-ORG-005**: 组织层级调整功能测试
- **TC-ORG-006**: 组织统计功能测试
- **TC-ORG-007**: 组织搜索和筛选功能测试

### 5. 系统管理模块测试 (system-management.spec.js)
- **TC-SYS-001**: 用户权限管理功能测试
- **TC-SYS-002**: 权限验证功能测试
- **TC-SYS-003**: 系统配置管理功能测试
- **TC-SYS-004**: 系统日志管理功能测试
- **TC-SYS-005**: 数据备份恢复功能测试
- **TC-SYS-006**: 系统监控功能测试

### 6. 统计分析模块测试 (statistics-management.spec.js)
- **TC-STATS-001**: 综合统计仪表盘功能测试
- **TC-STATS-002**: 党员统计分析功能测试
- **TC-STATS-003**: 活动统计分析功能测试
- **TC-STATS-004**: 组织统计分析功能测试
- **TC-STATS-005**: 党费统计分析功能测试
- **TC-STATS-006**: 自定义报表功能测试

### 7. 性能和安全测试 (performance-security.spec.js)
- **TC-PERF-001**: 页面加载性能测试
- **TC-PERF-002**: 并发用户访问测试
- **TC-PERF-003**: 系统稳定性测试
- **TC-SEC-001**: 用户认证安全测试
- **TC-SEC-002**: 数据安全防护测试
- **TC-SEC-003**: 权限安全测试

### 8. 兼容性测试 (compatibility.spec.js)
- **TC-COMPAT-001**: Chrome浏览器兼容性测试
- **TC-COMPAT-002**: Firefox浏览器兼容性测试
- **TC-COMPAT-003**: Safari浏览器兼容性测试
- **TC-COMPAT-004**: Edge浏览器兼容性测试
- **TC-MOBILE-001**: 手机设备响应式设计测试
- **TC-MOBILE-002**: 平板设备响应式设计测试
- **TC-MOBILE-003**: 不同屏幕尺寸适配测试
- **TC-MOBILE-004**: 移动端触摸手势测试

## 环境配置

### 前置条件
- Node.js 16+
- Playwright 最新版本
- 党建管理系统前端服务运行在 http://localhost:3000
- 党建管理系统后端服务运行在 http://localhost:8080

### 安装依赖
```bash
npm install
```

### 安装 Playwright 浏览器
```bash
npx playwright install
```

## 运行测试

### 运行所有测试
```bash
npx playwright test
```

### 运行特定模块测试
```bash
# 党员管理模块
npx playwright test tests/party-management/user-management.spec.js

# 活动管理模块
npx playwright test tests/party-management/activity-management.spec.js

# 性能测试
npx playwright test tests/party-management/performance-security.spec.js
```

### 运行特定浏览器测试
```bash
# Chrome
npx playwright test --project=chromium

# Firefox
npx playwright test --project=firefox

# Safari
npx playwright test --project=webkit
```

### 调试模式运行
```bash
# 显示浏览器窗口
npx playwright test --headed

# 调试特定测试
npx playwright test --debug
```

### 并行运行测试
```bash
# 指定并行数量
npx playwright test --workers=4
```

## 测试配置

### 测试超时设置
- 页面加载超时：30秒
- 元素查找超时：10秒
- 操作超时：5秒

### 测试用户
```javascript
TEST_USERS = {
  ADMIN: { username: 'admin', password: 'admin123' },
  ORG_ADMIN: { username: 'orgadmin', password: 'orgadmin123' },
  USER: { username: 'user001', password: 'user123' }
}
```

### 测试数据
测试脚本中包含了各种测试数据，包括：
- 有效的党员信息数据
- 有效的活动数据
- 有效的组织数据
- 无效的表单数据（用于负向测试）

## 测试报告

### HTML 报告
测试完成后会自动生成 HTML 报告，位于：
```
playwright-report/index.html
```

查看报告：
```bash
npx playwright show-report
```

### 控制台输出
测试运行时会显示详细的控制台输出，包括：
- 测试执行进度
- 性能指标
- 错误信息

## 自定义测试工具

### TestHelpers 工具类
提供了以下工具类：
- `LoginHelper`: 登录相关操作
- `FormHelper`: 表单操作
- `TableHelper`: 表格操作
- `DialogHelper`: 对话框操作
- `AssertionHelper`: 断言操作
- `PerformanceHelper`: 性能测试

### 使用示例
```javascript
import { createTestHelpers } from '../helpers/test-helpers.js';

test('示例测试', async ({ page }) => {
  const helpers = createTestHelpers(page);
  
  // 登录
  await helpers.login.login(TEST_CONFIG.TEST_USERS.ADMIN);
  
  // 导航到用户管理
  await page.goto(TEST_CONFIG.PAGES.USERS);
  
  // 验证页面
  await helpers.assertion.expectVisible('.user-management');
});
```

## 最佳实践

### 1. 测试组织
- 按功能模块组织测试文件
- 使用描述性的测试名称
- 合理使用测试分组（describe/test）

### 2. 测试数据管理
- 使用统一的测试配置
- 避免硬编码测试数据
- 考虑测试数据的清理

### 3. 等待策略
- 使用明确的等待条件
- 避免固定的等待时间
- 合理使用超时设置

### 4. 错误处理
- 捕获和记录测试错误
- 提供有意义的错误信息
- 使用 try-catch 处理异常情况

### 5. 性能考虑
- 合理设置并行度
- 避免不必要的浏览器操作
- 使用页面对象复用

## 故障排除

### 常见问题
1. **元素未找到**: 检查选择器是否正确
2. **超时错误**: 增加等待时间或检查网络状况
3. **认证失败**: 确认测试用户和密码
4. **环境问题**: 确认前后端服务正常运行

### 调试技巧
1. 使用 `--headed` 参数查看浏览器窗口
2. 使用 `--debug` 参数进行调试
3. 添加 `console.log` 输出调试信息
4. 使用 `page.screenshot()` 截图排查问题

## 扩展和维护

### 添加新测试
1. 在相应的模块文件中添加测试用例
2. 遵循现有的命名规范
3. 使用现有的工具类
4. 更新测试文档

### 维护测试
1. 定期更新测试数据
2. 根据UI变化更新选择器
3. 优化测试性能
4. 更新测试报告

---

**注意**: 运行测试前请确保系统环境配置正确，前后端服务正常运行。