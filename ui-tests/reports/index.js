/**
 * 测试报告路径配置
 * 统一管理各种测试报告的存储路径
 */

// HTML报告路径
export const HTML_REPORTS = {
  playwright: './html/playwright-report',
  coverage: './html/coverage'
};

// JSON报告路径
export const JSON_REPORTS = {
  results: './json/test-results.json',
  coverage: './json/coverage.json'
};

// JUnit报告路径
export const JUNIT_REPORTS = {
  results: './junit/test-results.xml'
};

// 测试结果文件路径
export const TEST_RESULTS = {
  directory: './test-results',
  lastRun: './test-results/.last-run.json'
};

// 截图和视频路径
export const MEDIA_REPORTS = {
  screenshots: './screenshots',
  videos: './videos',
  traces: './traces'
};

// 报告清理配置
export const CLEANUP_CONFIG = {
  retentionDays: 30,
  maxReports: 50
};

// 默认导出所有配置
export default {
  HTML_REPORTS,
  JSON_REPORTS,
  JUNIT_REPORTS,
  TEST_RESULTS,
  MEDIA_REPORTS,
  CLEANUP_CONFIG
};