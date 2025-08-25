import { vi } from 'vitest'

// 全局Mock配置 - 这个文件将被所有测试引用

// 1. Mock Element Plus - 彻底解决Element Plus导出问题
const mockElementPlus = {
  // Message 组件
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    close: vi.fn(),
    closeAll: vi.fn()
  },
  // MessageBox 组件
  ElMessageBox: {
    confirm: vi.fn(() => Promise.resolve('confirm')),
    alert: vi.fn(() => Promise.resolve()),
    prompt: vi.fn(() => Promise.resolve({ value: 'test' }))
  },
  // Notification 组件
  ElNotification: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    close: vi.fn(),
    closeAll: vi.fn()
  },
  // Loading 组件
  ElLoading: {
    service: vi.fn(() => ({
      close: vi.fn()
    }))
  },
  // 常用表单组件
  ElForm: { name: 'ElForm', template: '<form><slot /></form>' },
  ElFormItem: { name: 'ElFormItem', template: '<div><slot /></div>' },
  ElInput: { name: 'ElInput', template: '<input />' },
  ElInputNumber: { name: 'ElInputNumber', template: '<input type="number" />' },
  ElSelect: { name: 'ElSelect', template: '<select><slot /></select>' },
  ElOption: { name: 'ElOption', template: '<option><slot /></option>' },
  ElButton: { name: 'ElButton', template: '<button><slot /></button>' },
  ElSwitch: { name: 'ElSwitch', template: '<input type="checkbox" />' },
  ElUpload: { name: 'ElUpload', template: '<div><slot /></div>' },
  ElDialog: { name: 'ElDialog', template: '<div><slot /></div>' },
  ElCard: { name: 'ElCard', template: '<div><slot /></div>' },
  ElTabs: { name: 'ElTabs', template: '<div><slot /></div>' },
  ElTabPane: { name: 'ElTabPane', template: '<div><slot /></div>' },
  ElTable: { name: 'ElTable', template: '<table><slot /></table>' },
  ElTableColumn: { name: 'ElTableColumn', template: '<td><slot /></td>' },
  ElTag: { name: 'ElTag', template: '<span><slot /></span>' },
  ElDescriptions: { name: 'ElDescriptions', template: '<div><slot /></div>' },
  ElDescriptionsItem: { name: 'ElDescriptionsItem', template: '<div><slot /></div>' },
  ElAlert: { name: 'ElAlert', template: '<div><slot /></div>' },
  ElDivider: { name: 'ElDivider', template: '<hr />' },
  ElTooltip: { name: 'ElTooltip', template: '<div><slot /></div>' },
  ElPopconfirm: { name: 'ElPopconfirm', template: '<div><slot /></div>' },
  ElCollapse: { name: 'ElCollapse', template: '<div><slot /></div>' },
  ElCollapseItem: { name: 'ElCollapseItem', template: '<div><slot /></div>' },
  ElIcon: { name: 'ElIcon', template: '<i><slot /></i>' },
  Plus: { name: 'Plus', template: '<span>+</span>' }
}

vi.mock('element-plus', () => {
  const mock = {
    ...mockElementPlus,
    default: mockElementPlus,
    __esModule: true
  }
  return mock
})

// 2. Mock Vue Router - 彻底解决路由问题
const mockRouter = {
  push: vi.fn(() => Promise.resolve()),
  replace: vi.fn(() => Promise.resolve()),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  beforeEach: vi.fn(),
  afterEach: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      name: 'home',
      params: {},
      query: {},
      meta: {},
      fullPath: '/',
      hash: '',
      matched: []
    }
  }
}

vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => mockRouter),
  createWebHistory: vi.fn(() => ({})),
  useRouter: vi.fn(() => mockRouter),
  useRoute: vi.fn(() => mockRouter.currentRoute.value),
  RouterView: { template: '<div></div>' },
  RouterLink: { template: '<a><slot /></a>' },
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn()
}))

// 3. Mock Pinia Store
const createMockStore = (initialState = {}) => ({
  ...initialState,
  $id: 'test-store',
  $state: initialState,
  $reset: vi.fn(),
  $patch: vi.fn((updater) => {
    if (typeof updater === 'function') {
      updater(initialState)
    } else {
      Object.assign(initialState, updater)
    }
  }),
  $subscribe: vi.fn(),
  $dispose: vi.fn()
})

// Mock User Store
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => createMockStore({
    user: null,
    token: null,
    permissions: [],
    isLoggedIn: false,
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    updateProfile: vi.fn(),
    setUser: vi.fn(),
    setToken: vi.fn(),
    hasPermission: vi.fn(() => true)
  }))
}))

