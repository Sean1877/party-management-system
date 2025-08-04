<template>
  <el-dialog
    v-model="visible"
    :title="`${activity?.title || ''} - 参与者列表`"
    width="800px"
    :close-on-click-modal="false"
  >
    <div class="participant-list">
      <!-- 统计信息 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-statistic title="总报名人数" :value="participants.length" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="已签到人数" :value="checkedInCount" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="请假人数" :value="leaveCount" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="签到率" :value="checkInRate" suffix="%" :precision="1" />
          </el-col>
        </el-row>
      </div>
      
      <!-- 操作栏 -->
      <div class="toolbar">
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索参与者姓名或手机号"
            clearable
            style="width: 250px;"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="action-section">
          <el-button type="primary" @click="handleExportParticipants">
            <el-icon><Download /></el-icon>
            导出名单
          </el-button>
          <el-button type="success" @click="handleBatchCheckIn">
            <el-icon><Check /></el-icon>
            批量签到
          </el-button>
        </div>
      </div>
      
      <!-- 参与者表格 -->
      <el-table
        v-loading="loading"
        :data="filteredParticipants"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%"
        max-height="400px"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="user.realName" label="姓名" width="100" />
        
        <el-table-column prop="user.phone" label="手机号" width="120" />
        
        <el-table-column prop="user.organization.name" label="所属组织" width="150" show-overflow-tooltip />
        
        <el-table-column label="报名时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.registrationTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="签到状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.checkInTime" type="success">
              已签到
            </el-tag>
            <el-tag v-else-if="row.leaveTime" type="warning">
              已请假
            </el-tag>
            <el-tag v-else type="info">
              未签到
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="签到时间" width="160">
          <template #default="{ row }">
            {{ row.checkInTime ? formatDate(row.checkInTime) : '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              v-if="!row.checkInTime && !row.leaveTime"
              type="success" 
              size="small" 
              @click="handleCheckIn(row)"
            >
              签到
            </el-button>
            <el-button 
              v-if="!row.checkInTime && !row.leaveTime"
              type="warning" 
              size="small" 
              @click="handleLeave(row)"
            >
              请假
            </el-button>
            <span v-if="row.checkInTime || row.leaveTime" class="text-muted">
              {{ row.checkInTime ? '已签到' : '已请假' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getActivityParticipants, checkInActivity, leaveActivity, batchCheckIn, exportParticipants } from '@/api/activity'
import { formatDate } from '@/utils'
import {
  Search,
  Download,
  Check
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  activity: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const loading = ref(false)
const participants = ref([])
const selectedParticipants = ref([])
const searchKeyword = ref('')

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 过滤后的参与者列表
const filteredParticipants = computed(() => {
  if (!searchKeyword.value) {
    return participants.value
  }
  
  const keyword = searchKeyword.value.toLowerCase()
  return participants.value.filter(participant => {
    const user = participant.user
    return (
      user.realName?.toLowerCase().includes(keyword) ||
      user.phone?.includes(keyword)
    )
  })
})

// 已签到人数
const checkedInCount = computed(() => {
  return participants.value.filter(p => p.checkInTime).length
})

// 请假人数
const leaveCount = computed(() => {
  return participants.value.filter(p => p.leaveTime).length
})

// 签到率
const checkInRate = computed(() => {
  if (participants.value.length === 0) return 0
  return (checkedInCount.value / participants.value.length) * 100
})

// 监听活动变化
watch(
  () => props.activity,
  (newActivity) => {
    if (newActivity && visible.value) {
      loadParticipants()
    }
  },
  { immediate: true }
)

// 监听对话框显示状态
watch(
  visible,
  (newVisible) => {
    if (newVisible && props.activity) {
      loadParticipants()
    }
  }
)

// 加载参与者列表
const loadParticipants = async () => {
  if (!props.activity?.id) return
  
  try {
    loading.value = true
    const response = await getActivityParticipants(props.activity.id)
    participants.value = response.data || []
  } catch (error) {
    console.error('加载参与者列表失败:', error)
    ElMessage.error('加载参与者列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  // 搜索逻辑在计算属性中处理
}

// 签到
const handleCheckIn = async (participant) => {
  try {
    await checkInActivity(props.activity.id, participant.user.id)
    ElMessage.success('签到成功')
    loadParticipants()
  } catch (error) {
    console.error('签到失败:', error)
    ElMessage.error('签到失败')
  }
}

// 请假
const handleLeave = async (participant) => {
  try {
    await leaveActivity(props.activity.id, participant.user.id)
    ElMessage.success('请假成功')
    loadParticipants()
  } catch (error) {
    console.error('请假失败:', error)
    ElMessage.error('请假失败')
  }
}

// 批量签到
const handleBatchCheckIn = () => {
  if (selectedParticipants.value.length === 0) {
    ElMessage.warning('请选择要签到的参与者')
    return
  }
  
  ElMessageBox.confirm(
    `确定要为选中的 ${selectedParticipants.value.length} 个参与者批量签到吗？`,
    '确认批量签到',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const userIds = selectedParticipants.value.map(p => p.user.id)
      await batchCheckIn(props.activity.id, userIds)
      ElMessage.success('批量签到成功')
      selectedParticipants.value = []
      loadParticipants()
    } catch (error) {
      console.error('批量签到失败:', error)
      ElMessage.error('批量签到失败')
    }
  })
}

// 导出参与者名单
const handleExportParticipants = async () => {
  try {
    await exportParticipants(props.activity.id)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  selectedParticipants.value = selection
}
</script>

<style lang="scss" scoped>
.participant-list {
  .stats-section {
    margin-bottom: 20px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .action-section {
      display: flex;
      gap: 8px;
    }
  }
  
  .text-muted {
    color: #909399;
    font-size: 12px;
  }
}

.dialog-footer {
  text-align: right;
}

// 响应式
@media (max-width: $breakpoint-md) {
  .toolbar {
    flex-direction: column;
    gap: 12px;
    
    .search-section,
    .action-section {
      width: 100%;
    }
    
    .action-section {
      justify-content: flex-start;
    }
  }
}
</style>