import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { useRouter } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

// Mock dependencies
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn()
}))

vi.mock('@/api/statistics', () => ({
  getDashboardStats: vi.fn(),
  getRecentActivities: vi.fn(),
  getFeeStatistics: vi.fn(),
  getUserStatistics: vi.fn()
}))

vi.mock('@/api/activity', () => ({
  getUpcomingActivities: vi.fn()
}))

vi.mock('@/api/user', () => ({
  getRecentUsers: vi.fn()
}))

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('Dashboard', () => {
  let routerMock
  let userStoreMock
  let pinia

  const mockUser = {
    id: 1,
    username: 'testuser',
    realName: '测试用户',
    organizationName: '第一党支部',
    roleName: '党员'
  }

  const mockDashboardStats = {
    totalUsers: 150,
    totalActivities: 45,
    totalFeePayments: 320,
    recentActivities: 12
  }

  const mockRecentActivities = [
    {
      id: 1,
      title: '党史学习活动',
      type: '学习',
      startTime: '2024-01-15T09:00:00',
      status: '计划中',
      currentParticipants: 25,
      maxParticipants: 50
    },
    {
      id: 2,
      title: '志愿服务活动',
      type: '实践',
      startTime: '2024-01-20T14:00:00',
      status: '进行中',
      currentParticipants: 15,
      maxParticipants: 30
    }
  ]

  const mockFeeStats = {
    totalAmount: 15000,
    paidAmount: 12000,
    pendingAmount: 3000,
    paymentRate: 0.8
  }

  const mockUserStats = {
    totalUsers: 150,
    activeUsers: 140,
    inactiveUsers: 10,
    newUsersThisMonth: 5
  }

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup router mock
    routerMock = {
      push: vi.fn()
    }
    useRouter.mockReturnValue(routerMock)

    // Setup user store mock
    userStoreMock = {
      user: mockUser,
      hasPermission: vi.fn().mockReturnValue(true)
    }
    const { useUserStore } = require('@/stores/user')
    useUserStore.mockReturnValue(userStoreMock)

    // Setup API mocks
    const { getDashboardStats, getRecentActivities, getFeeStatistics, getUserStatistics } = require('@/api/statistics')
    const { getUpcomingActivities } = require('@/api/activity')
    const { getRecentUsers } = require('@/api/user')

    getDashboardStats.mockResolvedValue({ data: mockDashboardStats })
    getRecentActivities.mockResolvedValue({ data: mockRecentActivities })
    getFeeStatistics.mockResolvedValue({ data: mockFeeStats })
    getUserStatistics.mockResolvedValue({ data: mockUserStats })
    getUpcomingActivities.mockResolvedValue({ data: mockRecentActivities })
    getRecentUsers.mockResolvedValue({ data: [] })

    // Setup Pinia
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders dashboard correctly', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    expect(screen.getByText('党建管理系统')).toBeInTheDocument()
    expect(screen.getByText('欢迎回来，测试用户')).toBeInTheDocument()
  })

  it('loads dashboard data on mount', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      const { getDashboardStats, getRecentActivities, getFeeStatistics, getUserStatistics } = require('@/api/statistics')
      expect(getDashboardStats).toHaveBeenCalled()
      expect(getRecentActivities).toHaveBeenCalled()
      expect(getFeeStatistics).toHaveBeenCalled()
      expect(getUserStatistics).toHaveBeenCalled()
    })
  })

  it('displays dashboard statistics', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument() // totalUsers
      expect(screen.getByText('45')).toBeInTheDocument() // totalActivities
      expect(screen.getByText('320')).toBeInTheDocument() // totalFeePayments
      expect(screen.getByText('12')).toBeInTheDocument() // recentActivities
    })
  })

  it('displays recent activities', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('党史学习活动')).toBeInTheDocument()
      expect(screen.getByText('志愿服务活动')).toBeInTheDocument()
    })
  })

  it('navigates to activity detail when clicking on activity', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      const viewButton = screen.getByText('查看详情')
      fireEvent.click(viewButton)
      expect(routerMock.push).toHaveBeenCalledWith('/activity')
    })
  })

  it('displays fee statistics', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('15,000')).toBeInTheDocument() // totalAmount
      expect(screen.getByText('12,000')).toBeInTheDocument() // paidAmount
      expect(screen.getByText('3,000')).toBeInTheDocument() // pendingAmount
    })
  })

  it('displays user statistics', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument() // totalUsers
      expect(screen.getByText('140')).toBeInTheDocument() // activeUsers
      expect(screen.getByText('10')).toBeInTheDocument() // inactiveUsers
    })
  })

  it('handles loading state', async () => {
    // Make API calls take longer to test loading state
    const { getDashboardStats } = require('@/api/statistics')
    getDashboardStats.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: mockDashboardStats })
        }, 100)
      })
    })

    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    expect(screen.getAllByTestId('skeleton')).toHaveLength(4) // 4 skeleton loaders

    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  it('handles API error gracefully', async () => {
    const { getDashboardStats } = require('@/api/statistics')
    getDashboardStats.mockRejectedValue(new Error('加载失败'))

    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true,
          'el-empty': true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument()
    })
  })

  it('refreshes data when refresh button is clicked', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      const { getDashboardStats } = require('@/api/statistics')
      expect(getDashboardStats).toHaveBeenCalledTimes(1)
    })

    const refreshButton = screen.getByText('刷新')
    fireEvent.click(refreshButton)

    await waitFor(() => {
      const { getDashboardStats } = require('@/api/statistics')
      expect(getDashboardStats).toHaveBeenCalledTimes(2)
    })
  })

  it('formats activity status correctly', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('计划中')).toBeInTheDocument()
      expect(screen.getByText('进行中')).toBeInTheDocument()
    })
  })

  it('calculates activity participation rate', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      // First activity: 25/50 = 50%
      expect(screen.getByText('50%')).toBeInTheDocument()
      // Second activity: 15/30 = 50%
      expect(screen.getAllByText('50%')).toHaveLength(2)
    })
  })

  it('shows user info correctly', async () => {
    render(Dashboard, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-row': true,
          'el-col': true,
          'el-statistic': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-progress': true,
          'el-skeleton': true
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByText('测试用户')).toBeInTheDocument()
      expect(screen.getByText('第一党支部')).toBeInTheDocument()
      expect(screen.getByText('党员')).toBeInTheDocument()
    })
  })
})