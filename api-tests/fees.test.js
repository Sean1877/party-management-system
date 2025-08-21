/**
 * 党费管理API测试
 * 测试党费标准、党费缴纳记录等功能
 */

describe('党费管理API测试', () => {
  let adminHeaders;
  let userHeaders;
  let testStandard;
  let testPayment;
  
  beforeAll(async () => {
    // 获取管理员和用户认证头
    adminHeaders = await global.authUtils.getAdminAuthHeaders();
    userHeaders = await global.authUtils.getUserAuthHeaders();
    
    // 生成测试数据
    testStandard = global.dataUtils.generateFeeStandardData();
  });
  
  describe('党费标准管理', () => {
    describe('创建党费标准', () => {
      test('管理员创建党费标准', async () => {
        const response = await global.apiUtils.post('/fees/standards', testStandard, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        expect(response.data.data).toHaveProperty('id');
        expect(response.data.data.name).toBe(testStandard.name);
        expect(response.data.data.memberType).toBe(testStandard.memberType);
        expect(response.data.data.baseAmount).toBe(testStandard.baseAmount);
        
        // 保存标准ID用于后续测试
        testStandard.id = response.data.data.id;
        global.testData.fees[testStandard.id] = response.data.data;
      });
      
      test('普通用户创建党费标准应失败', async () => {
        const standardData = global.dataUtils.generateFeeStandardData();
        
        const response = await global.apiUtils.post('/fees/standards', standardData, userHeaders);
        
        global.assertUtils.expectError(response, 403, '权限不足');
      });
      
      test('缺少必填字段创建应失败', async () => {
        const incompleteData = {
          name: '测试标准',
          // 缺少memberType和baseAmount
        };
        
        const response = await global.apiUtils.post('/fees/standards', incompleteData, adminHeaders);
        
        global.assertUtils.expectError(response, 400);
      });
      
      test('无效金额创建应失败', async () => {
        const invalidData = {
          ...testStandard,
          baseAmount: -100 // 负数金额
        };
        
        const response = await global.apiUtils.post('/fees/standards', invalidData, adminHeaders);
        
        global.assertUtils.expectError(response, 400, '金额');
      });
      
      test('重复名称创建应失败', async () => {
        const duplicateData = {
          ...testStandard,
          name: testStandard.name // 使用已存在的名称
        };
        
        const response = await global.apiUtils.post('/fees/standards', duplicateData, adminHeaders);
        
        global.assertUtils.expectError(response, 400, '名称已存在');
      });
    });
    
    describe('查询党费标准', () => {
      test('获取党费标准列表', async () => {
        const response = await global.apiUtils.get('/fees/standards', adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        expect(response.data.data.list).toBeInstanceOf(Array);
        expect(response.data.data.list.length).toBeGreaterThan(0);
        
        // 验证列表中包含我们创建的标准
        const createdStandard = response.data.data.list.find(s => s.id === testStandard.id);
        expect(createdStandard).toBeDefined();
      });
      
      test('按会员类型筛选党费标准', async () => {
        const response = await global.apiUtils.get(`/fees/standards?memberType=${testStandard.memberType}`, adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        response.data.data.list.forEach(standard => {
          expect(standard.memberType).toBe(testStandard.memberType);
        });
      });
      
      test('按状态筛选党费标准', async () => {
        const response = await global.apiUtils.get('/fees/standards?status=active', adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        response.data.data.list.forEach(standard => {
          expect(standard.status).toBe('active');
        });
      });
      
      test('分页查询党费标准', async () => {
        const response = await global.apiUtils.get('/fees/standards?page=1&pageSize=5', adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response, 5);
        expect(response.data.data.page).toBe(1);
        expect(response.data.data.list.length).toBeLessThanOrEqual(5);
      });
      
      test('获取单个党费标准详情', async () => {
        const response = await global.apiUtils.get(`/fees/standards/${testStandard.id}`, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        expect(response.data.data.id).toBe(testStandard.id);
        expect(response.data.data.name).toBe(testStandard.name);
      });
      
      test('获取不存在的党费标准应失败', async () => {
        const response = await global.apiUtils.get('/fees/standards/999999', adminHeaders);
        
        global.assertUtils.expectError(response, 404, '未找到');
      });
    });
    
    describe('更新党费标准', () => {
      test('管理员更新党费标准', async () => {
        const updateData = {
          name: '更新后的党费标准',
          baseAmount: testStandard.baseAmount + 50,
          description: '更新后的描述'
        };
        
        const response = await global.apiUtils.put(`/fees/standards/${testStandard.id}`, updateData, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        expect(response.data.data.name).toBe(updateData.name);
        expect(response.data.data.baseAmount).toBe(updateData.baseAmount);
        expect(response.data.data.description).toBe(updateData.description);
      });
      
      test('普通用户更新党费标准应失败', async () => {
        const updateData = {
          name: '用户尝试更新'
        };
        
        const response = await global.apiUtils.put(`/fees/standards/${testStandard.id}`, updateData, userHeaders);
        
        global.assertUtils.expectError(response, 403, '权限不足');
      });
      
      test('更新不存在的党费标准应失败', async () => {
        const updateData = {
          name: '更新不存在的标准'
        };
        
        const response = await global.apiUtils.put('/fees/standards/999999', updateData, adminHeaders);
        
        global.assertUtils.expectError(response, 404, '未找到');
      });
    });
    
    describe('删除党费标准', () => {
      let deletableStandard;
      
      beforeEach(async () => {
        // 创建一个可删除的标准
        const standardData = global.dataUtils.generateFeeStandardData();
        const response = await global.apiUtils.post('/fees/standards', standardData, adminHeaders);
        deletableStandard = response.data.data;
      });
      
      test('管理员删除党费标准', async () => {
        const response = await global.apiUtils.delete(`/fees/standards/${deletableStandard.id}`, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        
        // 验证标准已被删除
        const getResponse = await global.apiUtils.get(`/fees/standards/${deletableStandard.id}`, adminHeaders);
        global.assertUtils.expectError(getResponse, 404);
      });
      
      test('普通用户删除党费标准应失败', async () => {
        const response = await global.apiUtils.delete(`/fees/standards/${deletableStandard.id}`, userHeaders);
        
        global.assertUtils.expectError(response, 403, '权限不足');
      });
      
      test('删除不存在的党费标准应失败', async () => {
        const response = await global.apiUtils.delete('/fees/standards/999999', adminHeaders);
        
        global.assertUtils.expectError(response, 404, '未找到');
      });
    });
  });
  
  describe('党费缴纳记录管理', () => {
    beforeAll(() => {
      testPayment = {
        standardId: testStandard.id,
        amount: testStandard.baseAmount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'bank_transfer',
        description: '测试缴费记录'
      };
    });
    
    describe('创建缴费记录', () => {
      test('管理员创建缴费记录', async () => {
        const response = await global.apiUtils.post('/fees/payments', testPayment, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        expect(response.data.data).toHaveProperty('id');
        expect(response.data.data.amount).toBe(testPayment.amount);
        expect(response.data.data.paymentMethod).toBe(testPayment.paymentMethod);
        
        // 保存缴费记录ID
        testPayment.id = response.data.data.id;
      });
      
      test('用户为自己创建缴费记录', async () => {
        const userPayment = {
          ...testPayment,
          description: '用户自己缴费'
        };
        
        const response = await global.apiUtils.post('/fees/payments', userPayment, userHeaders);
        
        global.assertUtils.expectSuccess(response);
        expect(response.data.data.amount).toBe(userPayment.amount);
      });
      
      test('缺少必填字段创建应失败', async () => {
        const incompleteData = {
          amount: 100
          // 缺少standardId和paymentDate
        };
        
        const response = await global.apiUtils.post('/fees/payments', incompleteData, adminHeaders);
        
        global.assertUtils.expectError(response, 400);
      });
      
      test('无效金额创建应失败', async () => {
        const invalidData = {
          ...testPayment,
          amount: -50 // 负数金额
        };
        
        const response = await global.apiUtils.post('/fees/payments', invalidData, adminHeaders);
        
        global.assertUtils.expectError(response, 400, '金额');
      });
      
      test('无效标准ID创建应失败', async () => {
        const invalidData = {
          ...testPayment,
          standardId: 999999 // 不存在的标准ID
        };
        
        const response = await global.apiUtils.post('/fees/payments', invalidData, adminHeaders);
        
        global.assertUtils.expectError(response, 400, '标准不存在');
      });
    });
    
    describe('查询缴费记录', () => {
      test('获取缴费记录列表', async () => {
        const response = await global.apiUtils.get('/fees/payments', adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        expect(response.data.data.list).toBeInstanceOf(Array);
        expect(response.data.data.list.length).toBeGreaterThan(0);
      });
      
      test('按标准ID筛选缴费记录', async () => {
        const response = await global.apiUtils.get(`/fees/payments?standardId=${testStandard.id}`, adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        response.data.data.list.forEach(payment => {
          expect(payment.standardId).toBe(testStandard.id);
        });
      });
      
      test('按缴费方式筛选记录', async () => {
        const response = await global.apiUtils.get('/fees/payments?paymentMethod=bank_transfer', adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        response.data.data.list.forEach(payment => {
          expect(payment.paymentMethod).toBe('bank_transfer');
        });
      });
      
      test('按日期范围筛选记录', async () => {
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';
        
        const response = await global.apiUtils.get(`/fees/payments?startDate=${startDate}&endDate=${endDate}`, adminHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        response.data.data.list.forEach(payment => {
          expect(payment.paymentDate).toBeGreaterThanOrEqual(startDate);
          expect(payment.paymentDate).toBeLessThanOrEqual(endDate);
        });
      });
      
      test('获取单个缴费记录详情', async () => {
        const response = await global.apiUtils.get(`/fees/payments/${testPayment.id}`, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        expect(response.data.data.id).toBe(testPayment.id);
        expect(response.data.data.amount).toBe(testPayment.amount);
      });
      
      test('用户只能查看自己的缴费记录', async () => {
        const response = await global.apiUtils.get('/fees/payments', userHeaders);
        
        global.assertUtils.expectPaginatedResponse(response);
        // 用户应该只能看到自己的记录
        // 这里需要根据实际的用户ID进行验证
      });
    });
    
    describe('更新缴费记录', () => {
      test('管理员更新缴费记录', async () => {
        const updateData = {
          amount: testPayment.amount + 10,
          description: '更新后的描述'
        };
        
        const response = await global.apiUtils.put(`/fees/payments/${testPayment.id}`, updateData, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        expect(response.data.data.amount).toBe(updateData.amount);
        expect(response.data.data.description).toBe(updateData.description);
      });
      
      test('普通用户更新他人缴费记录应失败', async () => {
        const updateData = {
          amount: 999
        };
        
        const response = await global.apiUtils.put(`/fees/payments/${testPayment.id}`, updateData, userHeaders);
        
        global.assertUtils.expectError(response, 403, '权限不足');
      });
    });
    
    describe('删除缴费记录', () => {
      let deletablePayment;
      
      beforeEach(async () => {
        // 创建一个可删除的缴费记录
        const paymentData = {
          ...testPayment,
          description: '可删除的记录'
        };
        const response = await global.apiUtils.post('/fees/payments', paymentData, adminHeaders);
        deletablePayment = response.data.data;
      });
      
      test('管理员删除缴费记录', async () => {
        const response = await global.apiUtils.delete(`/fees/payments/${deletablePayment.id}`, adminHeaders);
        
        global.assertUtils.expectSuccess(response);
        
        // 验证记录已被删除
        const getResponse = await global.apiUtils.get(`/fees/payments/${deletablePayment.id}`, adminHeaders);
        global.assertUtils.expectError(getResponse, 404);
      });
      
      test('普通用户删除缴费记录应失败', async () => {
        const response = await global.apiUtils.delete(`/fees/payments/${deletablePayment.id}`, userHeaders);
        
        global.assertUtils.expectError(response, 403, '权限不足');
      });
    });
  });
  
  describe('党费统计分析', () => {
    test('获取党费统计概览', async () => {
      const response = await global.apiUtils.get('/fees/statistics/overview', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('totalStandards');
      expect(response.data.data).toHaveProperty('totalPayments');
      expect(response.data.data).toHaveProperty('totalAmount');
      expect(response.data.data).toHaveProperty('paymentRate');
      
      // 验证数据类型
      expect(typeof response.data.data.totalStandards).toBe('number');
      expect(typeof response.data.data.totalPayments).toBe('number');
      expect(typeof response.data.data.totalAmount).toBe('number');
      expect(typeof response.data.data.paymentRate).toBe('number');
    });
    
    test('获取月度缴费趋势', async () => {
      const response = await global.apiUtils.get('/fees/statistics/monthly-trend', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        expect(firstItem).toHaveProperty('month');
        expect(firstItem).toHaveProperty('amount');
        expect(firstItem).toHaveProperty('count');
      }
    });
    
    test('获取缴费方式统计', async () => {
      const response = await global.apiUtils.get('/fees/statistics/payment-methods', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toBeInstanceOf(Array);
      
      if (response.data.data.length > 0) {
        const firstItem = response.data.data[0];
        expect(firstItem).toHaveProperty('method');
        expect(firstItem).toHaveProperty('count');
        expect(firstItem).toHaveProperty('amount');
      }
    });
    
    test('按时间范围获取统计', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      
      const response = await global.apiUtils.get(`/fees/statistics/overview?startDate=${startDate}&endDate=${endDate}`, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('totalAmount');
    });
    
    test('普通用户获取统计应失败', async () => {
      const response = await global.apiUtils.get('/fees/statistics/overview', userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
  });
  
  describe('党费导出功能', () => {
    test('导出党费标准', async () => {
      const response = await global.apiUtils.get('/fees/standards/export?format=excel', adminHeaders);
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/vnd.openxmlformats');
    });
    
    test('导出缴费记录', async () => {
      const response = await global.apiUtils.get('/fees/payments/export?format=excel', adminHeaders);
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/vnd.openxmlformats');
    });
    
    test('按条件导出缴费记录', async () => {
      const params = {
        format: 'excel',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        paymentMethod: 'bank_transfer'
      };
      
      const queryString = new URLSearchParams(params).toString();
      const response = await global.apiUtils.get(`/fees/payments/export?${queryString}`, adminHeaders);
      
      expect(response.status).toBe(200);
    });
    
    test('普通用户导出应失败', async () => {
      const response = await global.apiUtils.get('/fees/standards/export', userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
  });
  
  describe('性能测试', () => {
    test('批量创建缴费记录性能', async () => {
      const batchSize = 50;
      const payments = Array(batchSize).fill().map(() => ({
        standardId: testStandard.id,
        amount: Math.floor(Math.random() * 200) + 50,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'bank_transfer',
        description: '批量测试记录'
      }));
      
      const startTime = Date.now();
      
      const promises = payments.map(payment => 
        global.apiUtils.post('/fees/payments', payment, adminHeaders)
      );
      
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      
      const totalTime = endTime - startTime;
      const avgTime = totalTime / batchSize;
      
      // 所有请求都应该成功
      responses.forEach(response => {
        global.assertUtils.expectSuccess(response);
      });
      
      // 平均响应时间应该合理
      expect(avgTime).toBeLessThan(1000); // 每个请求平均不超过1秒
      
      console.log(`批量创建${batchSize}条记录，总耗时：${totalTime}ms，平均：${avgTime}ms`);
    }, 60000);
    
    test('大数据量查询性能', async () => {
      const startTime = Date.now();
      
      const response = await global.apiUtils.get('/fees/payments?pageSize=1000', adminHeaders);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      global.assertUtils.expectPaginatedResponse(response, 1000);
      expect(responseTime).toBeLessThan(3000); // 大数据量查询应在3秒内完成
      
      console.log(`查询1000条记录耗时：${responseTime}ms`);
    });
  });
});