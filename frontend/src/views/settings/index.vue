<template>
  <div class="settings-page">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <h3>系统设置</h3>
          <p>管理系统的基本配置和参数</p>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="120px"
            class="settings-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="系统名称" prop="systemName">
                  <el-input v-model="basicForm.systemName" placeholder="请输入系统名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统版本" prop="systemVersion">
                  <el-input v-model="basicForm.systemVersion" placeholder="请输入系统版本" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model="basicForm.contactPhone" placeholder="请输入联系电话" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系邮箱" prop="contactEmail">
                  <el-input v-model="basicForm.contactEmail" placeholder="请输入联系邮箱" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="系统描述" prop="systemDescription">
              <el-input
                v-model="basicForm.systemDescription"
                type="textarea"
                :rows="4"
                placeholder="请输入系统描述"
              />
            </el-form-item>
            
            <el-form-item label="系统Logo" prop="systemLogo">
              <el-upload
                class="logo-uploader"
                :action="uploadAction"
                :headers="uploadHeaders"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
                :on-success="handleLogoSuccess"
              >
                <img v-if="basicForm.systemLogo" :src="basicForm.systemLogo" class="logo-preview" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-tips">建议尺寸：200x60px，支持 PNG、JPG 格式</div>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" :loading="basicLoading" @click="saveBasicSettings">
                保存基本设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form
            ref="securityFormRef"
            :model="securityForm"
            :rules="securityRules"
            label-width="120px"
            class="settings-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="密码最小长度" prop="passwordMinLength">
                  <el-input-number
                    v-model="securityForm.passwordMinLength"
                    :min="6"
                    :max="20"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录失败次数" prop="maxLoginAttempts">
                  <el-input-number
                    v-model="securityForm.maxLoginAttempts"
                    :min="3"
                    :max="10"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="账户锁定时间" prop="lockoutDuration">
                  <el-select v-model="securityForm.lockoutDuration" style="width: 100%">
                    <el-option label="15分钟" :value="15" />
                    <el-option label="30分钟" :value="30" />
                    <el-option label="1小时" :value="60" />
                    <el-option label="2小时" :value="120" />
                    <el-option label="24小时" :value="1440" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="会话超时时间" prop="sessionTimeout">
                  <el-select v-model="securityForm.sessionTimeout" style="width: 100%">
                    <el-option label="30分钟" :value="30" />
                    <el-option label="1小时" :value="60" />
                    <el-option label="2小时" :value="120" />
                    <el-option label="4小时" :value="240" />
                    <el-option label="8小时" :value="480" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="密码复杂度" prop="passwordComplexity">
              <el-checkbox-group v-model="securityForm.passwordComplexity">
                <el-checkbox label="uppercase">包含大写字母</el-checkbox>
                <el-checkbox label="lowercase">包含小写字母</el-checkbox>
                <el-checkbox label="number">包含数字</el-checkbox>
                <el-checkbox label="special">包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item label="强制定期修改密码">
              <el-switch
                v-model="securityForm.forcePasswordChange"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            
            <el-form-item v-if="securityForm.forcePasswordChange" label="密码有效期" prop="passwordExpireDays">
              <el-input-number
                v-model="securityForm.passwordExpireDays"
                :min="30"
                :max="365"
                style="width: 100%"
              />
              <span class="form-tips">天</span>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" :loading="securityLoading" @click="saveSecuritySettings">
                保存安全设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 邮件设置 -->
        <el-tab-pane label="邮件设置" name="email">
          <el-form
            ref="emailFormRef"
            :model="emailForm"
            :rules="emailRules"
            label-width="120px"
            class="settings-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="SMTP服务器" prop="smtpHost">
                  <el-input v-model="emailForm.smtpHost" placeholder="请输入SMTP服务器地址" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="SMTP端口" prop="smtpPort">
                  <el-input-number
                    v-model="emailForm.smtpPort"
                    :min="1"
                    :max="65535"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发件人邮箱" prop="senderEmail">
                  <el-input v-model="emailForm.senderEmail" placeholder="请输入发件人邮箱" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发件人名称" prop="senderName">
                  <el-input v-model="emailForm.senderName" placeholder="请输入发件人名称" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="邮箱用户名" prop="username">
                  <el-input v-model="emailForm.username" placeholder="请输入邮箱用户名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱密码" prop="password">
                  <el-input
                    v-model="emailForm.password"
                    type="password"
                    placeholder="请输入邮箱密码或授权码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="启用SSL">
              <el-switch
                v-model="emailForm.enableSsl"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" :loading="emailLoading" @click="saveEmailSettings">
                保存邮件设置
              </el-button>
              <el-button @click="testEmailConnection">
                测试连接
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 系统信息 -->
        <el-tab-pane label="系统信息" name="info">
          <div class="system-info">
            <el-descriptions title="系统运行信息" :column="2" border>
              <el-descriptions-item label="系统版本">{{ systemInfo.version }}</el-descriptions-item>
              <el-descriptions-item label="运行时间">{{ systemInfo.uptime }}</el-descriptions-item>
              <el-descriptions-item label="Java版本">{{ systemInfo.javaVersion }}</el-descriptions-item>
              <el-descriptions-item label="操作系统">{{ systemInfo.osName }}</el-descriptions-item>
              <el-descriptions-item label="CPU使用率">{{ systemInfo.cpuUsage }}%</el-descriptions-item>
              <el-descriptions-item label="内存使用率">{{ systemInfo.memoryUsage }}%</el-descriptions-item>
              <el-descriptions-item label="磁盘使用率">{{ systemInfo.diskUsage }}%</el-descriptions-item>
              <el-descriptions-item label="数据库连接">{{ systemInfo.dbStatus }}</el-descriptions-item>
            </el-descriptions>
            
            <div class="info-actions">
              <el-button type="primary" @click="refreshSystemInfo">
                <el-icon><Refresh /></el-icon>
                刷新信息
              </el-button>
              <el-button @click="downloadLogs">
                <el-icon><Download /></el-icon>
                下载日志
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getSystemSettings,
  updateSystemSettings,
  getSystemInfo,
  testEmailConfig
} from '@/api/system'
import { getToken } from '@/utils/auth'
import {
  Plus,
  Refresh,
  Download
} from '@element-plus/icons-vue'