// Mock App Store
vi.mock('@/stores/app', () => ({
  useAppStore: vi.fn(() => createMockStore({
    sidebar: { opened: true },
    device: 'desktop',
    toggleSidebar: vi.fn(),
    closeSidebar: vi.fn(),
    toggleDevice: vi.fn()
  }))
}))

// 4. Mock所有API模块
vi.mock('@/api/auth', () => ({
  login: vi.fn(() => Promise.resolve({ data: { token: 'mock-token' } })),
  logout: vi.fn(() => Promise.resolve()),
  getCurrentUser: vi.fn(() => Promise.resolve({ data: { id: 1, username: 'test' } })),
  register: vi.fn(() => Promise.resolve()),
  forgotPassword: vi.fn(() => Promise.resolve()),
  resetPassword: vi.fn(() => Promise.resolve()),
  changePassword: vi.fn(() => Promise.resolve())
}))

vi.mock('@/api/user', () => ({
  getUsers: vi.fn(() => Promise.resolve({ data: { content: [], totalElements: 0 } })),
  getUserById: vi.fn(() => Promise.resolve({ data: { id: 1, username: 'test' } })),
  createUser: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  updateUser: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  deleteUser: vi.fn(() => Promise.resolve()),
  updateProfile: vi.fn(() => Promise.resolve()),
  changePassword: vi.fn(() => Promise.resolve()),
  uploadAvatar: vi.fn(() => Promise.resolve({ data: { url: 'mock-url' } }))
}))

vi.mock('@/api/organization', () => ({
  getOrganizations: vi.fn(() => Promise.resolve({ data: { content: [], totalElements: 0 } })),
  getOrganizationById: vi.fn(() => Promise.resolve({ data: { id: 1, name: 'test' } })),
  createOrganization: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  updateOrganization: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  deleteOrganization: vi.fn(() => Promise.resolve()),
  getOrganizationTree: vi.fn(() => Promise.resolve({ data: [] })),
  getOrganizationStats: vi.fn(() => Promise.resolve({ data: {} }))
}))

vi.mock('@/api/activity', () => ({
  getActivities: vi.fn(() => Promise.resolve({ data: { content: [], totalElements: 0 } })),
  getActivityById: vi.fn(() => Promise.resolve({ data: { id: 1, title: 'test' } })),
  createActivity: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  updateActivity: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  deleteActivity: vi.fn(() => Promise.resolve()),
  joinActivity: vi.fn(() => Promise.resolve()),
  leaveActivity: vi.fn(() => Promise.resolve()),
  getActivityParticipants: vi.fn(() => Promise.resolve({ data: [] })),
  checkInActivity: vi.fn(() => Promise.resolve())
}))

vi.mock('@/api/fee', () => ({
  getFeeStandards: vi.fn(() => Promise.resolve({ data: { content: [], totalElements: 0 } })),
  createFeeStandard: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  updateFeeStandard: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  deleteFeeStandard: vi.fn(() => Promise.resolve()),
  getFeePayments: vi.fn(() => Promise.resolve({ data: { content: [], totalElements: 0 } })),
  createFeePayment: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  updateFeePayment: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  deleteFeePayment: vi.fn(() => Promise.resolve()),
  getFeeStats: vi.fn(() => Promise.resolve({ data: {} })),
  exportFeeReport: vi.fn(() => Promise.resolve())
}))

vi.mock('@/api/statistics', () => ({
  getOverviewStats: vi.fn(() => Promise.resolve({ data: {} })),
  getUserStats: vi.fn(() => Promise.resolve({ data: {} })),
  getOrganizationStats: vi.fn(() => Promise.resolve({ data: {} })),
  getActivityStats: vi.fn(() => Promise.resolve({ data: {} })),
  getFeeStats: vi.fn(() => Promise.resolve({ data: {} })),
  getMonthlyStats: vi.fn(() => Promise.resolve({ data: {} })),
  getYearlyStats: vi.fn(() => Promise.resolve({ data: {} })),
  exportStatistics: vi.fn(() => Promise.resolve())
}))

vi.mock('@/api/system-config', () => ({
  // 实际API中存在的函数
  getSystemConfig: vi.fn(() => Promise.resolve({ data: {} })),
  updateSystemConfig: vi.fn(() => Promise.resolve()),
  importSystemConfigs: vi.fn(() => Promise.resolve()),
  exportSystemConfigs: vi.fn(() => Promise.resolve()),
  resetSystemConfig: vi.fn(() => Promise.resolve()),
  getSystemInfo: vi.fn(() => Promise.resolve({ data: {} })),
  testEmailConfig: vi.fn(() => Promise.resolve()),
  createBackup: vi.fn(() => Promise.resolve()),
  getBackupList: vi.fn(() => Promise.resolve({ data: [] })),
  restoreBackup: vi.fn(() => Promise.resolve()),
  deleteBackup: vi.fn(() => Promise.resolve()),
  downloadBackup: vi.fn(() => Promise.resolve()),
  // 测试中需要的额外函数
  getSystemConfigs: vi.fn(() => Promise.resolve({ data: [] })),
  getSystemConfigByKey: vi.fn(() => Promise.resolve({ data: {} })),
  createSystemConfig: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
  deleteSystemConfig: vi.fn(() => Promise.resolve()),
  batchUpdateSystemConfigs: vi.fn(() => Promise.resolve()),
  resetSystemConfigs: vi.fn(() => Promise.resolve())
}))

