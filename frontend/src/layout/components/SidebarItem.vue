<template>
  <!-- 如果有子菜单 -->
  <el-sub-menu 
    v-if="hasChildren" 
    :index="route.path"
  >
    <template #title>
      <el-icon v-if="route.meta.icon">
        <component :is="route.meta.icon" />
      </el-icon>
      <span>{{ route.meta.title }}</span>
    </template>
    
    <template v-for="child in route.children" :key="child.path">
      <SidebarItem :route="child" />
    </template>
  </el-sub-menu>
  
  <!-- 单个菜单项 -->
  <el-menu-item 
    v-else
    :index="route.path"
  >
    <el-icon v-if="route.meta.icon">
      <component :is="route.meta.icon" />
    </el-icon>
    <template #title>
      <span>{{ route.meta.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  route: {
    type: Object,
    required: true
  }
})

const userStore = useUserStore()

// 是否有子菜单
const hasChildren = computed(() => {
  // 确保route.children是数组，防止 'data2 is not iterable' 错误
  const childrenData = Array.isArray(props.route.children) ? props.route.children : []
  
  if (childrenData.length === 0) {
    return false
  }
  
  // 过滤掉隐藏的和没有权限的子菜单
  const visibleChildren = childrenData.filter(child => {
    if (child.meta && child.meta.hidden) {
      return false
    }
    
    if (child.meta && child.meta.permissions && Array.isArray(child.meta.permissions) && child.meta.permissions.length > 0) {
      return userStore.hasPermissions(child.meta.permissions)
    }
    
    return true
  })
  
  return visibleChildren.length > 0
})
</script>

<style lang="scss" scoped>
// 样式已在父组件中定义
</style>