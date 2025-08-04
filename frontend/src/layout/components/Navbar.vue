<template>
  <div class="navbar">
    <!-- 左侧区域 -->
    <div class="navbar-left">
      <!-- 折叠按钮 -->
      <div class="hamburger" @click="toggleSidebar">
        <el-icon size="20">
          <Fold v-if="!appStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>
      
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          <router-link v-if="item.path" :to="item.path">{{ item.title }}</router-link>
          <span v-else>{{ item.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 右侧区域 -->
    <div class="navbar-right">
      <!-- 主题切换 -->
      <div class="navbar-item" @click="toggleTheme">
        <el-icon size="18">
          <Sunny v-if="appStore.isDark" />
          <Moon v-else />
        </el-icon>
      </div>
      
      <!-- 全屏切换 -->
      <div class="navbar-item" @click="toggleFullscreen">
        <el-icon size="18">
          <FullScreen />
        </el-icon>
      </div>
      
      <!-- 用户信息 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar 
            :size="32" 
            :src="userStore.avatar" 
            :icon="UserFilled"
          />
          <span class="username">{{ userStore.userName }}</span>
          <el-icon class="dropdown-icon">
            <ArrowDown />
          </el-icon>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import {
  Fold,
  Expand,
  Sunny,
  Moon,
  FullScreen,
  UserFilled,
  ArrowDown,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const breadcrumbList = []
  
  matched.forEach(item => {
    if (item.name !== 'Layout') {
      breadcrumbList.push({
        title: item.meta.title,
        path: item.path
      })
    }
  })
  
  return breadcrumbList
})

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 切换主题
const toggleTheme = () => {
  appStore.toggleTheme()
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      // TODO: 跳转到设置页面
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.logout()
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #ffffff;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: $border-radius-base;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: $background-color-base;
  }
}

.breadcrumb {
  margin-left: 16px;
  
  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      color: $text-color-regular;
      
      &:hover {
        color: $primary-color;
      }
    }
    
    &:last-child .el-breadcrumb__inner {
      color: $text-color-primary;
      font-weight: 500;
    }
  }
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: $border-radius-base;
  transition: background-color 0.3s;
  color: $text-color-regular;
  
  &:hover {
    background-color: $background-color-base;
    color: $primary-color;
  }
}

.user-info {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: $border-radius-base;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: $background-color-base;
  }
  
  .username {
    margin: 0 8px;
    font-size: 14px;
    color: $text-color-primary;
  }
  
  .dropdown-icon {
    color: $text-color-secondary;
    transition: transform 0.3s;
  }
}

// 响应式
@media (max-width: $breakpoint-md) {
  .breadcrumb {
    display: none;
  }
  
  .navbar {
    padding: 0 16px;
  }
  
  .navbar-right {
    gap: 8px;
  }
  
  .user-info {
    .username {
      display: none;
    }
  }
}
</style>