// 5. Mock Utils
vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: {
        use: vi.fn(),
        handlers: []
      },
      response: {
        use: vi.fn(),
        handlers: []
      }
    }
  },
  get: vi.fn(() => Promise.resolve({ data: {} })),
  post: vi.fn(() => Promise.resolve({ data: {} })),
  put: vi.fn(() => Promise.resolve({ data: {} })),
  delete: vi.fn(() => Promise.resolve({ data: {} }))
}))

vi.mock('@/utils/auth', () => ({
  getToken: vi.fn(() => 'mock-token'),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  hasToken: vi.fn(() => true)
}))

vi.mock('@/utils/date', () => ({
  formatDate: vi.fn((date) => '2024-01-01'),
  formatDateTime: vi.fn((date) => '2024-01-01 10:00:00'),
  formatTime: vi.fn((date) => '10:00:00'),
  parseDate: vi.fn((dateStr) => new Date(dateStr)),
  addDays: vi.fn((date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)),
  subtractDays: vi.fn((date, days) => new Date(date.getTime() - days * 24 * 60 * 60 * 1000)),
  isSameDay: vi.fn((date1, date2) => true),
  isToday: vi.fn((date) => true),
  getDateDiff: vi.fn((date1, date2) => 0),
  formatRelativeTime: vi.fn((date) => '刚刚')
}))

vi.mock('@/utils/validation', () => ({
  validateEmail: vi.fn((email) => true),
  validatePhone: vi.fn((phone) => true),
  validatePassword: vi.fn((password) => true),
  validateRequired: vi.fn((value) => !!value),
  validateLength: vi.fn((value, min, max) => true),
  validateNumber: vi.fn((value) => true),
  validateInteger: vi.fn((value) => true),
  validateUrl: vi.fn((url) => true),
  validateIdCard: vi.fn((idCard) => true),
  createValidator: vi.fn(() => vi.fn(() => true))
}))

vi.mock('@/utils/index', () => ({
  debounce: vi.fn((fn, delay) => fn),
  throttle: vi.fn((fn, delay) => fn),
  deepClone: vi.fn((obj) => JSON.parse(JSON.stringify(obj))),
  isEmpty: vi.fn((value) => !value),
  isObject: vi.fn((value) => typeof value === 'object'),
  isArray: vi.fn((value) => Array.isArray(value)),
  isFunction: vi.fn((value) => typeof value === 'function'),
  generateUUID: vi.fn(() => 'mock-uuid'),
  formatFileSize: vi.fn((size) => '1KB'),
  downloadFile: vi.fn(),
  copyToClipboard: vi.fn(() => Promise.resolve()),
  openUrl: vi.fn()
}))

// 6. Mock Element Plus Icons
vi.mock('@element-plus/icons-vue', () => ({
  Plus: { name: 'Plus', template: '<span>+</span>' },
  Edit: { name: 'Edit', template: '<span>编辑</span>' },
  Delete: { name: 'Delete', template: '<span>删除</span>' },
  Search: { name: 'Search', template: '<span>搜索</span>' },
  Refresh: { name: 'Refresh', template: '<span>刷新</span>' },
  Setting: { name: 'Setting', template: '<span>设置</span>' },
  User: { name: 'User', template: '<span>用户</span>' },
  Lock: { name: 'Lock', template: '<span>锁定</span>' },
  Message: { name: 'Message', template: '<span>消息</span>' },
  FolderOpened: { name: 'FolderOpened', template: '<span>文件夹</span>' },
  Tools: { name: 'Tools', template: '<span>工具</span>' },
  Upload: { name: 'Upload', template: '<span>上传</span>' },
  Download: { name: 'Download', template: '<span>下载</span>' },
  View: { name: 'View', template: '<span>查看</span>' },
  Close: { name: 'Close', template: '<span>关闭</span>' }
}))

// 7. Mock 第三方库
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  })),
  dispose: vi.fn()
}))

// 导出Mock工具供测试使用
export {
  mockRouter,
  mockElementPlus,
  createMockStore
}