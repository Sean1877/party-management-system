module.exports = {
  // 测试环境
  testEnvironment: 'node',
  
  // 测试文件匹配模式
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // 忽略的文件和目录
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test-results/'
  ],
  
  // 覆盖率收集
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/test-results/**',
    '!jest.config.js',
    '!setup.js'
  ],
  
  // 覆盖率目录
  coverageDirectory: 'test-results/coverage',
  
  // 覆盖率报告格式
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json',
    'clover'
  ],
  
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // 设置文件
  setupFilesAfterEnv: [
    '<rootDir>/setup.js'
  ],
  
  // 全局变量
  globals: {
    'API_BASE_URL': 'http://localhost:8080/api',
    'TEST_TIMEOUT': 30000
  },
  
  // 测试超时时间
  testTimeout: 30000,
  
  // 详细输出
  verbose: true,
  
  // 报告器配置
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'test-results/html-report',
        filename: 'report.html',
        expand: true,
        hideIcon: false,
        pageTitle: '党建管理系统API测试报告',
        logoImgPath: undefined,
        inlineSource: false
      }
    ]
  ],
  
  // 模块名称映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@helpers/(.*)$': '<rootDir>/helpers/$1'
  },
  
  // 转换忽略模式
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',
  ],
  
  // 清除模拟
  clearMocks: true,
  
  // 恢复模拟
  restoreMocks: true,
  
  // 错误时停止
  bail: false,
  
  // 最大工作进程数
  maxWorkers: '50%',
  
  // 缓存目录
  cacheDirectory: '<rootDir>/test-results/.jest-cache',
  
  // 通知配置
  notify: false,
  notifyMode: 'failure-change',
  
  // 错误输出
  errorOnDeprecated: true,
  
  // 检测打开的句柄
  detectOpenHandles: true,
  
  // 强制退出
  forceExit: true
};