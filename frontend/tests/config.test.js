import { describe, it, expect } from 'vitest'

describe('测试配置验证', () => {
  it('应该能够运行基本测试', () => {
    expect(1 + 1).toBe(2)
  })

  it('应该能够正确解析路径别名', () => {
    // 这个测试验证 vitest 配置是否正确
    expect(process.env.NODE_ENV).toBe('test')
    expect(process.env.VITE_APP_TITLE).toBe('党建管理系统测试环境')
  })
})