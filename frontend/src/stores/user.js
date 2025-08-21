import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, getUserInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(getToken())
  const userInfo = ref(null)
  const permissions = ref([])
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.realName || userInfo.value?.username || '')
  const userRole = computed(() => userInfo.value?.role?.name || '')
  const userOrganization = computed(() => userInfo.value?.organization?.name || '')
  const avatar = computed(() => userInfo.value?.avatarUrl || '')
  
  // 登录
  const loginAction = async (loginData) => {
    console.log('🏪 Store: 开始登录操作', loginData)
    try {
      console.log('🌐 Store: 调用登录API')
      const response = await login(loginData)
      console.log('📥 Store: 收到API响应', response)
      
      // 检查响应结构
      if (!response) {
        console.error('❌ Store: API响应为空')
        throw new Error('登录响应为空')
      }
      
      if (!response.token) {
        console.error('❌ Store: 响应中缺少token', response)
        throw new Error('登录响应中缺少token')
      }
      
      // 保存token - 修复：从response对象中正确获取token
      console.log('💾 Store: 保存token')
      token.value = response.token
      setToken(response.token)
      console.log('✅ Store: token已保存')
      
      // 保存用户信息 - 修复：从response.data中获取用户信息
      if (response.data) {
        console.log('👤 Store: 保存用户信息', response.data)
        userInfo.value = response.data
        // 设置用户权限
        permissions.value = response.data.role?.permissions || []
        console.log('🔐 Store: 用户权限已设置', permissions.value)
      } else {
        console.warn('⚠️ Store: 响应中缺少用户数据')
      }
      
      console.log('✅ Store: 登录操作完成')
      return response
    } catch (error) {
      console.error('❌ Store: 登录失败:', error)
      console.error('❌ Store: 错误详情:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      })
      throw error
    }
  }
  
  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const response = await getUserInfo()
      const user = response.data
      
      userInfo.value = user
      permissions.value = user.role?.permissions || []
      
      return user
    } catch (error) {
      throw error
    }
  }
  
  // 登出
  const logoutAction = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 清除本地数据
      token.value = ''
      userInfo.value = null
      permissions.value = []
      removeToken()
      
      // 重定向到登录页
      router.push('/login')
    }
  }
  
  // 检查权限
  const hasPermission = (permission) => {
    if (!permission) return true
    return permissions.value.includes(permission)
  }
  
  // 检查多个权限（需要全部满足）
  const hasPermissions = (permissionList) => {
    if (!permissionList || permissionList.length === 0) return true
    return permissionList.every(permission => permissions.value.includes(permission))
  }
  
  // 检查任一权限（满足其中一个即可）
  const hasAnyPermission = (permissionList) => {
    if (!permissionList || permissionList.length === 0) return true
    return permissionList.some(permission => permissions.value.includes(permission))
  }
  
  // 更新用户信息
  const updateUserInfo = (newUserInfo) => {
    userInfo.value = { ...userInfo.value, ...newUserInfo }
  }
  
  // 更新头像
  const updateAvatar = (avatarUrl) => {
    if (userInfo.value) {
      userInfo.value.avatarUrl = avatarUrl
    }
  }
  
  return {
    // 状态
    token,
    userInfo,
    permissions,
    
    // 计算属性
    isLoggedIn,
    userName,
    userRole,
    userOrganization,
    avatar,
    
    // 方法
    login: loginAction,
    logout: logoutAction,
    getUserInfo: getUserInfoAction,
    hasPermission,
    hasPermissions,
    hasAnyPermission,
    updateUserInfo,
    updateAvatar
  }
})