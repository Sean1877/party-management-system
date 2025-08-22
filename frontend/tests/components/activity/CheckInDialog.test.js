import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CheckInDialog from '@/views/activity/components/CheckInDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Mock Element Plus
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

// Mock API
vi.mock('@/api/activity', () => ({
  checkInActivity: vi.fn(),
  batchCheckIn: vi.fn(),
  getActivityParticipants: vi.fn()
}))

describe('CheckInDialog', () => {
  let wrapper
  let pinia
  let emit

  const mockActivity = {
    id: 1,
    title: '党史学习活动',
    startTime: '2024-01-15T09:00:00',
    endTime: '2024-01-15T11:00:00',
    status: '进行中'
  }

  const mockParticipants = [
    {
      id: 1,
      userId: 1,
      userName: '张三',
      status: '已报名',
      signInTime: null,
      notes: ''
    },
    {
      id: 2,
      userId: 2,
      userName: '李四',
      status: '已签到',
      signInTime: '2024-01-15T09:05:00',
      notes: '准时参加'
    },
    {
      id: 3,
      userId: 3,
      userName: '王五',
      status: '已报名',
      signInTime: null,
      notes: ''
    }
  ]

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    emit = vi.fn()

    // Mock API responses
    const { getActivityParticipants } = require('@/api/activity')
    getActivityParticipants.mockResolvedValue({ data: mockParticipants })

    wrapper = mount(CheckInDialog, {
      props: {
        visible: true,
        activity: mockActivity
      },
      global: {
        plugins: [pinia],
        stubs: {
          'el-dialog': true,
          'el-table': true,
          'el-table-column': true,
          'el-button': true,
          'el-tag': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true,
          'el-checkbox-group': true
        }
      },
      emits: ['update:visible', 'checked-in']
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.check-in-dialog').exists()).toBe(true)
  })

  it('loads participants when dialog opens', async () => {
    const { getActivityParticipants } = require('@/api/activity')
    
    await wrapper.vm.$nextTick()
    
    expect(getActivityParticipants).toHaveBeenCalledWith(mockActivity.id)
  })

  it('displays activity information', () => {
    expect(wrapper.find('.activity-title').text()).toContain(mockActivity.title)
    expect(wrapper.find('.activity-time').text()).toContain('09:00 - 11:00')
  })

  it('displays participants list', async () => {
    await wrapper.vm.$nextTick()
    
    const rows = wrapper.findAll('.participant-row')
    expect(rows.length).toBe(3)
    
    expect(rows[0].text()).toContain('张三')
    expect(rows[1].text()).toContain('李四')
    expect(rows[2].text()).toContain('王五')
  })

  it('formats participant status correctly', async () => {
    await wrapper.vm.$nextTick()
    
    const statusElements = wrapper.findAll('.participant-status')
    expect(statusElements[0].text()).toBe('已报名')
    expect(statusElements[1].text()).toBe('已签到')
    expect(statusElements[2].text()).toBe('已报名')
  })

  it('handles individual check-in', async () => {
    const { checkInActivity } = require('@/api/activity')
    checkInActivity.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')

    const participant = mockParticipants[0]
    
    await wrapper.vm.handleCheckIn(participant)
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      `确定要为 ${participant.userName} 签到吗？`,
      '确认签到',
      expect.any(Object)
    )
    expect(checkInActivity).toHaveBeenCalledWith(mockActivity.id, participant.userId)
    expect(ElMessage.success).toHaveBeenCalledWith('签到成功')
  })

  it('handles batch check-in', async () => {
    const { batchCheckIn } = require('@/api/activity')
    batchCheckIn.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')

    // Select participants
    await wrapper.setData({
      selectedParticipants: [mockParticipants[0], mockParticipants[2]]
    })
    
    await wrapper.vm.handleBatchCheckIn()
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '确定要为选中的 2 个参与者批量签到吗？',
      '确认批量签到',
      expect.any(Object)
    )
    expect(batchCheckIn).toHaveBeenCalledWith(mockActivity.id, [1, 3])
    expect(ElMessage.success).toHaveBeenCalledWith('批量签到成功')
  })

  it('disables check-in for already checked-in participants', async () => {
    await wrapper.vm.$nextTick()
    
    const checkInButtons = wrapper.findAll('.check-in-button')
    expect(checkInButtons[0].attributes().disabled).toBeUndefined() // 张三 - 未签到
    expect(checkInButtons[1].attributes().disabled).toBe('disabled') // 李四 - 已签到
    expect(checkInButtons[2].attributes().disabled).toBeUndefined() // 王五 - 未签到
  })

  it('filters participants by status', async () => {
    await wrapper.vm.$nextTick()
    
    // Filter by "已报名" status
    await wrapper.setData({
      filterStatus: '已报名'
    })
    
    const filteredParticipants = wrapper.vm.filteredParticipants
    expect(filteredParticipants.length).toBe(2)
    expect(filteredParticipants.every(p => p.status === '已报名')).toBe(true)
  })

  it('filters participants by search term', async () => {
    await wrapper.vm.$nextTick()
    
    // Search for "张"
    await wrapper.setData({
      searchKeyword: '张'
    })
    
    const filteredParticipants = wrapper.vm.filteredParticipants
    expect(filteredParticipants.length).toBe(1)
    expect(filteredParticipants[0].userName).toBe('张三')
  })

  it('calculates check-in statistics', async () => {
    await wrapper.vm.$nextTick()
    
    const stats = wrapper.vm.checkInStats
    
    expect(stats.total).toBe(3)
    expect(stats.checkedIn).toBe(1)
    expect(stats.notCheckedIn).toBe(2)
    expect(stats.checkInRate).toBeCloseTo(33.33, 2)
  })

  it('selects all participants with select all checkbox', async () => {
    await wrapper.vm.$nextTick()
    
    // Click select all checkbox
    const selectAllCheckbox = wrapper.find('.select-all-checkbox')
    await selectAllCheckbox.trigger('click')
    
    expect(wrapper.vm.selectedParticipants.length).toBe(3)
  })

  it('unselects all participants when clicking select all again', async () => {
    await wrapper.vm.$nextTick()
    
    // Select all, then unselect all
    const selectAllCheckbox = wrapper.find('.select-all-checkbox')
    await selectAllCheckbox.trigger('click')
    await selectAllCheckbox.trigger('click')
    
    expect(wrapper.vm.selectedParticipants.length).toBe(0)
  })

  it('disables batch check-in when no participants selected', async () => {
    await wrapper.vm.$nextTick()
    
    const batchCheckInButton = wrapper.find('.batch-check-in-button')
    expect(batchCheckInButton.attributes().disabled).toBe('disabled')
  })

  it('enables batch check-in when participants are selected', async () => {
    await wrapper.vm.$nextTick()
    
    // Select participants
    await wrapper.setData({
      selectedParticipants: [mockParticipants[0]]
    })
    
    const batchCheckInButton = wrapper.find('.batch-check-in-button')
    expect(batchCheckInButton.attributes().disabled).toBeUndefined()
  })

  it('emits update:visible event when dialog is closed', async () => {
    await wrapper.vm.handleClose()
    
    expect(emit).toHaveBeenCalledWith('update:visible', false)
  })

  it('emits checked-in event when check-in is successful', async () => {
    const { checkInActivity } = require('@/api/activity')
    checkInActivity.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')

    const participant = mockParticipants[0]
    
    await wrapper.vm.handleCheckIn(participant)
    
    expect(emit).toHaveBeenCalledWith('checked-in', expect.any(Object))
  })

  it('handles API error during check-in', async () => {
    const { checkInActivity } = require('@/api/activity')
    checkInActivity.mockRejectedValue(new Error('签到失败'))
    ElMessageBox.confirm.mockResolvedValue('confirm')

    const participant = mockParticipants[0]
    
    await wrapper.vm.handleCheckIn(participant)
    
    expect(ElMessage.error).toHaveBeenCalledWith('签到失败')
  })

  it('refreshes participant list after check-in', async () => {
    const { checkInActivity, getActivityParticipants } = require('@/api/activity')
    checkInActivity.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')

    const participant = mockParticipants[0]
    
    await wrapper.vm.handleCheckIn(participant)
    
    expect(getActivityParticipants).toHaveBeenCalledTimes(2) // Initial load + refresh
  })

  it('shows loading state during API calls', async () => {
    const { checkInActivity } = require('@/api/activity')
    checkInActivity.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({})
        }, 100)
      })
    })

    const participant = mockParticipants[0]
    
    wrapper.vm.handleCheckIn(participant)
    
    expect(wrapper.vm.loading).toBe(true)
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 150))
    
    expect(wrapper.vm.loading).toBe(false)
  })

  it('disables actions during loading', async () => {
    const { checkInActivity } = require('@/api/activity')
    checkInActivity.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({})
        }, 100)
      })
    })

    const participant = mockParticipants[0]
    
    wrapper.vm.handleCheckIn(participant)
    
    const checkInButton = wrapper.find('.check-in-button')
    expect(checkInButton.attributes().disabled).toBe('disabled')
    
    // Wait for API call to complete
    await new Promise(resolve => setTimeout(resolve, 150))
    
    expect(checkInButton.attributes().disabled).toBeUndefined()
  })

  it('displays participant count information', async () => {
    await wrapper.vm.$nextTick()
    
    const countInfo = wrapper.find('.participant-count')
    expect(countInfo.text()).toContain('总参与人数：3')
    expect(countInfo.text()).toContain('已签到：1')
    expect(countInfo.text()).toContain('未签到：2')
  })

  it('formats sign-in time correctly', async () => {
    await wrapper.vm.$nextTick()
    
    const signInTimeElements = wrapper.findAll('.sign-in-time')
    expect(signInTimeElements[0].text()).toBe('-') // 张三 - 未签到
    expect(signInTimeElements[1].text()).toContain('09:05') // 李四 - 已签到
    expect(signInTimeElements[2].text()).toBe('-') // 王五 - 未签到
  })

  it('resets form when dialog closes', async () => {
    await wrapper.setData({
      searchKeyword: '张',
      filterStatus: '已报名',
      selectedParticipants: [mockParticipants[0]]
    })
    
    await wrapper.vm.handleClose()
    
    expect(wrapper.vm.searchKeyword).toBe('')
    expect(wrapper.vm.filterStatus).toBe('')
    expect(wrapper.vm.selectedParticipants).toEqual([])
  })
})