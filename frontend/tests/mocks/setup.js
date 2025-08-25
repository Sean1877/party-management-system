import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock global objects
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Mock fetch
global.fetch = vi.fn()

// Configure Vue Test Utils
config.global.stubs = {
  transition: false,
  'transition-group': false,
}

// Mock router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
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
      meta: {}
    }
  }
}

config.global.mocks = {
  $router: mockRouter,
  $route: mockRouter.currentRoute.value
}

// Mock Element Plus module
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    default: actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    },
    ElMessageBox: {
      confirm: vi.fn(),
      alert: vi.fn(),
      prompt: vi.fn()
    },
    ElNotification: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    },
    ElLoading: {
      service: vi.fn(() => ({
        close: vi.fn()
      }))
    }
  }
})

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    createRouter: vi.fn(() => mockRouter),
    createWebHistory: vi.fn(),
    useRouter: vi.fn(() => mockRouter),
    useRoute: vi.fn(() => mockRouter.currentRoute.value)
  }
})

// Mock Element Plus components globally
config.global.stubs = {
  ...config.global.stubs,
  'el-config-provider': true,
  'el-button': true,
  'el-input': true,
  'el-form': true,
  'el-form-item': true,
  'el-select': true,
  'el-option': true,
  'el-table': true,
  'el-table-column': true,
  'el-pagination': true,
  'el-dialog': true,
  'el-card': true,
  'el-tag': true,
  'el-switch': true,
  'el-date-picker': true,
  'el-radio': true,
  'el-radio-group': true,
  'el-checkbox': true,
  'el-checkbox-group': true,
  'el-textarea': true,
  'el-input-number': true,
  'el-upload': true,
  'el-avatar': true,
  'el-dropdown': true,
  'el-dropdown-menu': true,
  'el-dropdown-item': true,
  'el-menu': true,
  'el-menu-item': true,
  'el-submenu': true,
  'el-breadcrumb': true,
  'el-breadcrumb-item': true,
  'el-tabs': true,
  'el-tab-pane': true,
  'el-collapse': true,
  'el-collapse-item': true,
  'el-tooltip': true,
  'el-popover': true,
  'el-popconfirm': true,
  'el-drawer': true,
  'el-loading': true,
  'el-skeleton': true,
  'el-skeleton-item': true,
  'el-empty': true,
  'el-result': true,
  'el-alert': true,
  'el-notification': true,
  'el-message': true,
  'el-message-box': true,
  'el-progress': true,
  'el-badge': true,
  'el-divider': true,
  'el-space': true,
  'el-row': true,
  'el-col': true,
  'el-container': true,
  'el-header': true,
  'el-aside': true,
  'el-main': true,
  'el-footer': true,
  'el-scrollbar': true,
  'el-backtop': true,
  'el-image': true,
  'el-carousel': true,
  'el-carousel-item': true,
  'el-calendar': true,
  'el-timeline': true,
  'el-timeline-item': true,
  'el-tree': true,
  'el-tree-select': true,
  'el-cascader': true,
  'el-cascader-panel': true,
  'el-color-picker': true,
  'el-transfer': true,
  'el-slider': true,
  'el-rate': true,
  'el-steps': true,
  'el-step': true,
  'el-descriptions': true,
  'el-descriptions-item': true,
  'el-statistic': true,
  'el-countdown': true,
  'el-affix': true,
  'el-anchor': true,
  'el-anchor-link': true,
  'el-watermark': true,
  'el-tour': true,
  'el-tour-step': true
}