import { vi } from 'vitest'

// 测试辅助函数
export const testHelpers = {
  // 创建模拟成功响应
  createSuccessResponse(data, message = '操作成功') {
    return {
      success: true,
      data,
      message
    }
  },

  // 创建模拟错误响应
  createErrorResponse(message, code = 400) {
    return {
      success: false,
      message,
      code
    }
  },

  // 创建分页响应
  createPaginatedResponse(content, size, page, total) {
    const totalPages = Math.ceil(total / size)
    return {
      content,
      totalElements: total,
      totalPages,
      size,
      number: page - 1,
      first: page === 1,
      last: page === totalPages
    }
  },

  // 模拟表单验证
  mockFormValidation(isValid) {
    return vi.fn().mockResolvedValue(isValid)
  },

  // 模拟路由器
  mockRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
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
  },

  // 模拟存储
  mockStore(initialState = {}) {
    const store = { ...initialState }
    
    return {
      ...store,
      $reset: vi.fn(() => {
        Object.assign(store, initialState)
        Object.keys(store).forEach(key => {
          if (!key.startsWith('$')) {
            store[key] = initialState[key]
          }
        })
      }),
      $patch: vi.fn((patch) => {
        Object.assign(store, patch)
        // 同时更新store对象本身的属性
        Object.keys(patch).forEach(key => {
          store[key] = patch[key]
        })
      })
    }
  },

  // 等待下一个 tick
  waitForNextTick() {
    return new Promise(resolve => {
      setTimeout(resolve, 0)
    })
  },

  // 等待条件满足
  waitForCondition(condition, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      
      const check = () => {
        if (condition()) {
          resolve()
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'))
        } else {
          setTimeout(check, 10)
        }
      }
      
      check()
    })
  },

  // 触发事件
  triggerEvent(element, eventType, eventInit = {}) {
    const event = new Event(eventType, eventInit)
    element.dispatchEvent(event)
  },

  // 触发键盘事件
  triggerKeyEvent(element, eventType, keyInit = {}) {
    const event = new KeyboardEvent(eventType, {
      bubbles: true,
      cancelable: true,
      ...keyInit
    })
    element.dispatchEvent(event)
  },

  // 通过 testId 查找组件
  findByTestId(wrapper, testId) {
    return wrapper.find(`[data-testid="${testId}"]`)
  },

  // 通过 testId 查找所有组件
  findAllByTestId(wrapper, testId) {
    return wrapper.findAll(`[data-testid="${testId}"]`)
  },

  // 模拟 localStorage
  mockLocalStorage() {
    const store = {}
    
    return {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = String(value)
      }),
      removeItem: vi.fn((key) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
      key: vi.fn(() => Object.keys(store)),
      get length() {
        return Object.keys(store).length
      },
      store
    }
  },

  // 模拟 sessionStorage
  mockSessionStorage() {
    return this.mockLocalStorage()
  },

  // 创建模拟文件对象
  createMockFile(name, type, size = 1024) {
    const file = new File([''], name, { type })
    Object.defineProperty(file, 'size', { value: size })
    return file
  },

  // 创建模拟文件列表
  createMockFileList(files) {
    const fileList = {
      length: files.length,
      item: vi.fn((index) => files[index]),
      [Symbol.iterator]: function* () {
        for (let i = 0; i < files.length; i++) {
          yield files[i]
        }
      }
    }
    
    files.forEach((file, index) => {
      fileList[index] = file
    })
    
    return fileList
  },

  // 模拟拖拽事件
  createDragEvent(type, dataTransfer = {}) {
    return new DragEvent(type, {
      bubbles: true,
      cancelable: true,
      dataTransfer: {
        files: [],
        items: [],
        types: [],
        getData: vi.fn(() => ''),
        setData: vi.fn(),
        clearData: vi.fn(),
        ...dataTransfer
      }
    })
  },

  // 模拟剪贴板事件
  createClipboardEvent(type, clipboardData = {}) {
    return new ClipboardEvent(type, {
      bubbles: true,
      cancelable: true,
      clipboardData: {
        getData: vi.fn(() => ''),
        setData: vi.fn(),
        clearData: vi.fn(),
        ...clipboardData
      }
    })
  },

  // 模拟滚动事件
  createScrollEvent(target) {
    return new Event('scroll', {
      bubbles: true,
      cancelable: true,
      target: {
        scrollTop: 100,
        scrollLeft: 0,
        scrollHeight: 1000,
        scrollWidth: 800,
        clientHeight: 600,
        clientWidth: 800,
        ...target
      }
    })
  },

  // 模拟调整大小事件
  createResizeEvent(target) {
    return new Event('resize', {
      bubbles: true,
      cancelable: true,
      target: {
        innerWidth: 1024,
        innerHeight: 768,
        outerWidth: 1024,
        outerHeight: 768,
        ...target
      }
    })
  },

  // 等待组件渲染
  async waitForRender(wrapper, timeout = 5000) {
    await this.waitForCondition(() => {
      return wrapper.vm && wrapper.vm.$el
    }, timeout)
  },

  // 等待异步操作完成
  async waitForAsync(timeout = 5000) {
    await this.waitForNextTick()
    await new Promise(resolve => setTimeout(resolve, 10))
  },

  // 模拟网络延迟
  async simulateNetworkDelay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  // 创建模拟错误
  createMockError(message, code = 500, response = null) {
    const error = new Error(message)
    error.code = code
    error.response = response
    return error
  },

  // 验证调用次数
  expectCalledTimes(mock, times) {
    expect(mock).toHaveBeenCalledTimes(times)
  },

  // 验证调用参数
  expectCalledWith(mock, ...args) {
    expect(mock).toHaveBeenCalledWith(...args)
  },

  // 验证未被调用
  expectNotCalled(mock) {
    expect(mock).not.toHaveBeenCalled()
  },

  // 重置所有模拟
  resetAllMocks() {
    vi.clearAllMocks()
  },

  // 创建 Element Plus 组件 stubs
  createElementPlusStubs() {
    const createStub = (name) => ({ name, template: '<div><slot /></div>' })
    const createInputStub = (name, type = 'text') => ({ 
      name, 
      template: `<input type="${type}" />` 
    })
    
    return {
      // 基础组件
      'el-card': createStub('ElCard'),
      'el-tabs': createStub('ElTabs'),
      'el-tab-pane': createStub('ElTabPane'),
      'el-form': { name: 'ElForm', template: '<form><slot /></form>' },
      'el-form-item': createStub('ElFormItem'),
      
      // 输入组件
      'el-input': createInputStub('ElInput'),
      'el-input-number': createInputStub('ElInputNumber', 'number'),
      'el-textarea': { name: 'ElTextarea', template: '<textarea></textarea>' },
      'el-select': { name: 'ElSelect', template: '<select><slot /></select>' },
      'el-option': { name: 'ElOption', template: '<option><slot /></option>' },
      'el-switch': createInputStub('ElSwitch', 'checkbox'),
      'el-radio': createInputStub('ElRadio', 'radio'),
      'el-radio-group': createStub('ElRadioGroup'),
      'el-checkbox': createInputStub('ElCheckbox', 'checkbox'),
      'el-checkbox-group': createStub('ElCheckboxGroup'),
      'el-time-picker': createInputStub('ElTimePicker', 'time'),
      'el-date-picker': createInputStub('ElDatePicker', 'date'),
      'el-datetime-picker': createInputStub('ElDatetimePicker', 'datetime-local'),
      
      // 按钮和操作组件
      'el-button': { name: 'ElButton', template: '<button><slot /></button>' },
      'el-button-group': createStub('ElButtonGroup'),
      'el-dropdown': createStub('ElDropdown'),
      'el-dropdown-menu': createStub('ElDropdownMenu'),
      'el-dropdown-item': createStub('ElDropdownItem'),
      
      // 数据展示组件
      'el-table': { name: 'ElTable', template: '<table><slot /></table>' },
      'el-table-column': { name: 'ElTableColumn', template: '<td><slot /></td>' },
      'el-tag': { name: 'ElTag', template: '<span><slot /></span>' },
      'el-badge': createStub('ElBadge'),
      'el-descriptions': createStub('ElDescriptions'),
      'el-descriptions-item': createStub('ElDescriptionsItem'),
      'el-image': { name: 'ElImage', template: '<img />' },
      'el-avatar': createStub('ElAvatar'),
      
      // 反馈组件
      'el-alert': createStub('ElAlert'),
      'el-dialog': createStub('ElDialog'),
      'el-drawer': createStub('ElDrawer'),
      'el-popover': createStub('ElPopover'),
      'el-popconfirm': createStub('ElPopconfirm'),
      'el-tooltip': createStub('ElTooltip'),
      
      // 导航组件
      'el-menu': { name: 'ElMenu', template: '<nav><slot /></nav>' },
      'el-menu-item': { name: 'ElMenuItem', template: '<li><slot /></li>' },
      'el-submenu': createStub('ElSubmenu'),
      'el-breadcrumb': { name: 'ElBreadcrumb', template: '<nav><slot /></nav>' },
      'el-breadcrumb-item': createStub('ElBreadcrumbItem'),
      'el-steps': createStub('ElSteps'),
      'el-step': createStub('ElStep'),
      
      // 布局组件
      'el-row': createStub('ElRow'),
      'el-col': createStub('ElCol'),
      'el-container': createStub('ElContainer'),
      'el-header': { name: 'ElHeader', template: '<header><slot /></header>' },
      'el-aside': { name: 'ElAside', template: '<aside><slot /></aside>' },
      'el-main': { name: 'ElMain', template: '<main><slot /></main>' },
      'el-footer': { name: 'ElFooter', template: '<footer><slot /></footer>' },
      'el-divider': { name: 'ElDivider', template: '<hr />' },
      
      // 其他组件
      'el-upload': createStub('ElUpload'),
      'el-progress': createStub('ElProgress'),
      'el-tree': createStub('ElTree'),
      'el-pagination': createStub('ElPagination'),
      'el-loading': createStub('ElLoading'),
      'el-skeleton': createStub('ElSkeleton'),
      'el-skeleton-item': createStub('ElSkeletonItem'),
      'el-empty': createStub('ElEmpty'),
      'el-result': createStub('ElResult'),
      'el-collapse': createStub('ElCollapse'),
      'el-collapse-item': createStub('ElCollapseItem'),
      'el-carousel': createStub('ElCarousel'),
      'el-carousel-item': createStub('ElCarouselItem'),
      
      // 图标组件
      'el-icon': { name: 'ElIcon', template: '<i><slot /></i>' },
      
      // Element Plus Icons
      'Plus': { name: 'Plus', template: '<span>+</span>' },
      'Edit': { name: 'Edit', template: '<span>编辑</span>' },
      'Delete': { name: 'Delete', template: '<span>删除</span>' },
      'Search': { name: 'Search', template: '<span>搜索</span>' },
      'Refresh': { name: 'Refresh', template: '<span>刷新</span>' },
      'Setting': { name: 'Setting', template: '<span>设置</span>' },
      'User': { name: 'User', template: '<span>用户</span>' },
      'Lock': { name: 'Lock', template: '<span>锁定</span>' },
      'Message': { name: 'Message', template: '<span>消息</span>' },
      'FolderOpened': { name: 'FolderOpened', template: '<span>文件夹</span>' },
      'Tools': { name: 'Tools', template: '<span>工具</span>' },
      'Upload': { name: 'Upload', template: '<span>上传</span>' },
      'Download': { name: 'Download', template: '<span>下载</span>' },
      'View': { name: 'View', template: '<span>查看</span>' },
      'Close': { name: 'Close', template: '<span>关闭</span>' },
      'Calendar': { name: 'Calendar', template: '<span>日历</span>' },
      'Clock': { name: 'Clock', template: '<span>时钟</span>' }
    }
  }
}