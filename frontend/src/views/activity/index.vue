<template>
  <div class="activity-management">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <div class="search-section">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入活动标题"
              clearable
              style="width: 200px;"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="活动类型">
            <el-select
              v-model="searchForm.type"
              placeholder="请选择类型"
              clearable
              style="width: 150px;"
            >
              <el-option label="学习教育" :value="0" />
              <el-option label="组织生活" :value="1" />
              <el-option label="实践活动" :value="2" />
              <el-option label="志愿服务" :value="3" />
              <el-option label="文体活动" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="活动状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 120px;"
            >
              <el-option label="未开始" :value="0" />
              <el-option label="报名中" :value="1" />
              <el-option label="进行中" :value="2" />
              <el-option label="已结束" :value="3" />
              <el-option label="已取消" :value="4" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 240px;"
              @change="handleDateRangeChange"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="action-section">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增活动
        </el-button>
        <el-button 
          type="danger" 
          :disabled="selectedActivities.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>
    
    <!-- 活动表格 -->
    <el-card class="table-card">
      <el-table
        v-if="Array.isArray(activities)"
        ref="activityTableRef"
        v-loading="loading"
        :data="activities"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="title" label="活动标题" width="200" show-overflow-tooltip />
        
        <el-table-column label="活动类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getActivityTypeColor(row.type)">
              {{ getActivityTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="活动状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getActivityStatusColor(row.status)">
              {{ getActivityStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="organizer.realName" label="组织者" width="100" />
        
        <el-table-column prop="organization.name" label="主办组织" width="150" show-overflow-tooltip />
        
        <el-table-column label="活动时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.startTime, 'YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        
        <el-table-column prop="location" label="活动地点" width="150" show-overflow-tooltip />
        
        <el-table-column label="报名情况" width="120">
          <template #default="{ row }">
            <span>{{ row.participantCount || 0 }}/{{ row.maxParticipants || '不限' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="info" size="small" @click="handleViewParticipants(row)">
              参与者
            </el-button>
            <el-button 
              v-if="row.status === 1"
              type="success" 
              size="small" 
              @click="handleSignUp(row)"
            >
              报名
            </el-button>
            <el-button 
              v-if="row.status === 2"
              type="warning" 
              size="small" 
              @click="handleCheckIn(row)"
            >
              签到
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 活动表单对话框 -->
    <ActivityForm
      v-model="formVisible"
      :activity="currentActivity"
      :organizations="organizations"
      @success="handleFormSuccess"
    />
    
    <!-- 参与者列表对话框 -->
    <ParticipantList
      v-model="participantVisible"
      :activity="currentActivity"
    />
    
    <!-- 签到对话框 -->
    <CheckInDialog
      v-model="checkInVisible"
      :activity="currentActivity"
      @success="handleCheckInSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getActivityList, 
  deleteActivity, 
  batchDeleteActivities,
  joinActivity,
  cancelJoinActivity
} from '@/api/activity'
import { getOrganizationList } from '@/api/organization'
import { formatDate, getActivityTypeText, getActivityStatusText } from '@/utils'
import ActivityForm from './components/ActivityForm.vue'
import ParticipantList from './components/ParticipantList.vue'
import CheckInDialog from './components/CheckInDialog.vue'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const activities = ref([])
const organizations = ref([])
const selectedActivities = ref([])
const formVisible = ref(false)
const participantVisible = ref(false)
const checkInVisible = ref(false)
const currentActivity = ref(null)
const dateRange = ref([])
const activityTableRef = ref(null)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: null,
  status: null,
  startDate: '',
  endDate: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 获取活动类型颜色
const getActivityTypeColor = (type) => {
  const colorMap = {
    0: 'primary',  // 学习教育
    1: 'success',  // 组织生活
    2: 'warning',  // 实践活动
    3: 'info',     // 志愿服务
    4: 'danger',   // 文体活动
    5: ''          // 其他
  }
  return colorMap[type] || ''
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

// 加载活动列表
const loadActivities = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page - 1, // 后端从0开始
      size: pagination.size,
      ...searchForm
    }
    
    // 过滤空值
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await getActivityList(params)
    // 确保数据是数组，防止 'data2 is not iterable' 错误
    const responseData = response?.data
    if (responseData && typeof responseData === 'object') {
      activities.value = Array.isArray(responseData.content) ? responseData.content : []
      pagination.total = responseData.totalElements || 0
    } else {
      activities.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('加载活动列表失败:', error)
    ElMessage.error('加载活动列表失败')
    // 确保在错误情况下数据也是数组
    activities.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 加载组织列表
const loadOrganizations = async () => {
  try {
    const response = await getOrganizationList({ size: 1000 })
    organizations.value = response.data.content || []
  } catch (error) {
    console.error('加载组织列表失败:', error)
  }
}

// 处理日期范围变化
const handleDateRangeChange = (dates) => {
  if (dates && dates.length === 2) {
    searchForm.startDate = dates[0]
    searchForm.endDate = dates[1]
  } else {
    searchForm.startDate = ''
    searchForm.endDate = ''
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadActivities()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ['type', 'status'].includes(key) ? null : ''
  })
  dateRange.value = []
  pagination.page = 1
  loadActivities()
}

// 新增活动
const handleAdd = () => {
  currentActivity.value = null
  formVisible.value = true
}

// 编辑活动
const handleEdit = (activity) => {
  currentActivity.value = { ...activity }
  formVisible.value = true
}

// 删除活动
const handleDelete = (activity) => {
  ElMessageBox.confirm(
    `确定要删除活动 "${activity.title}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteActivity(activity.id)
      ElMessage.success('删除成功')
      loadActivities()
    } catch (error) {
      console.error('删除活动失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedActivities.value.length} 个活动吗？`,
    '确认批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const ids = selectedActivities.value.map(activity => activity.id)
      await batchDeleteActivities(ids)
      ElMessage.success('批量删除成功')
      selectedActivities.value = []
      loadActivities()
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  })
}

// 查看参与者
const handleViewParticipants = (activity) => {
  currentActivity.value = activity
  participantVisible.value = true
}

// 报名活动
const handleSignUp = async (activity) => {
  try {
    await joinActivity(activity.id)
    ElMessage.success('报名成功')
    loadActivities()
  } catch (error) {
    console.error('报名失败:', error)
    ElMessage.error('报名失败')
  }
}

// 签到
const handleCheckIn = (activity) => {
  currentActivity.value = activity
  checkInVisible.value = true
}

// 签到成功
const handleCheckInSuccess = () => {
  checkInVisible.value = false
  loadActivities()
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  // 确保selection是数组，防止null引用错误
  if (Array.isArray(selection)) {
    selectedActivities.value = selection
  } else {
    selectedActivities.value = []
  }
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  loadActivities()
}

// 当前页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  loadActivities()
}

// 表单提交成功
const handleFormSuccess = () => {
  formVisible.value = false
  loadActivities()
}

// 组件挂载时加载数据
onMounted(() => {
  loadActivities()
  loadOrganizations()
})
</script>

<style lang="scss" scoped>
.activity-management {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .search-section {
    flex: 1;
  }
  
  .action-section {
    display: flex;
    gap: 8px;
  }
}

.table-card {
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

// 响应式
@media (max-width: $breakpoint-md) {
  .activity-management {
    padding: 16px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 16px;
    
    .search-section {
      width: 100%;
      
      .search-form {
        .el-form-item {
          margin-bottom: 8px;
        }
      }
    }
    
    .action-section {
      width: 100%;
      justify-content: flex-start;
    }
  }
}
</style>