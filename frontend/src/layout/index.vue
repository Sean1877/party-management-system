<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <div 
      class="sidebar-container" 
      :class="{ 'collapsed': appStore.sidebarCollapsed }"
    >
      <Sidebar />
    </div>
    
    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar-container">
        <Navbar />
      </div>
      
      <!-- 页面内容 -->
      <div class="content-container">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

const appStore = useAppStore()

// 监听窗口大小变化
const handleResize = () => {
  const width = window.innerWidth
  if (width < 768) {
    appStore.setDevice('mobile')
  } else if (width < 992) {
    appStore.setDevice('tablet')
  } else {
    appStore.setDevice('desktop')
  }
}

// 初始化设备类型
handleResize()

// 监听窗口大小变化
window.addEventListener('resize', handleResize)

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.sidebar-container {
  width: $sidebar-width;
  height: 100%;
  background-color: #001529;
  transition: width 0.3s ease;
  
  &.collapsed {
    width: $sidebar-collapsed-width;
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar-container {
  height: $header-height;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: $z-index-top;
}

.content-container {
  flex: 1;
  overflow: auto;
  background-color: $background-color-base;
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 响应式布局
@media (max-width: $breakpoint-md) {
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $z-index-popper;
    
    &:not(.collapsed) {
      width: $sidebar-width;
    }
    
    &.collapsed {
      width: 0;
      overflow: hidden;
    }
  }
  
  .main-container {
    margin-left: 0;
  }
}
</style>