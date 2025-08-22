# 党建管理系统后端

## 项目结构

```
backend/
├── src/main/java/com/party/
│   ├── common/                    # 公共模块
│   │   ├── config/               # 配置类
│   │   │   └── SystemConfig.java  # 系统配置常量
│   │   ├── controller/          # 基础控制器
│   │   │   └── BaseController.java
│   │   ├── enums/               # 枚举类
│   │   │   ├── ActivityType.java
│   │   │   ├── ActivityStatus.java
│   │   │   └── PartyStatus.java
│   │   ├── exception/           # 异常处理
│   │   │   ├── BusinessException.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceAlreadyExistsException.java
│   │   │   └── ResourceNotFoundException.java
│   │   └── response/            # 响应工具
│   │       └── ResponseUtils.java
│   ├── config/                  # 配置模块
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── MockDataInitializer.java
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java
│   ├── controller/              # 控制器层
│   │   ├── ActivityController.java
│   │   ├── ActivityParticipantController.java
│   │   ├── AuthController.java
│   │   ├── FeeManagementController.java
│   │   ├── OperationLogController.java
│   │   ├── OrganizationController.java
│   │   ├── PermissionController.java
│   │   ├── SystemConfigController.java
│   │   └── UserController.java
│   ├── dto/                     # 数据传输对象
│   ├── entity/                  # 实体类
│   ├── interceptor/             # 拦截器
│   ├── repository/              # 数据访问层
│   ├── service/                 # 服务层
│   └── utils/                   # 工具类
└── src/test/java/com/party/     # 测试代码
```

## 主要改进

### 1. 代码结构优化
- 创建了 `common` 模块，包含公共组件
- 统一了响应格式和异常处理
- 引入了枚举类来管理状态码

### 2. 重复代码清理
- 移除了实体类中的重复状态转换方法
- 使用枚举替代硬编码的状态值
- 统一了控制器响应格式

### 3. 异常处理优化
- 引入了自定义异常类
- 实现了全局异常处理器
- 提供了统一的错误响应格式

### 4. 配置管理
- 创建了系统配置常量类
- 集中管理硬编码值
- 便于维护和修改

## 新增功能

### 响应工具类 (ResponseUtils)
- 统一的响应格式
- 支持成功/错误响应
- 提供常见HTTP状态码方法

### 枚举类
- `ActivityType`: 活动类型枚举
- `ActivityStatus`: 活动状态枚举  
- `PartyStatus`: 党员状态枚举

### 异常处理
- `BusinessException`: 业务异常基类
- `ResourceNotFoundException`: 资源不存在异常
- `ResourceAlreadyExistsException`: 资源已存在异常
- `GlobalExceptionHandler`: 全局异常处理器

### 基础控制器
- `BaseController`: 提供通用的响应方法
- 所有控制器建议继承此类

## 使用示例

### 响应格式
```java
// 成功响应
return success(data);
return success("操作成功", data);

// 错误响应
return error("操作失败");
return badRequest("参数错误");
return notFound("资源不存在");
```

### 异常使用
```java
// 抛出业务异常
throw new BusinessException("业务逻辑错误");

// 抛出资源不存在异常
throw new ResourceNotFoundException("用户", userId);

// 抛出资源已存在异常
throw new ResourceAlreadyExistsException("用户名", username);
```

### 枚举使用
```java
// 获取状态描述
String statusText = ActivityStatus.getDescriptionByCode(status);
String typeText = ActivityType.getDescriptionByCode(type);
String partyStatusText = PartyStatus.getDescriptionByCode(partyStatus);
```

## 配置说明

系统配置集中在 `SystemConfig` 类中，包括：
- 默认密码
- 分页设置
- CORS配置
- JWT配置
- 文件上传配置
- 活动相关配置
- 用户相关配置

## 测试

运行测试：
```bash
mvn test
```

清理和编译：
```bash
mvn clean compile
```