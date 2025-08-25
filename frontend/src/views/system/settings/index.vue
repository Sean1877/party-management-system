<template>
  <div class="system-settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="120px"
          >
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="basicForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="系统版本" prop="systemVersion">
              <el-input v-model="basicForm.systemVersion" placeholder="请输入系统版本" />
            </el-form-item>
            <el-form-item label="系统描述" prop="systemDescription">
              <el-input
                v-model="basicForm.systemDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入系统描述"
              />
            </el-form-item>
            <el-form-item label="系统Logo" prop="systemLogo">
              <el-upload
                class="logo-uploader"
                action="/api/upload/logo"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :before-upload="beforeLogoUpload"
              >
                <img v-if="basicForm.systemLogo" :src="basicForm.systemLogo" class="logo" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="版权信息" prop="copyright">
              <el-input v-model="basicForm.copyright" placeholder="请输入版权信息" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存</el-button>
              <el-button @click="resetBasicForm">重置</el-button>
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
          >
            <el-form-item label="密码最小长度" prop="minPasswordLength">
              <el-input-number
                v-model="securityForm.minPasswordLength"
                :min="6"
                :max="20"
                placeholder="密码最小长度"
              />
              <span class="form-tip">密码最小长度，建议6-20位</span>
            </el-form-item>
            <el-form-item label="密码复杂度" prop="passwordComplexity">
              <el-checkbox-group v-model="securityForm.passwordComplexity">
                <el-checkbox label="uppercase">包含大写字母</el-checkbox>
                <el-checkbox label="lowercase">包含小写字母</el-checkbox>
                <el-checkbox label="number">包含数字</el-checkbox>
                <el-checkbox label="special">包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="会话超时时间" prop="sessionTimeout">
              <el-input-number
                v-model="securityForm.sessionTimeout"
                :min="30"
                :max="1440"
                placeholder="会话超时时间(分钟)"
              />
              <span class="form-tip">会话超时时间，单位：分钟</span>
            </el-form-item>
            <el-form-item label="登录失败次数" prop="maxLoginAttempts">
              <el-input-number
                v-model="securityForm.maxLoginAttempts"
                :min="3"
                :max="10"
                placeholder="最大登录失败次数"
              />
              <span class="form-tip">超过此次数将锁定账户</span>
            </el-form-item>
            <el-form-item label="账户锁定时间" prop="lockoutDuration">
              <el-input-number
                v-model="securityForm.lockoutDuration"
                :min="5"
                :max="120"
                placeholder="锁定时间(分钟)"
              />
              <span class="form-tip">账户锁定时间，单位：分钟</span>
            </el-form-item>
            <el-form-item label="启用双因素认证" prop="enableTwoFactor">
              <el-switch v-model="securityForm.enableTwoFactor" />
              <span class="form-tip">启用双因素认证提高安全性</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存</el-button>
              <el-button @click="resetSecurityForm">重置</el-button>
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
          >
            <el-form-item label="SMTP服务器" prop="smtpHost">
              <el-input v-model="emailForm.smtpHost" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
            <el-form-item label="SMTP端口" prop="smtpPort">
              <el-input-number
                v-model="emailForm.smtpPort"
                :min="1"
                :max="65535"
                placeholder="SMTP端口"
              />
            </el-form-item>
            <el-form-item label="发件人邮箱" prop="senderEmail">
              <el-input v-model="emailForm.senderEmail" placeholder="请输入发件人邮箱" />
            </el-form-item>
            <el-form-item label="发件人密码" prop="senderPassword">
              <el-input
                v-model="emailForm.senderPassword"
                type="password"
                placeholder="请输入发件人密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="启用SSL" prop="enableSSL">
              <el-switch v-model="emailForm.enableSSL" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveEmailSettings">保存</el-button>
              <el-button @click="testEmailConnection">测试连接</el-button>
              <el-button @click="resetEmailForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 备份设置 -->
        <el-tab-pane label="备份设置" name="backup">
          <el-form
            ref="backupFormRef"
            :model="backupForm"
            :rules="backupRules"
            label-width="120px"
          >
            <el-form-item label="自动备份" prop="autoBackup">
              <el-switch v-model="backupForm.autoBackup" />
              <span class="form-tip">启用自动备份功能</span>
            </el-form-item>
            <el-form-item label="备份频率" prop="backupFrequency" v-if="backupForm.autoBackup">
              <el-select v-model="backupForm.backupFrequency" placeholder="请选择备份频率">
                <el-option label="每天" value="daily" />
                <el-option label="每周" value="weekly" />
                <el-option label="每月" value="monthly" />
              </el-select>
            </el-form-item>
            <el-form-item label="备份时间" prop="backupTime" v-if="backupForm.autoBackup">
              <el-time-picker
                v-model="backupForm.backupTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择备份时间"
              />
            </el-form-item>
            <el-form-item label="保留备份数" prop="backupRetention">
              <el-input-number
                v-model="backupForm.backupRetention"
                :min="1"
                :max="30"
                placeholder="保留备份文件数量"
              />
              <span class="form-tip">最多保留的备份文件数量</span>
            </el-form-item>
            <el-form-item label="备份路径" prop="backupPath">
              <el-input v-model="backupForm.backupPath" placeholder="备份文件存储路径" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBackupSettings">保存</el-button>
              <el-button type="success" @click="createBackup">立即备份</el-button>
              <el-button @click="resetBackupForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 备份列表 -->
    <el-card v-if="activeTab === 'backup'" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>备份文件列表</span>
          <el-button type="primary" size="small" @click="refreshBackupList">刷新</el-button>
        </div>
      </template>
      
      <el-table :data="backupList" border stripe>
        <el-table-column prop="filename" label="文件名" />
        <el-table-column prop="size" label="文件大小" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="downloadBackup(scope.row)">
              下载
            </el-button>
            <el-button link type="success" size="small" @click="restoreBackup(scope.row)">
              还原
            </el-button>
            <el-button link type="danger" size="small" @click="deleteBackup(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'SystemSettings',
  components: {
    Plus
  },
  setup() {
    const activeTab = ref('basic')
    const basicFormRef = ref()
    const securityFormRef = ref()
    const emailFormRef = ref()
    const backupFormRef = ref()
    const backupList = ref([])

    // 基本设置表单
    const basicForm = reactive({
      systemName: '党建管理系统',
      systemVersion: '1.0.0',
      systemDescription: '现代化党建组织管理平台',
      systemLogo: '',
      copyright: '© 2024 党建管理系统. All rights reserved.'
    })

    // 安全设置表单
    const securityForm = reactive({
      minPasswordLength: 8,
      passwordComplexity: ['lowercase', 'number'],
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      enableTwoFactor: false
    })

    // 邮件设置表单
    const emailForm = reactive({
      smtpHost: '',
      smtpPort: 587,
      senderEmail: '',
      senderPassword: '',
      enableSSL: true
    })

    // 备份设置表单
    const backupForm = reactive({
      autoBackup: false,
      backupFrequency: 'daily',
      backupTime: '02:00',
      backupRetention: 7,
      backupPath: '/data/backup'
    })

    // 表单验证规则
    const basicRules = {
      systemName: [
        { required: true, message: '请输入系统名称', trigger: 'blur' }
      ],
      systemVersion: [
        { required: true, message: '请输入系统版本', trigger: 'blur' }
      ]
    }

    const securityRules = {
      minPasswordLength: [
        { required: true, message: '请输入密码最小长度', trigger: 'blur' }
      ],
      sessionTimeout: [
        { required: true, message: '请输入会话超时时间', trigger: 'blur' }
      ]
    }

    const emailRules = {
      smtpHost: [
        { required: true, message: '请输入SMTP服务器', trigger: 'blur' }
      ],
      senderEmail: [
        { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ]
    }

    const backupRules = {
      backupRetention: [
        { required: true, message: '请输入保留备份数', trigger: 'blur' }
      ],
      backupPath: [
        { required: true, message: '请输入备份路径', trigger: 'blur' }
      ]
    }

    // 保存基本设置
    const saveBasicSettings = async () => {
      if (!basicFormRef.value) return
      try {
        await basicFormRef.value.validate()
        // 这里调用API保存设置
        ElMessage.success('基本设置保存成功')
      } catch (error) {
        ElMessage.error('请检查表单输入')
      }
    }

    // 保存安全设置
    const saveSecuritySettings = async () => {
      if (!securityFormRef.value) return
      try {
        await securityFormRef.value.validate()
        // 这里调用API保存设置
        ElMessage.success('安全设置保存成功')
      } catch (error) {
        ElMessage.error('请检查表单输入')
      }
    }

    // 保存邮件设置
    const saveEmailSettings = async () => {
      if (!emailFormRef.value) return
      try {
        await emailFormRef.value.validate()
        // 这里调用API保存设置
        ElMessage.success('邮件设置保存成功')
      } catch (error) {
        ElMessage.error('请检查表单输入')
      }
    }

    // 保存备份设置
    const saveBackupSettings = async () => {
      if (!backupFormRef.value) return
      try {
        await backupFormRef.value.validate()
        // 这里调用API保存设置
        ElMessage.success('备份设置保存成功')
      } catch (error) {
        ElMessage.error('请检查表单输入')
      }
    }

    // 重置表单
    const resetBasicForm = () => {
      if (basicFormRef.value) {
        basicFormRef.value.resetFields()
      }
    }

    const resetSecurityForm = () => {
      if (securityFormRef.value) {
        securityFormRef.value.resetFields()
      }
    }

    const resetEmailForm = () => {
      if (emailFormRef.value) {
        emailFormRef.value.resetFields()
      }
    }

    const resetBackupForm = () => {
      if (backupFormRef.value) {
        backupFormRef.value.resetFields()
      }
    }

    // Logo上传处理
    const handleLogoSuccess = (response) => {
      basicForm.systemLogo = response.data.url
      ElMessage.success('Logo上传成功')
    }

    const beforeLogoUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        ElMessage.error('上传Logo只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        ElMessage.error('上传Logo大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

    // 测试邮件连接
    const testEmailConnection = async () => {
      try {
        // 这里调用API测试邮件连接
        ElMessage.success('邮件连接测试成功')
      } catch (error) {
        ElMessage.error('邮件连接测试失败')
      }
    }

    // 立即备份
    const createBackup = async () => {
      try {
        // 这里调用API创建备份
        ElMessage.success('备份创建成功')
        refreshBackupList()
      } catch (error) {
        ElMessage.error('备份创建失败')
      }
    }

    // 刷新备份列表
    const refreshBackupList = async () => {
      try {
        // 这里调用API获取备份列表，暂时使用模拟数据
        backupList.value = [
          {
            id: 1,
            filename: 'backup_20240101_020000.sql',
            size: '2.5MB',
            createdAt: '2024-01-01 02:00:00'
          }
        ]
      } catch (error) {
        ElMessage.error('获取备份列表失败')
      }
    }

    // 下载备份
    const downloadBackup = (backup) => {
      // 这里处理备份文件下载
      ElMessage.success('开始下载备份文件')
    }

    // 还原备份
    const restoreBackup = async (backup) => {
      try {
        await ElMessageBox.confirm(
          `确定要还原备份文件 ${backup.filename} 吗？此操作不可撤销！`,
          '确认还原',
          {
            type: 'warning'
          }
        )
        // 这里调用API还原备份
        ElMessage.success('备份还原成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('备份还原失败')
        }
      }
    }

    // 删除备份
    const deleteBackup = async (backup) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除备份文件 ${backup.filename} 吗？`,
          '确认删除',
          {
            type: 'warning'
          }
        )
        // 这里调用API删除备份
        ElMessage.success('备份文件删除成功')
        refreshBackupList()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除备份文件失败')
        }
      }
    }

    onMounted(() => {
      // 获取当前设置数据
      refreshBackupList()
    })

    return {
      activeTab,
      basicFormRef,
      securityFormRef,
      emailFormRef,
      backupFormRef,
      basicForm,
      securityForm,
      emailForm,
      backupForm,
      basicRules,
      securityRules,
      emailRules,
      backupRules,
      backupList,
      saveBasicSettings,
      saveSecuritySettings,
      saveEmailSettings,
      saveBackupSettings,
      resetBasicForm,
      resetSecurityForm,
      resetEmailForm,
      resetBackupForm,
      handleLogoSuccess,
      beforeLogoUpload,
      testEmailConnection,
      createBackup,
      refreshBackupList,
      downloadBackup,
      restoreBackup,
      deleteBackup
    }
  }
}
</script>

<style scoped>
.system-settings {
  padding: 20px;
}

.form-tip {
  color: #909399;
  font-size: 12px;
  margin-left: 10px;
}

.logo-uploader .logo {
  width: 178px;
  height: 178px;
  display: block;
}

.logo-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}

.logo-uploader .el-upload:hover {
  border-color: #409eff;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>