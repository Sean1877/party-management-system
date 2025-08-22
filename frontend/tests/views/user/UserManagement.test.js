import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UserManagement from '@/views/user/index.vue'
import { useUserStore } from '@/stores/user'
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
vi.mock('@/api/user', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  batchDeleteUsers: vi.fn(),
  activateUser: vi.fn(),
  deactivateUser: vi.fn(),
  resetPassword: vi.fn()
}))

vi.mock('@/api/organization', () => ({
  getOrganizations: vi.fn()
}))

describe('UserManagement', () => {
  let wrapper
  let pinia
  let userStore

  const mockUsers = {
    content: [
      {
        id: 1,
        username: 'zhangsan',
        realName: '张三',
        idCard: '123456789012345678',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        gender: 1,
        birthDate: '1990-01-01',
        joinPartyDate: '2020-01-01',
        partyStatus: 3,
        organizationId: 1,
        organizationName: '第一党支部',
        roleId: 2,
        roleName: '党员',
        isActive: true,
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        username: 'lisi',
        realName: '李四',
        idCard: '987654321098765432',
        phone: '13900139000',
        email: 'lisi@example.com',
        gender: 2,
        birthDate: '1995-05-05',
        joinPartyDate: '2021-06-01',
        partyStatus: 2,
        organizationId: 1,
        organizationName: '第一党支部',
        roleId: 3,
        roleName: '预备党员',
        isActive: true,
        createdAt: '2024-01-02T00:00:00'
      }
    ],
    totalElements: 2,
    totalPages: 1,
    size: 10,
    number: 0
  }

  const mockOrganizations = [
    { id: 1, name: '第一党支部', code: 'BRANCH_1' },
    { id: 2, name: '第二党支部', code: 'BRANCH_2' }
  ]

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    userStore = useUserStore()
    
    // Mock API responses
    const { getUsers } = require('@/api/user')
    const { getOrganizations } = require('@/api/organization')
    
    getUsers.mockResolvedValue({ data: mockUsers })
    getOrganizations.mockResolvedValue({ data: mockOrganizations })

    wrapper = mount(UserManagement, {
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
          'el-switch': true
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.user-management').exists()).toBe(true)
  })

  it('loads users on mount', async () => {
    const { getUsers } = require('@/api/user')
    
    await wrapper.vm.$nextTick()
    
    expect(getUsers).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      username: '',
      realName: '',
      organizationId: null,
      roleId: null,
      isActive: null
    })
  })

  it('loads organizations on mount', async () => {
    const { getOrganizations } = require('@/api/organization')
    
    await wrapper.vm.$nextTick()
    
    expect(getOrganizations).toHaveBeenCalled()
  })

  it('handles search functionality', async () => {
    const { getUsers } = require('@/api/user')
    
    // Set search criteria
    await wrapper.setData({
      searchForm: {
        username: 'zhang',
        realName: '张',
        organizationId: 1,
        roleId: 2,
        isActive: true
      }
    })
    
    // Trigger search
    await wrapper.vm.handleSearch()
    
    expect(getUsers).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      username: 'zhang',
      realName: '张',
      organizationId: 1,
      roleId: 2,
      isActive: true
    })
  })

  it('handles reset search', async () => {
    const { getUsers } = require('@/api/user')
    
    // Set some search criteria
    await wrapper.setData({
      searchForm: {
        username: 'zhang',
        realName: '张',
        organizationId: 1,
        roleId: 2,
        isActive: true
      }
    })
    
    // Reset search
    await wrapper.vm.handleReset()
    
    expect(wrapper.vm.searchForm).toEqual({
      username: '',
      realName: '',
      organizationId: null,
      roleId: null,
      isActive: null
    })
    
    expect(getUsers).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      username: '',
      realName: '',
      organizationId: null,
      roleId: null,
      isActive: null
    })
  })

  it('opens add user dialog', async () => {
    await wrapper.vm.handleAdd()
    
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('添加用户')
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.userForm).toEqual({
      username: '',
      password: '',
      realName: '',
      idCard: '',
      phone: '',
      email: '',
      gender: 1,
      birthDate: '',
      joinPartyDate: '',
      partyStatus: 1,
      organizationId: null,
      roleId: null,
      isActive: true
    })
  })

  it('opens edit user dialog', async () => {
    const user = mockUsers.content[0]
    
    await wrapper.vm.handleEdit(user)
    
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('编辑用户')
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.userForm.id).toBe(user.id)
    expect(wrapper.vm.userForm.username).toBe(user.username)
    expect(wrapper.vm.userForm.realName).toBe(user.realName)
  })

  it('handles user creation', async () => {
    const { createUser } = require('@/api/user')
    createUser.mockResolvedValue({ data: { id: 3, username: 'newuser' } })
    
    await wrapper.setData({
      userForm: {
        username: 'newuser',
        password: 'password123',
        realName: '新用户',
        idCard: '111111111111111111',
        phone: '13700137000',
        email: 'newuser@example.com',
        gender: 1,
        birthDate: '1992-03-03',
        joinPartyDate: '2022-07-01',
        partyStatus: 2,
        organizationId: 1,
        roleId: 3,
        isActive: true
      },
      isEdit: false
    })
    
    await wrapper.vm.handleSubmit()
    
    expect(createUser).toHaveBeenCalledWith(wrapper.vm.userForm)
    expect(ElMessage.success).toHaveBeenCalledWith('用户创建成功')
  })

  it('handles user update', async () => {
    const { updateUser } = require('@/api/user')
    updateUser.mockResolvedValue({ data: { id: 1, realName: '更新的用户' } })
    
    await wrapper.setData({
      userForm: {
        id: 1,
        username: 'zhangsan',
        realName: '更新的用户',
        idCard: '123456789012345678',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        gender: 1,
        birthDate: '1990-01-01',
        joinPartyDate: '2020-01-01',
        partyStatus: 3,
        organizationId: 1,
        roleId: 2,
        isActive: true
      },
      isEdit: true
    })
    
    await wrapper.vm.handleSubmit()
    
    expect(updateUser).toHaveBeenCalledWith(1, wrapper.vm.userForm)
    expect(ElMessage.success).toHaveBeenCalledWith('用户更新成功')
  })

  it('handles user deletion', async () => {
    const { deleteUser } = require('@/api/user')
    const { ElMessageBox } = require('element-plus')
    
    deleteUser.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    const user = mockUsers.content[0]
    
    await wrapper.vm.handleDelete(user)
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      `确定要删除用户 "${user.realName}" 吗？`,
      '确认删除',
      expect.any(Object)
    )
    expect(deleteUser).toHaveBeenCalledWith(user.id)
    expect(ElMessage.success).toHaveBeenCalledWith('用户删除成功')
  })

  it('handles batch deletion', async () => {
    const { batchDeleteUsers } = require('@/api/user')
    const { ElMessageBox } = require('element-plus')
    
    batchDeleteUsers.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    await wrapper.setData({
      selectedUsers: [mockUsers.content[0], mockUsers.content[1]]
    })
    
    await wrapper.vm.handleBatchDelete()
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      '确定要删除选中的 2 个用户吗？',
      '确认批量删除',
      expect.any(Object)
    )
    expect(batchDeleteUsers).toHaveBeenCalledWith([1, 2])
    expect(ElMessage.success).toHaveBeenCalledWith('批量删除成功')
  })

  it('handles user activation', async () => {
    const { activateUser } = require('@/api/user')
    activateUser.mockResolvedValue({})
    
    const user = mockUsers.content[0]
    
    await wrapper.vm.handleActivate(user)
    
    expect(activateUser).toHaveBeenCalledWith(user.id)
    expect(ElMessage.success).toHaveBeenCalledWith('用户激活成功')
  })

  it('handles user deactivation', async () => {
    const { deactivateUser } = require('@/api/user')
    deactivateUser.mockResolvedValue({})
    
    const user = mockUsers.content[0]
    
    await wrapper.vm.handleDeactivate(user)
    
    expect(deactivateUser).toHaveBeenCalledWith(user.id)
    expect(ElMessage.success).toHaveBeenCalledWith('用户停用成功')
  })

  it('handles password reset', async () => {
    const { resetPassword } = require('@/api/user')
    const { ElMessageBox } = require('element-plus')
    
    resetPassword.mockResolvedValue({})
    ElMessageBox.confirm.mockResolvedValue('confirm')
    
    const user = mockUsers.content[0]
    
    await wrapper.vm.handleResetPassword(user)
    
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      `确定要重置用户 "${user.realName}" 的密码吗？`,
      '确认重置密码',
      expect.any(Object)
    )
    expect(resetPassword).toHaveBeenCalledWith(user.id)
    expect(ElMessage.success).toHaveBeenCalledWith('密码重置成功')
  })

  it('handles pagination change', async () => {
    const { getUsers } = require('@/api/user')
    
    await wrapper.vm.handlePageChange(2)
    
    expect(wrapper.vm.pagination.page).toBe(1) // 0-indexed
    expect(getUsers).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      username: '',
      realName: '',
      organizationId: null,
      roleId: null,
      isActive: null
    })
  })

  it('handles page size change', async () => {
    const { getUsers } = require('@/api/user')
    
    await wrapper.vm.handleSizeChange(20)
    
    expect(wrapper.vm.pagination.size).toBe(20)
    expect(wrapper.vm.pagination.page).toBe(0) // reset to first page
    expect(getUsers).toHaveBeenCalledWith({
      page: 0,
      size: 20,
      username: '',
      realName: '',
      organizationId: null,
      roleId: null,
      isActive: null
    })
  })

  it('validates form before submission', async () => {
    // Mock form validation
    const mockValidate = vi.fn().mockResolvedValue(false)
    wrapper.vm.$refs.userFormRef = { validate: mockValidate }
    
    await wrapper.setData({
      userForm: {
        username: '', // invalid - empty username
        realName: '测试用户',
        idCard: '123456789012345678'
      },
      isEdit: false
    })
    
    await wrapper.vm.handleSubmit()
    
    expect(mockValidate).toHaveBeenCalled()
    // Should not proceed with API call if validation fails
    const { createUser } = require('@/api/user')
    expect(createUser).not.toHaveBeenCalled()
  })

  it('formats user status correctly', () => {
    expect(wrapper.vm.getStatusType(true)).toBe('success')
    expect(wrapper.vm.getStatusType(false)).toBe('danger')
  })

  it('formats party status correctly', () => {
    expect(wrapper.vm.getPartyStatusType(1)).toBe('info')
    expect(wrapper.vm.getPartyStatusType(2)).toBe('warning')
    expect(wrapper.vm.getPartyStatusType(3)).toBe('success')
  })

  it('formats gender correctly', () => {
    expect(wrapper.vm.getGenderText(1)).toBe('男')
    expect(wrapper.vm.getGenderText(2)).toBe('女')
  })

  it('calculates user statistics correctly', () => {
    wrapper.vm.usersData = mockUsers.content
    
    const stats = wrapper.vm.userStats
    
    expect(stats.total).toBe(2)
    expect(stats.active).toBe(2)
    expect(stats.inactive).toBe(0)
    expect(stats.partyMembers).toBe(1) // partyStatus 3
    expect(stats.prePartyMembers).toBe(1) // partyStatus 2
  })

  it('filters users by search criteria', () => {
    wrapper.vm.usersData = mockUsers.content
    wrapper.vm.searchForm = {
      username: 'zhang',
      realName: '',
      organizationId: null,
      roleId: null,
      isActive: null
    }
    
    const filteredUsers = wrapper.vm.filteredUsers
    
    expect(filteredUsers.every(user => user.username.includes('zhang'))).toBe(true)
  })

  it('exports user data correctly', async () => {
    const exportData = wrapper.vm.exportUsers()
    
    expect(exportData).toBeDefined()
    expect(exportData.headers).toBeDefined()
    expect(exportData.data).toBeDefined()
    expect(exportData.data.length).toBe(mockUsers.content.length)
  })
})