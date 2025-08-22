// 测试数据工厂
export const testDataFactory = {
  // 创建用户
  createUser(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 1000) + 1,
      username: `user_${Math.random().toString(36).substr(2, 9)}`,
      realName: '测试用户',
      idCard: '123456789012345678',
      phone: '13800138000',
      email: `test_${Math.random().toString(36).substr(2, 9)}@example.com`,
      gender: Math.floor(Math.random() * 2) + 1,
      birthDate: '1990-01-01',
      joinPartyDate: '2020-01-01',
      partyStatus: Math.floor(Math.random() * 4) + 1,
      organizationId: 1,
      roleId: Math.floor(Math.random() * 5) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    }
  },

  // 创建多个用户
  createUsers(count, overrides = {}) {
    return Array.from({ length: count }, () => this.createUser(overrides))
  },

  // 创建活动
  createActivity(overrides = {}) {
    const startTime = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)
    
    return {
      id: Math.floor(Math.random() * 1000) + 1,
      title: '测试活动',
      type: ['学习', '实践', '会议', '培训', '其他'][Math.floor(Math.random() * 5)],
      content: '这是一个测试活动',
      location: '会议室A',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      organizerId: 1,
      organizationId: 1,
      status: ['计划中', '进行中', '已结束', '已取消'][Math.floor(Math.random() * 4)],
      maxParticipants: Math.floor(Math.random() * 100) + 10,
      currentParticipants: Math.floor(Math.random() * 50),
      isRequired: Math.random() > 0.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    }
  },

  // 创建多个活动
  createActivities(count, overrides = {}) {
    return Array.from({ length: count }, () => this.createActivity(overrides))
  },

  // 创建组织
  createOrganization(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 100) + 1,
      name: '测试组织',
      code: `ORG_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: ['党支部', '党总支', '党委'][Math.floor(Math.random() * 3)],
      parentId: null,
      leaderId: 1,
      description: '这是一个测试组织',
      address: '测试地址',
      phone: '010-12345678',
      email: `org_${Math.random().toString(36).substr(2, 9)}@example.com`,
      status: 'ACTIVE',
      establishedDate: '2020-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    }
  },

  // 创建党费标准
  createFeeStandard(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 100) + 1,
      name: '测试党费标准',
      description: '这是一个测试党费标准',
      minIncome: Math.floor(Math.random() * 10000) + 1000,
      maxIncome: Math.floor(Math.random() * 20000) + 5000,
      feeRate: Math.random() * 0.02,
      fixedAmount: Math.floor(Math.random() * 100) + 10,
      status: 'ACTIVE',
      effectiveDate: '2024-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    }
  },

  // 创建党费缴费记录
  createFeePayment(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 1000) + 1,
      userId: Math.floor(Math.random() * 100) + 1,
      amount: Math.floor(Math.random() * 200) + 20,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: ['BANK_TRANSFER', 'CASH', 'ONLINE'][Math.floor(Math.random() * 3)],
      status: ['PAID', 'PENDING', 'OVERDUE'][Math.floor(Math.random() * 3)],
      period: '2024-01',
      remark: '测试缴费记录',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    }
  },

  // 创建操作日志
  createOperationLog(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 10000) + 1,
      userId: Math.floor(Math.random() * 100) + 1,
      username: 'testuser',
      operationType: ['CREATE', 'UPDATE', 'DELETE', 'READ'][Math.floor(Math.random() * 4)],
      operationModule: ['USER_MANAGEMENT', 'ACTIVITY_MANAGEMENT', 'FEE_MANAGEMENT'][Math.floor(Math.random() * 3)],
      operationDescription: '测试操作',
      requestMethod: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
      requestUrl: '/api/test',
      requestParams: '{}',
      responseStatus: 200,
      executionTime: Math.floor(Math.random() * 1000) + 10,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Test Browser)',
      createdAt: new Date().toISOString(),
      ...overrides
    }
  }
}

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
    const state = { ...initialState }
    const actions = {}
    
    return {
      state,
      $reset: vi.fn(() => {
        Object.assign(state, initialState)
      }),
      $patch: vi.fn((patch) => {
        Object.assign(state, patch)
      }),
      ...actions
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

  // 模剪贴板事件
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
  }
}