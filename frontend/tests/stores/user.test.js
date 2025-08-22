import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import ElMessage from 'element-plus'

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  }
}))

// Mock API
vi.mock('@/api/user', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn()
}))

describe('UserStore', () => {
  let userStore
  let pinia

  const mockUser = {
    id: 1,
    username: 'testuser',
    realName: '测试用户',
    email: 'test@example.com',
    phone: '13800138000',
    organizationId: 1,
    organizationName: '第一党支部',
    roleId: 2,
    roleName: '党员',
    permissions: ['user:read', 'user:write', 'activity:read']
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    userStore = useUserStore()
    
    // Clear store state
    userStore.$reset()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(userStore.user).toBeNull()
      expect(userStore.token).toBeNull()
      expect(userStore.isAuthenticated).toBe(false)
      expect(userStore.loading).toBe(false)
      expect(userStore.error).toBeNull()
    })
  })

  describe('login', () => {
    it('should handle successful login', async () => {
      const { login } = require('@/api/user')
      login.mockResolvedValue({
        data: {
          token: 'mock-token',
          user: mockUser
        }
      })

      await userStore.login('testuser', 'password123')

      expect(login).toHaveBeenCalledWith('testuser', 'password123')
      expect(userStore.token).toBe('mock-token')
      expect(userStore.user).toEqual(mockUser)
      expect(userStore.isAuthenticated).toBe(true)
      expect(userStore.error).toBeNull()
    })

    it('should handle login failure', async () => {
      const { login } = require('@/api/user')
      login.mockRejectedValue(new Error('登录失败'))

      await expect(userStore.login('testuser', 'wrongpassword')).rejects.toThrow('登录失败')
      expect(userStore.error).toBe('登录失败')
      expect(userStore.token).toBeNull()
      expect(userStore.user).toBeNull()
      expect(userStore.isAuthenticated).toBe(false)
    })

    it('should handle network error during login', async () => {
      const { login } = require('@/api/user')
      login.mockRejectedValue(new Error('网络连接失败'))

      await expect(userStore.login('testuser', 'password123')).rejects.toThrow('网络连接失败')
      expect(userStore.error).toBe('网络连接失败')
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      // Set initial logged in state
      userStore.user = mockUser
      userStore.token = 'mock-token'
      userStore.isAuthenticated = true
    })

    it('should handle successful logout', async () => {
      const { logout } = require('@/api/user')
      logout.mockResolvedValue({})

      await userStore.logout()

      expect(logout).toHaveBeenCalled()
      expect(userStore.user).toBeNull()
      expect(userStore.token).toBeNull()
      expect(userStore.isAuthenticated).toBe(false)
      expect(userStore.error).toBeNull()
    })

    it('should handle logout failure', async () => {
      const { logout } = require('@/api/user')
      logout.mockRejectedValue(new Error('退出登录失败'))

      await userStore.logout()

      // Even if API fails, should clear local state
      expect(userStore.user).toBeNull()
      expect(userStore.token).toBeNull()
      expect(userStore.isAuthenticated).toBe(false)
    })
  })

  describe('getCurrentUser', () => {
    it('should handle successful get current user', async () => {
      const { getCurrentUser } = require('@/api/user')
      getCurrentUser.mockResolvedValue({ data: mockUser })

      await userStore.getCurrentUser()

      expect(getCurrentUser).toHaveBeenCalled()
      expect(userStore.user).toEqual(mockUser)
      expect(userStore.error).toBeNull()
    })

    it('should handle get current user failure', async () => {
      const { getCurrentUser } = require('@/api/user')
      getCurrentUser.mockRejectedValue(new Error('获取用户信息失败'))

      await expect(userStore.getCurrentUser()).rejects.toThrow('获取用户信息失败')
      expect(userStore.error).toBe('获取用户信息失败')
    })
  })

  describe('updateProfile', () => {
    beforeEach(() => {
      // Set initial user state
      userStore.user = mockUser
    })

    it('should handle successful profile update', async () => {
      const { updateProfile } = require('@/api/user')
      const updatedUser = { ...mockUser, realName: '更新的用户名' }
      updateProfile.mockResolvedValue({ data: updatedUser })

      await userStore.updateProfile({ realName: '更新的用户名' })

      expect(updateProfile).toHaveBeenCalledWith({ realName: '更新的用户名' })
      expect(userStore.user.realName).toBe('更新的用户名')
      expect(ElMessage.success).toHaveBeenCalledWith('个人信息更新成功')
    })

    it('should handle profile update failure', async () => {
      const { updateProfile } = require('@/api/user')
      updateProfile.mockRejectedValue(new Error('更新失败'))

      await expect(userStore.updateProfile({ realName: '更新的用户名' })).rejects.toThrow('更新失败')
      expect(ElMessage.error).toHaveBeenCalledWith('个人信息更新失败')
    })
  })

  describe('changePassword', () => {
    it('should handle successful password change', async () => {
      const { changePassword } = require('@/api/user')
      changePassword.mockResolvedValue({})

      await userStore.changePassword('oldpassword', 'newpassword')

      expect(changePassword).toHaveBeenCalledWith('oldpassword', 'newpassword')
      expect(ElMessage.success).toHaveBeenCalledWith('密码修改成功')
    })

    it('should handle password change failure', async () => {
      const { changePassword } = require('@/api/user')
      changePassword.mockRejectedValue(new Error('密码修改失败'))

      await expect(userStore.changePassword('oldpassword', 'newpassword')).rejects.toThrow('密码修改失败')
      expect(ElMessage.error).toHaveBeenCalledWith('密码修改失败')
    })
  })

  describe('hasPermission', () => {
    beforeEach(() => {
      userStore.user = mockUser
    })

    it('should return true if user has permission', () => {
      expect(userStore.hasPermission('user:read')).toBe(true)
      expect(userStore.hasPermission('user:write')).toBe(true)
      expect(userStore.hasPermission('activity:read')).toBe(true)
    })

    it('should return false if user does not have permission', () => {
      expect(userStore.hasPermission('admin:read')).toBe(false)
      expect(userStore.hasPermission('system:write')).toBe(false)
    })

    it('should return false if user is not logged in', () => {
      userStore.user = null
      expect(userStore.hasPermission('user:read')).toBe(false)
    })
  })

  describe('hasAnyPermission', () => {
    beforeEach(() => {
      userStore.user = mockUser
    })

    it('should return true if user has any of the specified permissions', () => {
      expect(userStore.hasAnyPermission(['user:read', 'admin:read'])).toBe(true)
      expect(userStore.hasAnyPermission(['activity:read', 'system:write'])).toBe(true)
    })

    it('should return false if user has none of the specified permissions', () => {
      expect(userStore.hasAnyPermission(['admin:read', 'system:write'])).toBe(false)
    })

    it('should return false if user is not logged in', () => {
      userStore.user = null
      expect(userStore.hasAnyPermission(['user:read'])).toBe(false)
    })
  })

  describe('hasRole', () => {
    beforeEach(() => {
      userStore.user = mockUser
    })

    it('should return true if user has the specified role', () => {
      expect(userStore.hasRole('党员')).toBe(true)
    })

    it('should return false if user does not have the specified role', () => {
      expect(userStore.hasRole('管理员')).toBe(false)
    })

    it('should return false if user is not logged in', () => {
      userStore.user = null
      expect(userStore.hasRole('党员')).toBe(false)
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      userStore.error = 'Some error message'
      userStore.clearError()
      expect(userStore.error).toBeNull()
    })
  })

  describe('loading states', () => {
    it('should handle loading state during login', async () => {
      const { login } = require('@/api/user')
      login.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: { token: 'mock-token', user: mockUser } })
          }, 100)
        })
      })

      const loginPromise = userStore.login('testuser', 'password123')
      expect(userStore.loading).toBe(true)

      await loginPromise
      expect(userStore.loading).toBe(false)
    })

    it('should handle loading state during logout', async () => {
      const { logout } = require('@/api/user')
      logout.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({})
          }, 100)
        })
      })

      const logoutPromise = userStore.logout()
      expect(userStore.loading).toBe(true)

      await logoutPromise
      expect(userStore.loading).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle API error with message', async () => {
      const { login } = require('@/api/user')
      const apiError = new Error('用户名或密码错误')
      apiError.response = {
        data: {
          message: '用户名或密码错误'
        }
      }
      login.mockRejectedValue(apiError)

      await expect(userStore.login('testuser', 'wrongpassword')).rejects.toThrow('用户名或密码错误')
      expect(userStore.error).toBe('用户名或密码错误')
    })

    it('should handle API error without message', async () => {
      const { login } = require('@/api/user')
      login.mockRejectedValue(new Error())

      await expect(userStore.login('testuser', 'wrongpassword')).rejects.toThrow()
      expect(userStore.error).toBeDefined()
    })
  })

  describe('token management', () => {
    it('should store token in localStorage', async () => {
      const { login } = require('@/api/user')
      login.mockResolvedValue({
        data: {
          token: 'mock-token',
          user: mockUser
        }
      })

      await userStore.login('testuser', 'password123')

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
    })

    it('should remove token from localStorage on logout', async () => {
      // First login to set token
      const { login } = require('@/api/user')
      login.mockResolvedValue({
        data: {
          token: 'mock-token',
          user: mockUser
        }
      })
      await userStore.login('testuser', 'password123')

      // Then logout
      const { logout } = require('@/api/user')
      logout.mockResolvedValue({})
      await userStore.logout()

      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    })
  })
})