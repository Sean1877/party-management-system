/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 全局设置
    globals: true,
    
    // 设置文件
    setupFiles: ['./setup.js'],
    
    // 测试文件匹配模式
    include: [
      '**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/?(*.)+(test|spec).{js,jsx,ts,tsx}'
    ],
    
    // 排除文件
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage'
    ],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover'],
      reportsDirectory: 'coverage',
      include: [
        '../../frontend/src/**/*.{js,jsx,ts,tsx}'
      ],
      exclude: [
        '../../frontend/src/main.jsx',
        '../../frontend/src/App.jsx',
        '../../frontend/src/**/*.d.ts',
        '../../frontend/src/**/*.config.{js,ts}',
        '../../frontend/src/**/*.stories.{js,jsx,ts,tsx}',
        '../../frontend/src/**/index.{js,jsx,ts,tsx}'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    // 报告器配置
    reporters: [
      'default',
      'verbose',
      'junit'
    ],
    
    // 输出目录
    outputFile: {
      junit: 'test-results/junit.xml',
      json: 'test-results/results.json'
    },
    
    // 测试超时
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // 并发设置
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    
    // 监听模式配置
    watch: {
      clearScreen: false
    },
    
    // UI配置
    ui: {
      port: 51204,
      open: false
    },
    
    // 环境变量
    env: {
      NODE_ENV: 'test',
      VITE_API_BASE_URL: 'http://localhost:8080/api',
      VITE_APP_TITLE: '党建管理系统测试环境'
    }
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../frontend/src'),
      '~': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, '../../frontend/src/components'),
      '@pages': path.resolve(__dirname, '../../frontend/src/pages'),
      '@hooks': path.resolve(__dirname, '../../frontend/src/hooks'),
      '@utils': path.resolve(__dirname, '../../frontend/src/utils'),
      '@stores': path.resolve(__dirname, '../../frontend/src/stores'),
      '@services': path.resolve(__dirname, '../../frontend/src/services'),
      '@assets': path.resolve(__dirname, '../../frontend/src/assets'),
      '@styles': path.resolve(__dirname, '../../frontend/src/styles')
    }
  },
  
  // 定义全局变量
  define: {
    __TEST__: true
  }
});