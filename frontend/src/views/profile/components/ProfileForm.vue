<template>
  <el-dialog
    v-model="visible"
    title="编辑个人资料"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      @submit.prevent
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="form.realName" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="请选择出生日期"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="民族" prop="nation">
            <el-input v-model="form.nation" placeholder="请输入民族" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="政治面貌" prop="politicalStatus">
            <el-select v-model="form.politicalStatus" placeholder="请选择政治面貌">
              <el-option label="群众" value="群众" />
              <el-option label="共青团员" value="共青团员" />
              <el-option label="中共党员" value="中共党员" />
              <el-option label="中共预备党员" value="中共预备党员" />
              <el-option label="民主党派" value="民主党派" />
              <el-option label="无党派人士" value="无党派人士" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学历" prop="education">
            <el-select v-model="form.education" placeholder="请选择学历">
              <el-option label="小学" value="小学" />
              <el-option label="初中" value="初中" />
              <el-option label="高中" value="高中" />
              <el-option label="中专" value="中专" />
              <el-option label="大专" value="大专" />
              <el-option label="本科" value="本科" />
              <el-option label="硕士" value="硕士" />
              <el-option label="博士" value="博士" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业" prop="profession">
            <el-input v-model="form.profession" placeholder="请输入职业" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="form.address"
          type="textarea"
          :rows="2"
          placeholder="请输入详细地址"
        />
      </el-form-item>
      
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { updateUser } from '@/api/user'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
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
  realName: '',
  phone: '',
  email: '',
  gender: null,
  birthday: '',
  idCard: '',
  nation: '',
  politicalStatus: '',
  education: '',
  profession: '',
  address: '',
  remark: ''
})

// 表单验证规则
const rules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  idCard: [
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确的身份证号',
      trigger: 'blur'
    }
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
        initForm()
      })
    }
  },
  { immediate: true }
)

// 监听visible变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 初始化表单
const initForm = () => {
  if (props.user) {
    Object.keys(form).forEach(key => {
      if (props.user[key] !== undefined) {
        form[key] = props.user[key]
      }
    })
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
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
    
    // 准备提交数据
    const submitData = { ...form }
    
    await updateUser(props.user.id, submitData)
    
    ElMessage.success('个人资料更新成功')
    emit('success')
  } catch (error) {
    console.error('更新个人资料失败:', error)
    ElMessage.error(error.message || '更新个人资料失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-select) {
  width: 100%;
}
</style>