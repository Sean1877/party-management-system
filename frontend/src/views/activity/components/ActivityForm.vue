<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑活动' : '新增活动'"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="activity-form"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="活动标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入活动标题"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="活动类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择活动类型" style="width: 100%">
              <el-option label="学习教育" :value="0" />
              <el-option label="组织生活" :value="1" />
              <el-option label="实践活动" :value="2" />
              <el-option label="志愿服务" :value="3" />
              <el-option label="文体活动" :value="4" />
              <el-option label="其他" :value="5" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="活动状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择活动状态" style="width: 100%">
              <el-option label="未开始" :value="0" />
              <el-option label="报名中" :value="1" />
              <el-option label="进行中" :value="2" />
              <el-option label="已结束" :value="3" />
              <el-option label="已取消" :value="4" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="主办组织" prop="organizationId">
            <el-select v-model="form.organizationId" placeholder="请选择主办组织" style="width: 100%">
              <el-option
                v-for="org in organizations"
                :key="org.id"
                :label="org.name"
                :value="org.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="活动地点" prop="location">
            <el-input
              v-model="form.location"
              placeholder="请输入活动地点"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="请选择开始时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="请选择结束时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="报名开始" prop="registrationStartTime">
            <el-date-picker
              v-model="form.registrationStartTime"
              type="datetime"
              placeholder="请选择报名开始时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="报名截止" prop="registrationEndTime">
            <el-date-picker
              v-model="form.registrationEndTime"
              type="datetime"
              placeholder="请选择报名截止时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="最大参与人数" prop="maxParticipants">
            <el-input-number
              v-model="form.maxParticipants"
              :min="1"
              :max="9999"
              placeholder="请输入最大参与人数"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="form.contactPhone"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="活动描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入活动描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="活动要求" prop="requirements">
            <el-input
              v-model="form.requirements"
              type="textarea"
              :rows="3"
              placeholder="请输入活动要求"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否需要报名">
            <el-switch
              v-model="form.requireRegistration"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="是否需要签到">
            <el-switch
              v-model="form.requireCheckIn"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createActivity, updateActivity } from '@/api/activity'
import { validatePhone } from '@/utils'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  activity: {
    type: Object,
    default: null
  },
  organizations: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const formRef = ref()
const submitting = ref(false)

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.activity?.id)

// 表单数据
const form = reactive({
  title: '',
  type: null,
  status: 0,
  organizationId: null,
  location: '',
  startTime: '',
  endTime: '',
  registrationStartTime: '',
  registrationEndTime: '',
  maxParticipants: null,
  contactPhone: '',
  description: '',
  requirements: '',
  remark: '',
  requireRegistration: true,
  requireCheckIn: true
})

// 验证结束时间
const validateEndTime = (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  
  if (form.startTime && new Date(value) <= new Date(form.startTime)) {
    callback(new Error('结束时间必须晚于开始时间'))
  } else {
    callback()
  }
}

// 验证报名截止时间
const validateRegistrationEndTime = (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  
  if (form.registrationStartTime && new Date(value) <= new Date(form.registrationStartTime)) {
    callback(new Error('报名截止时间必须晚于报名开始时间'))
  } else if (form.startTime && new Date(value) > new Date(form.startTime)) {
    callback(new Error('报名截止时间不能晚于活动开始时间'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入活动标题', trigger: 'blur' },
    { min: 2, max: 100, message: '活动标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择活动状态', trigger: 'change' }
  ],
  organizationId: [
    { required: true, message: '请选择主办组织', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入活动地点', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    { validator: validateEndTime, trigger: 'change' }
  ],
  registrationEndTime: [
    { validator: validateRegistrationEndTime, trigger: 'change' }
  ],
  contactPhone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' }
  ]
}

// 监听活动数据变化
watch(
  () => props.activity,
  (newActivity) => {
    if (newActivity) {
      // 编辑模式，填充表单数据
      Object.keys(form).forEach(key => {
        if (key in newActivity) {
          form[key] = newActivity[key]
        }
      })
      // 特殊处理
      form.organizationId = newActivity.organization?.id || null
    } else {
      // 新增模式，重置表单
      resetForm()
    }
  },
  { immediate: true }
)

// 重置表单
const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (key === 'status') {
      form[key] = 0
    } else if (['requireRegistration', 'requireCheckIn'].includes(key)) {
      form[key] = true
    } else if (['type', 'organizationId', 'maxParticipants'].includes(key)) {
      form[key] = null
    } else {
      form[key] = ''
    }
  })
  formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    const formData = { ...form }
    
    if (isEdit.value) {
      await updateActivity(props.activity.id, formData)
      ElMessage.success('更新活动成功')
    } else {
      await createActivity(formData)
      ElMessage.success('创建活动成功')
    }
    
    emit('success')
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error(isEdit.value ? '更新活动失败' : '创建活动失败')
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  resetForm()
}
</script>

<style lang="scss" scoped>
.activity-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>