/**
 * 测试配置文件
 * 包含测试环境配置、测试数据、URL等信息
 */

export const TEST_CONFIG = {
  // 基础URL
  BASE_URL: 'http://localhost:3000',
  
  // API URL
  API_URL: 'http://localhost:8080/api',
  
  // 测试用户
  TEST_USERS: {
    ADMIN: {
      username: 'admin',
      password: 'admin123',
      realName: '系统管理员'
    },
    ORG_ADMIN: {
      username: 'orgadmin',
      password: 'orgadmin123',
      realName: '组织管理员'
    },
    USER: {
      username: 'user001',
      password: 'user123',
      realName: '普通党员'
    }
  },
  
  // 测试超时时间
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
    NAVIGATION: 15000
  },
  
  // 选择器
  SELECTORS: {
    // 通用
    LOGIN_BUTTON: '[data-testid="login-button"]',
    LOGOUT_BUTTON: '[data-testid="logout-button"]',
    SUBMIT_BUTTON: '[type="submit"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
    
    // 导航
    SIDEBAR: '.sidebar',
    NAVBAR: '.navbar',
    
    // 表单
    FORM_INPUT: 'input, textarea, select',
    ERROR_MESSAGE: '.error-message, .el-message--error',
    SUCCESS_MESSAGE: '.success-message, .el-message--success',
    
    // 表格
    TABLE: '.el-table',
    TABLE_ROW: '.el-table__row',
    PAGINATION: '.el-pagination'
  },
  
  // 页面路径
  PAGES: {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    USERS: '/users',
    ACTIVITIES: '/activities',
    ORGANIZATIONS: '/organizations',
    PROFILE: '/profile',
    SETTINGS: '/settings'
  }
};

// 测试数据
export const TEST_DATA = {
  // 测试党员数据
  USER: {
    VALID: {
      username: 'testuser001',
      password: 'Test123456',
      realName: '测试党员',
      idCard: '110101199001011234',
      phone: '13800138000',
      email: 'test@example.com',
      gender: 1,
      birthDate: '1990-01-01',
      joinPartyDate: '2015-06-01',
      partyStatus: 1
    },
    INVALID: {
      username: '',
      password: '',
      realName: '',
      idCard: 'invalid',
      phone: 'invalid',
      email: 'invalid'
    }
  },
  
  // 测试活动数据
  ACTIVITY: {
    VALID: {
      title: '主题党日活动测试',
      type: 5,
      content: '这是一个测试活动的内容描述',
      location: '会议室A',
      startTime: '2024-01-15T09:00:00',
      endTime: '2024-01-15T11:00:00',
      maxParticipants: 30,
      isRequired: true
    },
    INVALID: {
      title: '',
      type: null,
      startTime: null,
      endTime: null
    }
  },
  
  // 测试组织数据
  ORGANIZATION: {
    VALID: {
      name: '测试党支部',
      type: 1,
      description: '这是一个测试党支部',
      contactPerson: '张三',
      contactPhone: '13900139000',
      address: '北京市朝阳区'
    },
    INVALID: {
      name: '',
      type: null
    }
  }
};