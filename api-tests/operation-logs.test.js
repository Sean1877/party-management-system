/**
 * 操作日志API测试
 * 测试操作日志的记录、查询和分析功能
 */

describe('操作日志API测试', () => {
  let adminHeaders;
  let userHeaders;
  let testLogId;
  
  beforeAll(async () => {
    // 获取管理员和用户认证头
    adminHeaders = await global.authUtils.getAdminAuthHeaders();
    userHeaders = await global.authUtils.getUserAuthHeaders();
  });
  
  describe('操作日志记录', () => {
    test('用户操作自动记录日志', async () => {
      // 执行一个会产生日志的操作（创建用户）
      const userData = global.dataUtils.generateUserData();
      const createResponse = await global.apiUtils.post('/users', userData, adminHeaders);
      
      global.assertUtils.expectSuccess(createResponse);
      
      // 等待日志记录
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 查询最近的操作日志
      const logsResponse = await global.apiUtils.get('/operation-logs?pageSize=10&sortBy=createdAt&sortOrder=desc', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(logsResponse);
      
      // 验证日志记录
      const recentLog = logsResponse.data.data.list[0];
      expect(recentLog.operation).toBe('CREATE');
      expect(recentLog.module).toBe('USER');
      expect(recentLog.description).toContain('创建用户');
    });
    
    test('登录操作记录日志', async () => {
      // 执行登录操作
      const loginData = {
        username: global.testData.admin.username,
        password: global.testData.admin.password
      };
      
      const loginResponse = await global.apiUtils.post('/api/auth/login', loginData);
      global.assertUtils.expectSuccess(loginResponse);
      
      // 等待日志记录
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 查询登录日志
      const logsResponse = await global.apiUtils.get('/operation-logs?operation=LOGIN&pageSize=10', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(logsResponse);
      
      // 验证登录日志
      const loginLog = logsResponse.data.data.list.find(log => 
        log.operation === 'LOGIN' && log.username === loginData.username
      );
      expect(loginLog).toBeDefined();
      expect(loginLog.module).toBe('AUTH');
      expect(loginLog.status).toBe('SUCCESS');
    });
    
    test('失败操作记录错误日志', async () => {
      // 执行一个会失败的操作
      const invalidData = {
        username: '', // 无效用户名
        password: 'test123'
      };
      
      const loginResponse = await global.apiUtils.post('/api/auth/login', invalidData);
      global.assertUtils.expectError(loginResponse, 400);
      
      // 等待日志记录
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 查询失败日志
      const logsResponse = await global.apiUtils.get('/operation-logs?status=FAILURE&pageSize=10', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(logsResponse);
      
      // 验证失败日志
      const failureLog = logsResponse.data.data.list.find(log => 
        log.operation === 'LOGIN' && log.status === 'FAILURE'
      );
      expect(failureLog).toBeDefined();
      expect(failureLog.errorMessage).toBeDefined();
    });
  });
  
  describe('查询操作日志', () => {
    test('管理员获取操作日志列表', async () => {
      const response = await global.apiUtils.get('/operation-logs', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      expect(response.data.data.list).toBeInstanceOf(Array);
      expect(response.data.data.list.length).toBeGreaterThan(0);
      
      // 验证日志结构
      const log = response.data.data.list[0];
      expect(log).toHaveProperty('id');
      expect(log).toHaveProperty('operationType');
      expect(log).toHaveProperty('operationModule');
      expect(log).toHaveProperty('username');
      expect(log).toHaveProperty('ipAddress');
      expect(log).toHaveProperty('userAgent');
      expect(log).toHaveProperty('success');
      expect(log).toHaveProperty('createdAt');
      
      testLogId = log.id;
    });
    
    test('按操作类型筛选日志', async () => {
      const response = await global.apiUtils.get('/operation-logs?operation=LOGIN', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(log => {
        expect(log.operationType).toBe('LOGIN');
      });
    });
    
    test('按模块筛选日志', async () => {
      const response = await global.apiUtils.get('/operation-logs?module=USER', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(log => {
        expect(log.operationModule).toBe('USER');
      });
    });
    
    test('按用户筛选日志', async () => {
      const username = global.testData.admin.username;
      const response = await global.apiUtils.get(`/operation-logs?username=${username}`, adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(log => {
        expect(log.username).toBe(username);
      });
    });
    
    test('按状态筛选日志', async () => {
      const response = await global.apiUtils.get('/operation-logs?status=SUCCESS', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(log => {
        expect(log.status).toBe('SUCCESS');
      });
    });
    
    test('按时间范围筛选日志', async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await global.apiUtils.get(`/operation-logs?startDate=${startDate}&endDate=${endDate}`, adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(log => {
        const logDate = log.createdAt.split('T')[0];
        expect(logDate).toBeGreaterThanOrEqual(startDate);
        expect(logDate).toBeLessThanOrEqual(endDate);
      });
    });
    
    test('按IP地址筛选日志', async () => {
      // 先获取一个有效的IP地址
      const allLogsResponse = await global.apiUtils.get('/operation-logs?pageSize=1', adminHeaders);
      
      if (allLogsResponse.data.data.list.length > 0) {
        const ipAddress = allLogsResponse.data.data.list[0].ipAddress;
        
        const response = await global.apiUtils.get(`/operation-logs?ipAddress=${ipAddress}`, adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        response.data.data.list.forEach(log => {
          expect(log.ipAddress).toBe(ipAddress);
        });
      }
    });
    
    test('关键字搜索日志', async () => {
      const keyword = '用户';
      const response = await global.apiUtils.get(`/operation-logs?search=${keyword}`, adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(log => {
        const searchText = `${log.description} ${log.module} ${log.operation}`.toLowerCase();
        expect(searchText).toContain(keyword.toLowerCase());
      });
    });
    
    test('分页查询操作日志', async () => {
      const response = await global.apiUtils.get('/operation-logs?page=1&pageSize=5', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response, 5);
      expect(response.data.data.page).toBe(1);
      expect(response.data.data.list.length).toBeLessThanOrEqual(5);
    });
    
    test('排序查询操作日志', async () => {
      const response = await global.apiUtils.get('/operation-logs?sortBy=createdAt&sortOrder=desc&pageSize=10', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      
      // 验证排序
      for (let i = 1; i < response.data.data.list.length; i++) {
        const current = new Date(response.data.data.list[i].createdAt);
        const previous = new Date(response.data.data.list[i - 1].createdAt);
        expect(current.getTime()).toBeLessThanOrEqual(previous.getTime());
      }
    });
    
    test('获取单个操作日志详情', async () => {
      const response = await global.apiUtils.get(`/operation-logs/${testLogId}`, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.id).toBe(testLogId);
      expect(response.data.data).toHaveProperty('requestData');
      expect(response.data.data).toHaveProperty('responseData');
    });
    
    test('获取不存在的操作日志应失败', async () => {
      const response = await global.apiUtils.get('/operation-logs/999999', adminHeaders);
      
      global.assertUtils.expectError(response, 404, '未找到');
    });
    
    test('普通用户只能查看自己的操作日志', async () => {
      const response = await global.apiUtils.get('/operation-logs', userHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      
      // 验证返回的日志都是当前用户的
      const currentUser = global.testData.user.username;
      response.data.data.list.forEach(log => {
        expect(log.username).toBe(currentUser);
      });
    });
  });
  
  describe('操作日志统计', () => {
    test('获取操作日志统计概览', async () => {
      const response = await global.apiUtils.get('/operation-logs/statistics/overview', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('totalLogs');
      expect(response.data.data).toHaveProperty('todayLogs');
      expect(response.data.data).toHaveProperty('successRate');
      expect(response.data.data).toHaveProperty('failureRate');
      
      // 验证数据类型
      expect(typeof response.data.data.totalLogs).toBe('number');
      expect(typeof response.data.data.todayLogs).toBe('number');
      expect(typeof response.data.data.successRate).toBe('number');
      expect(typeof response.data.data.failureRate).toBe('number');
    });
    
    test('获取操作类型统计', async () => {
      const response = await global.apiUtils.get('/operation-logs/statistics/operations', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        expect(firstItem).toHaveProperty('operation');
        expect(firstItem).toHaveProperty('count');
        expect(firstItem).toHaveProperty('percentage');
      }
    });
    
    test('获取模块访问统计', async () => {
      const response = await global.apiUtils.get('/operation-logs/statistics/modules', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        expect(firstItem).toHaveProperty('module');
        expect(firstItem).toHaveProperty('count');
        expect(firstItem).toHaveProperty('percentage');
      }
    });
    
    test('获取用户活跃度统计', async () => {
      const response = await global.apiUtils.get('/operation-logs/statistics/users', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        expect(firstItem).toHaveProperty('username');
        expect(firstItem).toHaveProperty('count');
        expect(firstItem).toHaveProperty('lastActivity');
      }
    });
    
    test('获取时间趋势统计', async () => {
      const response = await global.apiUtils.get('/operation-logs/statistics/trend?period=7d', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        expect(firstItem).toHaveProperty('date');
        expect(firstItem).toHaveProperty('count');
        expect(firstItem).toHaveProperty('successCount');
        expect(firstItem).toHaveProperty('failureCount');
      }
    });
    
    test('获取IP地址统计', async () => {
      const response = await global.apiUtils.get('/operation-logs/statistics/ips', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        expect(firstItem).toHaveProperty('ipAddress');
        expect(firstItem).toHaveProperty('count');
        expect(firstItem).toHaveProperty('location');
      }
    });
    
    test('按时间范围获取统计', async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await global.apiUtils.get(`/operation-logs/statistics/overview?startDate=${startDate}&endDate=${endDate}`, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('totalLogs');
    });
    
    test('普通用户获取统计应失败', async () => {
      const response = await global.apiUtils.get('/operation-logs/statistics/overview', userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
  });
  
  describe('操作日志导出', () => {
    test('导出操作日志', async () => {
      const response = await global.apiUtils.get('/operation-logs/export?format=excel', adminHeaders);
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/vnd.openxmlformats');
    });
    
    test('按条件导出操作日志', async () => {
      const params = {
        format: 'excel',
        operation: 'LOGIN',
        status: 'SUCCESS',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };
      
      const queryString = new URLSearchParams(params).toString();
      const response = await global.apiUtils.get(`/operation-logs/export?${queryString}`, adminHeaders);
      
      expect(response.status).toBe(200);
    });
    
    test('导出CSV格式', async () => {
      const response = await global.apiUtils.get('/operation-logs/export?format=csv', adminHeaders);
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
    });
    
    test('普通用户导出应失败', async () => {
      const response = await global.apiUtils.get('/operation-logs/export', userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
  });
  
  describe('操作日志清理', () => {
    test('清理过期日志', async () => {
      const cleanupData = {
        retentionDays: 30 // 保留30天内的日志
      };
      
      const response = await global.apiUtils.post('/operation-logs/cleanup', cleanupData, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('deletedCount');
      expect(typeof response.data.data.deletedCount).toBe('number');
    });
    
    test('按条件清理日志', async () => {
      const cleanupData = {
        operation: 'LOGIN',
        status: 'FAILURE',
        retentionDays: 7
      };
      
      const response = await global.apiUtils.post('/operation-logs/cleanup', cleanupData, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('deletedCount');
    });
    
    test('普通用户清理日志应失败', async () => {
      const cleanupData = {
        retentionDays: 30
      };
      
      const response = await global.apiUtils.post('/operation-logs/cleanup', cleanupData, userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
    
    test('无效保留天数应失败', async () => {
      const cleanupData = {
        retentionDays: -1 // 无效的保留天数
      };
      
      const response = await global.apiUtils.post('/operation-logs/cleanup', cleanupData, adminHeaders);
      
      global.assertUtils.expectError(response, 400, '保留天数');
    });
  });
  
  describe('安全审计', () => {
    test('检测异常登录', async () => {
      const response = await global.apiUtils.get('/operation-logs/security/anomalies?type=login', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const anomaly = response.data.data[0];
        expect(anomaly).toHaveProperty('type');
        expect(anomaly).toHaveProperty('description');
        expect(anomaly).toHaveProperty('riskLevel');
        expect(anomaly).toHaveProperty('occurrenceTime');
      }
    });
    
    test('检测频繁操作', async () => {
      const response = await global.apiUtils.get('/operation-logs/security/anomalies?type=frequency', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
    });
    
    test('检测权限异常', async () => {
      const response = await global.apiUtils.get('/operation-logs/security/anomalies?type=permission', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
    });
    
    test('获取安全报告', async () => {
      const response = await global.apiUtils.get('/operation-logs/security/report', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('summary');
      expect(response.data.data).toHaveProperty('anomalies');
      expect(response.data.data).toHaveProperty('recommendations');
    });
    
    test('普通用户访问安全审计应失败', async () => {
      const response = await global.apiUtils.get('/operation-logs/security/anomalies', userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
  });
  
  describe('性能测试', () => {
    test('大数据量日志查询性能', async () => {
      const startTime = Date.now();
      
      const response = await global.apiUtils.get('/operation-logs?pageSize=1000', adminHeaders);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      global.assertUtils.expectPaginatedResponse(response, 1000);
      expect(responseTime).toBeLessThan(3000); // 大数据量查询应在3秒内完成
      
      console.log(`查询1000条日志耗时：${responseTime}ms`);
    });
    
    test('复杂条件查询性能', async () => {
      const startTime = Date.now();
      
      const params = {
        operation: 'CREATE',
        module: 'USER',
        status: 'SUCCESS',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        search: '用户',
        pageSize: 100
      };
      
      const queryString = new URLSearchParams(params).toString();
      const response = await global.apiUtils.get(`/operation-logs?${queryString}`, adminHeaders);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      global.assertUtils.expectPaginatedResponse(response);
      expect(responseTime).toBeLessThan(2000); // 复杂查询应在2秒内完成
      
      console.log(`复杂条件查询耗时：${responseTime}ms`);
    });
    
    test('统计查询性能', async () => {
      const startTime = Date.now();
      
      const response = await global.apiUtils.get('/operation-logs/statistics/overview', adminHeaders);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      global.assertUtils.expectSuccess(response);
      expect(responseTime).toBeLessThan(1000); // 统计查询应在1秒内完成
      
      console.log(`统计查询耗时：${responseTime}ms`);
    });
  });
});