# 后端单元测试架构

## 测试目录结构

```
src/test/java/com/party/
├── common/                           # 测试公共组件
│   ├── AbstractIntegrationTest.java  # 抽象集成测试基类
│   ├── TestDataFactory.java          # 测试数据工厂
│   └── TestConfig.java               # 测试配置类
├── controller/                       # 控制器层测试
│   ├── ActivityControllerTest.java
│   └── UserControllerTest.java
├── service/                          # 服务层测试
│   ├── ActivityServiceTest.java
│   ├── UserServiceTest.java
│   └── FeeManagementServiceTest.java
├── integration/                      # 集成测试
│   └── (预留用于复杂集成测试)
├── repository/                       # 数据访问层测试
│   └── (预留用于Repository测试)
└── entity/                           # 实体测试
    └── (预留用于实体测试)
```

## 测试分层说明

### 1. common/ - 测试公共组件
- **AbstractIntegrationTest.java**: 抽象集成测试基类，提供通用的测试设置和清理逻辑
- **TestDataFactory.java**: 测试数据工厂，统一创建测试数据
- **TestConfig.java**: 测试配置类，定义测试专用的Bean配置

### 2. controller/ - 控制器层测试
- 使用Spring MVC Test框架进行HTTP层测试
- 测试API端点的请求/响应、权限控制、参数验证等
- 模拟HTTP请求并验证响应状态和内容

### 3. service/ - 服务层测试
- 使用Mockito进行单元测试
- 测试业务逻辑、数据处理、事务管理等
- 模拟Repository层依赖，专注于业务逻辑测试

### 4. integration/ - 集成测试
- 测试多个组件之间的交互
- 验证数据流和业务流程的正确性
- 使用真实的数据库连接（H2内存数据库）

### 5. repository/ - 数据访问层测试
- 测试数据库查询、数据持久化等
- 验证自定义查询方法的正确性
- 使用TestEntityManager或真实数据库连接

### 6. entity/ - 实体测试
- 测试实体类的属性、方法、验证规则等
- 验证实体映射和约束条件
- 测试实体间的关联关系

## 测试最佳实践

### 1. 测试命名规范
- **测试类**: `{ClassName}Test.java`
- **测试方法**: `test{Scenario}{ExpectedResult}()`
- **集成测试**: `{Module}IntegrationTest.java`

### 2. 测试数据管理
- 使用TestDataFactory统一创建测试数据
- 每个测试方法使用独立的测试数据
- 测试完成后自动清理测试数据

### 3. 测试隔离性
- 每个测试方法独立运行，不依赖其他测试的状态
- 使用@Transactional注解确保测试数据不污染生产数据库
- 测试前后自动清理相关数据

### 4. Mock使用原则
- Service层测试: Mock外部依赖（Repository、HTTP客户端等）
- Controller层测试: Mock Service层，测试HTTP层面
- 集成测试: 最小化Mock，测试真实交互

### 5. 断言最佳实践
- 使用明确的断言信息
- 验证关键业务逻辑的正确性
- 测试边界条件和异常情况

## 测试运行

### 运行所有测试
```bash
mvn test
```

### 运行特定测试类
```bash
mvn test -Dtest=ActivityServiceTest
```

### 运行特定测试方法
```bash
mvn test -Dtest=ActivityServiceTest#testCreateActivity
```

### 运行分层测试
```bash
# 运行所有Service层测试
mvn test -Dtest="**/*ServiceTest"

# 运行所有Controller层测试
mvn test -Dtest="**/*ControllerTest"
```

## 测试覆盖率目标

- **行覆盖率**: ≥ 80%
- **分支覆盖率**: ≥ 70%
- **核心业务逻辑**: ≥ 90%

## 测试环境配置

### 测试数据库
- 使用H2内存数据库
- 自动创建和销毁数据库结构
- 测试数据隔离，避免相互影响

### 测试配置
- 使用application-test.yml配置文件
- 测试专用的数据库连接和参数
- 禁用某些生产环境特性（如缓存、异步处理等）

## 合并说明

### 合并来源
1. **unit-tests/backend/**: 包含FeePayment、FeeStandard、OperationLog等相关测试
2. **backend/test/**: 包含Activity、User等相关测试和基础架构

### 合并策略
- 保留两个测试目录中的独特测试文件
- 统一测试架构和命名规范
- 消除重复的测试代码
- 优化测试数据管理

### 合并后的优势
- 统一的测试架构和最佳实践
- 更好的测试代码组织和维护性
- 减少重复代码，提高测试效率
- 完整的测试覆盖，包含所有核心模块

## 后续优化建议

1. **添加更多测试覆盖**: 为Organization、Role、Permission等模块添加测试
2. **性能测试**: 添加关键接口的性能测试
3. **契约测试**: 添加API契约测试确保接口兼容性
4. **测试报告**: 集成测试覆盖率报告和测试结果分析
5. **CI/CD集成**: 将测试集成到持续集成流程中

## 注意事项

- 测试代码的质量和生产代码同等重要
- 定期审查和重构测试代码
- 保持测试的独立性和可重复性
- 及时更新测试以适应业务逻辑变化