// 响应式数据
const activeTab = ref('basic')
const basicFormRef = ref()
const securityFormRef = ref()
const emailFormRef = ref()
const basicLoading = ref(false)
const securityLoading = ref(false)
const emailLoading = ref(false)

// 基本设置表单
const basicForm = reactive({
  systemName: '',
  systemVersion: '',
  contactPhone: '',
  contactEmail: '',
  systemDescription: '',
  systemLogo: ''
})

// 安全设置表单
const securityForm = reactive({
  passwordMinLength: 8,
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  sessionTimeout: 120,
  passwordComplexity: ['lowercase', 'number'],
  forcePasswordChange: false,
  passwordExpireDays: 90
})

// 邮件设置表单
const emailForm = reactive({
  smtpHost: '',
  smtpPort: 587,
  senderEmail: '',
  senderName: '',
  username: '',
  password: '',
  enableSsl: true
})

// 系统信息
const systemInfo = reactive({
  version: '',
  uptime: '',
  javaVersion: '',
  osName: '',
  cpuUsage: 0,
  memoryUsage: 0,
  diskUsage: 0,
  dbStatus: ''
})

// 上传配置
const uploadAction = computed(() => `${import.meta.env.VITE_API_BASE_URL}/api/upload/logo`)
const uploadHeaders = computed(() => ({
  'Authorization': `Bearer ${getToken()}`
}))

// 表单验证规则
const basicRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  systemVersion: [
    { required: true, message: '请输入系统版本', trigger: 'blur' }
  ],
  contactEmail: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const securityRules = {
  passwordMinLength: [
    { required: true, message: '请设置密码最小长度', trigger: 'blur' }
  ],
  maxLoginAttempts: [
    { required: true, message: '请设置登录失败次数', trigger: 'blur' }
  ]
}

const emailRules = {
  smtpHost: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  senderEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入邮箱用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入邮箱密码', trigger: 'blur' }
  ]
}

