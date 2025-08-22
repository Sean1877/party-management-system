<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑组织' : '新增组织'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="organization-form"
    >
      <el-form-item label="组织名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入组织名称"
        />
      </el-form-item>
      
      <el-form-item label="组织编码" prop="code">
        <el-input
          v-model="form.code"
          placeholder="请输入组织编码"
        />
      </el-form-item>
      
      <el-form-item label="组织类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择组织类型" style="width: 100%">
          <el-option label="党委" :value="0" />
          <el-option label="党总支" :value="1" />
          <el-option label="党支部" :value="2" />
          <el-option label="党小组" :value="3" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="上级组织" prop="parentId">
        <el-select 
          v-model="form.parentId" 
          placeholder="请选择上级组织" 
          style="width: 100%"
          clearable
          :disabled="!!parentOrganization"
        >
          <el-option
            v-for="org in availableParents"
            :key="org.id"
            :label="org.displayName || org.name"
            :value="org.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="form.sort"
          :min="0"
          :max="9999"
          placeholder="请输入排序"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入联系电话"
        />
      </el-form-item>
      
      <el-form-item label="联系邮箱" prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入联系邮箱"
        />
      </el-form-item>
      
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="form.address"
          placeholder="请输入地址"
        />
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入组织描述"
        />
      </el-form-item>
      
      <el-form-item label="状态" prop="active">
        <el-switch
          v-model="form.active"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>
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
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { createOrganization, updateOrganization, checkOrganizationCodeExists } from '@/api/organization'
import { validatePhone, validateEmail } from '@/utils'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  organization: {
    type: Object,
    default: null
  },
  parentOrganization: {
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

const isEdit = computed(() => !!props.organization?.id)

// 可选择的上级组织（排除自己和自己的子组织）
const availableParents = computed(() => {
  // 确保props.organizations是数组，防止 'data2 is not iterable' 错误
  const organizationsData = Array.isArray(props.organizations) ? props.organizations : []
  
  if (!isEdit.value) {
    return organizationsData
  }
  
  // 编辑模式下，排除自己和自己的子组织
  const excludeIds = new Set([props.organization.id])
  
  // 递归获取所有子组织ID
  const getChildrenIds = (org) => {
    if (org.children && Array.isArray(org.children)) {
      org.children.forEach(child => {
        excludeIds.add(child.id)
        getChildrenIds(child)
      })
    }
  }
  
  getChildrenIds(props.organization)
  
  return organizationsData.filter(org => !excludeIds.has(org.id))
})

// 表单数据
const form = reactive({
  name: '',
  code: '',
  type: null,
  parentId: null,
  sort: 0,
  phone: '',
  email: '',
  address: '',
  description: '',
  active: true
})

// 验证组织编码是否存在
const validateCode = async (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  
  try {
    // 编辑模式下，如果编码没有变化，则不需要验证
    if (isEdit.value && value === props.organization.code) {
      callback()
      return
    }
    
    const response = await checkOrganizationCodeExists(value)
    if (response.data) {
      callback(new Error('组织编码已存在'))
    } else {
      callback()
    }
  } catch (error) {
    console.error('验证组织编码失败:', error)
    callback()
  }
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入组织名称', trigger: 'blur' },
    { min: 2, max: 50, message: '组织名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入组织编码', trigger: 'blur' },
    { min: 2, max: 20, message: '组织编码长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '组织编码只能包含字母、数字、下划线和横线', trigger: 'blur' },
    { validator: validateCode, trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择组织类型', trigger: 'change' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ]
}

// 重置表单
const resetForm = () => {
  // 重置表单数据
  Object.assign(form, {
    name: '',
    code: '',
    type: null,
    parentId: null,
    sort: 0,
    phone: '',
    email: '',
    address: '',
    description: '',
    active: true
  })
  
  // 清除表单验证
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 监听组织数据变化
watch(
  () => props.organization,
  (newOrganization) => {
    if (newOrganization) {
      // 编辑模式，填充表单数据
      Object.keys(form).forEach(key => {
        if (key in newOrganization) {
          form[key] = newOrganization[key]
        }
      })
      // 特殊处理
      form.parentId = newOrganization.parent?.id || null
    } else {
      // 新增模式，重置表单
      resetForm()
    }
  },
  { immediate: true }
)

// 监听父组织变化
watch(
  () => props.parentOrganization,
  (newParent) => {
    if (newParent && !isEdit.value) {
      form.parentId = newParent.id
      // 根据父组织类型自动设置子组织类型
      if (newParent.type < 3) {
        form.type = newParent.type + 1
      }
    }
  },
  { immediate: true }
)



// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    const formData = { ...form }
    
    if (isEdit.value) {
      await updateOrganization(props.organization.id, formData)
      ElMessage.success('更新组织成功')
    } else {
      await createOrganization(formData)
      ElMessage.success('创建组织成功')
    }
    
    emit('success')
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error(isEdit.value ? '更新组织失败' : '创建组织失败')
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
.organization-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>