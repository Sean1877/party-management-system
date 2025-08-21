/**
 * Playwright 全局设置文件
 * 在所有测试运行前执行的设置操作
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * 全局设置函数
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalSetup(config) {
  console.log('🚀 开始全局设置...');
  
  try {
    // 创建必要的目录
    await createDirectories();
    
    // 清理旧的测试结果
    await cleanupOldResults();
    
    // 检查测试环境
    await checkTestEnvironment(config);
    
    // 准备测试数据
    await prepareTestData();
    
    // 执行数据库初始化（如果需要）
    await initializeDatabase();
    
    // 预热应用程序
    await warmupApplication(config);
    
    console.log('✅ 全局设置完成');
    
  } catch (error) {
    console.error('❌ 全局设置失败:', error);
    throw error;
  }
}

/**
 * 创建必要的目录
 */
async function createDirectories() {
  const directories = [
    'ui-tests/test-results',
    'ui-tests/reports',
    'ui-tests/reports/html',
    'ui-tests/screenshots',
    'ui-tests/videos',
    'ui-tests/traces',
    'ui-tests/downloads',
    'ui-tests/temp'
  ];
  
  for (const dir of directories) {
    const fullPath = path.resolve(dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 创建目录: ${dir}`);
    }
  }
}

/**
 * 清理旧的测试结果
 */
async function cleanupOldResults() {
  const cleanupDirs = [
    'ui-tests/test-results',
    'ui-tests/screenshots',
    'ui-tests/videos',
    'ui-tests/traces'
  ];
  
  for (const dir of cleanupDirs) {
    const fullPath = path.resolve(dir);
    if (fs.existsSync(fullPath)) {
      // 删除目录中的所有文件，但保留目录
      const files = fs.readdirSync(fullPath);
      for (const file of files) {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          fs.unlinkSync(filePath);
        } else if (stat.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      }
      console.log(`🧹 清理目录: ${dir}`);
    }
  }
}

/**
 * 检查测试环境
 */
async function checkTestEnvironment(config) {
  const baseURL = config.projects[0]?.use?.baseURL || config.use?.baseURL;
  
  if (!baseURL) {
    throw new Error('未配置基础URL');
  }
  
  console.log(`🔍 检查测试环境: ${baseURL}`);
  
  try {
    // 启动浏览器检查应用是否可访问
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // 设置较短的超时时间进行快速检查
    page.setDefaultTimeout(10000);
    
    await page.goto(baseURL);
    
    // 检查页面是否正常加载
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // 检查是否有基本的页面元素
    const title = await page.title();
    console.log(`📄 页面标题: ${title}`);
    
    await browser.close();
    console.log('✅ 测试环境检查通过');
    
  } catch (error) {
    console.warn(`⚠️  测试环境检查失败: ${error.message}`);
    console.warn('继续执行测试，但可能会遇到问题');
  }
}

/**
 * 准备测试数据
 */
async function prepareTestData() {
  console.log('📊 准备测试数据...');
  
  // 创建测试数据文件
  const testData = {
    users: [
      {
        username: 'test_admin',
        password: 'test123',
        role: 'admin',
        realName: '测试管理员',
        email: 'admin@test.com'
      },
      {
        username: 'test_user',
        password: 'test123',
        role: 'member',
        realName: '测试用户',
        email: 'user@test.com'
      }
    ],
    organizations: [
      {
        name: '测试党支部',
        type: 'branch',
        description: '用于测试的党支部'
      },
      {
        name: '测试党委',
        type: 'committee',
        description: '用于测试的党委'
      }
    ],
    activities: [
      {
        title: '测试党员大会',
        type: 'meeting',
        description: '用于测试的党员大会',
        location: '测试会议室'
      },
      {
        title: '测试学习活动',
        type: 'study',
        description: '用于测试的学习活动',
        location: '测试学习室'
      }
    ],
    feeStandards: [
      {
        name: '测试党费标准',
        amount: 50.00,
        description: '用于测试的党费标准'
      }
    ]
  };
  
  const testDataPath = path.resolve('ui-tests/temp/test-data.json');
  fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
  console.log('✅ 测试数据准备完成');
}

/**
 * 初始化数据库（如果需要）
 */
async function initializeDatabase() {
  console.log('🗄️  检查数据库初始化...');
  
  // 这里可以添加数据库初始化逻辑
  // 例如：运行数据库迁移、插入测试数据等
  
  try {
    // 检查是否有数据库初始化脚本
    const dbInitScript = path.resolve('data/init-test-data.sql');
    if (fs.existsSync(dbInitScript)) {
      console.log('📝 发现数据库初始化脚本');
      // 这里可以执行数据库脚本
      // 例如：使用数据库客户端执行SQL脚本
    }
    
    console.log('✅ 数据库检查完成');
  } catch (error) {
    console.warn(`⚠️  数据库初始化警告: ${error.message}`);
  }
}

/**
 * 预热应用程序
 */
async function warmupApplication(config) {
  console.log('🔥 预热应用程序...');
  
  const baseURL = config.projects[0]?.use?.baseURL || config.use?.baseURL;
  
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // 访问主要页面进行预热
    const pagesToWarmup = [
      '/',
      '/login',
      '/dashboard'
    ];
    
    for (const pagePath of pagesToWarmup) {
      try {
        await page.goto(`${baseURL}${pagePath}`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log(`🌡️  预热页面: ${pagePath}`);
      } catch (error) {
        console.warn(`⚠️  预热页面失败 ${pagePath}: ${error.message}`);
      }
    }
    
    await browser.close();
    console.log('✅ 应用程序预热完成');
    
  } catch (error) {
    console.warn(`⚠️  应用程序预热失败: ${error.message}`);
  }
}

/**
 * 生成测试报告头部信息
 */
function generateTestReportHeader() {
  const reportHeader = {
    testRun: {
      id: `test-run-${Date.now()}`,
      startTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      browser: 'chromium',
      platform: process.platform,
      nodeVersion: process.version
    }
  };
  
  const reportPath = path.resolve('ui-tests/reports/test-run-info.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportHeader, null, 2));
  console.log('📋 生成测试运行信息');
}

// 在设置完成时生成报告头部
globalSetup.reportHeader = generateTestReportHeader;

export default globalSetup;