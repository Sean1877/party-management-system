#!/usr/bin/env node

/**
 * 测试运行脚本
 * 支持按套件、标签、环境运行测试
 * 使用方式：
 *   npm run test:smoke
 *   npm run test:regression
 *   npm run test:e2e
 *   npm run test:module -- --module=auth
 *   npm run test:tags -- --tags="@critical,@smoke"
 */

import { spawn } from 'child_process';
import { TEST_SUITES, TEST_TAGS } from '../config/test-suites.config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    suite: null,
    module: null,
    tags: [],
    environment: 'development',
    browser: 'chromium',
    headed: false,
    debug: false,
    workers: null,
    retries: null,
    reporter: null,
    grep: null,
    project: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--suite=')) {
      options.suite = arg.split('=')[1];
    } else if (arg.startsWith('--module=')) {
      options.module = arg.split('=')[1];
    } else if (arg.startsWith('--tags=')) {
      options.tags = arg.split('=')[1].split(',').map(tag => tag.trim());
    } else if (arg.startsWith('--env=') || arg.startsWith('--environment=')) {
      options.environment = arg.split('=')[1];
    } else if (arg.startsWith('--browser=')) {
      options.browser = arg.split('=')[1];
    } else if (arg === '--headed') {
      options.headed = true;
    } else if (arg === '--debug') {
      options.debug = true;
    } else if (arg.startsWith('--workers=')) {
      options.workers = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--retries=')) {
      options.retries = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--reporter=')) {
      options.reporter = arg.split('=')[1];
    } else if (arg.startsWith('--grep=')) {
      options.grep = arg.split('=')[1];
    } else if (arg.startsWith('--project=')) {
      options.project = arg.split('=')[1];
    }
  }

  return options;
}

// 构建Playwright命令
function buildPlaywrightCommand(options) {
  const playwrightCmd = ['npx', 'playwright', 'test'];
  
  // 配置文件路径
  playwrightCmd.push('--config', path.join(__dirname, '../config/playwright.config.js'));
  
  // 项目选择
  if (options.project) {
    playwrightCmd.push('--project', options.project);
  } else if (options.browser && options.browser !== 'all') {
    playwrightCmd.push('--project', options.browser);
  }
  
  // 运行模式
  if (options.headed) {
    playwrightCmd.push('--headed');
  }
  
  if (options.debug) {
    playwrightCmd.push('--debug');
  }
  
  // 并发设置
  if (options.workers !== null) {
    playwrightCmd.push('--workers', options.workers.toString());
  }
  
  // 重试设置
  if (options.retries !== null) {
    playwrightCmd.push('--retries', options.retries.toString());
  }
  
  // 报告器设置
  if (options.reporter) {
    playwrightCmd.push('--reporter', options.reporter);
  }
  
  // 测试过滤
  let grepPattern = '';
  
  // 按套件过滤
  if (options.suite && TEST_SUITES[options.suite]) {
    const suite = TEST_SUITES[options.suite];
    if (suite.grep) {
      grepPattern = suite.grep.source;
    }
  }
  
  // 按模块过滤
  if (options.module) {
    const moduleTag = `@${options.module}`;
    if (Object.values(TEST_TAGS).includes(moduleTag)) {
      grepPattern = grepPattern ? `${grepPattern}.*${moduleTag}` : moduleTag;
    }
  }
  
  // 按标签过滤
  if (options.tags.length > 0) {
    const tagPattern = options.tags.map(tag => 
      tag.startsWith('@') ? tag : `@${tag}`
    ).join('|');
    grepPattern = grepPattern ? `${grepPattern}.*(${tagPattern})` : `(${tagPattern})`;
  }
  
  // 自定义grep模式
  if (options.grep) {
    grepPattern = grepPattern ? `${grepPattern}.*${options.grep}` : options.grep;
  }
  
  if (grepPattern) {
    playwrightCmd.push('--grep', grepPattern);
  }
  
  return playwrightCmd;
}

// 设置环境变量
function setEnvironmentVariables(options) {
  process.env.NODE_ENV = options.environment;
  
  if (options.suite) {
    process.env.TEST_SUITE = options.suite;
  }
  
  // 设置基础URL（如果需要）
  if (options.environment === 'staging') {
    process.env.BASE_URL = process.env.STAGING_URL || 'https://staging.example.com';
  } else if (options.environment === 'production') {
    process.env.BASE_URL = process.env.PROD_URL || 'https://prod.example.com';
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
测试运行脚本使用说明：

可用选项：
  --suite=<套件名>        运行指定测试套件 (${Object.keys(TEST_SUITES).join(', ')})
  --module=<模块名>       运行指定模块测试 (auth, user-management, organization, etc.)
  --tags=<标签列表>       运行指定标签的测试 (用逗号分隔)
  --env=<环境>           设置运行环境 (development, staging, production)
  --browser=<浏览器>      指定浏览器 (chromium, firefox, webkit, all)
  --project=<项目名>      指定项目配置
  --headed              有头模式运行
  --debug               调试模式运行
  --workers=<数量>       并发worker数量
  --retries=<次数>       重试次数
  --reporter=<报告器>     指定报告器
  --grep=<模式>          自定义过滤模式
  --help                显示帮助信息

使用示例：
  node scripts/run-tests.js --suite=SMOKE
  node scripts/run-tests.js --module=auth --headed
  node scripts/run-tests.js --tags="@critical,@smoke" --env=staging
  node scripts/run-tests.js --browser=firefox --debug
  node scripts/run-tests.js --grep="登录" --workers=1

可用测试套件：
${Object.entries(TEST_SUITES).map(([key, suite]) => 
  `  ${key.padEnd(20)} - ${suite.description}`
).join('\n')}

可用标签：
${Object.entries(TEST_TAGS).map(([key, tag]) => 
  `  ${key.padEnd(20)} - ${tag}`
).join('\n')}
`);
}

// 主函数
function main() {
  const options = parseArgs();
  
  // 显示帮助
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    return;
  }
  
  console.log('🚀 启动测试运行器...');
  console.log('📋 运行配置：', {
    suite: options.suite || '未指定',
    module: options.module || '未指定',
    tags: options.tags.length > 0 ? options.tags.join(', ') : '未指定',
    environment: options.environment,
    browser: options.browser,
    headed: options.headed,
    debug: options.debug
  });
  
  // 设置环境变量
  setEnvironmentVariables(options);
  
  // 构建命令
  const command = buildPlaywrightCommand(options);
  
  console.log('🔧 执行命令：', command.join(' '));
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 执行测试
  const child = spawn(command[0], command.slice(1), {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });
  
  child.on('close', (code) => {
    console.log('\n' + '='.repeat(60));
    if (code === 0) {
      console.log('✅ 测试执行完成');
    } else {
      console.log(`❌ 测试执行失败，退出码: ${code}`);
      process.exit(code);
    }
  });
  
  child.on('error', (error) => {
    console.error('❌ 执行错误:', error.message);
    process.exit(1);
  });
}

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseArgs, buildPlaywrightCommand, setEnvironmentVariables };