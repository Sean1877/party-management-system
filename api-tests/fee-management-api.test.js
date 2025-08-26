const request = require('supertest');

// 测试配置
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const API_PREFIX = '/api';

// 测试数据
let authToken = '';
let testFeeStandardId = null;
let testFeePaymentId = null;

describe('党费管理 API 测试', () => {
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

  describe('党费标准管理 API', () => {
    const feeStandardData = {
      name: '测试党费标准',
      description: '用于API测试的党费标准',
      minIncome: 3000,
      maxIncome: 5000,
      feeRate: 0.005,
      fixedAmount: 0,
      status: 'ACTIVE'
    };

    it('应该能够创建新的党费标准', async () => {
      const response = await request(BASE_URL)
        .post(`${API_PREFIX}/fee-standards`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(feeStandardData);

      expect(response.status).to.equal(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
      expect(response.body.data.name).to.equal(feeStandardData.name);
      
      testFeeStandardId = response.body.data.id;
    });

    it('应该能够获取所有党费标准列表', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-standards`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
    });

    it('应该能够根据ID获取特定的党费标准', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-standards/${testFeeStandardId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.id).to.equal(testFeeStandardId);
      expect(response.body.data.name).to.equal(feeStandardData.name);
    });

    it('应该能够更新党费标准信息', async () => {
      const updateData = {
        ...feeStandardData,
        name: '更新后的党费标准',
        description: '更新后的描述'
      };

      const response = await request(BASE_URL)
        .put(`${API_PREFIX}/fee-standards/${testFeeStandardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.name).to.equal(updateData.name);
      expect(response.body.data.description).to.equal(updateData.description);
    });

    it('应该能够根据收入范围查询党费标准', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-standards/by-income/4000`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据状态查询党费标准', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-standards/by-status/ACTIVE`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够分页获取党费标准', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-standards/page?page=0&size=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('content');
      expect(response.body.data).to.have.property('totalElements');
      expect(response.body.data).to.have.property('totalPages');
    });
  });

  describe('党费缴费记录管理 API', () => {
    const feePaymentData = {
      userId: 1,
      amount: 20.00,
      paymentDate: '2024-01-15',
      paymentMethod: 'BANK_TRANSFER',
      status: 'PAID',
      remark: 'API测试缴费记录'
    };

    it('应该能够创建新的缴费记录', async () => {
      const response = await request(BASE_URL)
        .post(`${API_PREFIX}/fee-payments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(feePaymentData);

      expect(response.status).to.equal(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
      expect(response.body.data.amount).to.equal(feePaymentData.amount);
      
      testFeePaymentId = response.body.data.id;
    });

    it('应该能够获取所有缴费记录列表', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
    });

    it('应该能够根据ID获取特定的缴费记录', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/${testFeePaymentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.id).to.equal(testFeePaymentId);
      expect(response.body.data.amount).to.equal(feePaymentData.amount);
    });

    it('应该能够更新缴费记录信息', async () => {
      const updateData = {
        ...feePaymentData,
        amount: 25.00,
        status: 'CONFIRMED',
        remark: '更新后的缴费记录'
      };

      const response = await request(BASE_URL)
        .put(`${API_PREFIX}/fee-payments/${testFeePaymentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.amount).to.equal(updateData.amount);
      expect(response.body.data.status).to.equal(updateData.status);
    });

    it('应该能够根据用户ID查询缴费记录', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/user/1`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据状态查询缴费记录', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/by-status/PAID`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够根据日期范围查询缴费记录', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/by-date-range?startDate=${startDate}&endDate=${endDate}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够计算用户的总缴费金额', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/user/1/total-amount`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.a('number');
      expect(response.body.data).to.be.greaterThanOrEqual(0);
    });

    it('应该能够分页获取缴费记录', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/page?page=0&size=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('content');
      expect(response.body.data).to.have.property('totalElements');
      expect(response.body.data).to.have.property('totalPages');
    });
  });

  describe('党费统计分析 API', () => {
    it('应该能够获取党费统计概览', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/statistics/overview`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('totalAmount');
      expect(response.body.data).to.have.property('totalPayments');
      expect(response.body.data).to.have.property('currentMonthAmount');
      expect(response.body.data).to.have.property('unpaidCount');
    });

    it('应该能够获取月度缴费趋势', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/statistics/monthly-trend?year=2024`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够获取缴费方式统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/statistics/payment-methods`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('应该能够获取组织缴费排行', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-payments/statistics/organization-ranking?limit=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('错误处理测试', () => {
    it('应该在未授权时返回401错误', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-standards`);

      expect(response.status).to.equal(401);
    });

    it('应该在访问不存在的资源时返回404错误', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/fee-standards/99999`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
    });

    it('应该在提交无效数据时返回400错误', async () => {
      const invalidData = {
        name: '', // 空名称
        minIncome: -1000, // 负数收入
        feeRate: 2 // 超出范围的费率
      };

      const response = await request(BASE_URL)
        .post(`${API_PREFIX}/fee-standards`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).to.equal(400);
    });
  });

  // 清理测试数据
  after(async () => {
    // 删除测试创建的缴费记录
    if (testFeePaymentId) {
      await request(BASE_URL)
        .delete(`${API_PREFIX}/fee-payments/${testFeePaymentId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }

    // 删除测试创建的党费标准
    if (testFeeStandardId) {
      await request(BASE_URL)
        .delete(`${API_PREFIX}/fee-standards/${testFeeStandardId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
  });
});