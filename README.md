# 党建管理系统

一个基于Spring Boot和Vue.js的党建活动管理平台，用于管理党组织活动、成员信息和相关数据统计。

## 项目结构

```
party-management-system/
├── backend/          # Spring Boot后端
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
├── frontend/         # Vue.js前端
│   ├── src/
│   │   ├── api/      # API接口
│   │   ├── components/ # 组件
│   │   ├── views/    # 页面
│   │   ├── stores/   # 状态管理
│   │   └── utils/    # 工具函数
│   ├── package.json
│   └── vite.config.js
└── docs/            # 文档
```

## 技术栈

### 后端
- Spring Boot 2.7.14
- Spring Security
- Spring Data JPA
- MySQL
- Maven
- Swagger/OpenAPI 3

### 前端
- Vue.js 3
- Element Plus
- Vite
- Pinia (状态管理)
- Vue Router
- Axios

## 功能特性

- 🔐 用户认证与授权
- 👥 用户管理
- 🏢 组织管理
- 📅 活动管理
- 📊 数据统计
- 🎂 生日提醒
- 🎉 党龄纪念
- 📱 响应式设计

## 快速开始

### 环境要求

- Java 8+
- Node.js 16+
- MySQL 5.7+
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

## API文档

启动后端服务后，可以访问 Swagger API 文档：
http://localhost:8080/swagger-ui/index.html

## 默认账户

- 用户名：admin
- 密码：123456

## 项目截图

（待添加）

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发者。