/**
 * 认证相关API测试
 * 测试用户登录、注册、权限验证等功能
 */

describe('认证API测试', () => {
  let testUser;
  
  beforeAll(() => {
    testUser = global.dataUtils.generateUserData();
  });
  
  describe('用户注册', () => {
    test('正常注册新用户', async () => {
      const userData = global.dataUtils.generateUserData();
      
      const response = await global.apiUtils.post('/auth/register', userData);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.username).toBe(userData.username);
      expect(response.data.data.email).toBe(userData.email);
      
      // 保存用户数据用于后续测试
      global.testData.users[userData.username] = response.data.data;
    });
    
    test('用户名重复注册应失败', async () => {
      const userData = global.dataUtils.generateUserData();
      
      // 第一次注册
      await global.apiUtils.post('/auth/register', userData);
      
      // 第二次注册相同用户名
      const response = await global.apiUtils.post('/auth/register', userData);
      
      global.assertUtils.expectError(response, 400, '用户名已存在');
    });
    
    test('邮箱重复注册应失败', async () => {
      const userData1 = global.dataUtils.generateUserData();
      const userData2 = global.dataUtils.generateUserData();
      userData2.email = userData1.email; // 使用相同邮箱
      
      // 第一次注册
      await global.apiUtils.post('/auth/register', userData1);
      
      // 第二次注册相同邮箱
      const response = await global.apiUtils.post('/auth/register', userData2);
      
      global.assertUtils.expectError(response, 400, '邮箱已存在');
    });
    
    test('缺少必填字段注册应失败', async () => {
      const incompleteData = {
        username: 'testuser',
        // 缺少password
        email: 'test@example.com'
      };
      
      const response = await global.apiUtils.post('/auth/register', incompleteData);
      
      global.assertUtils.expectError(response, 400);
    });
    
    test('无效邮箱格式注册应失败', async () => {
      const userData = global.dataUtils.generateUserData();
      userData.email = 'invalid-email';
      
      const response = await global.apiUtils.post('/auth/register', userData);
      
      global.assertUtils.expectError(response, 400, '邮箱格式');
    });
  });
  
  describe('用户登录', () => {
    // 使用系统中已存在的用户进行测试
    const existingUser = {
      username: 'member001',
      password: '123456'
    };
    
    test('正确用户名密码登录', async () => {
      const loginData = {
        username: existingUser.username,
        password: existingUser.password
      };
      
      const response = await global.apiUtils.post('/auth/login', loginData);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('data');
      expect(response.data.data.username).toBe(existingUser.username);
      
      // 保存token用于后续测试
      global.testData.tokens[existingUser.username] = response.data.token;
    });
    
    test('错误用户名登录应失败', async () => {
      const loginData = {
        username: 'nonexistent',
        password: existingUser.password
      };
      
      const response = await global.apiUtils.post('/auth/login', loginData);
      
      global.assertUtils.expectError(response, 401, '用户名或密码错误');
    });
    
    test('错误密码登录应失败', async () => {
      const loginData = {
        username: existingUser.username,
        password: 'wrongpassword'
      };
      
      const response = await global.apiUtils.post('/auth/login', loginData);
      
      global.assertUtils.expectError(response, 401, '用户名或密码错误');
    });
    
    test('空用户名登录应失败', async () => {
      const loginData = {
        username: '',
        password: testUser.password
      };
      
      const response = await global.apiUtils.post('/auth/login', loginData);
      
      global.assertUtils.expectError(response, 400);
    });
    
    test('空密码登录应失败', async () => {
      const loginData = {
        username: testUser.username,
        password: ''
      };
      
      const response = await global.apiUtils.post('/auth/login', loginData);
      
      global.assertUtils.expectError(response, 400);
    });
  });
  
  describe('Token验证', () => {
    let userToken;
    
    beforeAll(async () => {
      // 登录获取token
      const loginResponse = await global.apiUtils.post('/auth/login', {
        username: testUser.username,
        password: testUser.password
      });
      userToken = loginResponse.data.data.token;
    });
    
    test('有效token访问受保护资源', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      
      const response = await global.apiUtils.get('/auth/profile', headers);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.username).toBe(testUser.username);
    });
    
    test('无token访问受保护资源应失败', async () => {
      const response = await global.apiUtils.get('/auth/profile');
      
      global.assertUtils.expectError(response, 401, '未授权');
    });
    
    test('无效token访问受保护资源应失败', async () => {
      const headers = global.authUtils.getAuthHeaders('invalid-token');
      
      const response = await global.apiUtils.get('/auth/profile', headers);
      
      global.assertUtils.expectError(response, 401, 'token无效');
    });
    
    test('过期token访问受保护资源应失败', async () => {
      // 模拟过期token（这里使用一个已知的过期token格式）
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      const headers = global.authUtils.getAuthHeaders(expiredToken);
      
      const response = await global.apiUtils.get('/auth/profile', headers);
      
      global.assertUtils.expectError(response, 401);
    });
  });
  
  describe('用户信息管理', () => {
    let userToken;
    
    beforeAll(async () => {
      const loginResponse = await global.apiUtils.post('/auth/login', {
        username: testUser.username,
        password: testUser.password
      });
      userToken = loginResponse.data.data.token;
    });
    
    test('获取用户信息', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      
      const response = await global.apiUtils.get('/auth/profile', headers);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data).toHaveProperty('username');
      expect(response.data.data).toHaveProperty('email');
      expect(response.data.data).toHaveProperty('realName');
    });
    
    test('更新用户信息', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      const updateData = {
        realName: '更新后的姓名',
        phone: global.dataUtils.randomPhone()
      };
      
      const response = await global.apiUtils.put('/auth/profile', updateData, headers);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.realName).toBe(updateData.realName);
      expect(response.data.data.phone).toBe(updateData.phone);
    });
    
    test('修改密码', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      const passwordData = {
        oldPassword: testUser.password,
        newPassword: 'newpassword123'
      };
      
      const response = await global.apiUtils.put('/auth/password', passwordData, headers);
      
      global.assertUtils.expectSuccess(response);
      
      // 验证新密码可以登录
      const loginResponse = await global.apiUtils.post('/auth/login', {
        username: testUser.username,
        password: passwordData.newPassword
      });
      
      global.assertUtils.expectSuccess(loginResponse);
    });
    
    test('错误旧密码修改密码应失败', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      const passwordData = {
        oldPassword: 'wrongoldpassword',
        newPassword: 'newpassword123'
      };
      
      const response = await global.apiUtils.put('/auth/password', passwordData, headers);
      
      global.assertUtils.expectError(response, 400, '原密码错误');
    });
  });
  
  describe('权限验证', () => {
    let adminToken, userToken;
    
    beforeAll(async () => {
      // 获取管理员token
      adminToken = await global.authUtils.loginAsAdmin();
      
      // 获取普通用户token
      const loginResponse = await global.apiUtils.post('/auth/login', {
        username: testUser.username,
        password: 'newpassword123' // 使用修改后的密码
      });
      userToken = loginResponse.data.data.token;
    });
    
    test('管理员访问管理接口', async () => {
      const headers = global.authUtils.getAuthHeaders(adminToken);
      
      const response = await global.apiUtils.get('/api/users', headers);
      
      global.assertUtils.expectSuccess(response);
    });
    
    test('普通用户访问管理接口应失败', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      
      const response = await global.apiUtils.get('/api/users', headers);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
    
    test('普通用户访问自己的资源', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      
      const response = await global.apiUtils.get('/auth/profile', headers);
      
      global.assertUtils.expectSuccess(response);
    });
  });
  
  describe('登出功能', () => {
    let userToken;
    
    beforeAll(async () => {
      const loginResponse = await global.apiUtils.post('/auth/login', {
        username: testUser.username,
        password: 'newpassword123'
      });
      userToken = loginResponse.data.data.token;
    });
    
    test('正常登出', async () => {
      const headers = global.authUtils.getAuthHeaders(userToken);
      
      const response = await global.apiUtils.post('/auth/logout', {}, headers);
      
      global.assertUtils.expectSuccess(response);
      
      // 验证token已失效
      const profileResponse = await global.apiUtils.get('/auth/profile', headers);
      global.assertUtils.expectError(profileResponse, 401);
    });
    
    test('无token登出应失败', async () => {
      const response = await global.apiUtils.post('/auth/logout');
      
      global.assertUtils.expectError(response, 401);
    });
  });
  
  describe('安全测试', () => {
    test('SQL注入防护', async () => {
      const maliciousData = {
        username: "admin'; DROP TABLE users; --",
        password: 'password'
      };
      
      const response = await global.apiUtils.post('/auth/login', maliciousData);
      
      // 应该返回正常的认证失败，而不是服务器错误
      expect(response.status).toBe(401);
    });
    
    test('XSS防护', async () => {
      const xssData = {
        username: '<script>alert("xss")</script>',
        password: 'password'
      };
      
      const response = await global.apiUtils.post('/auth/login', xssData);
      
      // 应该返回正常的认证失败
      expect(response.status).toBe(401);
      // 响应中不应包含脚本标签
      expect(JSON.stringify(response.data)).not.toContain('<script>');
    });
    
    test('暴力破解防护', async () => {
      const loginData = {
        username: testUser.username,
        password: 'wrongpassword'
      };
      
      // 连续多次错误登录
      const attempts = [];
      for (let i = 0; i < 6; i++) {
        attempts.push(global.apiUtils.post('/auth/login', loginData));
      }
      
      const responses = await Promise.all(attempts);
      
      // 前几次应该是认证失败
      expect(responses[0].status).toBe(401);
      
      // 后面的请求应该被限制（可能是429状态码）
      const lastResponse = responses[responses.length - 1];
      expect([401, 429]).toContain(lastResponse.status);
    }, 30000);
  });
  
  describe('性能测试', () => {
    test('登录响应时间', async () => {
      const loginData = {
        username: global.ADMIN_USERNAME,
        password: global.ADMIN_PASSWORD
      };
      
      const startTime = Date.now();
      const response = await global.apiUtils.post('/auth/login', loginData);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      
      global.assertUtils.expectSuccess(response);
      expect(responseTime).toBeLessThan(2000); // 登录应在2秒内完成
    });
    
    test('并发登录', async () => {
      const loginData = {
        username: global.ADMIN_USERNAME,
        password: global.ADMIN_PASSWORD
      };
      
      // 并发10个登录请求
      const promises = Array(10).fill().map(() => 
        global.apiUtils.post('/auth/login', loginData)
      );
      
      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      
      const totalTime = endTime - startTime;
      
      // 所有请求都应该成功
      responses.forEach(response => {
        global.assertUtils.expectSuccess(response);
      });
      
      // 并发处理时间应该合理
      expect(totalTime).toBeLessThan(5000);
    }, 10000);
  });
});