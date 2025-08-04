<template>
  <el-dialog
    v-model="visible"
    :title="`${activity?.title || ''} - 签到`"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="check-in-dialog">
      <!-- 活动信息 -->
      <div class="activity-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="活动标题">{{ activity?.title }}</el-descriptions-item>
          <el-descriptions-item label="活动地点">{{ activity?.location }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">
            {{ formatDate(activity?.startTime, 'YYYY-MM-DD HH:mm') }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ formatDate(activity?.endTime, 'YYYY-MM-DD HH:mm') }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <!-- 签到方式选择 -->
      <div class="check-in-method">
        <el-radio-group v-model="checkInMethod" @change="handleMethodChange">
          <el-radio-button label="manual">手动签到</el-radio-button>
          <el-radio-button label="qrcode">二维码签到</el-radio-button>
          <el-radio-button label="batch">批量签到</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 手动签到 -->
      <div v-if="checkInMethod === 'manual'" class="manual-check-in">
        <el-form :model="manualForm" :rules="manualRules" ref="manualFormRef" label-width="100px">
          <el-form-item label="选择用户" prop="userId">
            <el-select
              v-model="manualForm.userId"
              placeholder="请选择要签到的用户"
              filterable
              remote
              :remote-method="searchUsers"
              :loading="searchLoading"
              style="width: 100%"
            >
              <el-option
                v-for="user in searchResults"
                :key="user.id"
                :label="`${user.realName} (${user.phone})`"
                :value="user.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="签到备注" prop="remark">
            <el-input
              v-model="manualForm.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入签到备注（可选）"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="handleManualCheckIn">
              确认签到
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 二维码签到 -->
      <div v-if="checkInMethod === 'qrcode'" class="qrcode-check-in">
        <div class="qrcode-container">
          <div class="qrcode-wrapper">
            <canvas ref="qrcodeCanvas" class="qrcode"></canvas>
          </div>
          <div class="qrcode-info">
            <p>请使用手机扫描二维码进行签到</p>
            <p class="text-muted">二维码每30秒自动刷新</p>
            <el-button @click="generateQRCode">刷新二维码</el-button>
          </div>
        </div>
        
        <!-- 实时签到记录 -->
        <div class="real-time-records">
          <h4>实时签到记录</h4>
          <div class="records-list">
            <div 
              v-for="record in realtimeRecords" 
              :key="record.id"
              class="record-item"
            >
              <el-avatar :size="32" :src="record.user.avatarUrl" :icon="UserFilled" />
              <div class="record-info">
                <div class="user-name">{{ record.user.realName }}</div>
                <div class="check-in-time">{{ formatDate(record.checkInTime, 'HH:mm:ss') }}</div>
              </div>
              <el-tag type="success" size="small">已签到</el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 批量签到 -->
      <div v-if="checkInMethod === 'batch'" class="batch-check-in">
        <el-form :model="batchForm" label-width="100px">
          <el-form-item label="选择用户">
            <el-transfer
              v-model="batchForm.userIds"
              :data="transferData"
              :titles="['未签到用户', '待签到用户']"
              :button-texts="['移除', '添加']"
              filterable
              filter-placeholder="搜索用户"
            />
          </el-form-item>
          
          <el-form-item label="批量备注">
            <el-input
              v-model="batchForm.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入批量签到备注（可选）"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              :loading="submitting" 
              :disabled="batchForm.userIds.length === 0"
              @click="handleBatchCheckIn"
            >
              批量签到 ({{ batchForm.userIds.length }})
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { checkInActivity, batchCheckIn, getActivityParticipants } from '@/api/activity'
import { searchUsers as searchUsersAPI } from '@/api/user'
import { formatDate } from '@/utils'
import QRCode from 'qrcode'
import { UserFilled } from '@element-plus/icons-vue'

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
const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const submitting = ref(false)
const searchLoading = ref(false)
const checkInMethod = ref('manual')
const searchResults = ref([])
const participants = ref([])
const realtimeRecords = ref([])
const qrcodeCanvas = ref()
const manualFormRef = ref()
const qrcodeTimer = ref(null)
const recordsTimer = ref(null)

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 手动签到表单
const manualForm = reactive({
  userId: null,
  remark: ''
})

// 批量签到表单
const batchForm = reactive({
  userIds: [],
  remark: ''
})

// 手动签到验证规则
const manualRules = {
  userId: [
    { required: true, message: '请选择要签到的用户', trigger: 'change' }
  ]
}

// 穿梭框数据
const transferData = computed(() => {
  return participants.value
    .filter(p => !p.checkInTime && !p.leaveTime)
    .map(p => ({
      key: p.user.id,
      label: `${p.user.realName} (${p.user.phone})`,
      disabled: false
    }))
})

// 监听对话框显示状态
watch(
  visible,
  (newVisible) => {
    if (newVisible && props.activity) {
      loadParticipants()
      if (checkInMethod.value === 'qrcode') {
        generateQRCode()
        startQRCodeTimer()
        startRecordsTimer()
      }
    } else {
      stopTimers()
    }
  }
)

// 加载参与者列表
const loadParticipants = async () => {
  if (!props.activity?.id) return
  
  try {
    const response = await getActivityParticipants(props.activity.id)
    participants.value = response.data || []
  } catch (error) {
    console.error('加载参与者列表失败:', error)
  }
}

// 搜索用户
const searchUsers = async (query) => {
  if (!query) {
    searchResults.value = []
    return
  }
  
  try {
    searchLoading.value = true
    const response = await searchUsersAPI({ keyword: query, size: 20 })
    searchResults.value = response.data.content || []
  } catch (error) {
    console.error('搜索用户失败:', error)
  } finally {
    searchLoading.value = false
  }
}

// 处理签到方式变化
const handleMethodChange = (method) => {
  stopTimers()
  
  if (method === 'qrcode') {
    generateQRCode()
    startQRCodeTimer()
    startRecordsTimer()
  }
}

// 手动签到
const handleManualCheckIn = async () => {
  try {
    const valid = await manualFormRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    await checkInActivity(props.activity.id, manualForm.userId, {
      remark: manualForm.remark
    })
    
    ElMessage.success('签到成功')
    
    // 重置表单
    manualForm.userId = null
    manualForm.remark = ''
    manualFormRef.value.clearValidate()
    
    emit('success')
  } catch (error) {
    console.error('签到失败:', error)
    ElMessage.error('签到失败')
  } finally {
    submitting.value = false
  }
}

// 批量签到
const handleBatchCheckIn = async () => {
  try {
    submitting.value = true
    
    await batchCheckIn(props.activity.id, batchForm.userIds)
    
    ElMessage.success(`批量签到成功，共 ${batchForm.userIds.length} 人`)
    
    // 重置表单
    batchForm.userIds = []
    batchForm.remark = ''
    
    // 重新加载参与者列表
    loadParticipants()
    
    emit('success')
  } catch (error) {
    console.error('批量签到失败:', error)
    ElMessage.error('批量签到失败')
  } finally {
    submitting.value = false
  }
}

// 生成二维码
const generateQRCode = async () => {
  if (!qrcodeCanvas.value || !props.activity?.id) return
  
  try {
    const qrData = {
      type: 'activity_checkin',
      activityId: props.activity.id,
      timestamp: Date.now()
    }
    
    const qrString = JSON.stringify(qrData)
    
    await QRCode.toCanvas(qrcodeCanvas.value, qrString, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('生成二维码失败:', error)
  }
}

// 启动二维码定时器
const startQRCodeTimer = () => {
  qrcodeTimer.value = setInterval(() => {
    generateQRCode()
  }, 30000) // 30秒刷新一次
}

// 启动实时记录定时器
const startRecordsTimer = () => {
  recordsTimer.value = setInterval(() => {
    loadRealtimeRecords()
  }, 5000) // 5秒刷新一次
}

// 加载实时签到记录
const loadRealtimeRecords = async () => {
  if (!props.activity?.id) return
  
  try {
    const response = await getActivityParticipants(props.activity.id)
    const checkedInParticipants = (response.data || [])
      .filter(p => p.checkInTime)
      .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
      .slice(0, 5) // 只显示最近5条
    
    realtimeRecords.value = checkedInParticipants
  } catch (error) {
    console.error('加载实时记录失败:', error)
  }
}

// 停止定时器
const stopTimers = () => {
  if (qrcodeTimer.value) {
    clearInterval(qrcodeTimer.value)
    qrcodeTimer.value = null
  }
  
  if (recordsTimer.value) {
    clearInterval(recordsTimer.value)
    recordsTimer.value = null
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  stopTimers()
  
  // 重置表单
  manualForm.userId = null
  manualForm.remark = ''
  batchForm.userIds = []
  batchForm.remark = ''
  realtimeRecords.value = []
}

// 组件卸载时清理定时器
onUnmounted(() => {
  stopTimers()
})
</script>

<style lang="scss" scoped>
.check-in-dialog {
  .activity-info {
    margin-bottom: 20px;
  }
  
  .check-in-method {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .qrcode-check-in {
    .qrcode-container {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      
      .qrcode-wrapper {
        flex-shrink: 0;
        
        .qrcode {
          border: 1px solid #dcdfe6;
          border-radius: 8px;
        }
      }
      
      .qrcode-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        
        p {
          margin: 0 0 8px 0;
          
          &.text-muted {
            color: #909399;
            font-size: 12px;
          }
        }
      }
    }
    
    .real-time-records {
      h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #303133;
      }
      
      .records-list {
        max-height: 200px;
        overflow-y: auto;
        
        .record-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .record-info {
            flex: 1;
            
            .user-name {
              font-size: 14px;
              color: #303133;
            }
            
            .check-in-time {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }
  
  .batch-check-in {
    :deep(.el-transfer) {
      .el-transfer-panel {
        width: 200px;
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}

// 响应式
@media (max-width: $breakpoint-md) {
  .qrcode-check-in {
    .qrcode-container {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }
}
</style>