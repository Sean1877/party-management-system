import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import Statistics from '@/views/statistics/index.vue'

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  }
}))

// Mock API calls
vi.mock('@/api/statistics', () => ({
  getOverviewStats: vi.fn(),
  getOrganizationStats: vi.fn(),
  getMemberActivityStats: vi.fn(),
  getFeeAnalysisStats: vi.fn(),
  exportStatisticsReport: vi.fn()
}))

// Mock ECharts
const mockChart = {
  setOption: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn()
}

vi.mock('echarts', () => ({
  init: vi.fn(() => mockChart),
  dispose: vi.fn()
}))

describe('Statistics.vue', () => {
  let wrapper
  
  const mockOverviewStats = {
    totalUsers: 150,
    totalOrganizations: 8,
    totalActivities: 25,
    activeUsers: 120,
    totalFeeAmount: 15000,
    paidFeeAmount: 12000,
    unpaidFeeAmount: 3000,
    paymentRate: 80
  }
  
  const mockOrganizationStats = [
    {
      organizationName: '第一党支部',
      memberCount: 25,
      activityCount: 8,
      feeCollectionRate: 95
    },
    {
      organizationName: '第二党支部',
      memberCount: 30,
      activityCount: 6,
      feeCollectionRate: 88
    }
  ]
  
  const mockMemberActivityStats = {
    memberTrend: [
      { date: '2024-01', count: 140 },
      { date: '2024-02', count: 145 },
      { date: '2024-03', count: 150 }
    ],
    activityParticipation: [
      { activityName: '党课学习', participantCount: 80 },
      { activityName: '志愿服务', participantCount: 65 },
      { activityName: '主题党日', participantCount: 90 }
    ]
  }
  
  const mockFeeAnalysisStats = {
    monthlyTrend: [
      { month: '2024-01', amount: 4000, count: 50 },
      { month: '2024-02', amount: 4200, count: 52 },
      { month: '2024-03', amount: 3800, count: 48 }
    ],
    paymentMethods: [
      { method: '银行转账', amount: 8000, percentage: 66.7 },
      { method: '现金', amount: 2500, percentage: 20.8 },
      { method: '在线支付', amount: 1500, percentage: 12.5 }
    ],
    organizationRanking: [
      { organizationName: '第一党支部', totalAmount: 3000, paymentRate: 95 },
      { organizationName: '第二党支部', totalAmount: 2800, paymentRate: 88 }
    ]
  }

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Setup default mock implementations
    const {
      getOverviewStats,
      getOrganizationStats,
      getMemberActivityStats,
      getFeeAnalysisStats
    } = require('@/api/statistics')
    
    getOverviewStats.mockResolvedValue({ data: mockOverviewStats })
    getOrganizationStats.mockResolvedValue({ data: mockOrganizationStats })
    getMemberActivityStats.mockResolvedValue({ data: mockMemberActivityStats })
    getFeeAnalysisStats.mockResolvedValue({ data: mockFeeAnalysisStats })
    
    wrapper = mount(Statistics, {
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
          'el-select': true,
          'el-option': true,
          'el-date-picker': true,
          'el-progress': true,
          'el-tag': true
        }
      }
    })
  })

  describe('组件初始化', () => {
    it('应该正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('应该在挂载时加载数据', async () => {
      const {
        getOverviewStats,
        getOrganizationStats,
        getMemberActivityStats,
        getFeeAnalysisStats
      } = require('@/api/statistics')
      
      await wrapper.vm.$nextTick()
      
      expect(getOverviewStats).toHaveBeenCalled()
      expect(getOrganizationStats).toHaveBeenCalled()
      expect(getMemberActivityStats).toHaveBeenCalled()
      expect(getFeeAnalysisStats).toHaveBeenCalled()
    })

    it('应该正确设置初始数据', () => {
      expect(wrapper.vm.activeTab).toBe('overview')
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.overviewData).toEqual({})
      expect(wrapper.vm.organizationData).toEqual([])
      expect(wrapper.vm.memberActivityData).toEqual({})
      expect(wrapper.vm.feeAnalysisData).toEqual({})
    })
  })

  describe('总体概览统计', () => {
    it('应该能够加载总体统计数据', async () => {
      await wrapper.vm.loadOverviewData()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.overviewData).toEqual(mockOverviewStats)
    })

    it('应该正确计算统计指标', async () => {
      wrapper.vm.overviewData = mockOverviewStats
      
      const paymentRate = wrapper.vm.calculatePaymentRate()
      expect(paymentRate).toBe(80)
      
      const activeUserRate = wrapper.vm.calculateActiveUserRate()
      expect(activeUserRate).toBe(80) // 120/150 * 100
    })

    it('应该能够刷新总体数据', async () => {
      const { getOverviewStats } = require('@/api/statistics')
      
      await wrapper.vm.refreshOverviewData()
      
      expect(getOverviewStats).toHaveBeenCalled()
      expect(ElMessage.success).toHaveBeenCalledWith('数据刷新成功')
    })
  })

  describe('组织统计', () => {
    it('应该能够加载组织统计数据', async () => {
      await wrapper.vm.loadOrganizationData()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.organizationData).toEqual(mockOrganizationStats)
    })

    it('应该能够按成员数量排序组织', async () => {
      wrapper.vm.organizationData = mockOrganizationStats
      
      const sortedData = wrapper.vm.sortOrganizationsByMembers()
      
      expect(sortedData[0].memberCount).toBeGreaterThanOrEqual(sortedData[1].memberCount)
    })

    it('应该能够按党费收缴率排序组织', async () => {
      wrapper.vm.organizationData = mockOrganizationStats
      
      const sortedData = wrapper.vm.sortOrganizationsByFeeRate()
      
      expect(sortedData[0].feeCollectionRate).toBeGreaterThanOrEqual(sortedData[1].feeCollectionRate)
    })

    it('应该能够筛选组织数据', async () => {
      wrapper.vm.organizationData = mockOrganizationStats
      wrapper.vm.organizationFilters.minMembers = 28
      
      const filteredData = wrapper.vm.filteredOrganizationData
      
      expect(filteredData.every(org => org.memberCount >= 28)).toBe(true)
    })
  })

  describe('成员活动统计', () => {
    it('应该能够加载成员活动数据', async () => {
      await wrapper.vm.loadMemberActivityData()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.memberActivityData).toEqual(mockMemberActivityStats)
    })

    it('应该能够初始化成员趋势图表', async () => {
      wrapper.vm.memberActivityData = mockMemberActivityStats
      
      await wrapper.vm.initMemberTrendChart()
      
      expect(mockChart.setOption).toHaveBeenCalled()
    })

    it('应该能够初始化活动参与图表', async () => {
      wrapper.vm.memberActivityData = mockMemberActivityStats
      
      await wrapper.vm.initActivityParticipationChart()
      
      expect(mockChart.setOption).toHaveBeenCalled()
    })

    it('应该能够计算活动参与率', async () => {
      wrapper.vm.memberActivityData = mockMemberActivityStats
      wrapper.vm.overviewData = mockOverviewStats
      
      const participationRate = wrapper.vm.calculateActivityParticipationRate()
      
      expect(participationRate).toBeGreaterThan(0)
      expect(participationRate).toBeLessThanOrEqual(100)
    })
  })

  describe('党费分析统计', () => {
    it('应该能够加载党费分析数据', async () => {
      await wrapper.vm.loadFeeAnalysisData()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.feeAnalysisData).toEqual(mockFeeAnalysisStats)
    })

    it('应该能够初始化党费趋势图表', async () => {
      wrapper.vm.feeAnalysisData = mockFeeAnalysisStats
      
      await wrapper.vm.initFeeTrendChart()
      
      expect(mockChart.setOption).toHaveBeenCalled()
    })

    it('应该能够初始化支付方式图表', async () => {
      wrapper.vm.feeAnalysisData = mockFeeAnalysisStats
      
      await wrapper.vm.initPaymentMethodChart()
      
      expect(mockChart.setOption).toHaveBeenCalled()
    })

    it('应该能够计算平均月缴费金额', async () => {
      wrapper.vm.feeAnalysisData = mockFeeAnalysisStats
      
      const averageAmount = wrapper.vm.calculateAverageMonthlyFee()
      
      expect(averageAmount).toBe(4000) // (4000 + 4200 + 3800) / 3
    })

    it('应该能够获取最佳收缴组织', async () => {
      wrapper.vm.feeAnalysisData = mockFeeAnalysisStats
      
      const topOrganization = wrapper.vm.getTopFeeCollectionOrganization()
      
      expect(topOrganization.organizationName).toBe('第一党支部')
      expect(topOrganization.paymentRate).toBe(95)
    })
  })

  describe('图表管理', () => {
    it('应该能够初始化所有图表', async () => {
      await wrapper.vm.initAllCharts()
      
      expect(mockChart.setOption).toHaveBeenCalledTimes(4) // 4个图表
    })

    it('应该能够调整图表大小', async () => {
      await wrapper.vm.resizeCharts()
      
      expect(mockChart.resize).toHaveBeenCalled()
    })

    it('应该在组件销毁时清理图表', async () => {
      wrapper.unmount()
      
      expect(mockChart.dispose).toHaveBeenCalled()
    })

    it('应该能够切换图表主题', async () => {
      await wrapper.vm.switchChartTheme('dark')
      
      expect(wrapper.vm.chartTheme).toBe('dark')
      expect(mockChart.setOption).toHaveBeenCalled()
    })
  })

  describe('数据导出功能', () => {
    it('应该能够导出总体统计报告', async () => {
      const { exportStatisticsReport } = require('@/api/statistics')
      exportStatisticsReport.mockResolvedValue({ success: true })
      
      await wrapper.vm.exportOverviewReport()
      
      expect(exportStatisticsReport).toHaveBeenCalledWith('overview', expect.any(Object))
      expect(ElMessage.success).toHaveBeenCalledWith('报告导出成功')
    })

    it('应该能够导出组织统计报告', async () => {
      const { exportStatisticsReport } = require('@/api/statistics')
      exportStatisticsReport.mockResolvedValue({ success: true })
      
      await wrapper.vm.exportOrganizationReport()
      
      expect(exportStatisticsReport).toHaveBeenCalledWith('organization', expect.any(Object))
      expect(ElMessage.success).toHaveBeenCalledWith('报告导出成功')
    })

    it('应该能够导出党费分析报告', async () => {
      const { exportStatisticsReport } = require('@/api/statistics')
      exportStatisticsReport.mockResolvedValue({ success: true })
      
      await wrapper.vm.exportFeeAnalysisReport()
      
      expect(exportStatisticsReport).toHaveBeenCalledWith('fee-analysis', expect.any(Object))
      expect(ElMessage.success).toHaveBeenCalledWith('报告导出成功')
    })

    it('应该能够导出完整统计报告', async () => {
      const { exportStatisticsReport } = require('@/api/statistics')
      exportStatisticsReport.mockResolvedValue({ success: true })
      
      await wrapper.vm.exportFullReport()
      
      expect(exportStatisticsReport).toHaveBeenCalledWith('full', expect.any(Object))
      expect(ElMessage.success).toHaveBeenCalledWith('完整报告导出成功')
    })
  })

  describe('数据筛选和时间范围', () => {
    it('应该能够设置时间范围', async () => {
      const dateRange = ['2024-01-01', '2024-03-31']
      
      await wrapper.vm.setDateRange(dateRange)
      
      expect(wrapper.vm.dateRange).toEqual(dateRange)
    })

    it('应该能够根据时间范围重新加载数据', async () => {
      const {
        getOverviewStats,
        getOrganizationStats,
        getMemberActivityStats,
        getFeeAnalysisStats
      } = require('@/api/statistics')
      
      wrapper.vm.dateRange = ['2024-01-01', '2024-03-31']
      
      await wrapper.vm.refreshDataWithDateRange()
      
      expect(getOverviewStats).toHaveBeenCalledWith(expect.objectContaining({
        startDate: '2024-01-01',
        endDate: '2024-03-31'
      }))
    })

    it('应该能够快速选择预设时间范围', async () => {
      await wrapper.vm.selectQuickDateRange('last30days')
      
      expect(wrapper.vm.dateRange).toBeDefined()
      expect(wrapper.vm.dateRange.length).toBe(2)
    })

    it('应该能够重置时间范围', async () => {
      wrapper.vm.dateRange = ['2024-01-01', '2024-03-31']
      
      await wrapper.vm.resetDateRange()
      
      expect(wrapper.vm.dateRange).toEqual([])
    })
  })

  describe('实时数据更新', () => {
    it('应该能够启动自动刷新', async () => {
      await wrapper.vm.startAutoRefresh()
      
      expect(wrapper.vm.autoRefreshInterval).toBeDefined()
      expect(wrapper.vm.isAutoRefreshing).toBe(true)
    })

    it('应该能够停止自动刷新', async () => {
      wrapper.vm.autoRefreshInterval = setInterval(() => {}, 1000)
      wrapper.vm.isAutoRefreshing = true
      
      await wrapper.vm.stopAutoRefresh()
      
      expect(wrapper.vm.autoRefreshInterval).toBeNull()
      expect(wrapper.vm.isAutoRefreshing).toBe(false)
    })

    it('应该能够设置刷新间隔', async () => {
      await wrapper.vm.setRefreshInterval(30000) // 30秒
      
      expect(wrapper.vm.refreshInterval).toBe(30000)
    })
  })

  describe('错误处理', () => {
    it('应该处理加载总体数据失败的情况', async () => {
      const { getOverviewStats } = require('@/api/statistics')
      getOverviewStats.mockRejectedValue(new Error('网络错误'))
      
      await wrapper.vm.loadOverviewData()
      
      expect(ElMessage.error).toHaveBeenCalledWith('加载总体统计数据失败')
    })

    it('应该处理加载组织数据失败的情况', async () => {
      const { getOrganizationStats } = require('@/api/statistics')
      getOrganizationStats.mockRejectedValue(new Error('服务器错误'))
      
      await wrapper.vm.loadOrganizationData()
      
      expect(ElMessage.error).toHaveBeenCalledWith('加载组织统计数据失败')
    })

    it('应该处理导出报告失败的情况', async () => {
      const { exportStatisticsReport } = require('@/api/statistics')
      exportStatisticsReport.mockRejectedValue(new Error('导出失败'))
      
      await wrapper.vm.exportOverviewReport()
      
      expect(ElMessage.error).toHaveBeenCalledWith('报告导出失败')
    })

    it('应该处理图表初始化失败的情况', async () => {
      const echarts = require('echarts')
      echarts.init.mockImplementation(() => {
        throw new Error('图表初始化失败')
      })
      
      await wrapper.vm.initMemberTrendChart()
      
      expect(ElMessage.error).toHaveBeenCalledWith('图表初始化失败')
    })
  })

  describe('响应式设计', () => {
    it('应该能够检测屏幕尺寸变化', async () => {
      const resizeEvent = new Event('resize')
      
      window.dispatchEvent(resizeEvent)
      
      await wrapper.vm.$nextTick()
      
      expect(mockChart.resize).toHaveBeenCalled()
    })

    it('应该能够适配移动端显示', async () => {
      wrapper.vm.isMobile = true
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.chartOptions.grid.left).toBe('5%')
      expect(wrapper.vm.chartOptions.grid.right).toBe('5%')
    })
  })

  describe('数据缓存', () => {
    it('应该能够缓存统计数据', async () => {
      wrapper.vm.overviewData = mockOverviewStats
      
      wrapper.vm.cacheData('overview', mockOverviewStats)
      
      const cachedData = wrapper.vm.getCachedData('overview')
      expect(cachedData).toEqual(mockOverviewStats)
    })

    it('应该能够清除过期缓存', async () => {
      wrapper.vm.cacheData('overview', mockOverviewStats)
      
      // 模拟缓存过期
      wrapper.vm.cacheTimestamps.overview = Date.now() - 600000 // 10分钟前
      
      const cachedData = wrapper.vm.getCachedData('overview')
      expect(cachedData).toBeNull()
    })

    it('应该能够清除所有缓存', async () => {
      wrapper.vm.cacheData('overview', mockOverviewStats)
      wrapper.vm.cacheData('organization', mockOrganizationStats)
      
      wrapper.vm.clearAllCache()
      
      expect(wrapper.vm.getCachedData('overview')).toBeNull()
      expect(wrapper.vm.getCachedData('organization')).toBeNull()
    })
  })

  describe('性能优化', () => {
    it('应该能够防抖数据刷新', async () => {
      const refreshSpy = vi.spyOn(wrapper.vm, 'loadAllData')
      
      // 快速连续调用
      wrapper.vm.debouncedRefresh()
      wrapper.vm.debouncedRefresh()
      wrapper.vm.debouncedRefresh()
      
      // 等待防抖延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      expect(refreshSpy).toHaveBeenCalledTimes(1)
    })

    it('应该能够节流图表更新', async () => {
      const updateSpy = vi.spyOn(wrapper.vm, 'updateAllCharts')
      
      // 快速连续调用
      wrapper.vm.throttledChartUpdate()
      wrapper.vm.throttledChartUpdate()
      wrapper.vm.throttledChartUpdate()
      
      expect(updateSpy).toHaveBeenCalledTimes(1)
    })
  })
})