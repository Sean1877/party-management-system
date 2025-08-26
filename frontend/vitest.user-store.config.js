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
    
    // 仅加载setup.js，不加载globalMocks.js
    setupFiles: ['./tests/mocks/setup.js'],
    
    // 只运行用户Store测试
    include: ['tests/stores/user.test.js'],
    
    // 排除文件
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage'
    ],
    
    // 测试超时
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@layout': path.resolve(__dirname, 'src/layout'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  },
  
  // 确保模块解析正确
  server: {
    fs: {
      // 允许从 tests 目录访问文件
      allow: ['..']
    }
  },
  
  // 定义全局变量
  define: {
    __TEST__: true
  }
});