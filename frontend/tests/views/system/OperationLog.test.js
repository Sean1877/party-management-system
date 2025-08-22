import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import OperationLog from '@/views/system/operation-log/index.vue'

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
}))

// Mock API calls
vi.mock('@/api/operation-log', () => ({
  getOperationLogs: vi.fn(),
  getOperationLogById: vi.fn(),
  deleteOperationLog: vi.fn(),
  batchDeleteOperationLogs: vi.fn(),
  exportOperationLogs: vi.fn(),
  getOperationLogStats: vi.fn(),
  searchOperationLogs: vi.fn()
}))

// Mock router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('OperationLog.vue', () => {
  let wrapper
  
  const mockOperationLogs = [
    {
      id: 1,
      userId: 1,
      username: '张三',
      operationType: 'CREATE',
      operationModule: 'USER_MANAGEMENT',
      operationDescription: '创建用户',
      operationDetails: '创建用户：李四',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0',
      operationTime: '2024-01-15 10:30:00',
      executionTime: 150,
      operationResult: 'SUCCESS',
      errorMessage: null
    },
    {
      id: 2,
      userId: 2,
      username: '李四',
      operationType: 'UPDATE',
      operationModule: 'ORGANIZATION_MANAGEMENT',
      operationDescription: '更新组织信息',
      operationDetails: '更新组织：第一党支部',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0',
      operationTime: '2024-01-15 11:00:00',
      executionTime: 200,
      operationResult: 'SUCCESS',
      errorMessage: null
    },
    {
      id: 3,
      userId: 1,
      username: '张三',
      operationType: 'DELETE',
      operationModule: 'ACTIVITY_MANAGEMENT',
      operationDescription: '删除活动',
      operationDetails: '删除活动：党课学习',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0',
      operationTime: '2024-01-15 14:20:00',
      executionTime: 100,
      operationResult: 'FAILED',
      errorMessage: '权限不足'
    }
  ]
  
  const mockPaginationData = {
    content: mockOperationLogs,
    totalElements: 50,
    totalPages: 5,
    size: 10,
    number: 0
  }
  
  const mockOperationLogStats = {
    totalOperations: 1250,
    todayOperations: 45,
    successRate: 95.2,
    averageExecutionTime: 180,
    operationTypeStats: [
      { type: 'CREATE', count: 400, percentage: 32 },
      { type: 'UPDATE', count: 350, percentage: 28 },
      { type: 'DELETE', count: 200, percentage: 16 },
      { type: 'QUERY', count: 300, percentage: 24 }
    ],
    operationModuleStats: [
      { module: 'USER_MANAGEMENT', count: 300, percentage: 24 },
      { module: 'ORGANIZATION_MANAGEMENT', count: 250, percentage: 20 },
      { module: 'ACTIVITY_MANAGEMENT', count: 200, percentage: 16 },
      { module: 'FEE_MANAGEMENT', count: 150, percentage: 12 },
      { module: 'SYSTEM_MANAGEMENT', count: 350, percentage: 28 }
    ]
  }

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Setup default mock implementations
    const {
      getOperationLogs,
      getOperationLogById,
      getOperationLogStats,
      searchOperationLogs
    } = require('@/api/operation-log')
    
    getOperationLogs.mockResolvedValue({ data: mockPaginationData })
    getOperationLogById.mockResolvedValue({ data: mockOperationLogs[0] })
    getOperationLogStats.mockResolvedValue({ data: mockOperationLogStats })
    searchOperationLogs.mockResolvedValue({ data: mockPaginationData })
    
    wrapper = mount(OperationLog, {
      global: {
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-date-picker': true,
          'el-button': true,
          'el-table': true,
          'el-table-column': true,
          'el-tag': true,
          'el-pagination': true,
          'el-dialog': true,
          'el-descriptions': true,
          'el-descriptions-item': true,
          'el-statistic': true,
          'el-progress': true,
          'el-tooltip': true,
          'el-popover': true
        }
      }
    })
  })

  describe('组件初始化', () => {
    it('应该正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('应该在挂载时加载数据', async () => {
      const { getOperationLogs, getOperationLogStats } = require('@/api/operation-log')
      
      await wrapper.vm.$nextTick()
      
      expect(getOperationLogs).toHaveBeenCalled()
      expect(getOperationLogStats).toHaveBeenCalled()
    })

    it('应该正确设置初始数据', () => {
      expect(wrapper.vm.operationLogs).toEqual([])
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.total).toBe(0)
      expect(wrapper.vm.currentPage).toBe(1)
      expect(wrapper.vm.pageSize).toBe(10)
      expect(wrapper.vm.searchForm).toEqual({
        keyword: '',
        operationType: '',
        operationModule: '',
        operationResult: '',
        userId: '',
        ipAddress: '',
        dateRange: []
      })
    })
  })

  describe('数据加载', () => {
    it('应该能够加载操作日志列表', async () => {
      await wrapper.vm.loadOperationLogs()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.operationLogs).toEqual(mockOperationLogs)
      expect(wrapper.vm.total).toBe(50)
    })

    it('应该能够加载操作日志统计数据', async () => {
      await wrapper.vm.loadOperationLogStats()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.statsData).toEqual(mockOperationLogStats)
    })

    it('应该能够刷新数据', async () => {
      const { getOperationLogs } = require('@/api/operation-log')
      
      await wrapper.vm.refreshData()
      
      expect(getOperationLogs).toHaveBeenCalled()
      expect(ElMessage.success).toHaveBeenCalledWith('数据刷新成功')
    })

    it('应该能够重置搜索条件并重新加载', async () => {
      wrapper.vm.searchForm.keyword = '测试'
      wrapper.vm.searchForm.operationType = 'CREATE'
      
      await wrapper.vm.resetSearch()
      
      expect(wrapper.vm.searchForm.keyword).toBe('')
      expect(wrapper.vm.searchForm.operationType).toBe('')
    })
  })

  describe('搜索和筛选', () => {
    it('应该能够按关键词搜索', async () => {
      const { searchOperationLogs } = require('@/api/operation-log')
      
      wrapper.vm.searchForm.keyword = '创建用户'
      
      await wrapper.vm.handleSearch()
      
      expect(searchOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        keyword: '创建用户'
      }))
    })

    it('应该能够按操作类型筛选', async () => {
      wrapper.vm.searchForm.operationType = 'CREATE'
      
      await wrapper.vm.handleSearch()
      
      const { getOperationLogs } = require('@/api/operation-log')
      expect(getOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        operationType: 'CREATE'
      }))
    })

    it('应该能够按操作模块筛选', async () => {
      wrapper.vm.searchForm.operationModule = 'USER_MANAGEMENT'
      
      await wrapper.vm.handleSearch()
      
      const { getOperationLogs } = require('@/api/operation-log')
      expect(getOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        operationModule: 'USER_MANAGEMENT'
      }))
    })

    it('应该能够按操作结果筛选', async () => {
      wrapper.vm.searchForm.operationResult = 'SUCCESS'
      
      await wrapper.vm.handleSearch()
      
      const { getOperationLogs } = require('@/api/operation-log')
      expect(getOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        operationResult: 'SUCCESS'
      }))
    })

    it('应该能够按日期范围筛选', async () => {
      wrapper.vm.searchForm.dateRange = ['2024-01-01', '2024-01-31']
      
      await wrapper.vm.handleSearch()
      
      const { getOperationLogs } = require('@/api/operation-log')
      expect(getOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }))
    })

    it('应该能够组合多个搜索条件', async () => {
      wrapper.vm.searchForm = {
        keyword: '用户',
        operationType: 'CREATE',
        operationModule: 'USER_MANAGEMENT',
        operationResult: 'SUCCESS',
        userId: '1',
        ipAddress: '192.168.1.100',
        dateRange: ['2024-01-01', '2024-01-31']
      }
      
      await wrapper.vm.handleSearch()
      
      const { searchOperationLogs } = require('@/api/operation-log')
      expect(searchOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        keyword: '用户',
        operationType: 'CREATE',
        operationModule: 'USER_MANAGEMENT',
        operationResult: 'SUCCESS',
        userId: '1',
        ipAddress: '192.168.1.100',
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }))
    })
  })

  describe('分页功能', () => {
    it('应该能够处理页码变化', async () => {
      const { getOperationLogs } = require('@/api/operation-log')
      
      await wrapper.vm.handleCurrentPageChange(2)
      
      expect(wrapper.vm.currentPage).toBe(2)
      expect(getOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        page: 1 // 后端页码从0开始
      }))
    })

    it('应该能够处理页面大小变化', async () => {
      const { getOperationLogs } = require('@/api/operation-log')
      
      await wrapper.vm.handlePageSizeChange(20)
      
      expect(wrapper.vm.pageSize).toBe(20)
      expect(wrapper.vm.currentPage).toBe(1)
      expect(getOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        size: 20,
        page: 0
      }))
    })

    it('应该能够跳转到第一页', async () => {
      wrapper.vm.currentPage = 3
      
      await wrapper.vm.goToFirstPage()
      
      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('应该能够跳转到最后一页', async () => {
      wrapper.vm.total = 100
      wrapper.vm.pageSize = 10
      
      await wrapper.vm.goToLastPage()
      
      expect(wrapper.vm.currentPage).toBe(10)
    })
  })

  describe('操作日志详情', () => {
    it('应该能够查看操作日志详情', async () => {
      await wrapper.vm.viewLogDetail(1)
      
      expect(wrapper.vm.showDetailDialog).toBe(true)
      expect(wrapper.vm.currentLogDetail).toEqual(mockOperationLogs[0])
    })

    it('应该能够关闭详情对话框', async () => {
      wrapper.vm.showDetailDialog = true
      wrapper.vm.currentLogDetail = mockOperationLogs[0]
      
      await wrapper.vm.closeDetailDialog()
      
      expect(wrapper.vm.showDetailDialog).toBe(false)
      expect(wrapper.vm.currentLogDetail).toEqual({})
    })

    it('应该能够格式化操作时间', () => {
      const formattedTime = wrapper.vm.formatOperationTime('2024-01-15 10:30:00')
      
      expect(formattedTime).toBe('2024-01-15 10:30:00')
    })

    it('应该能够格式化执行时间', () => {
      const formattedTime = wrapper.vm.formatExecutionTime(1500)
      
      expect(formattedTime).toBe('1.50s')
    })

    it('应该能够获取操作类型标签样式', () => {
      expect(wrapper.vm.getOperationTypeTagType('CREATE')).toBe('success')
      expect(wrapper.vm.getOperationTypeTagType('UPDATE')).toBe('warning')
      expect(wrapper.vm.getOperationTypeTagType('DELETE')).toBe('danger')
      expect(wrapper.vm.getOperationTypeTagType('QUERY')).toBe('info')
    })

    it('应该能够获取操作结果标签样式', () => {
      expect(wrapper.vm.getOperationResultTagType('SUCCESS')).toBe('success')
      expect(wrapper.vm.getOperationResultTagType('FAILED')).toBe('danger')
      expect(wrapper.vm.getOperationResultTagType('PENDING')).toBe('warning')
    })
  })

  describe('批量操作', () => {
    it('应该能够选择操作日志', async () => {
      const selectedLogs = [mockOperationLogs[0], mockOperationLogs[1]]
      
      await wrapper.vm.handleSelectionChange(selectedLogs)
      
      expect(wrapper.vm.selectedLogs).toEqual(selectedLogs)
    })

    it('应该能够全选操作日志', async () => {
      await wrapper.vm.handleSelectAll()
      
      expect(wrapper.vm.selectedLogs.length).toBe(mockOperationLogs.length)
    })

    it('应该能够清空选择', async () => {
      wrapper.vm.selectedLogs = [mockOperationLogs[0]]
      
      await wrapper.vm.clearSelection()
      
      expect(wrapper.vm.selectedLogs).toEqual([])
    })

    it('应该能够批量删除操作日志', async () => {
      const { batchDeleteOperationLogs } = require('@/api/operation-log')
      batchDeleteOperationLogs.mockResolvedValue({ success: true })
      
      ElMessageBox.confirm.mockResolvedValue('confirm')
      
      wrapper.vm.selectedLogs = [mockOperationLogs[0], mockOperationLogs[1]]
      
      await wrapper.vm.batchDeleteLogs()
      
      expect(ElMessageBox.confirm).toHaveBeenCalled()
      expect(batchDeleteOperationLogs).toHaveBeenCalledWith([1, 2])
      expect(ElMessage.success).toHaveBeenCalledWith('批量删除成功')
    })

    it('应该能够取消批量删除', async () => {
      ElMessageBox.confirm.mockRejectedValue('cancel')
      
      wrapper.vm.selectedLogs = [mockOperationLogs[0]]
      
      await wrapper.vm.batchDeleteLogs()
      
      const { batchDeleteOperationLogs } = require('@/api/operation-log')
      expect(batchDeleteOperationLogs).not.toHaveBeenCalled()
    })
  })

  describe('数据导出', () => {
    it('应该能够导出当前页数据', async () => {
      const { exportOperationLogs } = require('@/api/operation-log')
      exportOperationLogs.mockResolvedValue({ success: true })
      
      await wrapper.vm.exportCurrentPage()
      
      expect(exportOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        exportType: 'current',
        page: 0,
        size: 10
      }))
      expect(ElMessage.success).toHaveBeenCalledWith('导出成功')
    })

    it('应该能够导出所有数据', async () => {
      const { exportOperationLogs } = require('@/api/operation-log')
      exportOperationLogs.mockResolvedValue({ success: true })
      
      await wrapper.vm.exportAllData()
      
      expect(exportOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        exportType: 'all'
      }))
      expect(ElMessage.success).toHaveBeenCalledWith('导出成功')
    })

    it('应该能够导出筛选结果', async () => {
      const { exportOperationLogs } = require('@/api/operation-log')
      exportOperationLogs.mockResolvedValue({ success: true })
      
      wrapper.vm.searchForm.operationType = 'CREATE'
      
      await wrapper.vm.exportFilteredData()
      
      expect(exportOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        exportType: 'filtered',
        operationType: 'CREATE'
      }))
      expect(ElMessage.success).toHaveBeenCalledWith('导出成功')
    })

    it('应该能够导出选中数据', async () => {
      const { exportOperationLogs } = require('@/api/operation-log')
      exportOperationLogs.mockResolvedValue({ success: true })
      
      wrapper.vm.selectedLogs = [mockOperationLogs[0], mockOperationLogs[1]]
      
      await wrapper.vm.exportSelectedData()
      
      expect(exportOperationLogs).toHaveBeenCalledWith(expect.objectContaining({
        exportType: 'selected',
        logIds: [1, 2]
      }))
      expect(ElMessage.success).toHaveBeenCalledWith('导出成功')
    })
  })

  describe('统计数据显示', () => {
    it('应该能够显示操作统计卡片', async () => {
      wrapper.vm.statsData = mockOperationLogStats
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.statsData.totalOperations).toBe(1250)
      expect(wrapper.vm.statsData.todayOperations).toBe(45)
      expect(wrapper.vm.statsData.successRate).toBe(95.2)
    })

    it('应该能够计算成功率百分比', () => {
      const successRate = wrapper.vm.calculateSuccessRate(950, 1000)
      
      expect(successRate).toBe(95)
    })

    it('应该能够格式化平均执行时间', () => {
      const formattedTime = wrapper.vm.formatAverageExecutionTime(1500)
      
      expect(formattedTime).toBe('1.50s')
    })

    it('应该能够获取操作类型分布数据', () => {
      wrapper.vm.statsData = mockOperationLogStats
      
      const typeDistribution = wrapper.vm.getOperationTypeDistribution()
      
      expect(typeDistribution).toEqual(mockOperationLogStats.operationTypeStats)
    })

    it('应该能够获取操作模块分布数据', () => {
      wrapper.vm.statsData = mockOperationLogStats
      
      const moduleDistribution = wrapper.vm.getOperationModuleDistribution()
      
      expect(moduleDistribution).toEqual(mockOperationLogStats.operationModuleStats)
    })
  })

  describe('错误处理', () => {
    it('应该处理加载数据失败的情况', async () => {
      const { getOperationLogs } = require('@/api/operation-log')
      getOperationLogs.mockRejectedValue(new Error('网络错误'))
      
      await wrapper.vm.loadOperationLogs()
      
      expect(ElMessage.error).toHaveBeenCalledWith('加载操作日志失败')
    })

    it('应该处理搜索失败的情况', async () => {
      const { searchOperationLogs } = require('@/api/operation-log')
      searchOperationLogs.mockRejectedValue(new Error('搜索失败'))
      
      await wrapper.vm.handleSearch()
      
      expect(ElMessage.error).toHaveBeenCalledWith('搜索操作日志失败')
    })

    it('应该处理删除失败的情况', async () => {
      const { deleteOperationLog } = require('@/api/operation-log')
      deleteOperationLog.mockRejectedValue(new Error('删除失败'))
      
      ElMessageBox.confirm.mockResolvedValue('confirm')
      
      await wrapper.vm.deleteLog(1)
      
      expect(ElMessage.error).toHaveBeenCalledWith('删除操作日志失败')
    })

    it('应该处理导出失败的情况', async () => {
      const { exportOperationLogs } = require('@/api/operation-log')
      exportOperationLogs.mockRejectedValue(new Error('导出失败'))
      
      await wrapper.vm.exportCurrentPage()
      
      expect(ElMessage.error).toHaveBeenCalledWith('导出失败')
    })

    it('应该处理统计数据加载失败的情况', async () => {
      const { getOperationLogStats } = require('@/api/operation-log')
      getOperationLogStats.mockRejectedValue(new Error('统计数据加载失败'))
      
      await wrapper.vm.loadOperationLogStats()
      
      expect(ElMessage.error).toHaveBeenCalledWith('加载统计数据失败')
    })
  })

  describe('权限控制', () => {
    it('应该能够检查删除权限', () => {
      const hasDeletePermission = wrapper.vm.hasDeletePermission()
      
      expect(typeof hasDeletePermission).toBe('boolean')
    })

    it('应该能够检查导出权限', () => {
      const hasExportPermission = wrapper.vm.hasExportPermission()
      
      expect(typeof hasExportPermission).toBe('boolean')
    })

    it('应该能够检查查看详情权限', () => {
      const hasViewDetailPermission = wrapper.vm.hasViewDetailPermission()
      
      expect(typeof hasViewDetailPermission).toBe('boolean')
    })
  })

  describe('数据格式化', () => {
    it('应该能够格式化操作类型显示文本', () => {
      expect(wrapper.vm.formatOperationType('CREATE')).toBe('创建')
      expect(wrapper.vm.formatOperationType('UPDATE')).toBe('更新')
      expect(wrapper.vm.formatOperationType('DELETE')).toBe('删除')
      expect(wrapper.vm.formatOperationType('QUERY')).toBe('查询')
    })

    it('应该能够格式化操作模块显示文本', () => {
      expect(wrapper.vm.formatOperationModule('USER_MANAGEMENT')).toBe('用户管理')
      expect(wrapper.vm.formatOperationModule('ORGANIZATION_MANAGEMENT')).toBe('组织管理')
      expect(wrapper.vm.formatOperationModule('ACTIVITY_MANAGEMENT')).toBe('活动管理')
      expect(wrapper.vm.formatOperationModule('FEE_MANAGEMENT')).toBe('党费管理')
    })

    it('应该能够格式化操作结果显示文本', () => {
      expect(wrapper.vm.formatOperationResult('SUCCESS')).toBe('成功')
      expect(wrapper.vm.formatOperationResult('FAILED')).toBe('失败')
      expect(wrapper.vm.formatOperationResult('PENDING')).toBe('处理中')
    })

    it('应该能够截断长文本', () => {
      const longText = '这是一个非常长的操作描述文本，需要被截断显示'
      const truncatedText = wrapper.vm.truncateText(longText, 10)
      
      expect(truncatedText.length).toBeLessThanOrEqual(13) // 10 + '...'
    })
  })

  describe('响应式设计', () => {
    it('应该能够适配移动端显示', async () => {
      wrapper.vm.isMobile = true
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.tableHeight).toBe('auto')
    })

    it('应该能够调整表格高度', async () => {
      wrapper.vm.windowHeight = 800
      
      const tableHeight = wrapper.vm.calculateTableHeight()
      
      expect(tableHeight).toBeGreaterThan(0)
    })
  })

  describe('性能优化', () => {
    it('应该能够防抖搜索', async () => {
      const searchSpy = vi.spyOn(wrapper.vm, 'handleSearch')
      
      // 快速连续输入
      wrapper.vm.debouncedSearch()
      wrapper.vm.debouncedSearch()
      wrapper.vm.debouncedSearch()
      
      // 等待防抖延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      expect(searchSpy).toHaveBeenCalledTimes(1)
    })

    it('应该能够虚拟滚动大量数据', async () => {
      wrapper.vm.enableVirtualScroll = true
      wrapper.vm.operationLogs = new Array(1000).fill(null).map((_, index) => ({
        ...mockOperationLogs[0],
        id: index + 1
      }))
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.visibleLogs.length).toBeLessThanOrEqual(50) // 虚拟滚动显示的数量
    })
  })
})