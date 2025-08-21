<template>
  <div class="profile-page">
    <el-row :gutter="20">
      <!-- 左侧个人信息卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="profile-header">
            <div class="avatar-section">
              <el-avatar :size="80" :src="userInfo.avatarUrl" :icon="UserFilled" />
              <el-button type="primary" size="small" @click="handleAvatarUpload">
                更换头像
              </el-button>
            </div>
            
            <div class="user-info">
              <h3>{{ userInfo.realName }}</h3>
              <p class="username">@{{ userInfo.username }}</p>
              <el-tag :type="getPartyMemberStatusType(userInfo.partyMemberStatus)">
                {{ getPartyMemberStatusText(userInfo.partyMemberStatus) }}
              </el-tag>
            </div>
          </div>
          
          <el-divider />
          
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-value">{{ stats.activityCount || 0 }}</div>
              <div class="stat-label">参与活动</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.checkInCount || 0 }}</div>
              <div class="stat-label">签到次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ partyAge }}</div>
              <div class="stat-label">党龄</div>
            </div>
          </div>
        </el-card>
        
        <!-- 快捷操作 -->
        <el-card class="quick-actions" style="margin-top: 20px;">
          <template #header>
            <span>快捷操作</span>
          </template>
          
          <div class="action-list">
            <el-button type="primary" @click="handleEditProfile">
              <el-icon><Edit /></el-icon>
              编辑资料
            </el-button>
            <el-button type="warning" @click="handleChangePassword">
              <el-icon><Lock /></el-icon>
              修改密码
            </el-button>
            <el-button type="info" @click="handleViewActivities">
              <el-icon><Calendar /></el-icon>
              我的活动
            </el-button>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧详细信息 -->
      <el-col :span="16">
        <el-card class="detail-card">
          <template #header>
            <span>个人详细信息</span>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="真实姓名">{{ userInfo.realName }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ getGenderText(userInfo.gender) }}</el-descriptions-item>
            <el-descriptions-item label="出生日期">{{ userInfo.birthday || '-' }}</el-descriptions-item>
            <el-descriptions-item label="身份证号">{{ maskIdCard(userInfo.idCard) }}</el-descriptions-item>
            <el-descriptions-item label="民族">{{ userInfo.nation || '-' }}</el-descriptions-item>
            <el-descriptions-item label="政治面貌">{{ userInfo.politicalStatus || '-' }}</el-descriptions-item>
            <el-descriptions-item label="党员状态">
              <el-tag :type="getPartyMemberStatusType(userInfo.partyMemberStatus)">
                {{ getPartyMemberStatusText(userInfo.partyMemberStatus) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="入党时间">{{ userInfo.joinPartyDate || '-' }}</el-descriptions-item>
            <el-descriptions-item label="转正时间">{{ userInfo.formalDate || '-' }}</el-descriptions-item>
            <el-descriptions-item label="所属组织">{{ userInfo.organization?.name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ userInfo.role?.name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="学历">{{ userInfo.education || '-' }}</el-descriptions-item>
            <el-descriptions-item label="职业">{{ userInfo.profession || '-' }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{ userInfo.address || '-' }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ userInfo.remark || '-' }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ formatDate(userInfo.createTime) }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ formatDate(userInfo.lastLoginTime) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        
        <!-- 最近活动 -->
        <el-card class="recent-activities" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>最近参与的活动</span>
              <el-button type="text" @click="handleViewAllActivities">查看全部</el-button>
            </div>
          </template>
          
          <div v-if="recentActivities.length === 0" class="empty-state">
            <el-empty description="暂无参与的活动" />
          </div>
          
          <div v-else class="activity-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-info">
                <h4>{{ activity.title }}</h4>
                <p class="activity-meta">
                  <el-icon><Location /></el-icon>
                  {{ activity.location }}
                  <el-icon><Clock /></el-icon>
                  {{ formatDate(activity.startTime, 'YYYY-MM-DD HH:mm') }}
                </p>
              </div>
              
              <div class="activity-status">
                <el-tag :type="getActivityStatusColor(activity.status)" size="small">
                  {{ getActivityStatusText(activity.status) }}
                </el-tag>
                <el-tag v-if="activity.checkInTime" type="success" size="small">
                  已签到
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 编辑资料对话框 -->
    <ProfileForm
      v-model="profileFormVisible"
      :user="userInfo"
      @success="handleProfileUpdateSuccess"
    />
    
    <!-- 修改密码对话框 -->
    <PasswordForm
      v-model="passwordFormVisible"
    />
    
    <!-- 头像上传对话框 -->
    <AvatarUpload
      v-model="avatarUploadVisible"
      @success="handleAvatarUpdateSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getMyActivities } from '@/api/activity'
import { formatDate, getGenderText, getPartyMemberStatusText, getActivityStatusText } from '@/utils'
import ProfileForm from './components/ProfileForm.vue'
import PasswordForm from './components/PasswordForm.vue'
import AvatarUpload from './components/AvatarUpload.vue'
import {
  UserFilled,
  Edit,
  Lock,
  Calendar,
  Location,
  Clock
} from '@element-plus/icons-vue'

// Store
const userStore = useUserStore()

// 响应式数据
const profileFormVisible = ref(false)
const passwordFormVisible = ref(false)
const avatarUploadVisible = ref(false)
const recentActivities = ref([])
const stats = reactive({
  activityCount: 0,
  checkInCount: 0
})

// 计算属性
const userInfo = computed(() => userStore.userInfo)

// 党龄计算
const partyAge = computed(() => {
  if (!userInfo.value.joinPartyDate) return '-'
  
  const joinDate = new Date(userInfo.value.joinPartyDate)
  const now = new Date()
  const years = now.getFullYear() - joinDate.getFullYear()
  
  if (years < 1) {
    const months = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth())
    return months > 0 ? `${months}个月` : '不足1个月'
  }
  
  return `${years}年`
})

// 获取党员状态类型
const getPartyMemberStatusType = (status) => {
  const typeMap = {
    0: 'info',
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'info',
    5: 'danger',
    6: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取活动状态颜色
const getActivityStatusColor = (status) => {
  const colorMap = {
    0: 'info',     // 未开始
    1: 'primary',  // 报名中
    2: 'success',  // 进行中
    3: 'warning',  // 已结束
    4: 'danger'    // 已取消
  }
  return colorMap[status] || 'info'
}

// 身份证号脱敏
const maskIdCard = (idCard) => {
  if (!idCard) return '-'
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
}

// 加载最近活动
const loadRecentActivities = async () => {
  try {
    const response = await getMyActivities({ size: 5 })
    recentActivities.value = response.data.content || []
    
    // 统计数据
    stats.activityCount = response.data.totalElements || 0
    // 确保recentActivities.value是数组，防止 'data2 is not iterable' 错误
    const activitiesData = Array.isArray(recentActivities.value) ? recentActivities.value : []
    stats.checkInCount = activitiesData.filter(a => a.checkInTime).length
  } catch (error) {
    console.error('加载最近活动失败:', error)
  }
}

// 编辑资料
const handleEditProfile = () => {
  profileFormVisible.value = true
}

// 修改密码
const handleChangePassword = () => {
  passwordFormVisible.value = true
}

// 查看我的活动
const handleViewActivities = () => {
  // 跳转到活动页面，筛选我的活动
  // 这里可以使用路由跳转
}

// 查看全部活动
const handleViewAllActivities = () => {
  // 跳转到活动页面
}

// 头像上传
const handleAvatarUpload = () => {
  avatarUploadVisible.value = true
}

// 资料更新成功
const handleProfileUpdateSuccess = () => {
  profileFormVisible.value = false
  // 重新获取用户信息
  userStore.getUserInfo()
}

// 头像更新成功
const handleAvatarUpdateSuccess = () => {
  avatarUploadVisible.value = false
  // 重新获取用户信息
  userStore.getUserInfo()
}

// 组件挂载时加载数据
onMounted(() => {
  loadRecentActivities()
})
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 20px;
}

.profile-card {
  .profile-header {
    text-align: center;
    
    .avatar-section {
      margin-bottom: 16px;
      
      .el-button {
        margin-top: 8px;
      }
    }
    
    .user-info {
      h3 {
        margin: 0 0 8px 0;
        color: #303133;
      }
      
      .username {
        margin: 0 0 12px 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }
  
  .profile-stats {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: $primary-color;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.quick-actions {
  .action-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .el-button {
      justify-content: flex-start;
    }
  }
}

.detail-card {
  :deep(.el-descriptions) {
    .el-descriptions__label {
      font-weight: 500;
    }
  }
}

.recent-activities {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .activity-list {
    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-info {
        flex: 1;
        
        h4 {
          margin: 0 0 8px 0;
          color: #303133;
          font-size: 16px;
        }
        
        .activity-meta {
          margin: 0;
          color: #909399;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
      
      .activity-status {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: flex-end;
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 0;
  }
}

// 响应式
@media (max-width: $breakpoint-md) {
  .profile-page {
    padding: 16px;
    
    .el-row {
      flex-direction: column;
      
      .el-col {
        width: 100%;
        margin-bottom: 20px;
      }
    }
  }
  
  .quick-actions {
    .action-list {
      flex-direction: row;
      flex-wrap: wrap;
      
      .el-button {
        flex: 1;
        min-width: 120px;
      }
    }
  }
  
  .activity-list {
    .activity-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      
      .activity-status {
        align-items: flex-start;
        flex-direction: row;
      }
    }
  }
}
</style>