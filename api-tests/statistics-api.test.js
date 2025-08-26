const request = require('supertest');

// 测试配置
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const API_PREFIX = '/api';

// 测试数据
let authToken = '';

describe('统计分析 API 测试', () => {
  // 测试前的准备工作
  beforeAll(async () => {
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

  describe('总体统计 API', () => {
    it('应该能够获取系统总体统计数据', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/overview`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('totalUsers');
      expect(response.body.data).to.have.property('totalOrganizations');
      expect(response.body.data).to.have.property('totalActivities');
      expect(response.body.data).to.have.property('activeUsers');
      expect(response.body.data).to.have.property('totalFeeAmount');
      expect(response.body.data).to.have.property('paidFeeAmount');
      expect(response.body.data).to.have.property('unpaidFeeAmount');
    });

    it('应该能够获取实时统计数据', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/realtime`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('onlineUsers');
      expect(response.body.data).to.have.property('todayLogins');
      expect(response.body.data).to.have.property('todayActivities');
      expect(response.body.data).to.have.property('todayFeePayments');
    });

    it('应该能够获取系统健康状态统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/system-health`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('cpuUsage');
      expect(response.body.data).to.have.property('memoryUsage');
      expect(response.body.data).to.have.property('diskUsage');
      expect(response.body.data).to.have.property('databaseConnections');
    });
  });

  describe('用户统计 API', () => {
    it('应该能够获取用户增长趋势', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/users/growth-trend?period=30`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('date');
        expect(response.body.data[0]).to.have.property('count');
      }
    });

    it('应该能够获取用户年龄分布统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/users/age-distribution`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('ageRange');
        expect(response.body.data[0]).to.have.property('count');
      }
    });

    it('应该能够获取用户性别分布统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/users/gender-distribution`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('gender');
        expect(response.body.data[0]).to.have.property('count');
      }
    });

    it('应该能够获取用户活跃度统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/users/activity-level?period=30`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('highlyActive');
      expect(response.body.data).to.have.property('moderatelyActive');
      expect(response.body.data).to.have.property('lowActive');
      expect(response.body.data).to.have.property('inactive');
    });

    it('应该能够获取用户登录统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/users/login-stats?period=7`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('date');
        expect(response.body.data[0]).to.have.property('loginCount');
        expect(response.body.data[0]).to.have.property('uniqueUsers');
      }
    });
  });

  describe('组织统计 API', () => {
    it('应该能够获取组织分布统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/organizations/distribution`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('organizationName');
        expect(response.body.data[0]).to.have.property('memberCount');
      }
    });

    it('应该能够获取组织成员增长趋势', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/organizations/member-growth?period=30`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('date');
        expect(response.body.data[0]).to.have.property('memberCount');
      }
    });

    it('应该能够获取组织活动统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/organizations/activity-stats`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('organizationName');
        expect(response.body.data[0]).to.have.property('activityCount');
        expect(response.body.data[0]).to.have.property('participantCount');
      }
    });

    it('应该能够获取组织排行榜', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/organizations/ranking?type=member&limit=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('organizationName');
        expect(response.body.data[0]).to.have.property('score');
        expect(response.body.data[0]).to.have.property('rank');
      }
    });
  });

  describe('活动统计 API', () => {
    it('应该能够获取活动统计概览', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/activities/overview`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('totalActivities');
      expect(response.body.data).to.have.property('ongoingActivities');
      expect(response.body.data).to.have.property('completedActivities');
      expect(response.body.data).to.have.property('totalParticipants');
      expect(response.body.data).to.have.property('averageParticipation');
    });

    it('应该能够获取活动类型分布', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/activities/type-distribution`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('activityType');
        expect(response.body.data[0]).to.have.property('count');
      }
    });

    it('应该能够获取活动参与度趋势', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/activities/participation-trend?period=30`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('date');
        expect(response.body.data[0]).to.have.property('participantCount');
        expect(response.body.data[0]).to.have.property('activityCount');
      }
    });

    it('应该能够获取热门活动排行', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/activities/popular?limit=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('activityName');
        expect(response.body.data[0]).to.have.property('participantCount');
        expect(response.body.data[0]).to.have.property('rating');
      }
    });
  });

  describe('党费统计 API', () => {
    it('应该能够获取党费收缴概览', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/fees/overview`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('totalAmount');
      expect(response.body.data).to.have.property('paidAmount');
      expect(response.body.data).to.have.property('unpaidAmount');
      expect(response.body.data).to.have.property('paymentRate');
      expect(response.body.data).to.have.property('totalMembers');
      expect(response.body.data).to.have.property('paidMembers');
    });

    it('应该能够获取党费收缴趋势', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/fees/payment-trend?period=12&type=month`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('period');
        expect(response.body.data[0]).to.have.property('amount');
        expect(response.body.data[0]).to.have.property('count');
      }
    });

    it('应该能够获取党费支付方式统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/fees/payment-methods`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('paymentMethod');
        expect(response.body.data[0]).to.have.property('amount');
        expect(response.body.data[0]).to.have.property('count');
      }
    });

    it('应该能够获取组织党费收缴排行', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/fees/organization-ranking?limit=10`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).to.have.property('organizationName');
        expect(response.body.data[0]).to.have.property('totalAmount');
        expect(response.body.data[0]).to.have.property('paymentRate');
        expect(response.body.data[0]).to.have.property('rank');
      }
    });

    it('应该能够获取党费欠费统计', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/fees/overdue`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('overdueAmount');
      expect(response.body.data).to.have.property('overdueMembers');
      expect(response.body.data).to.have.property('overdueDetails');
      expect(response.body.data.overdueDetails).to.be.an('array');
    });
  });

  describe('自定义统计 API', () => {
    it('应该能够创建自定义统计报表', async () => {
      const reportConfig = {
        name: '测试报表',
        description: '用于API测试的自定义报表',
        type: 'USER_STATISTICS',
        parameters: {
          dateRange: '30',
          groupBy: 'organization',
          metrics: ['count', 'growth']
        },
        schedule: 'MANUAL'
      };

      const response = await request(BASE_URL)
        .post(`${API_PREFIX}/statistics/custom-reports`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reportConfig);

      expect(response.status).to.equal(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
      expect(response.body.data.name).to.equal(reportConfig.name);
    });

    it('应该能够执行自定义统计查询', async () => {
      const queryConfig = {
        entity: 'User',
        metrics: ['count', 'avg_age'],
        groupBy: ['organization', 'gender'],
        filters: {
          status: 'ACTIVE',
          createdDate: {
            start: '2024-01-01',
            end: '2024-12-31'
          }
        },
        orderBy: 'count DESC',
        limit: 100
      };

      const response = await request(BASE_URL)
        .post(`${API_PREFIX}/statistics/custom-query`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(queryConfig);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('results');
      expect(response.body.data).to.have.property('totalCount');
      expect(response.body.data.results).to.be.an('array');
    });

    it('应该能够获取统计数据导出', async () => {
      const exportConfig = {
        type: 'USER_OVERVIEW',
        format: 'excel',
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        },
        includeCharts: true
      };

      const response = await request(BASE_URL)
        .post(`${API_PREFIX}/statistics/export`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(exportConfig);

      expect(response.status).to.equal(200);
      expect(response.headers['content-type']).to.include('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  });

  describe('权限控制测试', () => {
    it('应该在未授权时返回401错误', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/overview`);

      expect(response.status).to.equal(401);
    });

    it('应该在访问无权限的统计数据时返回403错误', async () => {
      // 这里假设有一个受限的统计接口
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/sensitive-data`)
        .set('Authorization', `Bearer ${authToken}`);

      // 根据实际权限配置，可能返回403或404
      expect([403, 404]).to.include(response.status);
    });

    it('应该在提交无效参数时返回400错误', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/users/growth-trend?period=invalid`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(400);
    });
  });

  describe('性能测试', () => {
    it('应该能够在合理时间内返回复杂统计数据', async () => {
      const startTime = Date.now();
      
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/overview`)
        .set('Authorization', `Bearer ${authToken}`);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).to.equal(200);
      expect(responseTime).to.be.lessThan(3000); // 响应时间应小于3秒
    });

    it('应该能够处理大数据量的统计查询', async () => {
      const response = await request(BASE_URL)
        .get(`${API_PREFIX}/statistics/users/growth-trend?period=365`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
    });

    it('应该能够处理并发统计请求', async () => {
      const promises = [];
      
      // 创建5个并发统计请求
      const endpoints = [
        '/statistics/overview',
        '/statistics/users/growth-trend?period=30',
        '/statistics/organizations/distribution',
        '/statistics/activities/overview',
        '/statistics/fees/overview'
      ];

      endpoints.forEach(endpoint => {
        promises.push(
          request(BASE_URL)
            .get(`${API_PREFIX}${endpoint}`)
            .set('Authorization', `Bearer ${authToken}`)
        );
      });

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
      });
    });
  });
});