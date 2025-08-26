// API测试全局设置文件
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 全局配置
global.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';
global.TEST_TIMEOUT = parseInt(process.env.TEST_TIMEOUT) || 30000;
global.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
global.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';
global.TEST_USER_USERNAME = process.env.TEST_USER_USERNAME || 'member001';
global.TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || '123456';

// 创建测试结果目录
const testResultsDir = path.join(__dirname, 'test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// 全局axios配置
axios.defaults.baseURL = 'http://localhost:8080/api';
axios.defaults.timeout = global.TEST_TIMEOUT;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 全局变量存储
global.testData = {
  tokens: {},
  users: {},
  organizations: {},
  activities: {},
  fees: {}
};

// 认证工具函数
global.authUtils = {
  // 管理员登录
  async loginAsAdmin() {
    try {
      const response = await axios.post('/auth/login', {
        username: global.ADMIN_USERNAME,
        password: global.ADMIN_PASSWORD
      });
      
      const token = response.data.token;
      global.testData.tokens.admin = token;
      return token;
    } catch (error) {
      console.error('管理员登录失败:', error.message);
      throw error;
    }
  },
  
  // 普通用户登录
  async loginAsUser() {
    try {
      const response = await axios.post('/auth/login', {
        username: global.TEST_USER_USERNAME,
        password: global.TEST_USER_PASSWORD
      });
      
      const token = response.data.token;
      global.testData.tokens.user = token;
      return token;
    } catch (error) {
      console.error('用户登录失败:', error.message);
      throw error;
    }
  },
  
  // 获取认证头
  getAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  },
  
  // 获取管理员认证头
  async getAdminAuthHeaders() {
    if (!global.testData.tokens.admin) {
      await this.loginAsAdmin();
    }
    return this.getAuthHeaders(global.testData.tokens.admin);
  },
  
  // 获取用户认证头
  async getUserAuthHeaders() {
    if (!global.testData.tokens.user) {
      await this.loginAsUser();
    }
    return this.getAuthHeaders(global.testData.tokens.user);
  }
};

// 数据工具函数
global.dataUtils = {
  // 生成随机字符串
  randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  
  // 生成随机邮箱
  randomEmail() {
    return `test${this.randomString(6)}@example.com`;
  },
  
  // 生成随机手机号
  randomPhone() {
    return `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
  },
  
  // 生成测试用户数据
  generateUserData() {
    const id = this.randomString(6);
    return {
      username: `testuser${id}`,
      password: 'test123',
      email: this.randomEmail(),
      phone: this.randomPhone(),
      realName: `测试用户${id}`,
      idCard: `110101199001010${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      memberType: 'regular',
      joinDate: new Date().toISOString().split('T')[0]
    };
  },
  
  // 生成测试组织数据
  generateOrganizationData() {
    const id = this.randomString(6);
    return {
      name: `测试组织${id}`,
      type: 'branch',
      description: `这是一个测试组织${id}`,
      establishDate: new Date().toISOString().split('T')[0],
      contactPerson: `联系人${id}`,
      contactPhone: this.randomPhone()
    };
  },
  
  // 生成测试活动数据
  generateActivityData() {
    const id = this.randomString(6);
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      title: `测试活动${id}`,
      description: `这是一个测试活动${id}`,
      type: 'meeting',
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      location: `测试地点${id}`,
      maxParticipants: 50,
      status: 'upcoming'
    };
  },
  
  // 生成测试党费标准数据
  generateFeeStandardData() {
    const id = this.randomString(6);
    return {
      name: `测试党费标准${id}`,
      incomeMin: 3000,
      incomeMax: 5000,
      feeRate: 0.005,
      fixedAmount: null,
      description: `这是一个测试党费标准${id}`,
      effectiveDate: new Date().toISOString().split('T')[0]
    };
  }
};

// API工具函数
global.apiUtils = {
  // 发送GET请求
  async get(url, headers = {}) {
    try {
      const response = await axios.get(url, { headers });
      return response;
    } catch (error) {
      return error.response || error;
    }
  },
  
  // 发送POST请求
  async post(url, data = {}, headers = {}) {
    try {
      const response = await axios.post(url, data, { headers });
      return response;
    } catch (error) {
      return error.response || error;
    }
  },
  
  // 发送PUT请求
  async put(url, data = {}, headers = {}) {
    try {
      const response = await axios.put(url, data, { headers });
      return response;
    } catch (error) {
      return error.response || error;
    }
  },
  
  // 发送DELETE请求
  async delete(url, headers = {}) {
    try {
      const response = await axios.delete(url, { headers });
      return response;
    } catch (error) {
      return error.response || error;
    }
  },
  
  // 等待API响应
  async waitForResponse(url, expectedStatus = 200, maxAttempts = 10, delay = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await this.get(url);
        if (response.status === expectedStatus) {
          return response;
        }
      } catch (error) {
        // 继续尝试
      }
      
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error(`API响应超时: ${url}`);
  }
};

