const request = require('supertest');
const { expect } = require('chai');

// 测试配置
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const API_PREFIX = '/api';

// 测试数据
let authToken = '';
let testOperationLogId = null;

describe('操作日志 API 测试', () => {
  // 测试前的准备工作
  before(async () => {
    // 登录获取认证token
    const loginResponse = await request(BASE_URL)
      .post(`${API_PREFIX}/api/auth/login`)
      .send({
        username: 'admin',
        password: 'admin123'
      });
    
    expect(loginResponse.status).to.equal(200);
    authToken = loginResponse.body.data.token;
  });

  describe('操作日志查询 API', () => {
    it('应该能够获取所有操作日志列表', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够分页获取操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/page?page=0&size=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('content');
      expect(response.body.data).to.have.property('totalElements');
      expect(response.body.data).to.have.property('totalPages');
      expect(response.body.data).to.have.property('size');
      expect(response.body.data).to.have.property('number');
    });

    it('应该能够根据用户ID查询操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/user/1`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据操作类型查询操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/type/CREATE`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据操作模块查询操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/module/USER_MANAGEMENT`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据日期范围查询操作日志', async () => {
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-12-31T23:59:59';
      
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/date-range?startDate=${startDate}&endDate=${endDate}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据IP地址查询操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/ip/127.0.0.1`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据ID获取特定的操作日志', async () => {
      // 首先获取一个日志ID
      const listResponse = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/page?page=0&size=1`)
        .set('Authorization', `Bearer ${authToken}`);

      if (listResponse.body.data.content.length > 0) {
        const logId = listResponse.body.data.content[0].id;
        
        const response = await request(BASE_URL)
          .get(`${API_PREFIX}/operation-logs/${logId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.id).to.equal(logId);
      }
    });
  });

  describe('操作日志统计 API', () => {
    it('应该能够获取操作类型统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/statistics/operation-types`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够获取操作模块统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/statistics/operation-modules`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够获取用户操作统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/statistics/user-operations?limit=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够获取每日操作统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/statistics/daily-operations?days=30`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够获取操作响应时间统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/statistics/response-times`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('averageTime');
      expect(response.body.data).to.have.property('maxTime');
      expect(response.body.data).to.have.property('minTime');
    });

    it('应该能够获取错误操作统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/statistics/error-operations`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('操作日志管理 API', () => {
    it('应该能够手动创建操作日志（仅用于测试）', async () => {
      const logData = {
        userId: 1,
        username: 'testuser',
        operationType: 'TEST',
        operationModule: 'API_TEST',
        operationDescription: 'API测试创建的日志',
        requestMethod: 'POST',
        requestUrl: '/api/test',
        requestParams: '{"test": true}',
        responseStatus: 200,
        executionTime: 100,
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent'
      };

      const response = await request(BASE_URL)
        .post(`${API_PREFIX}/operation-logs`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(logData);

      expect(response.status).to.equal(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
      expect(response.body.data.operationType).to.equal(logData.operationType);
      
      testOperationLogId = response.body.data.id;
    });

    it('应该能够批量删除过期的操作日志', async () => {
      const startDate = '2023-01-01T00:00:00';
      const endDate = '2023-12-31T23:59:59';
      
      const response = await request(BASE_URL)
        .delete(`${API_PREFIX}/operation-logs/batch-delete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          startDate: startDate,
          endDate: endDate
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('deletedCount');
      expect(response.body.data.deletedCount).to.be.a('number');
    });

    it('应该能够导出操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/export?format=csv&startDate=2024-01-01&endDate=2024-12-31`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.headers['content-type']).to.include('text/csv');
    });

    it('应该能够导出Excel格式的操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/export?format=excel&startDate=2024-01-01&endDate=2024-12-31`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.headers['content-type']).to.include('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  });

  describe('操作日志搜索 API', () => {
    it('应该能够根据关键词搜索操作日志', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/search?keyword=用户&page=0&size=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('content');
      expect(response.body.data).to.have.property('totalElements');
    });

    it('应该能够组合条件搜索操作日志', async () => {
      const searchParams = {
        operationType: 'CREATE',
        operationModule: 'USER_MANAGEMENT',
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
        page: 0,
        size: 10
      };

      const queryString = new URLSearchParams(searchParams).toString();
      
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/advanced-search?${queryString}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('content');
    });
  });

  describe('权限控制测试', () => {
    it('应该在未授权时返回401错误', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs`);

      expect(response.status).to.equal(401);
    });

    it('应该在访问不存在的日志时返回404错误', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/99999`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
    });

    it('应该在提交无效搜索参数时返回400错误', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/date-range?startDate=invalid-date&endDate=invalid-date`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(400);
    });
  });

  describe('性能测试', () => {
    it('应该能够在合理时间内返回大量日志数据', async () => {
      const startTime = Date.now();
      
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/operation-logs/page?page=0&size=100`)
        .set('Authorization', `Bearer ${authToken}`);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).to.equal(200);
      expect(responseTime).to.be.lessThan(5000); // 响应时间应小于5秒
    });

    it('应该能够处理并发请求', async () => {
      const promises = [];
      
      // 创建10个并发请求
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(BASE_URL)
            .get(`${API_PREFIX}/operation-logs/page?page=${i}&size=10`)
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
      });
    });
  });

  // 清理测试数据
  after(async () => {
    // 删除测试创建的操作日志
    if (testOperationLogId) {
      await request(BASE_URL)
        .delete(`${API_PREFIX}/operation-logs/${testOperationLogId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
  });
});