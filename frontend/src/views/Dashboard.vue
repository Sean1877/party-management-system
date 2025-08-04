<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <el-card class="welcome-card">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ userStore.userName }}！</h2>
            <p>今天是 {{ currentDate }}，{{ greeting }}</p>
          </div>
          <div class="welcome-avatar">
            <el-avatar :size="60" :src="userStore.avatar" :icon="UserFilled" />
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon primary">
                <el-icon><User /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.totalUsers || 0 }}</div>
                <div class="stats-label">党员总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon success">
                <el-icon><OfficeBuilding /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.totalOrganizations || 0 }}</div>
                <div class="stats-label">组织数量</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon warning">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.totalActivities || 0 }}</div>
                <div class="stats-label">活动总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon danger">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.activeUsers || 0 }}</div>
                <div class="stats-label">活跃用户</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 内容区域 -->
    <el-row :gutter="20" class="content-section">
      <!-- 左侧内容 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <!-- 最近活动 -->
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-link type="primary" :underline="false" @click="$router.push('/activities')">
                查看更多
              </el-link>
            </div>
          </template>
          
          <div v-if="recentActivities.length > 0" class="activity-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id" 
              class="activity-item"
            >
              <div class="activity-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-meta">
                  <span class="activity-time">{{ formatDate(activity.startTime, 'MM-DD HH:mm') }}</span>
                  <el-tag :type="getActivityStatusType(activity.status)" size="small">
                    {{ getActivityStatusText(activity.status) }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
          
          <el-empty v-else description="暂无活动" :image-size="80" />
        </el-card>
        
        <!-- 党员状态分布图表 -->
        <el-card class="content-card">
          <template #header>
            <span>党员状态分布</span>
          </template>
          
          <div class="chart-container">
            <v-chart :option="partyMemberChartOption" style="height: 300px;" />
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧内容 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <!-- 快捷操作 -->
        <el-card class="content-card">
          <template #header>
            <span>快捷操作</span>
          </template>
          
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/users')">
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </div>
            <div class="action-item" @click="$router.push('/organizations')">
              <el-icon><OfficeBuilding /></el-icon>
              <span>组织管理</span>
            </div>
            <div class="action-item" @click="$router.push('/activities')">
              <el-icon><Calendar /></el-icon>
              <span>活动管理</span>
            </div>
            <div class="action-item" @click="$router.push('/profile')">
              <el-icon><Setting /></el-icon>
              <span>个人设置</span>
            </div>
          </div>
        </el-card>
        
        <!-- 本月生日 -->
        <el-card class="content-card">
          <template #header>
            <span>本月生日</span>
          </template>
          
          <div v-if="birthdayUsers.length > 0" class="birthday-list">
            <div 
              v-for="user in birthdayUsers" 
              :key="user.id" 
              class="birthday-item"
            >
              <el-avatar :size="32" :src="user.avatarUrl" :icon="UserFilled" />
              <div class="birthday-info">
                <div class="birthday-name">{{ user.realName }}</div>
                <div class="birthday-date">{{ formatDate(user.birthDate, 'MM-DD') }}</div>
              </div>
            </div>
          </div>
          
          <el-empty v-else description="本月无生日" :image-size="60" />
        </el-card>
        
        <!-- 入党周年 -->
        <el-card class="content-card">
          <template #header>
            <span>入党周年</span>
          </template>
          
          <div v-if="anniversaryUsers.length > 0" class="anniversary-list">
            <div 
              v-for="user in anniversaryUsers" 
              :key="user.id" 
              class="anniversary-item"
            >
              <el-avatar :size="32" :src="user.avatarUrl" :icon="UserFilled" />
              <div class="anniversary-info">
                <div class="anniversary-name">{{ user.realName }}</div>
                <div class="anniversary-date">{{ formatDate(user.partyJoinDate, 'MM-DD') }}</div>
              </div>
            </div>
          </div>
          
          <el-empty v-else description="本月无入党周年" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useUserStore } from '@/stores/user'
import { getUserStats, getBirthdayUsers, getPartyAnniversaryUsers } from '@/api/user'
import { getOrganizationStats } from '@/api/organization'
import { getActivityStats, getRecentActivities } from '@/api/activity'
import { formatDate, getActivityStatusText } from '@/utils'
import {
  UserFilled,
  User,
  OfficeBuilding,
  Calendar,
  TrendCharts,
  Setting
} from '@element-plus/icons-vue'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const userStore = useUserStore()

// 响应式数据
const stats = ref({
  totalUsers: 0,
  totalOrganizations: 0,
  totalActivities: 0,
  activeUsers: 0
})
const recentActivities = ref([])
const birthdayUsers = ref([])
const anniversaryUsers = ref([])
const partyMemberStats = ref([])