// 断言工具函数
global.assertUtils = {
  // 检查响应状态
  expectStatus(response, expectedStatus) {
    expect(response.status).toBe(expectedStatus);
  },
  
  // 检查响应数据结构
  expectResponseStructure(response, structure) {
    expect(response.data).toMatchObject(structure);
  },
  
  // 检查成功响应
  expectSuccess(response, data = null) {
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    if (data) {
      expect(response.data.data).toMatchObject(data);
    }
  },
  
  // 检查错误响应
  expectError(response, expectedStatus, message = null) {
    expect(response.status).toBe(expectedStatus);
    expect(response.data.success).toBe(false);
    if (message) {
      expect(response.data.message).toContain(message);
    }
  },
  
  // 检查分页响应
  expectPaginatedResponse(response, pageSize = null) {
    this.expectSuccess(response);
    expect(response.data.data).toHaveProperty('list');
    expect(response.data.data).toHaveProperty('total');
    expect(response.data.data).toHaveProperty('page');
    expect(response.data.data).toHaveProperty('pageSize');
    
    if (pageSize) {
      expect(response.data.data.pageSize).toBe(pageSize);
    }
  }
};

// 清理工具函数
global.cleanupUtils = {
  // 清理测试数据
  async cleanup() {
    console.log('开始清理测试数据...');
    
    try {
      // 清理测试用户
      await this.cleanupUsers();
      
      // 清理测试组织
      await this.cleanupOrganizations();
      
      // 清理测试活动
      await this.cleanupActivities();
      
      // 清理测试党费数据
      await this.cleanupFees();
      
      console.log('测试数据清理完成');
    } catch (error) {
      console.warn('清理测试数据失败:', error.message);
    }
  },
  
  async cleanupUsers() {
    const headers = await global.authUtils.getAdminAuthHeaders();
    const testUsers = Object.values(global.testData.users);
    
    for (const user of testUsers) {
      try {
        await global.apiUtils.delete(`/users/${user.id}`, headers);
      } catch (error) {
        console.warn(`删除测试用户失败: ${user.username}`, error.message);
      }
    }
  },
  
  async cleanupOrganizations() {
    const headers = await global.authUtils.getAdminAuthHeaders();
    const testOrgs = Object.values(global.testData.organizations);
    
    for (const org of testOrgs) {
      try {
        await global.apiUtils.delete(`/organizations/${org.id}`, headers);
      } catch (error) {
        console.warn(`删除测试组织失败: ${org.name}`, error.message);
      }
    }
  },
  
  async cleanupActivities() {
    const headers = await global.authUtils.getAdminAuthHeaders();
    const testActivities = Object.values(global.testData.activities);
    
    for (const activity of testActivities) {
      try {
        await global.apiUtils.delete(`/activities/${activity.id}`, headers);
      } catch (error) {
        console.warn(`删除测试活动失败: ${activity.title}`, error.message);
      }
    }
  },
  
  async cleanupFees() {
    const headers = await global.authUtils.getAdminAuthHeaders();
    const testFees = Object.values(global.testData.fees);
    
    for (const fee of testFees) {
      try {
        await global.apiUtils.delete(`/fees/standards/${fee.id}`, headers);
      } catch (error) {
        console.warn(`删除测试党费标准失败: ${fee.name}`, error.message);
      }
    }
  }
};

// Jest钩子
beforeAll(async () => {
  console.log('开始API测试初始化...');
  
  // 等待API服务启动 - 使用登录端点验证服务可用性
  try {
    // 尝试访问登录端点来验证API服务可用性
    await global.apiUtils.waitForResponse('/auth/login', 405, 15, 2000); // 405 Method Not Allowed 说明端点存在
    console.log('API服务已启动');
  } catch (error) {
    console.warn('使用登录端点检查API服务失败，尝试直接登录...');
    // 如果健康检查失败，我们仍然继续，因为服务可能运行正常但健康检查端点不可用
  }
  
  // 预先登录获取token
  try {
    await global.authUtils.loginAsAdmin();
    console.log('管理员登录成功');
  } catch (error) {
    console.warn('管理员登录失败:', error.message);
  }
});

afterAll(async () => {
  console.log('开始API测试清理...');
  
  // 清理测试数据
  await global.cleanupUtils.cleanup();
  
  console.log('API测试清理完成');
});

// 每个测试前重置axios拦截器
beforeEach(() => {
  // 清除之前的拦截器
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();
});

// 增加Jest超时时间
jest.setTimeout(global.TEST_TIMEOUT);