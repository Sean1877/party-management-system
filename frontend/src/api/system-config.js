import request from '@/utils/request'

// 获取系统配置
export function getSystemConfig() {
  return request({
    url: '/system-config',
    method: 'get'
  })
}

// 更新系统配置
export function updateSystemConfig(data) {
  return request({
    url: '/system-config',
    method: 'put',
    data
  })
}

// 导入系统配置
export function importSystemConfigs(data) {
  return request({
    url: '/system-config/import',
    method: 'post',
    data
  })
}

// 导出系统配置
export function exportSystemConfigs() {
  return request({
    url: '/system-config/export',
    method: 'get',
    responseType: 'blob'
  })
}

// 重置系统配置
export function resetSystemConfig() {
  return request({
    url: '/system-config/reset',
    method: 'post'
  })
}

// 获取系统信息
export function getSystemInfo() {
  return request({
    url: '/system-config/info',
    method: 'get'
  })
}

// 测试邮件配置
export function testEmailConfig(data) {
  return request({
    url: '/system-config/test-email',
    method: 'post',
    data
  })
}

// 创建备份
export function createBackup() {
  return request({
    url: '/system-config/backup',
    method: 'post'
  })
}

// 获取备份列表
export function getBackupList() {
  return request({
    url: '/system-config/backups',
    method: 'get'
  })
}

// 还原备份
export function restoreBackup(backupId) {
  return request({
    url: `/system-config/backup/${backupId}/restore`,
    method: 'post'
  })
}

// 删除备份
export function deleteBackup(backupId) {
  return request({
    url: `/system-config/backup/${backupId}`,
    method: 'delete'
  })
}

// 下载备份
export function downloadBackup(backupId) {
  return request({
    url: `/system-config/backup/${backupId}/download`,
    method: 'get',
    responseType: 'blob'
  })
}