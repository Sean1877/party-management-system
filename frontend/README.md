# 党建管理系统前端

## 项目概述

党建管理系统前端是一个基于 Vue 3 + Element Plus 的现代化 Web 应用程序，用于管理党组织、党员信息、活动管理、费用统计等功能。

## 技术栈

- **前端框架**: Vue 3
- **UI 组件库**: Element Plus
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP 客户端**: Axios
- **测试框架**: Vitest + Vue Test Utils
- **样式预处理**: Sass
- **代码规范**: ESLint + Prettier

## 目录结构

```
frontend/
├── public/                 # 静态资源文件
│   ├── favicon.ico         # 网站图标
│   └── logo.png           # 网站Logo
├── src/                   # 源代码目录
│   ├── api/              # API 接口
│   │   ├── auth.js       # 认证相关接口
│   │   ├── user.js       # 用户管理接口
│   │   ├── activity.js   # 活动管理接口
│   │   ├── organization.js # 组织管理接口
│   │   ├── fee.js        # 费用管理接口
│   │   ├── statistics.js # 统计分析接口
│   │   └── system-config.js # 系统配置接口
│   ├── assets/           # 资源文件
│   │   ├── images/       # 图片资源
│   │   └── styles/       # 样式文件
│   ├── components/       # 公共组件
│   │   ├── common/       # 通用组件
│   │   └── layout/       # 布局组件
│   ├── layout/           # 布局相关
│   │   ├── index.vue     # 主布局组件
│   │   └── components/   # 布局子组件
│   │       ├── Navbar.vue # 导航栏
│   │       ├── Sidebar.vue # 侧边栏
│   │       └── SidebarItem.vue # 侧边栏项目
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── stores/           # 状态管理
│   │   ├── auth.js       # 认证状态
│   │   ├── user.js       # 用户状态
│   │   └── app.js        # 应用状态
│   ├── styles/           # 全局样式
│   │   ├── main.scss     # 主样式文件
│   │   ├── variables.scss # 样式变量
│   │   └── mixins.scss   # 样式混入
│   ├── utils/            # 工具函数
│   │   ├── auth.js       # 认证工具
│   │   ├── request.js    # 请求工具
│   │   ├── validation.js # 验证工具
│   │   └── format.js     # 格式化工具
│   ├── views/            # 页面组件
│   │   ├── dashboard/    # 仪表板
│   │   │   └── index.vue
│   │   ├── user/         # 用户管理
│   │   │   └── index.vue
│   │   ├── activity/     # 活动管理
│   │   │   ├── index.vue
│   │   │   └── components/ # 活动组件
│   │   │       ├── CheckInDialog.vue
│   │   │       └── ParticipantList.vue
│   │   ├── organization/ # 组织管理
│   │   │   ├── index.vue
│   │   │   └── components/ # 组织组件
│   │   │       └── OrganizationForm.vue
│   │   ├── fee/          # 费用管理
│   │   │   └── index.vue
│   │   ├── statistics/   # 统计分析
│   │   │   └── index.vue
│   │   ├── profile/      # 个人中心
│   │   │   └── index.vue
│   │   └── system/       # 系统设置
│   │       ├── settings/ # 系统配置
│   │       │   └── index.vue
│   │       └── operation-log/ # 操作日志
│   │           └── index.vue
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── tests/               # 测试文件
│   ├── mocks/           # 测试模拟
│   │   └── setup.js     # 测试设置
│   ├── unit/            # 单元测试
│   │   ├── stores/      # 状态管理测试
│   │   ├── utils/       # 工具函数测试
│   │   └── components/  # 组件测试
│   ├── views/           # 页面测试
│   │   ├── user/        # 用户管理测试
│   │   │   └── UserManagement.test.js
│   │   ├── system/      # 系统设置测试
│   │   │   ├── SystemSettings.test.js
│   │   │   └── OperationLog.test.js
│   │   ├── profile/     # 个人中心测试
│   │   │   └── Profile.test.js
│   │   ├── statistics/  # 统计分析测试
│   │   │   └── Statistics.test.js
│   │   └── fee/         # 费用管理测试
│   │       └── FeeManagement.test.js
│   └── config.test.js   # 配置验证测试
├── .env                 # 环境变量
├── .env.development     # 开发环境变量
├── .env.production      # 生产环境变量
├── .eslintrc.js         # ESLint 配置
├── .prettierrc.js       # Prettier 配置
├── vite.config.js       # Vite 配置
├── vitest.config.js     # Vitest 配置
├── package.json         # 项目依赖
├── README.md           # 项目说明
└── .gitignore          # Git 忽略文件
```

## 主要功能模块

### 1. 用户管理
- 用户信息管理
- 角色权限管理
- 用户状态管理
- 批量操作功能

### 2. 活动管理
- 活动创建和编辑
- 活动报名管理
- 签到功能
- 参与者管理

### 3. 组织管理
- 党组织结构管理
- 组织信息维护
- 组织成员管理

### 4. 费用管理
- 党费标准设置
- 费用缴纳记录
- 费用统计分析
- 缴费提醒功能

### 5. 统计分析
- 数据可视化展示
- 报表生成
- 趋势分析
- 导出功能

### 6. 系统设置
- 系统配置管理
- 操作日志记录
- 权限管理
- 数据备份恢复

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试UI界面
npm run test:ui

# 监听模式运行测试
npm run test:watch
```

### 代码规范
```bash
# 检查代码规范
npm run lint

# 格式化代码
npm run format
```

## 测试策略

### 单元测试
- 组件测试：使用 Vue Test Utils 测试组件渲染和交互
- 状态管理测试：测试 Pinia store 的状态变化和 actions
- 工具函数测试：测试纯函数的逻辑正确性
- API 接口测试：模拟 HTTP 请求和响应

### 测试覆盖率
- 整体覆盖率要求：70%
- 分支覆盖率：70%
- 函数覆盖率：70%
- 行覆盖率：70%
- 语句覆盖率：70%

### 测试文件组织
- `tests/views/`：页面组件测试
- `tests/unit/`：单元测试
- `tests/mocks/`：测试模拟数据

## 部署说明

### 构建产物
- `dist/`：构建后的静态文件
- `coverage/`：测试覆盖率报告

### 环境配置
- 开发环境：`.env.development`
- 生产环境：`.env.production`
- 测试环境：`.env.test`

## 路径别名

为方便导入，配置了以下路径别名：

- `@/`：`src/`
- `@api/`：`src/api/`
- `@components/`：`src/components/`
- `@views/`：`src/views/`
- `@stores/`：`src/stores/`
- `@utils/`：`src/utils/`
- `@layout/`：`src/layout/`
- `@styles/`：`src/styles/`

## 代码规范

### 命名规范
- 组件文件：PascalCase（如 `UserManagement.vue`）
- 工具函数：camelCase（如 `formatDate`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- CSS 类名：kebab-case（如 `user-card`）

### 代码风格
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 Vue 3 组合式 API 规范
- 使用 TypeScript 进行类型检查
- 编写详细的 JSDoc 注释

## 许可证

本项目仅供内部使用，未经授权不得外传。