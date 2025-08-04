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
          icon: 'User',
          permissions: ['user:view']
        }
      },
      {
        path: '/organizations',
        name: 'Organizations',
        component: () => import('@/views/organization/index.vue'),
        meta: {
          title: '组织管理',
          icon: 'OfficeBuilding',
          permissions: ['org:view']
        }
      },
      {
        path: '/activities',
        name: 'Activities',
        component: () => import('@/views/activity/index.vue'),
        meta: {
          title: '活动管理',
          icon: 'Calendar',
          permissions: ['activity:view']
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
  NProgress.start()
  
  const userStore = useUserStore()
  const token = userStore.token
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 党建管理系统` : '党建管理系统'
  
  // 如果访问登录页面且已登录，重定向到首页
  if (to.path === '/login' && token) {
    next('/')
    return
  }
  
  // 如果页面需要认证
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login')
      return
    }
    
    // 如果用户信息不存在，获取用户信息
    if (!userStore.userInfo) {
      try {
        await userStore.getUserInfo()
      } catch (error) {
        console.error('获取用户信息失败:', error)
        userStore.logout()
        next('/login')
        return
      }
    }
    
    // 检查权限
    if (to.meta.permissions && to.meta.permissions.length > 0) {
      const hasPermission = userStore.hasPermissions(to.meta.permissions)
      if (!hasPermission) {
        next('/404')
        return
      }
    }
  }
  
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router