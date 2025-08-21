/**
 * 测试套件配置文件
 * 按照Playwright最佳实践组织测试分组和标签
 */

// 测试标签定义
export const TEST_TAGS = {
  // 功能模块标签
  AUTH: '@auth',
  USER_MANAGEMENT: '@user-management',
  ORGANIZATION: '@organization',
  ACTIVITY: '@activity',
  FEE: '@fee',
  STATISTICS: '@statistics',
  SYSTEM: '@system',
  
  // 测试类型标签
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  E2E: '@e2e',
  API: '@api',
  UI: '@ui',
  
  // 优先级标签
  CRITICAL: '@critical',
  HIGH: '@high',
  MEDIUM: '@medium',
  LOW: '@low',
  
  // 环境标签
  DEV: '@dev',
  STAGING: '@staging',
  PROD: '@prod',
  
  // 浏览器兼容性标签
  CHROME_ONLY: '@chrome-only',
  FIREFOX_ONLY: '@firefox-only',
  WEBKIT_ONLY: '@webkit-only',
  MOBILE_ONLY: '@mobile-only',
  DESKTOP_ONLY: '@desktop-only'
};

// 测试套件定义
export const TEST_SUITES = {
  // 冒烟测试套件 - 核心功能快速验证
  SMOKE: {
    name: 'Smoke Tests',
    description: '核心功能冒烟测试',
    grep: /@smoke/,
    timeout: 30000,
    retries: 1,
    tests: [
      'auth/login.spec.js',
      'user-management/user-crud.spec.js',
      'organization-management/org-basic.spec.js'
    ]
  },
  
  // 回归测试套件 - 完整功能验证
  REGRESSION: {
    name: 'Regression Tests',
    description: '完整回归测试',
    grep: /@regression/,
    timeout: 60000,
    retries: 2,
    tests: [
      'auth/**/*.spec.js',
      'user-management/**/*.spec.js',
      'organization-management/**/*.spec.js',
      'activity-management/**/*.spec.js',
      'fee-management/**/*.spec.js'
    ]
  },
  
  // 端到端测试套件 - 完整业务流程
  E2E: {
    name: 'End-to-End Tests',
    description: '端到端业务流程测试',
    grep: /@e2e/,
    timeout: 120000,
    retries: 1,
    tests: [
      'e2e/**/*.spec.js'
    ]
  },
  
  // 关键功能测试套件
  CRITICAL: {
    name: 'Critical Tests',
    description: '关键功能测试',
    grep: /@critical/,
    timeout: 45000,
    retries: 2,
    tests: [
      'auth/login.spec.js',
      'user-management/user-management.spec.js',
      'system-settings/security.spec.js'
    ]
  },
  
  // 按模块分组的测试套件
  AUTH_MODULE: {
    name: 'Authentication Module',
    description: '认证模块测试',
    grep: /@auth/,
    testDir: './tests/auth',
    timeout: 30000
  },
  
  USER_MODULE: {
    name: 'User Management Module',
    description: '用户管理模块测试',
    grep: /@user-management/,
    testDir: './tests/user-management',
    timeout: 45000
  },
  
  ORGANIZATION_MODULE: {
    name: 'Organization Module',
    description: '组织管理模块测试',
    grep: /@organization/,
    testDir: './tests/organization-management',
    timeout: 45000
  },
  
  ACTIVITY_MODULE: {
    name: 'Activity Module',
    description: '活动管理模块测试',
    grep: /@activity/,
    testDir: './tests/activity-management',
    timeout: 60000
  },
  
  FEE_MODULE: {
    name: 'Fee Management Module',
    description: '费用管理模块测试',
    grep: /@fee/,
    testDir: './tests/fee-management',
    timeout: 45000
  },
  
  STATISTICS_MODULE: {
    name: 'Statistics Module',
    description: '统计分析模块测试',
    grep: /@statistics/,
    testDir: './tests/statistics',
    timeout: 60000
  },
  
  SYSTEM_MODULE: {
    name: 'System Settings Module',
    description: '系统设置模块测试',
    grep: /@system/,
    testDir: './tests/system-settings',
    timeout: 30000
  }
};

// 测试执行策略
export const EXECUTION_STRATEGIES = {
  // 并行执行策略
  PARALLEL: {
    workers: 4,
    fullyParallel: true,
    forbidOnly: !!process.env.CI
  },
  
  // 串行执行策略
  SERIAL: {
    workers: 1,
    fullyParallel: false
  },
  
  // CI环境策略
  CI: {
    workers: 2,
    retries: 3,
    forbidOnly: true,
    reporter: [['html'], ['junit', { outputFile: 'reports/junit/results.xml' }]]
  },
  
  // 本地开发策略
  LOCAL: {
    workers: undefined,
    retries: 0,
    reporter: [['html'], ['line']]
  }
};

// 测试数据分组
export const TEST_DATA_GROUPS = {
  USERS: {
    ADMIN: 'admin-users',
    ORG_ADMIN: 'org-admin-users',
    REGULAR: 'regular-users',
    INACTIVE: 'inactive-users'
  },
  
  ORGANIZATIONS: {
    ACTIVE: 'active-orgs',
    INACTIVE: 'inactive-orgs',
    HIERARCHICAL: 'hierarchical-orgs'
  },
  
  ACTIVITIES: {
    UPCOMING: 'upcoming-activities',
    ONGOING: 'ongoing-activities',
    COMPLETED: 'completed-activities'
  }
};

// 环境配置映射
export const ENVIRONMENT_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    retries: 0
  },
  
  staging: {
    baseURL: process.env.STAGING_URL || 'https://staging.example.com',
    timeout: 45000,
    retries: 2
  },
  
  production: {
    baseURL: process.env.PROD_URL || 'https://prod.example.com',
    timeout: 60000,
    retries: 3
  }
};

// 获取当前环境的测试套件配置
export function getTestSuiteConfig(suiteName, environment = 'development') {
  const suite = TEST_SUITES[suiteName];
  const envConfig = ENVIRONMENT_CONFIG[environment];
  
  if (!suite) {
    throw new Error(`Test suite '${suiteName}' not found`);
  }
  
  return {
    ...suite,
    ...envConfig,
    use: {
      baseURL: envConfig.baseURL
    }
  };
}

// 根据标签过滤测试
export function getTestsByTags(tags) {
  const tagPattern = tags.map(tag => `(?=.*${tag})`).join('');
  return new RegExp(tagPattern);
}

// 导出默认配置
export default {
  TEST_TAGS,
  TEST_SUITES,
  EXECUTION_STRATEGIES,
  TEST_DATA_GROUPS,
  ENVIRONMENT_CONFIG,
  getTestSuiteConfig,
  getTestsByTags
};