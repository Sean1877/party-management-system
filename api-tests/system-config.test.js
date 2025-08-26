/**
 * 系统配置管理API测试
 * 测试系统配置的增删改查功能
 */

describe('系统配置管理API测试', () => {
  let adminHeaders;
  let userHeaders;
  let testConfig;
  
  beforeAll(async () => {
    // 获取管理员和用户认证头
    adminHeaders = await global.authUtils.getAdminAuthHeaders();
    userHeaders = await global.authUtils.getUserAuthHeaders();
    
    // 生成测试配置数据
    testConfig = {
      configKey: 'test_config_' + global.dataUtils.generateRandomString(8),
      configValue: 'test_value_' + global.dataUtils.generateRandomString(10),
      configType: 'string',
      description: '测试配置项',
      category: 'system'
    };
  });
  
  describe('创建系统配置', () => {
    test('管理员创建系统配置', async () => {
      const response = await global.apiUtils.post('/system/config', testConfig, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.configKey).toBe(testConfig.configKey);
      expect(response.data.data.configValue).toBe(testConfig.configValue);
      expect(response.data.data.configType).toBe(testConfig.configType);
      
      // 保存配置ID用于后续测试
      testConfig.id = response.data.data.id;
      global.testData.configs = global.testData.configs || {};
      global.testData.configs[testConfig.id] = response.data.data;
    });
    
    test('普通用户创建系统配置应失败', async () => {
      const configData = {
        configKey: 'user_test_config',
        configValue: 'user_value',
        configType: 'string',
        description: '用户测试配置'
      };
      
      const response = await global.apiUtils.post('/system/config', configData, userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
    
    test('缺少必填字段创建应失败', async () => {
      const incompleteData = {
        configKey: 'incomplete_config'
        // 缺少configValue和configType
      };
      
      const response = await global.apiUtils.post('/system/config', incompleteData, adminHeaders);
      
      global.assertUtils.expectError(response, 400);
    });
    
    test('重复配置键创建应失败', async () => {
      const duplicateData = {
        ...testConfig,
        configKey: testConfig.configKey // 使用已存在的配置键
      };
      
      const response = await global.apiUtils.post('/system/config', duplicateData, adminHeaders);
      
      global.assertUtils.expectError(response, 400, '配置键已存在');
    });
    
    test('无效配置类型创建应失败', async () => {
      const invalidData = {
        ...testConfig,
        configKey: 'invalid_type_config',
        configType: 'invalid_type' // 无效的配置类型
      };
      
      const response = await global.apiUtils.post('/system/config', invalidData, adminHeaders);
      
      global.assertUtils.expectError(response, 400, '配置类型');
    });
  });
  
  describe('查询系统配置', () => {
    test('获取系统配置列表', async () => {
      const response = await global.apiUtils.get('/system/config', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      expect(response.data.data.list).toBeInstanceOf(Array);
      expect(response.data.data.list.length).toBeGreaterThan(0);
      
      // 验证列表中包含我们创建的配置
      const createdConfig = response.data.data.list.find(c => c.id === testConfig.id);
      expect(createdConfig).toBeDefined();
    });
    
    test('按分类筛选系统配置', async () => {
      const response = await global.apiUtils.get(`/system/config?category=${testConfig.category}`, adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(config => {
        expect(config.category).toBe(testConfig.category);
      });
    });
    
    test('按配置类型筛选', async () => {
      const response = await global.apiUtils.get(`/system/config?configType=${testConfig.configType}`, adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(config => {
        expect(config.configType).toBe(testConfig.configType);
      });
    });
    
    test('按配置键搜索', async () => {
      const searchKey = testConfig.configKey.substring(0, 10);
      const response = await global.apiUtils.get(`/system/config?search=${searchKey}`, adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response);
      response.data.data.list.forEach(config => {
        expect(config.configKey.toLowerCase()).toContain(searchKey.toLowerCase());
      });
    });
    
    test('分页查询系统配置', async () => {
      const response = await global.apiUtils.get('/system/config?page=1&pageSize=5', adminHeaders);
      
      global.assertUtils.expectPaginatedResponse(response, 5);
      expect(response.data.data.page).toBe(1);
      expect(response.data.data.list.length).toBeLessThanOrEqual(5);
    });
    
    test('获取单个系统配置详情', async () => {
      const response = await global.apiUtils.get(`/system/config/${testConfig.id}`, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.id).toBe(testConfig.id);
      expect(response.data.data.configKey).toBe(testConfig.configKey);
    });
    
    test('通过配置键获取配置值', async () => {
      const response = await global.apiUtils.get(`/system/config/key/${testConfig.configKey}`, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.configValue).toBe(testConfig.configValue);
    });
    
    test('获取不存在的系统配置应失败', async () => {
      const response = await global.apiUtils.get('/system/config/999999', adminHeaders);
      
      global.assertUtils.expectError(response, 404, '未找到');
    });
    
    test('普通用户查看敏感配置应失败', async () => {
      // 创建一个敏感配置
      const sensitiveConfig = {
        configKey: 'sensitive_config_' + global.dataUtils.generateRandomString(8),
        configValue: 'sensitive_value',
        configType: 'string',
        description: '敏感配置',
        category: 'security',
        isSensitive: true
      };
      
      const createResponse = await global.apiUtils.post('/system/config', sensitiveConfig, adminHeaders);
      const configId = createResponse.data.data.id;
      
      const response = await global.apiUtils.get(`/system/config/${configId}`, userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
  });
  
  describe('更新系统配置', () => {
    test('管理员更新系统配置', async () => {
      const updateData = {
        configValue: 'updated_value_' + global.dataUtils.generateRandomString(10),
        description: '更新后的描述'
      };
      
      const response = await global.apiUtils.put(`/system/config/${testConfig.id}`, updateData, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.configValue).toBe(updateData.configValue);
      expect(response.data.data.description).toBe(updateData.description);
    });
    
    test('普通用户更新系统配置应失败', async () => {
      const updateData = {
        configValue: 'user_updated_value'
      };
      
      const response = await global.apiUtils.put(`/system/config/${testConfig.id}`, updateData, userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
    
    test('更新不存在的系统配置应失败', async () => {
      const updateData = {
        configValue: 'updated_value'
      };
      
      const response = await global.apiUtils.put('/system/config/999999', updateData, adminHeaders);
      
      global.assertUtils.expectError(response, 404, '未找到');
    });
    
    test('更新配置键应失败', async () => {
      const updateData = {
        configKey: 'new_config_key' // 不允许更新配置键
      };
      
      const response = await global.apiUtils.put(`/system/config/${testConfig.id}`, updateData, adminHeaders);
      
      global.assertUtils.expectError(response, 400, '配置键不可修改');
    });
    
    test('批量更新系统配置', async () => {
      // 创建多个测试配置
      const configs = [];
      for (let i = 0; i < 3; i++) {
        const configData = {
          configKey: `batch_config_${i}_` + global.dataUtils.generateRandomString(6),
          configValue: `batch_value_${i}`,
          configType: 'string',
          description: `批量测试配置${i}`,
          category: 'test'
        };
        
        const createResponse = await global.apiUtils.post('/system/config', configData, adminHeaders);
        configs.push(createResponse.data.data);
      }
      
      // 批量更新
      const batchUpdateData = configs.map(config => ({
        id: config.id,
        configValue: `updated_${config.configValue}`
      }));
      
      const response = await global.apiUtils.put('/system/config/batch', { configs: batchUpdateData }, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.updated).toBe(configs.length);
    });
  });
  
  describe('删除系统配置', () => {
    let deletableConfig;
    
    beforeEach(async () => {
      // 创建一个可删除的配置
      const configData = {
        configKey: 'deletable_config_' + global.dataUtils.generateRandomString(8),
        configValue: 'deletable_value',
        configType: 'string',
        description: '可删除的配置',
        category: 'test'
      };
      
      const response = await global.apiUtils.post('/system/config', configData, adminHeaders);
      deletableConfig = response.data.data;
    });
    
    test('管理员删除系统配置', async () => {
      const response = await global.apiUtils.delete(`/system/config/${deletableConfig.id}`, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      
      // 验证配置已被删除
      const getResponse = await global.apiUtils.get(`/system/config/${deletableConfig.id}`, adminHeaders);
      global.assertUtils.expectError(getResponse, 404);
    });
    
    test('普通用户删除系统配置应失败', async () => {
      const response = await global.apiUtils.delete(`/system/config/${deletableConfig.id}`, userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
    
    test('删除不存在的系统配置应失败', async () => {
      const response = await global.apiUtils.delete('/system/config/999999', adminHeaders);
      
      global.assertUtils.expectError(response, 404, '未找到');
    });
    
    test('删除系统关键配置应失败', async () => {
      // 创建一个系统关键配置
      const criticalConfig = {
        configKey: 'system_critical_config',
        configValue: 'critical_value',
        configType: 'string',
        description: '系统关键配置',
        category: 'system',
        isSystem: true
      };
      
      const createResponse = await global.apiUtils.post('/system/config', criticalConfig, adminHeaders);
      const configId = createResponse.data.data.id;
      
      const response = await global.apiUtils.delete(`/system/config/${configId}`, adminHeaders);
      
      global.assertUtils.expectError(response, 400, '系统配置不可删除');
    });
  });
  
  describe('配置类型验证', () => {
    test('字符串类型配置', async () => {
      const stringConfig = {
        configKey: 'string_config_' + global.dataUtils.generateRandomString(8),
        configValue: 'string_value',
        configType: 'string',
        description: '字符串配置'
      };
      
      const response = await global.apiUtils.post('/system/config', stringConfig, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.configValue).toBe(stringConfig.configValue);
    });
    
    test('数字类型配置', async () => {
      const numberConfig = {
        configKey: 'number_config_' + global.dataUtils.generateRandomString(8),
        configValue: '123',
        configType: 'number',
        description: '数字配置'
      };
      
      const response = await global.apiUtils.post('/system/config', numberConfig, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.configValue).toBe(numberConfig.configValue);
    });
    
    test('布尔类型配置', async () => {
      const booleanConfig = {
        configKey: 'boolean_config_' + global.dataUtils.generateRandomString(8),
        configValue: 'true',
        configType: 'boolean',
        description: '布尔配置'
      };
      
      const response = await global.apiUtils.post('/system/config', booleanConfig, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.configValue).toBe(booleanConfig.configValue);
    });
    
    test('JSON类型配置', async () => {
      const jsonConfig = {
        configKey: 'json_config_' + global.dataUtils.generateRandomString(8),
        configValue: '{"key": "value", "number": 123}',
        configType: 'json',
        description: 'JSON配置'
      };
      
      const response = await global.apiUtils.post('/system/config', jsonConfig, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.configValue).toBe(jsonConfig.configValue);
    });
    
    test('无效JSON格式应失败', async () => {
      const invalidJsonConfig = {
        configKey: 'invalid_json_config',
        configValue: '{invalid json}',
        configType: 'json',
        description: '无效JSON配置'
      };
      
      const response = await global.apiUtils.post('/system/config', invalidJsonConfig, adminHeaders);
      
      global.assertUtils.expectError(response, 400, 'JSON格式');
    });
  });
  
  describe('配置缓存管理', () => {
    test('刷新配置缓存', async () => {
      const response = await global.apiUtils.post('/system/config/cache/refresh', {}, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.message).toContain('缓存刷新成功');
    });
    
    test('清空配置缓存', async () => {
      const response = await global.apiUtils.delete('/system/config/cache', adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.message).toContain('缓存清空成功');
    });
    
    test('普通用户操作缓存应失败', async () => {
      const response = await global.apiUtils.post('/system/config/cache/refresh', {}, userHeaders);
      
      global.assertUtils.expectError(response, 403, '权限不足');
    });
  });
  
  describe('配置导入导出', () => {
    test('导出系统配置', async () => {
      const response = await global.apiUtils.get('/system/config/export?format=json', adminHeaders);
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });
    
    test('按分类导出配置', async () => {
      const response = await global.apiUtils.get(`/system/config/export?format=json&category=${testConfig.category}`, adminHeaders);
      
      expect(response.status).toBe(200);
    });
    
    test('导入系统配置', async () => {
      const importData = {
        configs: [
          {
            configKey: 'import_config_1',
            configValue: 'import_value_1',
            configType: 'string',
            description: '导入配置1',
            category: 'import_test'
          },
          {
            configKey: 'import_config_2',
            configValue: 'import_value_2',
            configType: 'string',
            description: '导入配置2',
            category: 'import_test'
          }
        ]
      };
      
      const response = await global.apiUtils.post('/system/config/import', importData, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.imported).toBe(2);
    });
    
    test('导入重复配置应跳过', async () => {
      const importData = {
        configs: [
          {
            configKey: testConfig.configKey, // 已存在的配置键
            configValue: 'duplicate_value',
            configType: 'string',
            description: '重复配置'
          }
        ]
      };
      
      const response = await global.apiUtils.post('/system/config/import', importData, adminHeaders);
      
      global.assertUtils.expectSuccess(response);
      expect(response.data.data.skipped).toBe(1);
    });
    
    test('普通用户导入导出应失败', async () => {
      const exportResponse = await global.apiUtils.get('/system/config/export', userHeaders);
      global.assertUtils.expectError(exportResponse, 403, '权限不足');
      
      const importResponse = await global.apiUtils.post('/system/config/import', { configs: [] }, userHeaders);
      global.assertUtils.expectError(importResponse, 403, '权限不足');
    });
  });
  
  describe('性能测试', () => {
    test('批量创建配置性能', async () => {
      const batchSize = 100;
      const configs = Array(batchSize).fill().map((_, index) => ({
        configKey: `perf_config_${index}_` + global.dataUtils.generateRandomString(6),
        configValue: `perf_value_${index}`,
        configType: 'string',
        description: `性能测试配置${index}`,
        category: 'performance_test'
      }));
      
      const startTime = Date.now();
      
      const promises = configs.map(config => 
        global.apiUtils.post('/system/config', config, adminHeaders)
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
      expect(avgTime).toBeLessThan(500); // 每个请求平均不超过500ms
      
      console.log(`批量创建${batchSize}个配置，总耗时：${totalTime}ms，平均：${avgTime}ms`);
    }, 60000);
    
    test('大数据量查询性能', async () => {
      const startTime = Date.now();
      
      const response = await global.apiUtils.get('/system/config?pageSize=500', adminHeaders);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      global.assertUtils.expectPaginatedResponse(response, 500);
      expect(responseTime).toBeLessThan(2000); // 大数据量查询应在2秒内完成
      
      console.log(`查询500个配置耗时：${responseTime}ms`);
    });
  });
});