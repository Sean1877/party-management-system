import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import FeeManagement from '../../frontend/src/views/fee/index.vue';

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
vi.mock('../../frontend/src/api/fee', () => ({
  getFeeStandards: vi.fn(),
  createFeeStandard: vi.fn(),
  updateFeeStandard: vi.fn(),
  deleteFeeStandard: vi.fn(),
  getFeePayments: vi.fn(),
  createFeePayment: vi.fn(),
  updateFeePayment: vi.fn(),
  deleteFeePayment: vi.fn(),
  exportFeeData: vi.fn()
}));

// Mock ECharts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn()
  })),
  dispose: vi.fn()
}));

describe('FeeManagement.vue', () => {
  let wrapper;
  
  const mockFeeStandards = [
    {
      id: 1,
      incomeRange: '3000-5000',
      feeAmount: 30.00,
      feeRate: 0.01,
      status: 'ACTIVE',
      effectiveDate: '2024-01-01',
      description: '月收入3000-5000元标准'
    },
    {
      id: 2,
      incomeRange: '5000-8000',
      feeAmount: 50.00,
      feeRate: 0.01,
      status: 'ACTIVE',
      effectiveDate: '2024-01-01',
      description: '月收入5000-8000元标准'
    }
  ];
  
  const mockFeePayments = [
    {
      id: 1,
      userId: 1,
      userName: '张三',
      organizationName: '第一党支部',
      amount: 30.00,
      paymentDate: '2024-01-15',
      paymentMethod: 'BANK_TRANSFER',
      status: 'PAID',
      period: '2024-01',
      remark: '按时缴费'
    },
    {
      id: 2,
      userId: 2,
      userName: '李四',
      organizationName: '第二党支部',
      amount: 50.00,
      paymentDate: '2024-01-20',
      paymentMethod: 'CASH',
      status: 'PAID',
      period: '2024-01',
      remark: '现金缴费'
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    const { getFeeStandards, getFeePayments } = require('../../frontend/src/api/fee');
    getFeeStandards.mockResolvedValue({ data: mockFeeStandards });
    getFeePayments.mockResolvedValue({ data: mockFeePayments });
    
    wrapper = mount(FeeManagement, {
      global: {
        stubs: {
          'el-tabs': true,
          'el-tab-pane': true,
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-date-picker': true,
          'el-form': true,
          'el-form-item': true,
          'el-dialog': true,
          'el-pagination': true,
          'el-tag': true
        }
      }
    });
  });

  describe('组件初始化', () => {
    it('应该正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('应该在挂载时加载数据', async () => {
      const { getFeeStandards, getFeePayments } = require('../../frontend/src/api/fee');
      
      await wrapper.vm.$nextTick();
      
      expect(getFeeStandards).toHaveBeenCalled();
      expect(getFeePayments).toHaveBeenCalled();
    });

    it('应该正确设置初始数据', () => {
      expect(wrapper.vm.activeTab).toBe('standards');
      expect(wrapper.vm.standardsData).toEqual([]);
      expect(wrapper.vm.paymentsData).toEqual([]);
      expect(wrapper.vm.loading).toBe(false);
    });
  });

  describe('党费标准管理', () => {
    it('应该能够显示党费标准列表', async () => {
      await wrapper.vm.loadStandards();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.standardsData).toEqual(mockFeeStandards);
    });

    it('应该能够打开新增标准对话框', async () => {
      await wrapper.vm.handleAddStandard();
      
      expect(wrapper.vm.standardDialogVisible).toBe(true);
      expect(wrapper.vm.standardDialogTitle).toBe('新增党费标准');
      expect(wrapper.vm.standardForm).toEqual({
        incomeRange: '',
        feeAmount: '',
        feeRate: '',
        status: 'ACTIVE',
        effectiveDate: '',
        description: ''
      });
    });

    it('应该能够打开编辑标准对话框', async () => {
      const standard = mockFeeStandards[0];
      await wrapper.vm.handleEditStandard(standard);
      
      expect(wrapper.vm.standardDialogVisible).toBe(true);
      expect(wrapper.vm.standardDialogTitle).toBe('编辑党费标准');
      expect(wrapper.vm.standardForm.id).toBe(standard.id);
      expect(wrapper.vm.standardForm.incomeRange).toBe(standard.incomeRange);
    });

    it('应该能够提交新增标准表单', async () => {
      const { createFeeStandard } = require('../../frontend/src/api/fee');
      createFeeStandard.mockResolvedValue({ success: true });
      
      wrapper.vm.standardForm = {
        incomeRange: '8000-10000',
        feeAmount: 80,
        feeRate: 0.01,
        status: 'ACTIVE',
        effectiveDate: '2024-02-01',
        description: '月收入8000-10000元标准'
      };
      
      await wrapper.vm.submitStandardForm();
      
      expect(createFeeStandard).toHaveBeenCalledWith(wrapper.vm.standardForm);
      expect(ElMessage.success).toHaveBeenCalledWith('党费标准创建成功');
    });

    it('应该能够提交编辑标准表单', async () => {
      const { updateFeeStandard } = require('../../frontend/src/api/fee');
      updateFeeStandard.mockResolvedValue({ success: true });
      
      wrapper.vm.standardForm = {
        id: 1,
        incomeRange: '3000-5000',
        feeAmount: 35,
        feeRate: 0.01,
        status: 'ACTIVE',
        effectiveDate: '2024-01-01',
        description: '月收入3000-5000元标准（已更新）'
      };
      
      await wrapper.vm.submitStandardForm();
      
      expect(updateFeeStandard).toHaveBeenCalledWith(1, wrapper.vm.standardForm);
      expect(ElMessage.success).toHaveBeenCalledWith('党费标准更新成功');
    });

    it('应该能够删除党费标准', async () => {
      const { deleteFeeStandard } = require('../../frontend/src/api/fee');
      deleteFeeStandard.mockResolvedValue({ success: true });
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.handleDeleteStandard(1);
      
      expect(ElMessageBox.confirm).toHaveBeenCalled();
      expect(deleteFeeStandard).toHaveBeenCalledWith(1);
      expect(ElMessage.success).toHaveBeenCalledWith('党费标准删除成功');
    });

    it('应该验证标准表单数据', () => {
      const rules = wrapper.vm.standardRules;
      
      expect(rules.incomeRange).toBeDefined();
      expect(rules.feeAmount).toBeDefined();
      expect(rules.effectiveDate).toBeDefined();
      
      // 测试收入范围验证
      const incomeRangeRule = rules.incomeRange[0];
      expect(incomeRangeRule.required).toBe(true);
      expect(incomeRangeRule.message).toBe('请输入收入范围');
    });
  });

  describe('党费缴费记录管理', () => {
    beforeEach(() => {
      wrapper.vm.activeTab = 'payments';
    });

    it('应该能够显示缴费记录列表', async () => {
      await wrapper.vm.loadPayments();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.paymentsData).toEqual(mockFeePayments);
    });

    it('应该能够打开新增缴费记录对话框', async () => {
      await wrapper.vm.handleAddPayment();
      
      expect(wrapper.vm.paymentDialogVisible).toBe(true);
      expect(wrapper.vm.paymentDialogTitle).toBe('新增缴费记录');
      expect(wrapper.vm.paymentForm).toEqual({
        userId: '',
        amount: '',
        paymentDate: '',
        paymentMethod: 'BANK_TRANSFER',
        period: '',
        remark: ''
      });
    });

    it('应该能够打开编辑缴费记录对话框', async () => {
      const payment = mockFeePayments[0];
      await wrapper.vm.handleEditPayment(payment);
      
      expect(wrapper.vm.paymentDialogVisible).toBe(true);
      expect(wrapper.vm.paymentDialogTitle).toBe('编辑缴费记录');
      expect(wrapper.vm.paymentForm.id).toBe(payment.id);
      expect(wrapper.vm.paymentForm.userId).toBe(payment.userId);
    });

    it('应该能够提交新增缴费记录表单', async () => {
      const { createFeePayment } = require('../../frontend/src/api/fee');
      createFeePayment.mockResolvedValue({ success: true });
      
      wrapper.vm.paymentForm = {
        userId: 3,
        amount: 40,
        paymentDate: '2024-02-15',
        paymentMethod: 'ONLINE',
        period: '2024-02',
        remark: '在线支付'
      };
      
      await wrapper.vm.submitPaymentForm();
      
      expect(createFeePayment).toHaveBeenCalledWith(wrapper.vm.paymentForm);
      expect(ElMessage.success).toHaveBeenCalledWith('缴费记录创建成功');
    });

    it('应该能够删除缴费记录', async () => {
      const { deleteFeePayment } = require('../../frontend/src/api/fee');
      deleteFeePayment.mockResolvedValue({ success: true });
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.handleDeletePayment(1);
      
      expect(ElMessageBox.confirm).toHaveBeenCalled();
      expect(deleteFeePayment).toHaveBeenCalledWith(1);
      expect(ElMessage.success).toHaveBeenCalledWith('缴费记录删除成功');
    });

    it('应该验证缴费记录表单数据', () => {
      const rules = wrapper.vm.paymentRules;
      
      expect(rules.userId).toBeDefined();
      expect(rules.amount).toBeDefined();
      expect(rules.paymentDate).toBeDefined();
      expect(rules.period).toBeDefined();
      
      // 测试金额验证
      const amountRule = rules.amount[0];
      expect(amountRule.required).toBe(true);
      expect(amountRule.message).toBe('请输入缴费金额');
    });
  });

  describe('数据筛选和搜索', () => {
    it('应该能够根据状态筛选党费标准', async () => {
      wrapper.vm.standardsData = mockFeeStandards;
      wrapper.vm.standardFilters.status = 'ACTIVE';
      
      const filteredData = wrapper.vm.filteredStandardsData;
      
      expect(filteredData.every(item => item.status === 'ACTIVE')).toBe(true);
    });

    it('应该能够根据关键词搜索党费标准', async () => {
      wrapper.vm.standardsData = mockFeeStandards;
      wrapper.vm.standardFilters.keyword = '3000';
      
      const filteredData = wrapper.vm.filteredStandardsData;
      
      expect(filteredData.some(item => item.incomeRange.includes('3000'))).toBe(true);
    });

    it('应该能够根据状态筛选缴费记录', async () => {
      wrapper.vm.paymentsData = mockFeePayments;
      wrapper.vm.paymentFilters.status = 'PAID';
      
      const filteredData = wrapper.vm.filteredPaymentsData;
      
      expect(filteredData.every(item => item.status === 'PAID')).toBe(true);
    });

    it('应该能够根据日期范围筛选缴费记录', async () => {
      wrapper.vm.paymentsData = mockFeePayments;
      wrapper.vm.paymentFilters.dateRange = ['2024-01-01', '2024-01-31'];
      
      const filteredData = wrapper.vm.filteredPaymentsData;
      
      expect(filteredData.every(item => {
        const paymentDate = new Date(item.paymentDate);
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');
        return paymentDate >= startDate && paymentDate <= endDate;
      })).toBe(true);
    });
  });

  describe('数据导出功能', () => {
    it('应该能够导出党费标准数据', async () => {
      const { exportFeeData } = require('../../frontend/src/api/fee');
      exportFeeData.mockResolvedValue({ success: true });
      
      await wrapper.vm.exportStandards();
      
      expect(exportFeeData).toHaveBeenCalledWith('standards', expect.any(Object));
      expect(ElMessage.success).toHaveBeenCalledWith('导出成功');
    });

    it('应该能够导出缴费记录数据', async () => {
      const { exportFeeData } = require('../../frontend/src/api/fee');
      exportFeeData.mockResolvedValue({ success: true });
      
      await wrapper.vm.exportPayments();
      
      expect(exportFeeData).toHaveBeenCalledWith('payments', expect.any(Object));
      expect(ElMessage.success).toHaveBeenCalledWith('导出成功');
    });
  });

  describe('统计数据', () => {
    it('应该正确计算统计数据', async () => {
      wrapper.vm.paymentsData = mockFeePayments;
      
      await wrapper.vm.$nextTick();
      
      const stats = wrapper.vm.paymentStats;
      
      expect(stats.totalAmount).toBe(80); // 30 + 50
      expect(stats.totalCount).toBe(2);
      expect(stats.paidCount).toBe(2);
      expect(stats.unpaidCount).toBe(0);
    });

    it('应该正确计算月度趋势数据', async () => {
      wrapper.vm.paymentsData = mockFeePayments;
      
      const trendData = wrapper.vm.monthlyTrendData;
      
      expect(trendData).toBeInstanceOf(Array);
      expect(trendData.length).toBeGreaterThan(0);
    });
  });

  describe('错误处理', () => {
    it('应该处理加载数据失败的情况', async () => {
      const { getFeeStandards } = require('../../frontend/src/api/fee');
      getFeeStandards.mockRejectedValue(new Error('网络错误'));
      
      await wrapper.vm.loadStandards();
      
      expect(ElMessage.error).toHaveBeenCalledWith('加载党费标准失败');
    });

    it('应该处理创建数据失败的情况', async () => {
      const { createFeeStandard } = require('../../frontend/src/api/fee');
      createFeeStandard.mockRejectedValue(new Error('服务器错误'));
      
      wrapper.vm.standardForm = {
        incomeRange: '8000-10000',
        feeAmount: 80,
        feeRate: 0.01,
        status: 'ACTIVE',
        effectiveDate: '2024-02-01',
        description: '测试标准'
      };
      
      await wrapper.vm.submitStandardForm();
      
      expect(ElMessage.error).toHaveBeenCalledWith('党费标准创建失败');
    });

    it('应该处理删除数据失败的情况', async () => {
      const { deleteFeeStandard } = require('../../frontend/src/api/fee');
      deleteFeeStandard.mockRejectedValue(new Error('删除失败'));
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.handleDeleteStandard(1);
      
      expect(ElMessage.error).toHaveBeenCalledWith('党费标准删除失败');
    });
  });

  describe('表单验证', () => {
    it('应该验证必填字段', async () => {
      wrapper.vm.standardForm = {
        incomeRange: '',
        feeAmount: '',
        feeRate: '',
        status: 'ACTIVE',
        effectiveDate: '',
        description: ''
      };
      
      const isValid = await wrapper.vm.validateStandardForm();
      
      expect(isValid).toBe(false);
    });

    it('应该验证数值字段的格式', async () => {
      wrapper.vm.standardForm = {
        incomeRange: '3000-5000',
        feeAmount: 'invalid',
        feeRate: 0.01,
        status: 'ACTIVE',
        effectiveDate: '2024-01-01',
        description: '测试'
      };
      
      const isValid = await wrapper.vm.validateStandardForm();
      
      expect(isValid).toBe(false);
    });

    it('应该验证日期字段的格式', async () => {
      wrapper.vm.paymentForm = {
        userId: 1,
        amount: 30,
        paymentDate: 'invalid-date',
        paymentMethod: 'BANK_TRANSFER',
        period: '2024-01',
        remark: ''
      };
      
      const isValid = await wrapper.vm.validatePaymentForm();
      
      expect(isValid).toBe(false);
    });
  });

  describe('分页功能', () => {
    it('应该正确处理分页参数', async () => {
      wrapper.vm.standardsPagination.currentPage = 2;
      wrapper.vm.standardsPagination.pageSize = 10;
      
      await wrapper.vm.handleStandardsPageChange(3);
      
      expect(wrapper.vm.standardsPagination.currentPage).toBe(3);
    });

    it('应该正确处理页面大小变化', async () => {
      await wrapper.vm.handleStandardsPageSizeChange(20);
      
      expect(wrapper.vm.standardsPagination.pageSize).toBe(20);
      expect(wrapper.vm.standardsPagination.currentPage).toBe(1);
    });
  });
});