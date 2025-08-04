import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebarCollapsed = ref(false)
  
  // 主题模式
  const isDark = ref(false)
  
  // 设备类型
  const device = ref('desktop') // desktop, tablet, mobile
  
  // 页面加载状态
  const pageLoading = ref(false)
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 设置侧边栏状态
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
  }
  
  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    // 应用主题到document
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // 设置主题
  const setTheme = (dark) => {
    isDark.value = dark
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // 设置设备类型
  const setDevice = (deviceType) => {
    device.value = deviceType
    
    // 移动端自动收起侧边栏
    if (deviceType === 'mobile') {
      sidebarCollapsed.value = true
    }
  }
  
  // 设置页面加载状态
  const setPageLoading = (loading) => {
    pageLoading.value = loading
  }
  
  return {
    // 状态
    sidebarCollapsed,
    isDark,
    device,
    pageLoading,
    
    // 方法
    toggleSidebar,
    setSidebarCollapsed,
    toggleTheme,
    setTheme,
    setDevice,
    setPageLoading
  }
})