import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Mock 模块
vi.mock('@/api/auth')
vi.mock('@/utils/auth')
vi.mock('@/router')

import { useUserStore } from '@/stores/user'
import * as authAPI from '@/api/auth'
import * as authUtils from '@/utils/auth'
import router from '@/router'

describe('UserStore', () => {
  let userStore
  let pinia

  const mockUserData = {
    id: 1,
    username: 'testuser',
    realName: '测试用户',
    email: 'test@example.com',
    phone: '13800138000',
    avatarUrl: 'https://example.com/avatar.png',
    role: {
      id: 1,
      name: '党员',
      permissions: ['user:read', 'user:write', 'activity:read']
    },
    organization: {
      id: 1,
      name: '第一党支部'
    }
  }

  const mockLoginResponse = {
    token: 'mock-jwt-token',
    data: mockUserData
  }

  beforeEach(() => {
    // 重置所有mocks
    vi.clearAllMocks()
    
    pinia = createPinia()
    setActivePinia(pinia)
    userStore = useUserStore()
    
    // 重置localStorage mock
    vi.mocked(authUtils.getToken).mockReturnValue(null)
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(userStore.token).toBeNull()
      expect(userStore.userInfo).toBeNull()
      expect(userStore.permissions).toEqual([])
    })

    it('计算属性应该返回正确的初始值', () => {
      expect(userStore.isLoggedIn).toBe(false)
      expect(userStore.userName).toBe('')
      expect(userStore.userRole).toBe('')
      expect(userStore.userOrganization).toBe('')
      expect(userStore.avatar).toBe('')
    })
  })

  describe('登录功能', () => {
    it('应该成功处理登录', async () => {
      // Mock API调用
      vi.mocked(authAPI.login).mockResolvedValue(mockLoginResponse)

      const loginData = {
        username: 'testuser',
        password: 'password123'
      }

      const result = await userStore.login(loginData)

      // 验证API调用
      expect(authAPI.login).toHaveBeenCalledWith(loginData)
      
      // 验证状态更新
      expect(userStore.token).toBe('mock-jwt-token')
      expect(userStore.userInfo).toEqual(mockUserData)
      expect(userStore.permissions).toEqual(['user:read', 'user:write', 'activity:read'])
      
      // 验证计算属性
      expect(userStore.isLoggedIn).toBe(true)
      expect(userStore.userName).toBe('测试用户')
      expect(userStore.userRole).toBe('党员')
      expect(userStore.userOrganization).toBe('第一党支部')
      expect(userStore.avatar).toBe('https://example.com/avatar.png')
      
      // 验证token存储
      expect(authUtils.setToken).toHaveBeenCalledWith('mock-jwt-token')
      
      // 验证返回值
      expect(result).toEqual(mockLoginResponse)
    })

    it('应该处理缺少token的登录响应', async () => {
      const invalidResponse = { data: mockUserData }
      vi.mocked(authAPI.login).mockResolvedValue(invalidResponse)

      const loginData = { username: 'testuser', password: 'password123' }

      await expect(userStore.login(loginData)).rejects.toThrow('登录响应中缺少token')
    })

    it('应该处理空响应', async () => {
      vi.mocked(authAPI.login).mockResolvedValue(null)

      const loginData = { username: 'testuser', password: 'password123' }

      await expect(userStore.login(loginData)).rejects.toThrow('登录响应为空')
    })

    it('应该处理登录失败', async () => {
      const error = new Error('用户名或密码错误')
      vi.mocked(authAPI.login).mockRejectedValue(error)

      const loginData = { username: 'testuser', password: 'wrongpassword' }

      await expect(userStore.login(loginData)).rejects.toThrow('用户名或密码错误')
    })

    it('应该处理没有用户数据的登录响应', async () => {
      const responseWithoutData = { token: 'mock-jwt-token' }
      vi.mocked(authAPI.login).mockResolvedValue(responseWithoutData)

      const loginData = { username: 'testuser', password: 'password123' }

      const result = await userStore.login(loginData)

      expect(userStore.token).toBe('mock-jwt-token')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.permissions).toEqual([])
      expect(result).toEqual(responseWithoutData)
    })
  })

  describe('获取用户信息功能', () => {
    it('应该成功获取用户信息', async () => {
      const getUserInfoResponse = { data: mockUserData }
      vi.mocked(authAPI.getUserInfo).mockResolvedValue(getUserInfoResponse)

      const result = await userStore.getUserInfo()

      expect(authAPI.getUserInfo).toHaveBeenCalled()
      expect(userStore.userInfo).toEqual(mockUserData)
      expect(userStore.permissions).toEqual(['user:read', 'user:write', 'activity:read'])
      expect(result).toEqual(mockUserData)
    })

    it('应该处理获取用户信息失败', async () => {
      const error = new Error('获取用户信息失败')
      vi.mocked(authAPI.getUserInfo).mockRejectedValue(error)

      await expect(userStore.getUserInfo()).rejects.toThrow('获取用户信息失败')
    })

    it('应该处理没有角色权限的用户', async () => {
      const userWithoutRole = { ...mockUserData, role: null }
      const getUserInfoResponse = { data: userWithoutRole }
      vi.mocked(authAPI.getUserInfo).mockResolvedValue(getUserInfoResponse)

      await userStore.getUserInfo()

      expect(userStore.userInfo).toEqual(userWithoutRole)
      expect(userStore.permissions).toEqual([])
    })
  })

  describe('登出功能', () => {
    beforeEach(() => {
      // 设置已登录状态
      userStore.token = 'existing-token'
      userStore.userInfo = mockUserData
      userStore.permissions = ['user:read', 'user:write']
    })

    it('应该成功处理登出', async () => {
      vi.mocked(authAPI.logout).mockResolvedValue({})

      await userStore.logout()

      // 验证API调用
      expect(authAPI.logout).toHaveBeenCalled()
      
      // 验证状态清理
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.permissions).toEqual([])
      
      // 验证token移除
      expect(authUtils.removeToken).toHaveBeenCalled()
      
      // 验证路由跳转
      expect(router.push).toHaveBeenCalledWith('/login')
    })

    it('应该在API失败时仍清理本地状态', async () => {
      const error = new Error('登出API失败')
      vi.mocked(authAPI.logout).mockRejectedValue(error)

      await userStore.logout()

      // 即使API失败，也应该清理本地状态
      expect(userStore.token).toBe('')
      expect(userStore.userInfo).toBeNull()
      expect(userStore.permissions).toEqual([])
      expect(authUtils.removeToken).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('权限检查功能', () => {
    beforeEach(() => {
      userStore.permissions = ['user:read', 'user:write', 'activity:read']
    })

    describe('hasPermission', () => {
      it('应该在用户拥有权限时返回true', () => {
        expect(userStore.hasPermission('user:read')).toBe(true)
        expect(userStore.hasPermission('user:write')).toBe(true)
        expect(userStore.hasPermission('activity:read')).toBe(true)
      })

      it('应该在用户没有权限时返回false', () => {
        expect(userStore.hasPermission('admin:read')).toBe(false)
        expect(userStore.hasPermission('system:write')).toBe(false)
      })

      it('应该在权限为空或null时返回true', () => {
        expect(userStore.hasPermission(null)).toBe(true)
        expect(userStore.hasPermission('')).toBe(true)
        expect(userStore.hasPermission(undefined)).toBe(true)
      })
    })

    describe('hasPermissions', () => {
      it('应该在用户拥有所有权限时返回true', () => {
        expect(userStore.hasPermissions(['user:read', 'user:write'])).toBe(true)
        expect(userStore.hasPermissions(['activity:read'])).toBe(true)
      })

      it('应该在用户缺少任一权限时返回false', () => {
        expect(userStore.hasPermissions(['user:read', 'admin:read'])).toBe(false)
        expect(userStore.hasPermissions(['system:write'])).toBe(false)
      })

      it('应该在权限列表为空时返回true', () => {
        expect(userStore.hasPermissions([])).toBe(true)
        expect(userStore.hasPermissions(null)).toBe(true)
        expect(userStore.hasPermissions(undefined)).toBe(true)
      })
    })

    describe('hasAnyPermission', () => {
      it('应该在用户拥有任一权限时返回true', () => {
        expect(userStore.hasAnyPermission(['user:read', 'admin:read'])).toBe(true)
        expect(userStore.hasAnyPermission(['activity:read', 'system:write'])).toBe(true)
      })

      it('应该在用户没有任何权限时返回false', () => {
        expect(userStore.hasAnyPermission(['admin:read', 'system:write'])).toBe(false)
      })

      it('应该在权限列表为空时返回true', () => {
        expect(userStore.hasAnyPermission([])).toBe(true)
        expect(userStore.hasAnyPermission(null)).toBe(true)
        expect(userStore.hasAnyPermission(undefined)).toBe(true)
      })
    })
  })

  describe('用户信息更新功能', () => {
    beforeEach(() => {
      userStore.userInfo = { ...mockUserData }
    })

    it('应该更新用户信息', () => {
      const updateData = { realName: '新用户名', email: 'new@example.com' }
      
      userStore.updateUserInfo(updateData)

      expect(userStore.userInfo.realName).toBe('新用户名')
      expect(userStore.userInfo.email).toBe('new@example.com')
      expect(userStore.userInfo.username).toBe('testuser') // 未更新的字段保持原值
    })

    it('应该更新头像', () => {
      const newAvatarUrl = 'https://example.com/new-avatar.png'
      
      userStore.updateAvatar(newAvatarUrl)

      expect(userStore.userInfo.avatarUrl).toBe(newAvatarUrl)
      expect(userStore.avatar).toBe(newAvatarUrl)
    })

    it('应该在没有用户信息时不更新头像', () => {
      userStore.userInfo = null
      const newAvatarUrl = 'https://example.com/new-avatar.png'
      
      userStore.updateAvatar(newAvatarUrl)

      expect(userStore.userInfo).toBeNull()
    })
  })

  describe('计算属性', () => {
    describe('isLoggedIn', () => {
      it('应该在有token时返回true', () => {
        userStore.token = 'some-token'
        expect(userStore.isLoggedIn).toBe(true)
      })

      it('应该在没有token时返回false', () => {
        userStore.token = ''
        expect(userStore.isLoggedIn).toBe(false)
        
        userStore.token = null
        expect(userStore.isLoggedIn).toBe(false)
      })
    })

    describe('userName', () => {
      it('应该优先返回realName', () => {
        userStore.userInfo = { realName: '真实姓名', username: '用户名' }
        expect(userStore.userName).toBe('真实姓名')
      })

      it('应该在没有realName时返回username', () => {
        userStore.userInfo = { username: '用户名' }
        expect(userStore.userName).toBe('用户名')
      })

      it('应该在没有用户信息时返回空字符串', () => {
        userStore.userInfo = null
        expect(userStore.userName).toBe('')
      })
    })

    describe('userRole', () => {
      it('应该返回角色名称', () => {
        userStore.userInfo = { role: { name: '管理员' } }
        expect(userStore.userRole).toBe('管理员')
      })

      it('应该在没有角色信息时返回空字符串', () => {
        userStore.userInfo = { role: null }
        expect(userStore.userRole).toBe('')
        
        userStore.userInfo = null
        expect(userStore.userRole).toBe('')
      })
    })

    describe('userOrganization', () => {
      it('应该返回组织名称', () => {
        userStore.userInfo = { organization: { name: '第一党支部' } }
        expect(userStore.userOrganization).toBe('第一党支部')
      })

      it('应该在没有组织信息时返回空字符串', () => {
        userStore.userInfo = { organization: null }
        expect(userStore.userOrganization).toBe('')
        
        userStore.userInfo = null
        expect(userStore.userOrganization).toBe('')
      })
    })

    describe('avatar', () => {
      it('应该返回头像URL', () => {
        userStore.userInfo = { avatarUrl: 'https://example.com/avatar.png' }
        expect(userStore.avatar).toBe('https://example.com/avatar.png')
      })

      it('应该在没有头像时返回空字符串', () => {
        userStore.userInfo = { avatarUrl: null }
        expect(userStore.avatar).toBe('')
        
        userStore.userInfo = null
        expect(userStore.avatar).toBe('')
      })
    })
  })

  describe('从token初始化', () => {
    it('应该从localStorage读取token', () => {
      vi.mocked(authUtils.getToken).mockReturnValue('stored-token')
      
      // 重新创建store来测试初始化
      const newStore = useUserStore()
      
      expect(newStore.token).toBe('stored-token')
      expect(newStore.isLoggedIn).toBe(true)
    })

    it('应该在没有存储token时保持空状态', () => {
      vi.mocked(authUtils.getToken).mockReturnValue(null)
      
      const newStore = useUserStore()
      
      expect(newStore.token).toBeNull()
      expect(newStore.isLoggedIn).toBe(false)
    })
  })
})