// 加载系统设置
const loadSystemSettings = async () => {
  try {
    const response = await getSystemSettings()
    const settings = response.data
    
    // 填充基本设置
    Object.assign(basicForm, settings.basic || {})
    
    // 填充安全设置
    Object.assign(securityForm, settings.security || {})
    
    // 填充邮件设置
    Object.assign(emailForm, settings.email || {})
  } catch (error) {
    console.error('加载系统设置失败:', error)
  }
}

// 加载系统信息
const loadSystemInfo = async () => {
  try {
    const response = await getSystemInfo()
    Object.assign(systemInfo, response.data)
  } catch (error) {
    console.error('加载系统信息失败:', error)
  }
}

// Logo上传前验证
const beforeLogoUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  
  return true
}

// Logo上传成功
const handleLogoSuccess = (response) => {
  if (response.code === 200) {
    basicForm.systemLogo = response.data.url
    ElMessage.success('Logo上传成功')
  } else {
    ElMessage.error(response.message || 'Logo上传失败')
  }
}

// 保存基本设置
const saveBasicSettings = async () => {
  try {
    const valid = await basicFormRef.value.validate()
    if (!valid) return
    
    basicLoading.value = true
    
    await updateSystemSettings({
      type: 'basic',
      settings: basicForm
    })
    
    ElMessage.success('基本设置保存成功')
  } catch (error) {
    console.error('保存基本设置失败:', error)
    ElMessage.error(error.message || '保存基本设置失败')
  } finally {
    basicLoading.value = false
  }
}

// 保存安全设置
const saveSecuritySettings = async () => {
  try {
    const valid = await securityFormRef.value.validate()
    if (!valid) return
    
    securityLoading.value = true
    
    await updateSystemSettings({
      type: 'security',
      settings: securityForm
    })
    
    ElMessage.success('安全设置保存成功')
  } catch (error) {
    console.error('保存安全设置失败:', error)
    ElMessage.error(error.message || '保存安全设置失败')
  } finally {
    securityLoading.value = false
  }
}

// 保存邮件设置
const saveEmailSettings = async () => {
  try {
    const valid = await emailFormRef.value.validate()
    if (!valid) return
    
    emailLoading.value = true
    
    await updateSystemSettings({
      type: 'email',
      settings: emailForm
    })
    
    ElMessage.success('邮件设置保存成功')
  } catch (error) {
    console.error('保存邮件设置失败:', error)
    ElMessage.error(error.message || '保存邮件设置失败')
  } finally {
    emailLoading.value = false
  }
}

// 测试邮件连接
const testEmailConnection = async () => {
  try {
    const valid = await emailFormRef.value.validate()
    if (!valid) return
    
    await testEmailConfig(emailForm)
    ElMessage.success('邮件连接测试成功')
  } catch (error) {
    console.error('邮件连接测试失败:', error)
    ElMessage.error(error.message || '邮件连接测试失败')
  }
}

// 刷新系统信息
const refreshSystemInfo = () => {
  loadSystemInfo()
  ElMessage.success('系统信息已刷新')
}

// 下载日志
const downloadLogs = () => {
  // 实现日志下载逻辑
  ElMessage.info('日志下载功能开发中')
}

// 组件挂载时加载数据
onMounted(() => {
  loadSystemSettings()
  loadSystemInfo()
})
</script>

<style lang="scss" scoped>
.settings-page {
  padding: 20px;
}

.page-card {
  .card-header {
    h3 {
      margin: 0 0 8px 0;
      color: #303133;
    }
    
    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }
}

.settings-tabs {
  margin-top: 20px;
  
  :deep(.el-tabs__content) {
    padding-top: 20px;
  }
}

.settings-form {
  max-width: 800px;
  
  .form-tips {
    margin-left: 8px;
    color: #909399;
    font-size: 14px;
  }
  
  .upload-tips {
    margin-top: 8px;
    color: #909399;
    font-size: 12px;
  }
}

.logo-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    width: 200px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      border-color: $primary-color;
    }
  }
  
  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
  }
  
  .logo-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.system-info {
  .info-actions {
    margin-top: 24px;
    display: flex;
    gap: 12px;
  }
}

// 响应式
@media (max-width: $breakpoint-md) {
  .settings-page {
    padding: 16px;
  }
  
  .settings-form {
    .el-row {
      .el-col {
        margin-bottom: 16px;
      }
    }
  }
  
  .system-info {
    .info-actions {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>