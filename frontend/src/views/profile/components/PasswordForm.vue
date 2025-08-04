<template>
  <el-dialog
    v-model="visible"
    title="修改密码"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入当前密码"
          show-password
          autocomplete="current-password"
        />
      </el-form-item>
      
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="请输入新密码"
          show-password
          autocomplete="new-password"
        />
        <div class="password-tips">
          <p>密码要求：</p>
          <ul>
            <li :class="{ valid: passwordChecks.length }">长度8-20位</li>
            <li :class="{ valid: passwordChecks.uppercase }">包含大写字母</li>
            <li :class="{ valid: passwordChecks.lowercase }">包含小写字母</li>
            <li :class="{ valid: passwordChecks.number }">包含数字</li>
            <li :class="{ valid: passwordChecks.special }">包含特殊字符</li>
          </ul>
        </div>
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确认修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { changePassword } from '@/api/user'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const formRef = ref()
const loading = ref(false)
const visible = ref(false)

// 表单数据
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码强度检查
const passwordChecks = computed(() => {
  const password = form.newPassword
  return {
    length: password.length >= 8 && password.length <= 20,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
})

// 密码强度等级
const passwordStrength = computed(() => {
  const checks = passwordChecks.value
  const validCount = Object.values(checks).filter(Boolean).length
  
  if (validCount < 3) return 'weak'
  if (validCount < 5) return 'medium'
  return 'strong'
})

// 自定义密码验证
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入新密码'))
    return
  }
  
  const checks = passwordChecks.value
  const validCount = Object.values(checks).filter(Boolean).length
  
  if (validCount < 3) {
    callback(new Error('密码强度不够，请至少满足3项要求'))
    return
  }
  
  if (value === form.oldPassword) {
    callback(new Error('新密码不能与当前密码相同'))
    return
  }
  
  callback()
}

// 确认密码验证
const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请确认新密码'))
    return
  }
  
  if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
    return
  }
  
  callback()
}

// 表单验证规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val) {
      nextTick(() => {
        resetForm()
      })
    }
  },
  { immediate: true }
)

// 监听visible变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 重置表单
const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    await changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    })
    
    ElMessage.success('密码修改成功，请重新登录')
    emit('success')
    handleClose()
    
    // 可以在这里触发退出登录
    // await userStore.logout()
    // router.push('/login')
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error(error.message || '修改密码失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}

.password-tips {
  margin-top: 8px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  
  p {
    margin: 0 0 8px 0;
    font-weight: 500;
    color: #606266;
  }
  
  ul {
    margin: 0;
    padding-left: 16px;
    
    li {
      margin-bottom: 4px;
      color: #909399;
      transition: color 0.3s;
      
      &.valid {
        color: #67c23a;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

// 密码强度指示器
.password-strength {
  margin-top: 8px;
  
  .strength-label {
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .strength-bar {
    height: 4px;
    background-color: #e4e7ed;
    border-radius: 2px;
    overflow: hidden;
    
    .strength-fill {
      height: 100%;
      transition: all 0.3s;
      
      &.weak {
        width: 33%;
        background-color: #f56c6c;
      }
      
      &.medium {
        width: 66%;
        background-color: #e6a23c;
      }
      
      &.strong {
        width: 100%;
        background-color: #67c23a;
      }
    }
  }
}
</style>