// 当前日期和问候语
const currentDate = computed(() => {
  return formatDate(new Date(), 'YYYY年MM月DD日')
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，注意休息'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了，注意休息'
})

// 党员状态分布图表配置
const partyMemberChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '党员状态',
        type: 'pie',
        radius: '50%',
        data: partyMemberStats.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})

// 获取活动状态类型
const getActivityStatusType = (status) => {
  const typeMap = {
    0: 'info',
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return typeMap[status] || 'info'
}

// 加载数据
const loadData = async () => {
  try {
    // 并行加载所有数据
    const [userStatsRes, orgStatsRes, activityStatsRes, recentActivitiesRes, birthdayUsersRes, anniversaryUsersRes] = await Promise.all([
      getUserStats(),
      getOrganizationStats(),
      getActivityStats(),
      getRecentActivities(5),
      getBirthdayUsers(),
      getPartyAnniversaryUsers()
    ])
    
    // 设置统计数据
    stats.value = {
      totalUsers: userStatsRes.data.totalUsers || 0,
      totalOrganizations: orgStatsRes.data.totalOrganizations || 0,
      totalActivities: activityStatsRes.data.totalActivities || 0,
      activeUsers: userStatsRes.data.activeUsers || 0
    }
    
    // 设置最近活动
    recentActivities.value = recentActivitiesRes.data || []
    
    // 设置生日用户
    birthdayUsers.value = birthdayUsersRes.data || []
    
    // 设置入党周年用户
    anniversaryUsers.value = anniversaryUsersRes.data || []
    
    // 设置党员状态分布数据
    if (userStatsRes.data.partyMemberStats) {
      partyMemberStats.value = [
        { value: userStatsRes.data.partyMemberStats.activists || 0, name: '入党积极分子' },
        { value: userStatsRes.data.partyMemberStats.candidates || 0, name: '发展对象' },
        { value: userStatsRes.data.partyMemberStats.probationary || 0, name: '预备党员' },
        { value: userStatsRes.data.partyMemberStats.formal || 0, name: '正式党员' }
      ]
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  
  :deep(.el-card__body) {
    padding: 30px;
  }
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .welcome-text {
    h2 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 16px;
      opacity: 0.9;
    }
  }
}

.stats-section {
  margin-bottom: 20px;
}

.stats-card {
  .stats-content {
    display: flex;
    align-items: center;
    
    .stats-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      
      .el-icon {
        font-size: 24px;
        color: #ffffff;
      }
      
      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      &.success {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      
      &.warning {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }
      
      &.danger {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      }
    }
    
    .stats-info {
      .stats-number {
        font-size: 28px;
        font-weight: bold;
        color: $text-color-primary;
        line-height: 1;
        margin-bottom: 4px;
      }
      
      .stats-label {
        font-size: 14px;
        color: $text-color-secondary;
      }
    }
  }
}

.content-section {
  .content-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.activity-list {
  .activity-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid $border-color-lighter;
    
    &:last-child {
      border-bottom: none;
    }
    
    .activity-icon {
      width: 40px;
      height: 40px;
      background-color: $primary-color;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      
      .el-icon {
        color: #ffffff;
        font-size: 18px;
      }
    }
    
    .activity-content {
      flex: 1;
      
      .activity-title {
        font-size: 14px;
        font-weight: 500;
        color: $text-color-primary;
        margin-bottom: 4px;
      }
      
      .activity-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .activity-time {
          font-size: 12px;
          color: $text-color-secondary;
        }
      }
    }
  }
}

.chart-container {
  width: 100%;
  height: 300px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: $background-color-base;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background-color: $primary-color;
      color: #ffffff;
      transform: translateY(-2px);
    }
    
    .el-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    span {
      font-size: 14px;
    }
  }
}

.birthday-list,
.anniversary-list {
  .birthday-item,
  .anniversary-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid $border-color-lighter;
    
    &:last-child {
      border-bottom: none;
    }
    
    .birthday-info,
    .anniversary-info {
      margin-left: 12px;
      
      .birthday-name,
      .anniversary-name {
        font-size: 14px;
        color: $text-color-primary;
        margin-bottom: 2px;
      }
      
      .birthday-date,
      .anniversary-date {
        font-size: 12px;
        color: $text-color-secondary;
      }
    }
  }
}

// 响应式
@media (max-width: $breakpoint-md) {
  .dashboard {
    padding: 16px;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
    
    .welcome-text {
      margin-bottom: 16px;
    }
  }
  
  .quick-actions {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>