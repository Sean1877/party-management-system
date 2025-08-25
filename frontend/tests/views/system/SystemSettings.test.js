import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SystemSettings from '@/views/system/settings/index.vue'
import * as systemConfigAPI from '@/api/system-config'
import * as elementPlus from 'element-plus'
import { testHelpers } from '../../mocks/testHelpers'

// 使用全局 Mock，无需重复定义

describe('SystemSettings.vue', () => {
  let wrapper

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Setup default mock implementations
    vi.mocked(systemConfigAPI.getSystemConfig).mockResolvedValue({ data: {} })
    vi.mocked(systemConfigAPI.updateSystemConfig).mockResolvedValue({ success: true })
    
    wrapper = mount(SystemSettings, {
      global: {
        stubs: testHelpers.createElementPlusStubs()
      }
    })
  })

  describe('组件初始化', () => {
    it('应该正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('应该包含系统设置标题', () => {
      expect(wrapper.text()).toContain('系统设置')
    })

    it('应该正确设置初始数据', () => {
      expect(wrapper.vm.activeTab).toBe('basic')
      expect(wrapper.vm.basicForm).toBeDefined()
      expect(wrapper.vm.securityForm).toBeDefined()
      expect(wrapper.vm.emailForm).toBeDefined()
      expect(wrapper.vm.backupForm).toBeDefined()
    })
  })

  describe('基本设置', () => {
    it('应该能够更新基本设置表单', async () => {
      const basicForm = wrapper.vm.basicForm
      basicForm.systemName = '测试系统'
      basicForm.systemVersion = '1.0.0'
      
      await wrapper.vm.$nextTick()
      
      expect(basicForm.systemName).toBe('测试系统')
      expect(basicForm.systemVersion).toBe('1.0.0')
    })

    it('应该能够保存基本设置', async () => {
      await wrapper.vm.saveBasicSettings()
      
      expect(systemConfigAPI.updateSystemConfig).toHaveBeenCalled()
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('基本设置保存成功')
    })

    it('应该能够重置基本设置表单', async () => {
      wrapper.vm.basicForm.systemName = '测试'
      wrapper.vm.resetBasicForm()
      
      expect(wrapper.vm.basicForm.systemName).toBe('')
    })

    it('应该能够处理Logo上传成功', () => {
      const response = { data: { url: '/test-logo.png' } }
      wrapper.vm.handleLogoSuccess(response)
      
      expect(wrapper.vm.basicForm.systemLogo).toBe('/test-logo.png')
    })

    it('应该能够验证Logo上传前的文件', () => {
      const file = { type: 'image/jpeg', size: 1024 * 1024 }
      const result = wrapper.vm.beforeLogoUpload(file)
      
      expect(result).toBe(true)
    })

    it('应该拒绝过大的Logo文件', () => {
      const file = { type: 'image/jpeg', size: 5 * 1024 * 1024 }
      const result = wrapper.vm.beforeLogoUpload(file)
      
      expect(result).toBe(false)
      expect(elementPlus.ElMessage.error).toHaveBeenCalledWith('上传文件大小不能超过 2MB!')
    })
  })

  describe('安全设置', () => {
    it('应该能够保存安全设置', async () => {
      await wrapper.vm.saveSecuritySettings()
      
      expect(systemConfigAPI.updateSystemConfig).toHaveBeenCalled()
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('安全设置保存成功')
    })

    it('应该能够重置安全设置表单', async () => {
      wrapper.vm.securityForm.passwordMinLength = 10
      wrapper.vm.resetSecurityForm()
      
      expect(wrapper.vm.securityForm.passwordMinLength).toBe(8)
    })
  })

  describe('邮件设置', () => {
    it('应该能够保存邮件设置', async () => {
      await wrapper.vm.saveEmailSettings()
      
      expect(systemConfigAPI.updateSystemConfig).toHaveBeenCalled()
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('邮件设置保存成功')
    })

    it('应该能够重置邮件设置表单', async () => {
      wrapper.vm.emailForm.smtpHost = 'test.com'
      wrapper.vm.resetEmailForm()
      
      expect(wrapper.vm.emailForm.smtpHost).toBe('')
    })

    it('应该能够测试邮件连接', async () => {
      vi.mocked(systemConfigAPI.testEmailConfig).mockResolvedValue({ success: true })
      
      await wrapper.vm.testEmailConnection()
      
      expect(systemConfigAPI.testEmailConfig).toHaveBeenCalled()
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('邮件连接测试成功')
    })
  })

  describe('备份设置', () => {
    it('应该能够保存备份设置', async () => {
      await wrapper.vm.saveBackupSettings()
      
      expect(systemConfigAPI.updateSystemConfig).toHaveBeenCalled()
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('备份设置保存成功')
    })

    it('应该能够重置备份设置表单', async () => {
      wrapper.vm.backupForm.autoBackupEnabled = false
      wrapper.vm.resetBackupForm()
      
      expect(wrapper.vm.backupForm.autoBackupEnabled).toBe(true)
    })

    it('应该能够创建备份', async () => {
      vi.mocked(systemConfigAPI.createBackup).mockResolvedValue({ success: true })
      
      await wrapper.vm.createBackup()
      
      expect(systemConfigAPI.createBackup).toHaveBeenCalled()
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('备份创建成功')
    })

    it('应该能够刷新备份列表', async () => {
      const mockBackups = [{ id: 1, name: 'backup1' }]
      vi.mocked(systemConfigAPI.getBackupList).mockResolvedValue({ data: mockBackups })
      
      await wrapper.vm.refreshBackupList()
      
      expect(systemConfigAPI.getBackupList).toHaveBeenCalled()
      expect(wrapper.vm.backupList).toEqual(mockBackups)
    })

    it('应该能够下载备份', () => {
      const backup = { id: 1, name: 'backup1' }
      const mockWindow = { open: vi.fn() }
      global.window = mockWindow
      
      wrapper.vm.downloadBackup(backup)
      
      expect(mockWindow.open).toHaveBeenCalledWith('/api/system-config/backup/1/download')
    })

    it('应该能够恢复备份', async () => {
      const backup = { id: 1, name: 'backup1' }
      vi.mocked(elementPlus.ElMessageBox.confirm).mockResolvedValue('confirm')
      vi.mocked(systemConfigAPI.restoreBackup).mockResolvedValue({ success: true })
      
      await wrapper.vm.restoreBackup(backup)
      
      expect(elementPlus.ElMessageBox.confirm).toHaveBeenCalled()
      expect(systemConfigAPI.restoreBackup).toHaveBeenCalledWith(1)
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('备份恢复成功')
    })

    it('应该能够删除备份', async () => {
      const backup = { id: 1, name: 'backup1' }
      vi.mocked(elementPlus.ElMessageBox.confirm).mockResolvedValue('confirm')
      vi.mocked(systemConfigAPI.deleteBackup).mockResolvedValue({ success: true })
      
      await wrapper.vm.deleteBackup(backup)
      
      expect(elementPlus.ElMessageBox.confirm).toHaveBeenCalled()
      expect(systemConfigAPI.deleteBackup).toHaveBeenCalledWith(1)
      expect(elementPlus.ElMessage.success).toHaveBeenCalledWith('备份删除成功')
    })
  })

  describe('错误处理', () => {
    it('应该处理保存基本设置失败的情况', async () => {
      vi.mocked(systemConfigAPI.updateSystemConfig).mockRejectedValue(new Error('保存失败'))
      
      await wrapper.vm.saveBasicSettings()
      
      expect(elementPlus.ElMessage.error).toHaveBeenCalledWith('基本设置保存失败')
    })

    it('应该处理邮件连接测试失败的情况', async () => {
      vi.mocked(systemConfigAPI.testEmailConfig).mockRejectedValue(new Error('连接失败'))
      
      await wrapper.vm.testEmailConnection()
      
      expect(elementPlus.ElMessage.error).toHaveBeenCalledWith('邮件连接测试失败')
    })

    it('应该处理创建备份失败的情况', async () => {
      vi.mocked(systemConfigAPI.createBackup).mockRejectedValue(new Error('创建失败'))
      
      await wrapper.vm.createBackup()
      
      expect(elementPlus.ElMessage.error).toHaveBeenCalledWith('备份创建失败')
    })

    it('应该处理删除备份失败的情况', async () => {
      const backup = { id: 1, name: 'backup1' }
      vi.mocked(elementPlus.ElMessageBox.confirm).mockResolvedValue('confirm')
      vi.mocked(systemConfigAPI.deleteBackup).mockRejectedValue(new Error('删除失败'))
      
      await wrapper.vm.deleteBackup(backup)
      
      expect(elementPlus.ElMessage.error).toHaveBeenCalledWith('备份删除失败')
    })
  })

  describe('表单验证', () => {
    it('应该验证基本设置表单', async () => {
      const basicFormRef = { validate: vi.fn().mockResolvedValue(true) }
      wrapper.vm.basicFormRef = basicFormRef
      
      await wrapper.vm.saveBasicSettings()
      
      expect(basicFormRef.validate).toHaveBeenCalled()
    })

    it('应该验证安全设置表单', async () => {
      const securityFormRef = { validate: vi.fn().mockResolvedValue(true) }
      wrapper.vm.securityFormRef = securityFormRef
      
      await wrapper.vm.saveSecuritySettings()
      
      expect(securityFormRef.validate).toHaveBeenCalled()
    })

    it('应该验证邮件设置表单', async () => {
      const emailFormRef = { validate: vi.fn().mockResolvedValue(true) }
      wrapper.vm.emailFormRef = emailFormRef
      
      await wrapper.vm.saveEmailSettings()
      
      expect(emailFormRef.validate).toHaveBeenCalled()
    })
  })

  describe('响应式设计', () => {
    it('应该能够切换标签页', async () => {
      wrapper.vm.activeTab = 'security'
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.activeTab).toBe('security')
    })

    it('应该能够处理窗口大小变化', () => {
      // 这里可以测试响应式布局相关的逻辑
      expect(wrapper.exists()).toBe(true)
    })
  })
})