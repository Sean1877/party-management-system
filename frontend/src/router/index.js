import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '工作台',
          icon: 'House'
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User'
        }
      },
      {
        path: '/organizations',
        name: 'Organizations',
        component: () => import('@/views/organization/index.vue'),
        meta: {
          title: '组织管理',
          icon: 'OfficeBuilding'
        }
      },
      {
        path: '/activities',
        name: 'Activities',
        component: () => import('@/views/activity/index.vue'),
        meta: {
          title: '活动管理',
          icon: 'Calendar'
        }
      },
      {
        path: '/fees',
        name: 'Fees',
        component: () => import('@/views/fee/index.vue'),
        meta: {
          title: '党费管理',
          icon: 'Money'
        }
      },
      {
        path: '/statistics',
        name: 'Statistics',
        component: () => import('@/views/statistics/index.vue'),
        meta: {
          title: '统计分析',
          icon: 'TrendCharts'
        }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'UserFilled'
        }
      }
    ]
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.log('🛡️ 路由守卫: 开始检查', { from: from.path, to: to.path })
  NProgress.start()
  
  const userStore = useUserStore()
  const token = userStore.token
  console.log('🔑 路由守卫: token状态', { hasToken: !!token, userInfo: !!userStore.userInfo })
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 党建管理系统` : '党建管理系统'
  
  // 如果访问登录页面且已登录，重定向到首页
  if (to.path === '/login' && token) {
    console.log('🔄 路由守卫: 已登录用户访问登录页，重定向到首页')
    next('/')
    return
  }
  
  // 如果页面需要认证
  if (to.meta.requiresAuth) {
    console.log('🔐 路由守卫: 页面需要认证')
    if (!token) {
      console.log('❌ 路由守卫: 无token，重定向到登录页')
      next('/login')
      return
    }
    
    // 如果用户信息不存在，获取用户信息
    if (!userStore.userInfo) {
      console.log('👤 路由守卫: 用户信息不存在，尝试获取')
      try {
        await userStore.getUserInfo()
        console.log('✅ 路由守卫: 用户信息获取成功')
      } catch (error) {
        console.error('❌ 路由守卫: 获取用户信息失败:', error)
        userStore.logout()
        next('/login')
        return
      }
    } else {
      console.log('✅ 路由守卫: 用户信息已存在')
    }
    
    // 检查权限
    if (to.meta.permissions && to.meta.permissions.length > 0) {
      console.log('🔍 路由守卫: 检查权限', to.meta.permissions)
      const hasPermission = userStore.hasPermissions(to.meta.permissions)
      if (!hasPermission) {
        console.log('❌ 路由守卫: 权限不足，重定向到404')
        next('/404')
        return
      }
      console.log('✅ 路由守卫: 权限检查通过')
    }
  }
  
  console.log('✅ 路由守卫: 检查通过，允许访问')
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router