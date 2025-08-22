<template>
  <div class="sidebar">
    <!-- Logo区域 -->
    <div class="logo-container">
      <div class="logo">
        <img src="/logo.svg" alt="Logo" class="logo-img" v-if="!appStore.sidebarCollapsed">
        <img src="/logo-mini.svg" alt="Logo" class="logo-img-mini" v-else>
        <span class="logo-text" v-if="!appStore.sidebarCollapsed">党建管理系统</span>
      </div>
    </div>
    
    <!-- 菜单区域 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      :unique-opened="true"
      :collapse-transition="false"
      mode="vertical"
      background-color="#001529"
      text-color="rgba(255, 255, 255, 0.65)"
      active-text-color="#ffffff"
      router
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <SidebarItem :route="route" />
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 菜单路由
const menuRoutes = computed(() => {
  const routes = router.getRoutes()
  const layoutRoute = routes.find(r => r.name === 'Layout')
  
  if (!layoutRoute || !layoutRoute.children) {
    return []
  }
  
  return layoutRoute.children.filter(route => {
    // 过滤掉不需要在菜单中显示的路由
    if (!route.meta || route.meta.hidden) {
      return false
    }
    
    // 权限检查已移除，显示所有菜单项
    
    return true
  })
})
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-container {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #002140;
  border-bottom: 1px solid #1d3a5f;
}

.logo {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  
  .logo-img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
  
  .logo-img-mini {
    width: 32px;
    height: 32px;
  }
  
  .logo-text {
    white-space: nowrap;
  }
}

.el-menu {
  flex: 1;
  border: none;
  
  &:not(.el-menu--collapse) {
    width: $sidebar-width;
  }
}

// Element Plus 菜单样式覆盖
:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  
  &:hover {
    background-color: #1890ff !important;
  }
  
  &.is-active {
    background-color: #1890ff !important;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 3px;
      height: 100%;
      background-color: #ffffff;
    }
  }
}

:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  
  &:hover {
    background-color: #1890ff !important;
  }
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #000c17 !important;
  
  &:hover {
    background-color: #1890ff !important;
  }
  
  &.is-active {
    background-color: #1890ff !important;
  }
}

:deep(.el-menu--collapse) {
  .el-menu-item,
  .el-sub-menu__title {
    text-align: center;
    
    .el-icon {
      margin-right: 0;
    }
  }
}
</style>