/**
 * 后端单元测试全局配置
 * 提供测试环境初始化、数据库连接、Mock配置等功能
 */

const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// 设置中文语言环境
faker.locale = 'zh_CN';

// 创建测试结果目录
const testResultsDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// 全局测试配置
global.testConfig = {
  // 数据库配置
  database: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 3306,
    username: process.env.TEST_DB_USERNAME || 'test',
    password: process.env.TEST_DB_PASSWORD || 'test123',
    database: process.env.TEST_DB_NAME || 'party_management_test'
  },
  
  // Redis配置
  redis: {
    host: process.env.TEST_REDIS_HOST || 'localhost',
    port: process.env.TEST_REDIS_PORT || 6379,
    password: process.env.TEST_REDIS_PASSWORD || ''
  },
  
  // JWT配置
  jwt: {
    secret: 'test-jwt-secret-key',
    expiration: '1h'
  },
  
  // 测试超时时间
  timeout: 30000
};

// 全局测试数据存储
global.testData = {
  users: [],
  organizations: [],
  activities: [],
  fees: [],
  configs: [],
  logs: []
};

// 数据生成工具
global.dataGenerator = {
  // 生成随机字符串
  randomString: (length = 8) => {
    return faker.string.alphanumeric(length);
  },
  
  // 生成随机邮箱
  randomEmail: () => {
    return faker.internet.email();
  },
  
  // 生成随机手机号
  randomPhone: () => {
    return faker.phone.number('1##########');
  },
  
  // 生成用户数据
  generateUser: (overrides = {}) => {
    return {
      username: faker.internet.userName(),
      password: 'Test123!',
      email: faker.internet.email(),
      realName: faker.person.fullName(),
      phone: faker.phone.number('1##########'),
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      idCard: faker.string.numeric(18),
      address: faker.location.streetAddress(),
      joinDate: faker.date.past({ years: 5 }),
      memberType: faker.helpers.arrayElement(['PROBATIONARY', 'FORMAL']),
      position: faker.person.jobTitle(),
      education: faker.helpers.arrayElement(['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'DOCTOR']),
      politicalStatus: faker.helpers.arrayElement(['PARTY_MEMBER', 'PROBATIONARY_MEMBER', 'ACTIVIST']),
      status: 'ACTIVE',
      ...overrides
    };
  },
  
  // 生成组织数据
  generateOrganization: (overrides = {}) => {
    return {
      name: faker.company.name() + '党支部',
      code: faker.string.alphanumeric(8).toUpperCase(),
      type: faker.helpers.arrayElement(['PARTY_BRANCH', 'PARTY_COMMITTEE', 'PARTY_GROUP']),
      level: faker.helpers.arrayElement(['PRIMARY', 'SECONDARY', 'TERTIARY']),
      description: faker.lorem.paragraph(),
      address: faker.location.streetAddress(),
      contactPerson: faker.person.fullName(),
      contactPhone: faker.phone.number('1##########'),
      contactEmail: faker.internet.email(),
      establishDate: faker.date.past({ years: 10 }),
      status: 'ACTIVE',
      ...overrides
    };
  },
  
  // 生成活动数据
  generateActivity: (overrides = {}) => {
    return {
      title: faker.lorem.words(3),
      content: faker.lorem.paragraphs(2),
      type: faker.helpers.arrayElement(['STUDY', 'MEETING', 'VOLUNTEER', 'TRAINING']),
      startTime: faker.date.future(),
      endTime: faker.date.future(),
      location: faker.location.streetAddress(),
      maxParticipants: faker.number.int({ min: 10, max: 100 }),
      registrationDeadline: faker.date.future(),
      requirements: faker.lorem.sentence(),
      status: 'PUBLISHED',
      ...overrides
    };
  },
  
  // 生成党费标准数据
  generateFeeStandard: (overrides = {}) => {
    return {
      name: faker.lorem.words(2) + '党费标准',
      memberType: faker.helpers.arrayElement(['PROBATIONARY', 'FORMAL']),
      baseAmount: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
      calculationMethod: faker.helpers.arrayElement(['FIXED', 'PERCENTAGE']),
      percentage: faker.number.float({ min: 0.5, max: 3.0, precision: 0.1 }),
      minAmount: faker.number.float({ min: 5, max: 20, precision: 0.01 }),
      maxAmount: faker.number.float({ min: 100, max: 500, precision: 0.01 }),
      effectiveDate: faker.date.past(),
      expiryDate: faker.date.future(),
      description: faker.lorem.sentence(),
      status: 'ACTIVE',
      ...overrides
    };
  },
  
  // 生成党费缴费记录数据
  generateFeePayment: (overrides = {}) => {
    return {
      amount: faker.number.float({ min: 10, max: 200, precision: 0.01 }),
      paymentMethod: faker.helpers.arrayElement(['CASH', 'BANK_TRANSFER', 'ALIPAY', 'WECHAT']),
      paymentDate: faker.date.recent(),
      period: faker.date.recent().toISOString().substring(0, 7), // YYYY-MM格式
      remark: faker.lorem.sentence(),
      status: 'PAID',
      ...overrides
    };
  },
  
  // 生成系统配置数据
  generateSystemConfig: (overrides = {}) => {
    return {
      configKey: faker.string.alphanumeric(10).toLowerCase(),
      configValue: faker.lorem.word(),
      configType: faker.helpers.arrayElement(['STRING', 'NUMBER', 'BOOLEAN', 'JSON']),
      category: faker.helpers.arrayElement(['SYSTEM', 'BUSINESS', 'SECURITY']),
      description: faker.lorem.sentence(),
      isSystem: false,
      ...overrides
    };
  }
};

// Mock工具
global.mockUtils = {
  // Mock HTTP请求
  mockHttpRequest: (data = {}) => {
    return {
      getHeader: jest.fn().mockReturnValue('application/json'),
      getParameter: jest.fn().mockImplementation(key => data[key]),
      getAttribute: jest.fn().mockImplementation(key => data[key]),
      getRemoteAddr: jest.fn().mockReturnValue('127.0.0.1'),
      getUserAgent: jest.fn().mockReturnValue('Test-Agent'),
      ...data
    };
  },
  
  // Mock HTTP响应
  mockHttpResponse: () => {
    return {
      setStatus: jest.fn(),
      setHeader: jest.fn(),
      getWriter: jest.fn().mockReturnValue({
        write: jest.fn(),
        flush: jest.fn()
      })
    };
  },
  
  // Mock 数据库连接
  mockDatabaseConnection: () => {
    return {
      createStatement: jest.fn().mockReturnValue({
        executeQuery: jest.fn(),
        executeUpdate: jest.fn(),
        close: jest.fn()
      }),
      prepareStatement: jest.fn().mockReturnValue({
        setString: jest.fn(),
        setInt: jest.fn(),
        setLong: jest.fn(),
        setDouble: jest.fn(),
        setBoolean: jest.fn(),
        setTimestamp: jest.fn(),
        executeQuery: jest.fn(),
        executeUpdate: jest.fn(),
        close: jest.fn()
      }),
      close: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn()
    };
  },
  
  // Mock Redis连接
  mockRedisConnection: () => {
    const storage = new Map();
    return {
      set: jest.fn().mockImplementation((key, value) => {
        storage.set(key, value);
        return Promise.resolve('OK');
      }),
      get: jest.fn().mockImplementation(key => {
        return Promise.resolve(storage.get(key));
      }),
      del: jest.fn().mockImplementation(key => {
        const existed = storage.has(key);
        storage.delete(key);
        return Promise.resolve(existed ? 1 : 0);
      }),
      exists: jest.fn().mockImplementation(key => {
        return Promise.resolve(storage.has(key) ? 1 : 0);
      }),
      expire: jest.fn().mockResolvedValue(1),
      ttl: jest.fn().mockResolvedValue(-1),
      flushall: jest.fn().mockImplementation(() => {
        storage.clear();
        return Promise.resolve('OK');
      })
    };
  }
};

// 断言工具
global.assertUtils = {
  // 断言对象结构
  expectObjectStructure: (obj, expectedKeys) => {
    expectedKeys.forEach(key => {
      expect(obj).toHaveProperty(key);
    });
  },
  
  // 断言数组不为空
  expectNonEmptyArray: (arr) => {
    expect(arr).toBeInstanceOf(Array);
    expect(arr.length).toBeGreaterThan(0);
  },
  
  // 断言分页结构
  expectPaginationStructure: (data) => {
    expect(data).toHaveProperty('list');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('pageSize');
    expect(data).toHaveProperty('totalPages');
    expect(data.list).toBeInstanceOf(Array);
    expect(typeof data.total).toBe('number');
    expect(typeof data.page).toBe('number');
    expect(typeof data.pageSize).toBe('number');
    expect(typeof data.totalPages).toBe('number');
  },
  
  // 断言日期格式
  expectValidDate: (dateStr) => {
    const date = new Date(dateStr);
    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).not.toBeNaN();
  },
  
  // 断言邮箱格式
  expectValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(email)).toBe(true);
  },
  
  // 断言手机号格式
  expectValidPhone: (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    expect(phoneRegex.test(phone)).toBe(true);
  }
};

// 清理工具
global.cleanupUtils = {
  // 清理测试数据
  cleanup: async () => {
    // 清理全局测试数据
    global.testData.users = [];
    global.testData.organizations = [];
    global.testData.activities = [];
    global.testData.fees = [];
    global.testData.configs = [];
    global.testData.logs = [];
    
    console.log('测试数据已清理');
  },
  
  // 清理测试文件
  cleanupFiles: () => {
    const testResultsDir = path.join(__dirname, 'test-results');
    if (fs.existsSync(testResultsDir)) {
      fs.rmSync(testResultsDir, { recursive: true, force: true });
      fs.mkdirSync(testResultsDir, { recursive: true });
    }
  }
};

// Jest钩子
beforeAll(async () => {
  console.log('开始后端单元测试...');
  
  // 设置测试超时
  jest.setTimeout(global.testConfig.timeout);
  
  // 创建测试结果目录
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }
});

afterAll(async () => {
  console.log('后端单元测试完成');
  
  // 清理测试数据
  await global.cleanupUtils.cleanup();
});

beforeEach(() => {
  // 重置所有Mock
  jest.clearAllMocks();
});

afterEach(() => {
  // 清理每个测试后的状态
  jest.restoreAllMocks();
});

// 全局错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});