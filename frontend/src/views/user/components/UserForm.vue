<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="user-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              :disabled="isEdit"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input
              v-model="form.realName"
              placeholder="请输入真实姓名"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" v-if="!isEdit">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认密码"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        
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
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="form.idCard"
              placeholder="请输入身份证号"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="民族" prop="nation">
            <el-input
              v-model="form.nation"
              placeholder="请输入民族"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="政治面貌" prop="politicalStatus">
            <el-select v-model="form.politicalStatus" placeholder="请选择政治面貌" style="width: 100%">
              <el-option label="群众" value="群众" />
              <el-option label="共青团员" value="共青团员" />
              <el-option label="入党积极分子" value="入党积极分子" />
              <el-option label="发展对象" value="发展对象" />
              <el-option label="预备党员" value="预备党员" />
              <el-option label="中共党员" value="中共党员" />
              <el-option label="民主党派" value="民主党派" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="党员状态" prop="partyMemberStatus">
            <el-select v-model="form.partyMemberStatus" placeholder="请选择党员状态" style="width: 100%">
              <el-option label="入党积极分子" :value="0" />
              <el-option label="发展对象" :value="1" />
              <el-option label="预备党员" :value="2" />
              <el-option label="正式党员" :value="3" />
              <el-option label="转出" :value="4" />
              <el-option label="退党" :value="5" />
              <el-option label="开除党籍" :value="6" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="入党时间" prop="joinPartyDate">
            <el-date-picker
              v-model="form.joinPartyDate"
              type="date"
              placeholder="请选择入党时间"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="转正时间" prop="formalDate">
            <el-date-picker
              v-model="form.formalDate"
              type="date"
              placeholder="请选择转正时间"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属组织" prop="organizationId">
            <el-select v-model="form.organizationId" placeholder="请选择组织" style="width: 100%">
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
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择角色" style="width: 100%">
              <el-option
                v-for="role in roles"
                :key="role.id"
                :label="role.name"
                :value="role.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学历" prop="education">
            <el-select v-model="form.education" placeholder="请选择学历" style="width: 100%">
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
            <el-input
              v-model="form.profession"
              placeholder="请输入职业"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入地址"
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
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="active">
            <el-switch
              v-model="form.active"
              active-text="启用"
              inactive-text="停用"
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
import { createUser, updateUser } from '@/api/user'
import { validatePhone, validateEmail, validateIdCard } from '@/utils'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  organizations: {
    type: Array,
    default: () => []
  },
  roles: {
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

const isEdit = computed(() => !!props.user?.id)

// 表单数据
const form = reactive({
  username: '',
  realName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: null,
  birthday: '',
  idCard: '',
  nation: '',
  politicalStatus: '',
  partyMemberStatus: null,
  joinPartyDate: '',
  formalDate: '',
  organizationId: null,
  roleId: null,
  education: '',
  profession: '',
  address: '',
  remark: '',
  active: true
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  idCard: [
    { validator: validateIdCard, trigger: 'blur' }
  ],
  organizationId: [
    { required: true, message: '请选择组织', trigger: 'change' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 监听用户数据变化
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      // 编辑模式，填充表单数据
      Object.keys(form).forEach(key => {
        if (key in newUser) {
          form[key] = newUser[key]
        }
      })
      // 特殊处理
      form.organizationId = newUser.organization?.id || null
      form.roleId = newUser.role?.id || null
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
    if (key === 'active') {
      form[key] = true
    } else if (['gender', 'partyMemberStatus', 'organizationId', 'roleId'].includes(key)) {
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
    
    // 移除确认密码字段
    delete formData.confirmPassword
    
    // 如果是编辑模式且没有输入密码，则移除密码字段
    if (isEdit.value && !formData.password) {
      delete formData.password
    }
    
    if (isEdit.value) {
      await updateUser(props.user.id, formData)
      ElMessage.success('更新用户成功')
    } else {
      await createUser(formData)
      ElMessage.success('创建用户成功')
    }
    
    emit('success')
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error(isEdit.value ? '更新用户失败' : '创建用户失败')
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
.user-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>