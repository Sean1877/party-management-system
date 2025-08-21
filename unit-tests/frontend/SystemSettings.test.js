import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import SystemSettings from '../../frontend/src/views/system/settings/index.vue';

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn()
  }
}));

// Mock API calls
vi.mock('../../frontend/src/api/system-config', () => ({
  getSystemConfigs: vi.fn(),
  getSystemConfigByKey: vi.fn(),
  updateSystemConfig: vi.fn(),
  createSystemConfig: vi.fn(),
  deleteSystemConfig: vi.fn(),
  batchUpdateSystemConfigs: vi.fn(),
  resetSystemConfigs: vi.fn(),
  exportSystemConfigs: vi.fn(),
  importSystemConfigs: vi.fn()
}));

describe('SystemSettings.vue', () => {
  let wrapper;
  
  const mockSystemConfigs = [
    {
      id: 1,
      configKey: 'system.title',
      configValue: '党建管理系统',
      configDescription: '系统标题',
      configType: 'STRING',
      configCategory: 'BASIC',
      isEditable: true,
      isVisible: true,
      defaultValue: '党建管理系统',
      validationRule: null,
      sortOrder: 1,
      createTime: '2024-01-01 00:00:00',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      configKey: 'system.logo',
      configValue: '/images/logo.png',
      configDescription: '系统Logo',
      configType: 'FILE',
      configCategory: 'BASIC',
      isEditable: true,
      isVisible: true,
      defaultValue: '/images/default-logo.png',
      validationRule: null,
      sortOrder: 2,
      createTime: '2024-01-01 00:00:00',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 3,
      configKey: 'security.password.min.length',
      configValue: '8',
      configDescription: '密码最小长度',
      configType: 'NUMBER',
      configCategory: 'SECURITY',
      isEditable: true,
      isVisible: true,
      defaultValue: '6',
      validationRule: 'min:6,max:20',
      sortOrder: 1,
      createTime: '2024-01-01 00:00:00',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 4,
      configKey: 'email.smtp.host',
      configValue: 'smtp.qq.com',
      configDescription: 'SMTP服务器地址',
      configType: 'STRING',
      configCategory: 'EMAIL',
      isEditable: true,
      isVisible: true,
      defaultValue: '',
      validationRule: 'required',
      sortOrder: 1,
      createTime: '2024-01-01 00:00:00',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 5,
      configKey: 'backup.auto.enabled',
      configValue: 'true',
      configDescription: '启用自动备份',
      configType: 'BOOLEAN',
      configCategory: 'BACKUP',
      isEditable: true,
      isVisible: true,
      defaultValue: 'false',
      validationRule: null,
      sortOrder: 1,
      createTime: '2024-01-01 00:00:00',
      updateTime: '2024-01-15 10:30:00'
    }
  ];
  
  const mockConfigCategories = [
    { key: 'BASIC', label: '基础设置', icon: 'Setting' },
    { key: 'SECURITY', label: '安全设置', icon: 'Lock' },
    { key: 'EMAIL', label: '邮件设置', icon: 'Message' },
    { key: 'BACKUP', label: '备份设置', icon: 'FolderOpened' },
    { key: 'ADVANCED', label: '高级设置', icon: 'Tools' }
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    const {
      getSystemConfigs,
      getSystemConfigByKey,
      updateSystemConfig,
      createSystemConfig
    } = require('../../frontend/src/api/system-config');
    
    getSystemConfigs.mockResolvedValue({ data: mockSystemConfigs });
    getSystemConfigByKey.mockResolvedValue({ data: mockSystemConfigs[0] });
    updateSystemConfig.mockResolvedValue({ success: true });
    createSystemConfig.mockResolvedValue({ success: true, data: { id: 6 } });
    
    wrapper = mount(SystemSettings, {
      global: {
        stubs: {
          'el-tabs': true,
          'el-tab-pane': true,
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-input-number': true,
          'el-select': true,
          'el-option': true,
          'el-switch': true,
          'el-upload': true,
          'el-button': true,
          'el-table': true,
          'el-table-column': true,
          'el-tag': true,
          'el-dialog': true,
          'el-descriptions': true,
          'el-descriptions-item': true,
          'el-alert': true,
          'el-divider': true,
          'el-tooltip': true,
          'el-popconfirm': true,
          'el-collapse': true,
          'el-collapse-item': true
        }
      }
    });
  });

  describe('组件初始化', () => {
    it('应该正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('应该在挂载时加载配置数据', async () => {
      const { getSystemConfigs } = require('../../frontend/src/api/system-config');
      
      await wrapper.vm.$nextTick();
      
      expect(getSystemConfigs).toHaveBeenCalled();
    });

    it('应该正确设置初始数据', () => {
      expect(wrapper.vm.systemConfigs).toEqual([]);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.activeCategory).toBe('BASIC');
      expect(wrapper.vm.configCategories).toEqual(mockConfigCategories);
      expect(wrapper.vm.showConfigDialog).toBe(false);
      expect(wrapper.vm.isEditMode).toBe(false);
    });
  });

  describe('配置数据加载', () => {
    it('应该能够加载系统配置列表', async () => {
      await wrapper.vm.loadSystemConfigs();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.systemConfigs).toEqual(mockSystemConfigs);
    });

    it('应该能够按分类筛选配置', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      wrapper.vm.activeCategory = 'SECURITY';
      
      const filteredConfigs = wrapper.vm.filteredConfigs;
      
      expect(filteredConfigs.every(config => config.configCategory === 'SECURITY')).toBe(true);
    });

    it('应该能够刷新配置数据', async () => {
      const { getSystemConfigs } = require('../../frontend/src/api/system-config');
      
      await wrapper.vm.refreshConfigs();
      
      expect(getSystemConfigs).toHaveBeenCalled();
      expect(ElMessage.success).toHaveBeenCalledWith('配置刷新成功');
    });

    it('应该能够搜索配置项', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      wrapper.vm.searchKeyword = '密码';
      
      const searchResults = wrapper.vm.searchedConfigs;
      
      expect(searchResults.some(config => config.configDescription.includes('密码'))).toBe(true);
    });
  });

  describe('配置分类管理', () => {
    it('应该能够切换配置分类', async () => {
      await wrapper.vm.switchCategory('SECURITY');
      
      expect(wrapper.vm.activeCategory).toBe('SECURITY');
    });

    it('应该能够获取分类配置数量', () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      const basicCount = wrapper.vm.getCategoryConfigCount('BASIC');
      const securityCount = wrapper.vm.getCategoryConfigCount('SECURITY');
      
      expect(basicCount).toBe(2);
      expect(securityCount).toBe(1);
    });

    it('应该能够获取分类标签', () => {
      const basicLabel = wrapper.vm.getCategoryLabel('BASIC');
      const securityLabel = wrapper.vm.getCategoryLabel('SECURITY');
      
      expect(basicLabel).toBe('基础设置');
      expect(securityLabel).toBe('安全设置');
    });

    it('应该能够获取分类图标', () => {
      const basicIcon = wrapper.vm.getCategoryIcon('BASIC');
      const securityIcon = wrapper.vm.getCategoryIcon('SECURITY');
      
      expect(basicIcon).toBe('Setting');
      expect(securityIcon).toBe('Lock');
    });
  });

  describe('配置项编辑', () => {
    it('应该能够打开编辑配置对话框', async () => {
      await wrapper.vm.editConfig(mockSystemConfigs[0]);
      
      expect(wrapper.vm.showConfigDialog).toBe(true);
      expect(wrapper.vm.isEditMode).toBe(true);
      expect(wrapper.vm.currentConfig).toEqual(mockSystemConfigs[0]);
    });

    it('应该能够打开新增配置对话框', async () => {
      await wrapper.vm.addConfig();
      
      expect(wrapper.vm.showConfigDialog).toBe(true);
      expect(wrapper.vm.isEditMode).toBe(false);
      expect(wrapper.vm.currentConfig).toEqual({
        configKey: '',
        configValue: '',
        configDescription: '',
        configType: 'STRING',
        configCategory: wrapper.vm.activeCategory,
        isEditable: true,
        isVisible: true,
        defaultValue: '',
        validationRule: '',
        sortOrder: 1
      });
    });

    it('应该能够保存配置修改', async () => {
      const { updateSystemConfig } = require('../../frontend/src/api/system-config');
      
      wrapper.vm.currentConfig = {
        ...mockSystemConfigs[0],
        configValue: '新的系统标题'
      };
      wrapper.vm.isEditMode = true;
      
      await wrapper.vm.saveConfig();
      
      expect(updateSystemConfig).toHaveBeenCalledWith(1, expect.objectContaining({
        configValue: '新的系统标题'
      }));
      expect(ElMessage.success).toHaveBeenCalledWith('配置保存成功');
    });

    it('应该能够创建新配置', async () => {
      const { createSystemConfig } = require('../../frontend/src/api/system-config');
      
      wrapper.vm.currentConfig = {
        configKey: 'new.config.key',
        configValue: 'new value',
        configDescription: '新配置项',
        configType: 'STRING',
        configCategory: 'BASIC',
        isEditable: true,
        isVisible: true,
        defaultValue: '',
        validationRule: '',
        sortOrder: 1
      };
      wrapper.vm.isEditMode = false;
      
      await wrapper.vm.saveConfig();
      
      expect(createSystemConfig).toHaveBeenCalledWith(expect.objectContaining({
        configKey: 'new.config.key',
        configValue: 'new value'
      }));
      expect(ElMessage.success).toHaveBeenCalledWith('配置创建成功');
    });

    it('应该能够取消配置编辑', async () => {
      wrapper.vm.showConfigDialog = true;
      wrapper.vm.currentConfig = mockSystemConfigs[0];
      
      await wrapper.vm.cancelEdit();
      
      expect(wrapper.vm.showConfigDialog).toBe(false);
      expect(wrapper.vm.currentConfig).toEqual({});
    });

    it('应该能够删除配置项', async () => {
      const { deleteSystemConfig } = require('../../frontend/src/api/system-config');
      deleteSystemConfig.mockResolvedValue({ success: true });
      
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.deleteConfig(mockSystemConfigs[0]);
      
      expect(ElMessageBox.confirm).toHaveBeenCalled();
      expect(deleteSystemConfig).toHaveBeenCalledWith(1);
      expect(ElMessage.success).toHaveBeenCalledWith('配置删除成功');
    });
  });

  describe('配置验证', () => {
    it('应该能够验证必填字段', () => {
      const config = {
        configKey: '',
        configValue: 'test',
        configDescription: '测试配置',
        validationRule: 'required'
      };
      
      const isValid = wrapper.vm.validateConfig(config);
      
      expect(isValid).toBe(false);
    });

    it('应该能够验证数字类型配置', () => {
      const config = {
        configKey: 'test.number',
        configValue: 'abc',
        configType: 'NUMBER',
        validationRule: 'min:1,max:100'
      };
      
      const isValid = wrapper.vm.validateConfig(config);
      
      expect(isValid).toBe(false);
    });

    it('应该能够验证布尔类型配置', () => {
      const config = {
        configKey: 'test.boolean',
        configValue: 'maybe',
        configType: 'BOOLEAN'
      };
      
      const isValid = wrapper.vm.validateConfig(config);
      
      expect(isValid).toBe(false);
    });

    it('应该能够验证邮箱格式', () => {
      const config = {
        configKey: 'test.email',
        configValue: 'invalid-email',
        validationRule: 'email'
      };
      
      const isValid = wrapper.vm.validateConfig(config);
      
      expect(isValid).toBe(false);
    });

    it('应该能够验证URL格式', () => {
      const config = {
        configKey: 'test.url',
        configValue: 'not-a-url',
        validationRule: 'url'
      };
      
      const isValid = wrapper.vm.validateConfig(config);
      
      expect(isValid).toBe(false);
    });

    it('应该能够验证字符串长度', () => {
      const config = {
        configKey: 'test.string',
        configValue: 'ab',
        validationRule: 'min:5,max:20'
      };
      
      const isValid = wrapper.vm.validateConfig(config);
      
      expect(isValid).toBe(false);
    });
  });

  describe('配置类型处理', () => {
    it('应该能够渲染字符串类型配置', () => {
      const config = {
        configType: 'STRING',
        configValue: '测试字符串'
      };
      
      const component = wrapper.vm.getConfigInputComponent(config);
      
      expect(component).toBe('el-input');
    });

    it('应该能够渲染数字类型配置', () => {
      const config = {
        configType: 'NUMBER',
        configValue: '123'
      };
      
      const component = wrapper.vm.getConfigInputComponent(config);
      
      expect(component).toBe('el-input-number');
    });

    it('应该能够渲染布尔类型配置', () => {
      const config = {
        configType: 'BOOLEAN',
        configValue: 'true'
      };
      
      const component = wrapper.vm.getConfigInputComponent(config);
      
      expect(component).toBe('el-switch');
    });

    it('应该能够渲染文件类型配置', () => {
      const config = {
        configType: 'FILE',
        configValue: '/path/to/file'
      };
      
      const component = wrapper.vm.getConfigInputComponent(config);
      
      expect(component).toBe('el-upload');
    });

    it('应该能够格式化配置值显示', () => {
      expect(wrapper.vm.formatConfigValue('true', 'BOOLEAN')).toBe('是');
      expect(wrapper.vm.formatConfigValue('false', 'BOOLEAN')).toBe('否');
      expect(wrapper.vm.formatConfigValue('123', 'NUMBER')).toBe('123');
      expect(wrapper.vm.formatConfigValue('test', 'STRING')).toBe('test');
    });

    it('应该能够转换配置值类型', () => {
      expect(wrapper.vm.convertConfigValue('123', 'NUMBER')).toBe(123);
      expect(wrapper.vm.convertConfigValue('true', 'BOOLEAN')).toBe(true);
      expect(wrapper.vm.convertConfigValue('false', 'BOOLEAN')).toBe(false);
      expect(wrapper.vm.convertConfigValue('test', 'STRING')).toBe('test');
    });
  });

  describe('批量操作', () => {
    it('应该能够批量更新配置', async () => {
      const { batchUpdateSystemConfigs } = require('../../frontend/src/api/system-config');
      batchUpdateSystemConfigs.mockResolvedValue({ success: true });
      
      const updates = [
        { id: 1, configValue: '新标题' },
        { id: 2, configValue: '/new/logo.png' }
      ];
      
      await wrapper.vm.batchUpdateConfigs(updates);
      
      expect(batchUpdateSystemConfigs).toHaveBeenCalledWith(updates);
      expect(ElMessage.success).toHaveBeenCalledWith('批量更新成功');
    });

    it('应该能够重置配置到默认值', async () => {
      const { resetSystemConfigs } = require('../../frontend/src/api/system-config');
      resetSystemConfigs.mockResolvedValue({ success: true });
      
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.resetToDefaults();
      
      expect(ElMessageBox.confirm).toHaveBeenCalled();
      expect(resetSystemConfigs).toHaveBeenCalled();
      expect(ElMessage.success).toHaveBeenCalledWith('配置重置成功');
    });

    it('应该能够重置单个配置到默认值', async () => {
      const { updateSystemConfig } = require('../../frontend/src/api/system-config');
      
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.resetConfigToDefault(mockSystemConfigs[0]);
      
      expect(updateSystemConfig).toHaveBeenCalledWith(1, expect.objectContaining({
        configValue: mockSystemConfigs[0].defaultValue
      }));
      expect(ElMessage.success).toHaveBeenCalledWith('配置重置成功');
    });
  });

  describe('配置导入导出', () => {
    it('应该能够导出配置', async () => {
      const { exportSystemConfigs } = require('../../frontend/src/api/system-config');
      exportSystemConfigs.mockResolvedValue({ success: true });
      
      await wrapper.vm.exportConfigs();
      
      expect(exportSystemConfigs).toHaveBeenCalled();
      expect(ElMessage.success).toHaveBeenCalledWith('配置导出成功');
    });

    it('应该能够导出指定分类的配置', async () => {
      const { exportSystemConfigs } = require('../../frontend/src/api/system-config');
      exportSystemConfigs.mockResolvedValue({ success: true });
      
      await wrapper.vm.exportConfigsByCategory('SECURITY');
      
      expect(exportSystemConfigs).toHaveBeenCalledWith(expect.objectContaining({
        category: 'SECURITY'
      }));
      expect(ElMessage.success).toHaveBeenCalledWith('配置导出成功');
    });

    it('应该能够导入配置', async () => {
      const { importSystemConfigs } = require('../../frontend/src/api/system-config');
      importSystemConfigs.mockResolvedValue({ success: true, imported: 5 });
      
      const file = new File(['config data'], 'configs.json', { type: 'application/json' });
      
      await wrapper.vm.importConfigs(file);
      
      expect(importSystemConfigs).toHaveBeenCalledWith(file);
      expect(ElMessage.success).toHaveBeenCalledWith('成功导入 5 个配置项');
    });

    it('应该能够验证导入文件格式', () => {
      const validFile = new File(['{}'], 'config.json', { type: 'application/json' });
      const invalidFile = new File(['data'], 'config.txt', { type: 'text/plain' });
      
      expect(wrapper.vm.validateImportFile(validFile)).toBe(true);
      expect(wrapper.vm.validateImportFile(invalidFile)).toBe(false);
    });
  });

  describe('配置搜索和筛选', () => {
    it('应该能够按关键词搜索配置', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      await wrapper.vm.searchConfigs('密码');
      
      const results = wrapper.vm.searchedConfigs;
      expect(results.some(config => 
        config.configKey.includes('password') || 
        config.configDescription.includes('密码')
      )).toBe(true);
    });

    it('应该能够按配置类型筛选', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      await wrapper.vm.filterByType('BOOLEAN');
      
      const results = wrapper.vm.filteredConfigs;
      expect(results.every(config => config.configType === 'BOOLEAN')).toBe(true);
    });

    it('应该能够按是否可编辑筛选', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      await wrapper.vm.filterByEditable(true);
      
      const results = wrapper.vm.filteredConfigs;
      expect(results.every(config => config.isEditable === true)).toBe(true);
    });

    it('应该能够清空搜索条件', async () => {
      wrapper.vm.searchKeyword = '测试';
      wrapper.vm.typeFilter = 'STRING';
      wrapper.vm.editableFilter = true;
      
      await wrapper.vm.clearFilters();
      
      expect(wrapper.vm.searchKeyword).toBe('');
      expect(wrapper.vm.typeFilter).toBe('');
      expect(wrapper.vm.editableFilter).toBe(null);
    });
  });

  describe('配置排序', () => {
    it('应该能够按配置键排序', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      await wrapper.vm.sortByKey();
      
      const sortedConfigs = wrapper.vm.sortedConfigs;
      for (let i = 1; i < sortedConfigs.length; i++) {
        expect(sortedConfigs[i].configKey >= sortedConfigs[i-1].configKey).toBe(true);
      }
    });

    it('应该能够按更新时间排序', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      await wrapper.vm.sortByUpdateTime();
      
      const sortedConfigs = wrapper.vm.sortedConfigs;
      for (let i = 1; i < sortedConfigs.length; i++) {
        expect(new Date(sortedConfigs[i].updateTime) <= new Date(sortedConfigs[i-1].updateTime)).toBe(true);
      }
    });

    it('应该能够按排序顺序排序', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      await wrapper.vm.sortBySortOrder();
      
      const sortedConfigs = wrapper.vm.sortedConfigs;
      for (let i = 1; i < sortedConfigs.length; i++) {
        expect(sortedConfigs[i].sortOrder >= sortedConfigs[i-1].sortOrder).toBe(true);
      }
    });
  });

  describe('错误处理', () => {
    it('应该处理加载配置失败的情况', async () => {
      const { getSystemConfigs } = require('../../frontend/src/api/system-config');
      getSystemConfigs.mockRejectedValue(new Error('网络错误'));
      
      await wrapper.vm.loadSystemConfigs();
      
      expect(ElMessage.error).toHaveBeenCalledWith('加载系统配置失败');
    });

    it('应该处理保存配置失败的情况', async () => {
      const { updateSystemConfig } = require('../../frontend/src/api/system-config');
      updateSystemConfig.mockRejectedValue(new Error('保存失败'));
      
      wrapper.vm.currentConfig = mockSystemConfigs[0];
      wrapper.vm.isEditMode = true;
      
      await wrapper.vm.saveConfig();
      
      expect(ElMessage.error).toHaveBeenCalledWith('配置保存失败');
    });

    it('应该处理删除配置失败的情况', async () => {
      const { deleteSystemConfig } = require('../../frontend/src/api/system-config');
      deleteSystemConfig.mockRejectedValue(new Error('删除失败'));
      
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.deleteConfig(mockSystemConfigs[0]);
      
      expect(ElMessage.error).toHaveBeenCalledWith('配置删除失败');
    });

    it('应该处理导入配置失败的情况', async () => {
      const { importSystemConfigs } = require('../../frontend/src/api/system-config');
      importSystemConfigs.mockRejectedValue(new Error('导入失败'));
      
      const file = new File(['invalid data'], 'config.json', { type: 'application/json' });
      
      await wrapper.vm.importConfigs(file);
      
      expect(ElMessage.error).toHaveBeenCalledWith('配置导入失败');
    });

    it('应该处理配置验证失败的情况', async () => {
      wrapper.vm.currentConfig = {
        configKey: '',
        configValue: '',
        configDescription: '',
        validationRule: 'required'
      };
      
      await wrapper.vm.saveConfig();
      
      expect(ElMessage.error).toHaveBeenCalledWith('配置验证失败，请检查输入');
    });
  });

  describe('权限控制', () => {
    it('应该能够检查编辑权限', () => {
      const hasEditPermission = wrapper.vm.hasEditPermission(mockSystemConfigs[0]);
      
      expect(typeof hasEditPermission).toBe('boolean');
    });

    it('应该能够检查删除权限', () => {
      const hasDeletePermission = wrapper.vm.hasDeletePermission(mockSystemConfigs[0]);
      
      expect(typeof hasDeletePermission).toBe('boolean');
    });

    it('应该能够检查导入导出权限', () => {
      const hasImportPermission = wrapper.vm.hasImportPermission();
      const hasExportPermission = wrapper.vm.hasExportPermission();
      
      expect(typeof hasImportPermission).toBe('boolean');
      expect(typeof hasExportPermission).toBe('boolean');
    });

    it('应该能够检查重置权限', () => {
      const hasResetPermission = wrapper.vm.hasResetPermission();
      
      expect(typeof hasResetPermission).toBe('boolean');
    });
  });

  describe('响应式设计', () => {
    it('应该能够适配移动端显示', async () => {
      wrapper.vm.isMobile = true;
      
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.tableLayout).toBe('mobile');
    });

    it('应该能够调整表格列宽', async () => {
      wrapper.vm.windowWidth = 800;
      
      const columnWidth = wrapper.vm.calculateColumnWidth();
      
      expect(columnWidth).toBeGreaterThan(0);
    });
  });

  describe('性能优化', () => {
    it('应该能够防抖搜索', async () => {
      const searchSpy = vi.spyOn(wrapper.vm, 'searchConfigs');
      
      // 快速连续输入
      wrapper.vm.debouncedSearch('test');
      wrapper.vm.debouncedSearch('test1');
      wrapper.vm.debouncedSearch('test12');
      
      // 等待防抖延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('test12');
    });

    it('应该能够缓存配置数据', async () => {
      wrapper.vm.systemConfigs = mockSystemConfigs;
      
      wrapper.vm.cacheConfigs();
      
      const cachedConfigs = wrapper.vm.getCachedConfigs();
      expect(cachedConfigs).toEqual(mockSystemConfigs);
    });

    it('应该能够清除配置缓存', async () => {
      wrapper.vm.cacheConfigs();
      
      wrapper.vm.clearConfigCache();
      
      const cachedConfigs = wrapper.vm.getCachedConfigs();
      expect(cachedConfigs).toBeNull();
    });
  });
});