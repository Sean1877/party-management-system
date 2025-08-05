# 党建管理系统

一个基于Spring Boot + Vue.js的现代化党建组织管理平台，旨在提高党建工作的数字化管理水平。

## 📋 项目概述

党建管理系统是一个集组织架构管理、党员信息管理、活动组织于一体的综合性管理平台，采用前后端分离架构，提供完整的党建工作数字化解决方案。

## ✨ 功能特性

### 🏢 组织管理
- 党组织架构管理(党委、党总支、党支部)
- 组织层级关系维护
- 组织信息统计分析
- 组织树形结构展示
- 组织状态管理(激活/停用)

### 👥 用户管理
- 用户基本信息管理
- 角色权限分配
- 用户状态控制
- 批量用户操作
- 密码管理和重置

### 🎯 活动管理
- 党建活动创建和管理
- 在线报名功能
- 活动签到管理
- 活动统计分析
- 活动类型分类

### 🔐 权限控制
- 基于角色的访问控制(RBAC)
- JWT Token认证
- 路由级权限验证
- API接口权限控制

### 📊 数据统计
- 组织数据统计
- 用户活跃度分析
- 活动参与统计
- 可视化图表展示

### 👤 个人中心
- 个人信息管理
- 密码修改
- 活动参与记录
- 个人数据统计

## 🛠 技术栈

### 后端技术
- **框架**: Spring Boot 2.7.14
- **安全**: Spring Security + JWT
- **数据访问**: Spring Data JPA
- **数据库**: H2 Database (开发环境)
- **构建工具**: Maven
- **API文档**: OpenAPI 3.0 (Swagger)

### 前端技术
- **框架**: Vue.js 3
- **构建工具**: Vite
- **UI组件**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP客户端**: Axios

### 开发工具
- **版本控制**: Git
- **代码编辑器**: VS Code / IntelliJ IDEA
- **包管理**: npm / Maven

## 🚀 快速开始

### 环境要求
- Node.js 16+
- Java 11+
- Maven 3.6+

### 后端启动

1. 进入后端目录
```bash
cd backend
```

2. 配置数据库连接（修改 `src/main/resources/application.yml`）

3. 启动后端服务
```bash
mvn spring-boot:run
```

后端服务将在 http://localhost:8080 启动

### 前端启动

1. 进入前端目录
```bash
cd frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

前端服务将在 http://localhost:3000 启动

## 🌐 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:3000 | Vue.js应用 |
| 后端API | http://localhost:8080 | Spring Boot API |
| API文档 | http://localhost:8080/swagger-ui.html | Swagger文档 |
| H2控制台 | http://localhost:8080/h2-console | 数据库管理 |

## 👤 默认账户

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 管理员 | admin | admin123 | 系统管理员账户 |

## 📁 项目结构

```
party-management-system/
├── backend/                 # 后端Spring Boot项目
│   ├── src/main/java/
│   │   └── com/party/
│   │       ├── controller/  # 控制器层
│   │       ├── service/     # 服务层
│   │       ├── repository/  # 数据访问层
│   │       ├── entity/      # 实体类
│   │       ├── config/      # 配置类
│   │       ├── security/    # 安全配置
│   │       └── util/        # 工具类
│   ├── src/main/resources/  # 资源文件
│   └── pom.xml             # Maven配置
├── frontend/               # 前端Vue.js项目
│   ├── src/
│   │   ├── api/            # API接口
│   │   ├── components/     # 公共组件
│   │   ├── layout/         # 布局组件
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # 状态管理
│   │   ├── styles/         # 样式文件
│   │   ├── utils/          # 工具函数
│   │   └── views/          # 页面组件
│   ├── public/             # 静态资源
│   ├── package.json        # npm配置
│   └── vite.config.js      # Vite配置
├── docs/                   # 项目文档
├── .gitignore             # Git忽略文件
└── README.md              # 项目说明
```

## 🔧 开发指南

### 代码规范
- 后端遵循阿里巴巴Java开发手册
- 前端遵循Vue.js官方风格指南
- 使用ESLint和Prettier进行代码格式化

### 提交规范
使用Conventional Commits规范：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### API接口
所有API接口遵循RESTful设计规范：
- GET: 查询数据
- POST: 创建数据
- PUT: 更新数据
- DELETE: 删除数据

## 🧪 测试

### 后端测试
```bash
cd backend
mvn test
```

### 前端测试
```bash
cd frontend
npm run test
```

## 📦 构建部署

### 前端构建
```bash
cd frontend
npm run build
```

### 后端打包
```bash
cd backend
mvn clean package
```

### Docker部署
```bash
# 构建镜像
docker build -t party-management-system .

# 运行容器
docker run -p 8080:8080 party-management-system
```

## 📷 项目截图

### 登录页面
![登录页面](docs/images/login.png)

### 工作台
![工作台](docs/images/dashboard.png)

### 用户管理
![用户管理](docs/images/user-management.png)

### 组织管理
![组织管理](docs/images/organization-management.png)

### 活动管理
![活动管理](docs/images/activity-management.png)

## 📋 开发计划

- [x] 基础架构搭建
- [x] 用户认证系统
- [x] 用户管理模块
- [x] 组织管理模块
- [x] 活动管理模块
- [x] 数据统计功能
- [ ] 消息通知系统
- [ ] 移动端适配
- [ ] 数据导入导出
- [ ] 系统监控

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/sean1877/party-management-system/issues)
- 邮箱: your-email@example.com

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

---

⭐ 如果这个项目对你有帮助，请给它一个星标！