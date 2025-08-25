import { vi } from 'vitest'

// Mock所有API模块
vi.mock('@/api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  register: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  changePassword: vi.fn()
}))

vi.mock('@/api/user', () => ({
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  uploadAvatar: vi.fn()
}))

vi.mock('@/api/organization', () => ({
  getOrganizations: vi.fn(),
  getOrganizationById: vi.fn(),
  createOrganization: vi.fn(),
  updateOrganization: vi.fn(),
  deleteOrganization: vi.fn(),
  getOrganizationTree: vi.fn(),
  getOrganizationStats: vi.fn()
}))

vi.mock('@/api/activity', () => ({
  getActivities: vi.fn(),
  getActivityById: vi.fn(),
  createActivity: vi.fn(),
  updateActivity: vi.fn(),
  deleteActivity: vi.fn(),
  joinActivity: vi.fn(),
  leaveActivity: vi.fn(),
  getActivityParticipants: vi.fn(),
  checkInActivity: vi.fn()
}))

vi.mock('@/api/fee', () => ({
  getFeeStandards: vi.fn(),
  createFeeStandard: vi.fn(),
  updateFeeStandard: vi.fn(),
  deleteFeeStandard: vi.fn(),
  getFeePayments: vi.fn(),
  createFeePayment: vi.fn(),
  updateFeePayment: vi.fn(),
  deleteFeePayment: vi.fn(),
  getFeeStats: vi.fn(),
  exportFeeReport: vi.fn()
}))

vi.mock('@/api/statistics', () => ({
  getOverviewStats: vi.fn(),
  getUserStats: vi.fn(),
  getOrganizationStats: vi.fn(),
  getActivityStats: vi.fn(),
  getFeeStats: vi.fn(),
  getMonthlyStats: vi.fn(),
  getYearlyStats: vi.fn(),
  exportStatistics: vi.fn()
}))

vi.mock('@/api/system-config', () => ({
  getSystemConfig: vi.fn(),
  updateSystemConfig: vi.fn(),
  importSystemConfigs: vi.fn(),
  exportSystemConfigs: vi.fn(),
  resetSystemConfig: vi.fn(),
  getSystemInfo: vi.fn(),
  testEmailConfig: vi.fn(),
  createBackup: vi.fn(),
  getBackupList: vi.fn(),
  restoreBackup: vi.fn(),
  deleteBackup: vi.fn(),
  downloadBackup: vi.fn()
}))