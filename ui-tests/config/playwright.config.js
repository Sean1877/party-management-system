import { defineConfig, devices } from '@playwright/test';
import { TEST_SUITES, EXECUTION_STRATEGIES, ENVIRONMENT_CONFIG } from './test-suites.config.js';

/**
 * Playwright 配置文件
 * 定义测试运行环境、浏览器设置、报告等配置
 * 集成测试套件分组和标签管理
 */

// 获取当前环境和测试套件
const environment = process.env.NODE_ENV || 'development';
const testSuite = process.env.TEST_SUITE || 'REGRESSION';
const envConfig = ENVIRONMENT_CONFIG[environment];
const executionStrategy = process.env.CI ? EXECUTION_STRATEGIES.CI : EXECUTION_STRATEGIES.LOCAL;

export default defineConfig({
  // 测试目录
  testDir: '../tests',
  
  // 全局测试超时时间
  timeout: envConfig?.timeout || 30 * 1000,
  
  // 断言超时时间（5秒）
  expect: {
    timeout: 5000,
  },
  
  // 测试失败时的重试次数
  retries: executionStrategy.retries || (process.env.CI ? 2 : 0),
  
  // 并行运行的worker数量
  workers: executionStrategy.workers || (process.env.CI ? 1 : undefined),
  
  // 完全并行执行
  fullyParallel: executionStrategy.fullyParallel || true,
  
  // CI环境禁止使用test.only
  forbidOnly: executionStrategy.forbidOnly || !!process.env.CI,
  
  // 测试报告配置
  reporter: executionStrategy.reporter || [
    ['html', { outputFolder: '../reports/html' }],
    ['json', { outputFile: '../reports/json/results.json' }],
    ['junit', { outputFile: '../reports/junit/results.xml' }],
    ['line']
  ],
  
  // 全局设置
  use: {
    // 基础URL
    baseURL: envConfig?.baseURL || process.env.BASE_URL || 'http://localhost:3000',
    
    // 浏览器上下文设置
    viewport: { width: 1280, height: 720 },
    
    // 忽略HTTPS错误
    ignoreHTTPSErrors: true,
    
    // 操作超时时间
    actionTimeout: 10 * 1000,
    
    // 导航超时时间
    navigationTimeout: 30 * 1000,
    
    // 截图设置
    screenshot: 'only-on-failure',
    
    // 视频录制设置
    video: 'retain-on-failure',
    
    // 跟踪设置
    trace: 'retain-on-failure',
    
    // 用户代理
    userAgent: 'Playwright Test Agent',
    
    // 语言设置
    locale: 'zh-CN',
    
    // 时区设置
    timezoneId: 'Asia/Shanghai',
  },
  
  // 项目配置 - 不同浏览器的测试配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // 移动端测试
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // 平板测试
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],
  
  // 输出目录
  outputDir: '../reports/test-results/',
  
  // 全局设置和拆卸
  globalSetup: require.resolve('./global-setup.js'),
  globalTeardown: require.resolve('./global-teardown.js'),
  
  // 测试标签过滤（支持通过环境变量指定）
  grep: process.env.TEST_GREP ? new RegExp(process.env.TEST_GREP) : undefined,
  grepInvert: process.env.TEST_GREP_INVERT ? new RegExp(process.env.TEST_GREP_INVERT) : undefined,
  
  // Web服务器配置（如果需要启动本地服务器）
  webServer: {
    command: 'cd ../frontend && npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  // 测试匹配模式
  testMatch: [
    '**/*.spec.js',
    '**/tests/**/*.spec.js'
  ],
  
  // 忽略的文件
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.git/**'
  ],
  
  // 元数据
  metadata: {
    'test-type': 'ui-automation',
    'project': '党建管理系统',
    'version': '1.0.0',
    'environment': environment,
    'test-suite': testSuite,
    'execution-strategy': process.env.CI ? 'CI' : 'LOCAL'
  },
  
  // 实验性功能
  experimentalCTSupportMode: 'service',
});

// 环境特定配置
if (process.env.NODE_ENV === 'production') {
  // 生产环境配置
  module.exports.use.baseURL = process.env.PROD_BASE_URL || 'https://your-production-url.com';
  module.exports.retries = 3;
  module.exports.workers = 2;
} else if (process.env.NODE_ENV === 'staging') {
  // 预发布环境配置
  module.exports.use.baseURL = process.env.STAGING_BASE_URL || 'https://your-staging-url.com';
  module.exports.retries = 2;
  module.exports.workers = 1;
}