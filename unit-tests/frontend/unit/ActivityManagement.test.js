import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ActivityManagement from '@/views/activity/index.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

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
  getActivities: vi.fn(),
  createActivity: vi.fn(),
  updateActivity: vi.fn(),
  deleteActivity: vi.fn(),
  batchDeleteActivities: vi.fn(),
  getActivityParticipants: vi.fn(),
  signUpActivity: vi.fn(),
  checkInActivity: vi.fn(),
  batchCheckIn: vi.fn()
}))

vi.mock('@/api/user', () => ({
  getUsers: vi.fn()
}))

vi.mock('@/api/organization', () => ({
  getOrganizations: vi.fn()
}))

describe('ActivityManagement', () => {
  let wrapper
  let pinia
  let userStore

  const mockActivities = {
    content: [
      {
        id: 1,
        title: '党史学习活动',
        type: '学习',
        content: '学习党的历史，传承红色基因',
        location: '会议室A',
        startTime: '2024-01-15T09:00:00',
        endTime: '2024-01-15T11:00:00',
        organizerId: 1,
        organizerName: '张三',
        organizationId: 1,
        organizationName: '党支部',
        status: '计划中',
        maxParticipants: 50,
        currentParticipants: 25,
        isRequired: true,
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        title: '志愿服务活动',
        type: '实践',
        content: '社区志愿服务，服务人民群众',
        location: '社区服务中心',
        startTime: '2024-01-20T14:00:00',
        endTime: '2024-01-20T17:00:00',
        organizerId: 2,
        organizerName: '李四',
        organizationId: 1,
        organizationName: '党支部',
        status: '进行中',
        maxParticipants: 30,
        currentParticipants: 15,
        isRequired: false,
        createdAt: '2024-01-02T00:00:00'
      }
    ],
    totalElements: 2,
    totalPages: 1,
    size: 10,
    number: 0
  }

  const mockUsers = [
    { id: 1, realName: '张三', username: 'zhangsan' },
    { id: 2, realName: '李四', username: 'lisi' }
  ]

  const mockOrganizations = [
    { id: 1, name: '党支部', code: 'PARTY_BRANCH' },
    { id: 2, name: '团支部', code: 'YOUTH_BRANCH' }
  ]

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
    }
  ]

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    userStore = useUserStore()
    
    // Mock API responses
    const { getActivities, getActivityParticipants } = require('@/api/activity')
    const { getUsers } = require('@/api/user')
    const { getOrganizations } = require('@/api/organization')
    
    getActivities.mockResolvedValue({ data: mockActivities })
    getActivityParticipants.mockResolvedValue({ data: mockParticipants })
    getUsers.mockResolvedValue({ data: mockUsers })
    getOrganizations.mockResolvedValue({ data: mockOrganizations })

    wrapper = mount(ActivityManagement, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-button': true,
          'el-table': true,
          'el-table-column': true,
          'el-tag': true,
          'el-pagination': true,
          'el-dialog': true,
          'el-date-picker': true,
          'el-radio-group': true,
          'el-radio': true,
          'el-switch': true,
          'el-textarea': true,
          'el-input-number': true
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.activity-management').exists()).toBe(true)
  })

  it('loads activities on mount', async () => {
    const { getActivities } = require('@/api/activity')
    
    await wrapper.vm.$nextTick()
    
    expect(getActivities).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      title: '',
      type: '',
      status: '',
      organizationId: null,
      organizerId: null
    })
  })

  it('loads users and organizations on mount', async () => {
    const { getUsers } = require('@/api/user')
    const { getOrganizations } = require('@/api/organization')
    
    await wrapper.vm.$nextTick()
    
    expect(getUsers).toHaveBeenCalled()
    expect(getOrganizations).toHaveBeenCalled()
  })

  it('handles search functionality', async () => {
    const { getActivities } = require('@/api/activity')
    
    // Set search criteria
    await wrapper.setData({
      searchForm: {
        title: '学习',
        type: '学习',
        status: '计划中',
        organizationId: 1,
        organizerId: 1
      }
    })
    
    // Trigger search
    await wrapper.vm.handleSearch()
    
    expect(getActivities).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      title: '学习',
      type: '学习',
      status: '计划中',
      organizationId: 1,
      organizerId: 1
    })
  })

  it('handles reset search', async () => {
    const { getActivities } = require('@/api/activity')
    
    // Set some search criteria
    await wrapper.setData({
      searchForm: {
        title: '学习',
        type: '学习',
        status: '计划中',
        organizationId: 1,
        organizerId: 1
      }
    })
    
    // Reset search
    await wrapper.vm.handleReset()
    
    expect(wrapper.vm.searchForm).toEqual({
      title: '',
      type: '',
      status: '',
      organizationId: null,
      organizerId: null
    })
    
    expect(getActivities).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      title: '',
      type: '',
      status: '',
      organizationId: null,
      organizerId: null
    })
  })

  it('opens add activity dialog', async () => {
    await wrapper.vm.handleAdd()
    
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('添加活动')
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.activityForm).toEqual({
      title: '',
      type: '',
      content: '',
      location: '',
      startTime: '',
      endTime: '',
      organizerId: null,
      organizationId: null,
      maxParticipants: 50,
      isRequired: false
    })
  })

  it('opens edit activity dialog', async () => {
    const activity = mockActivities.content[0]
    
    await wrapper.vm.handleEdit(activity)
    
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('编辑活动')
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.activityForm.title).toBe(activity.title)
    expect(wrapper.vm.activityForm.type).toBe(activity.type)
  })

  it('handles activity creation', async () => {
    const { createActivity } = require('@/api/activity')
    createActivity.mockResolvedValue({ data: { id: 3, title: '新活动' } })
    
    await wrapper.setData({
      activityForm: {
        title: '新活动',
        type: '培训',
        content: '这是一个新的培训活动',
        location: '培训室',
        startTime: '2024-02-01T09:00:00',
        endTime: '2024-02-01T12:00:00',
        organizerId: 1,
        organizationId: 1,
        maxParticipants: 40,
        isRequired: true
      },
      isEdit: false
    })
    
    await wrapper.vm.handleSubmit()
    
    expect(createActivity).toHaveBeenCalledWith(wrapper.vm.activityForm)
    expect(ElMessage.success).toHaveBeenCalledWith('活动创建成功')
  })

  it('handles activity update', async () => {
    const { updateActivity } = require('@/api/activity')
    updateActivity.mockResolvedValue({ data: { id: 1, title: '更新的活动' } })
    
    await wrapper.setData({
      activityForm: {
        id: 1,
        title: '更新的活动',
        type: '学习',
        content: '更新的活动内容',
        location: '会议室B',
        startTime: '2024-01-15T09:00:00',
        endTime: '2024-01-15T11:00:00',
        organizerId: 1,
        organizationId: 1,
        maxParticipants: 60,
        isRequired: true
      },
      isEdit: true
    })
    
    await wrapper.vm.handleSubmit()
    
    expect(updateActivity).toHaveBeenCalledWith(1, wrapper.vm.activityForm)
    expect(ElMessage.success).toHaveBeenCalledWith('活动更新成功')
  })

  it('handles activity deletion', async () => {
    const { deleteActivity } = require('@/api/activity')
    const { ElMessageBox } = require('element-plus')
    
    deleteActivity.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    const activity = mockActivities.content[0]
    
    await wrapper.vm.handleDelete(activity)
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      `确定要删除活动 "${activity.title}" 吗？`,
      '确认删除',
      expect.any(Object)
    )
    expect(deleteActivity).toHaveBeenCalledWith(activity.id)
    expect(ElMessage.success).toHaveBeenCalledWith('活动删除成功')
  })

  it('handles batch deletion', async () => {
    const { batchDeleteActivities } = require('@/api/activity')
    const { ElMessageBox } = require('element-plus')
    
    batchDeleteActivities.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    await wrapper.setData({
      selectedActivities: [mockActivities.content[0], mockActivities.content[1]]
    })
    
    await wrapper.vm.handleBatchDelete()
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '确定要删除选中的 2 个活动吗？',
      '确认批量删除',
      expect.any(Object)
    )
    expect(batchDeleteActivities).toHaveBeenCalledWith([1, 2])
    expect(ElMessage.success).toHaveBeenCalledWith('批量删除成功')
  })

  it('opens participants dialog', async () => {
    const { getActivityParticipants } = require('@/api/activity')
    const activity = mockActivities.content[0]
    
    await wrapper.vm.handleViewParticipants(activity)
    
    expect(wrapper.vm.participantsDialogVisible).toBe(true)
    expect(wrapper.vm.currentActivity).toEqual(activity)
    expect(getActivityParticipants).toHaveBeenCalledWith(activity.id)
  })

  it('handles activity sign up', async () => {
    const { signUpActivity } = require('@/api/activity')
    const { ElMessageBox } = require('element-plus')
    
    signUpActivity.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    const activity = mockActivities.content[0]
    
    await wrapper.vm.handleSignUp(activity)
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      `确定要报名参加活动 "${activity.title}" 吗？`,
      '确认报名',
      expect.any(Object)
    )
    expect(signUpActivity).toHaveBeenCalledWith(activity.id)
    expect(ElMessage.success).toHaveBeenCalledWith('报名成功')
  })

  it('handles activity check in', async () => {
    const { checkInActivity } = require('@/api/activity')
    const { ElMessageBox } = require('element-plus')
    
    checkInActivity.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    const activity = mockActivities.content[0]
    
    await wrapper.vm.handleCheckIn(activity)
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      `确定要签到活动 "${activity.title}" 吗？`,
      '确认签到',
      expect.any(Object)
    )
    expect(checkInActivity).toHaveBeenCalledWith(activity.id)
    expect(ElMessage.success).toHaveBeenCalledWith('签到成功')
  })

  it('handles batch check in', async () => {
    const { batchCheckIn } = require('@/api/activity')
    const { ElMessageBox } = require('element-plus')
    
    batchCheckIn.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    await wrapper.setData({
      currentActivity: mockActivities.content[0],
      selectedParticipants: [mockParticipants[0]]
    })
    
    await wrapper.vm.handleBatchCheckIn()
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '确定要为选中的 1 个参与者批量签到吗？',
      '确认批量签到',
      expect.any(Object)
    )
    expect(batchCheckIn).toHaveBeenCalledWith(mockActivities.content[0].id, [1])
    expect(ElMessage.success).toHaveBeenCalledWith('批量签到成功')
  })

  it('handles pagination change', async () => {
    const { getActivities } = require('@/api/activity')
    
    await wrapper.vm.handlePageChange(2)
    
    expect(wrapper.vm.pagination.page).toBe(1) // 0-indexed
    expect(getActivities).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      title: '',
      type: '',
      status: '',
      organizationId: null,
      organizerId: null
    })
  })

  it('handles page size change', async () => {
    const { getActivities } = require('@/api/activity')
    
    await wrapper.vm.handleSizeChange(20)
    
    expect(wrapper.vm.pagination.size).toBe(20)
    expect(wrapper.vm.pagination.page).toBe(0) // reset to first page
    expect(getActivities).toHaveBeenCalledWith({
      page: 0,
      size: 20,
      title: '',
      type: '',
      status: '',
      organizationId: null,
      organizerId: null
    })
  })

  it('validates form before submission', async () => {
    // Mock form validation
    const mockValidate = vi.fn().mockResolvedValue(false)
    wrapper.vm.$refs.activityFormRef = { validate: mockValidate }
    
    await wrapper.setData({
      activityForm: {
        title: '', // invalid - empty title
        type: '学习',
        content: '测试内容'
      },
      isEdit: false
    })
    
    await wrapper.vm.handleSubmit()
    
    expect(mockValidate).toHaveBeenCalled()
    // Should not proceed with API call if validation fails
    const { createActivity } = require('@/api/activity')
    expect(createActivity).not.toHaveBeenCalled()
  })

  it('formats activity status correctly', () => {
    expect(wrapper.vm.getStatusType('计划中')).toBe('info')
    expect(wrapper.vm.getStatusType('进行中')).toBe('success')
    expect(wrapper.vm.getStatusType('已结束')).toBe('warning')
    expect(wrapper.vm.getStatusType('已取消')).toBe('danger')
  })

  it('formats participant status correctly', () => {
    expect(wrapper.vm.getParticipantStatusType('已报名')).toBe('info')
    expect(wrapper.vm.getParticipantStatusType('已签到')).toBe('success')
    expect(wrapper.vm.getParticipantStatusType('已取消')).toBe('danger')
  })

  it('calculates activity duration correctly', () => {
    const activity = mockActivities.content[0]
    const duration = wrapper.vm.calculateDuration(activity.startTime, activity.endTime)
    expect(duration).toBe('2小时')
  })

  it('checks if activity is full', () => {
    const fullActivity = {
      maxParticipants: 30,
      currentParticipants: 30
    }
    const notFullActivity = {
      maxParticipants: 30,
      currentParticipants: 25
    }
    
    expect(wrapper.vm.isActivityFull(fullActivity)).toBe(true)
    expect(wrapper.vm.isActivityFull(notFullActivity)).toBe(false)
  })

  it('checks if activity can be signed up', () => {
    const futureActivity = {
      startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      status: '计划中'
    }
    const pastActivity = {
      startTime: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: '已结束'
    }
    
    expect(wrapper.vm.canSignUp(futureActivity)).toBe(true)
    expect(wrapper.vm.canSignUp(pastActivity)).toBe(false)
  })

  it('checks if activity can be checked in', () => {
    const ongoingActivity = {
      startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
      status: '进行中'
    }
    const futureActivity = {
      startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      status: '计划中'
    }
    
    expect(wrapper.vm.canCheckIn(ongoingActivity)).toBe(true)
    expect(wrapper.vm.canCheckIn(futureActivity)).toBe(false)
  })
})