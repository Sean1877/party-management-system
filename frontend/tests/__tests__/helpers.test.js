import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testDataFactory } from '@tests/fixtures/dataFactory'
import { testHelpers } from '@tests/mocks/testHelpers'

describe('Data Factory Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('User Factory', () => {
    it('should create a valid user object', () => {
      const user = testDataFactory.createUser()
      
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('realName')
      expect(user).toHaveProperty('email')
      expect(typeof user.id).toBe('number')
      expect(typeof user.username).toBe('string')
      expect(typeof user.realName).toBe('string')
      expect(typeof user.email).toBe('string')
    })

    it('should create user with custom attributes', () => {
      const customUser = testDataFactory.createUser({
        username: 'customuser',
        realName: '自定义用户',
        partyStatus: 2
      })
      
      expect(customUser.username).toBe('customuser')
      expect(customUser.realName).toBe('自定义用户')
      expect(customUser.partyStatus).toBe(2)
    })

    it('should create multiple users', () => {
      const users = testDataFactory.createUsers(3)
      
      expect(users).toHaveLength(3)
      expect(users[0].id).not.toBe(users[1].id)
    })
  })

  describe('Activity Factory', () => {
    it('should create a valid activity object', () => {
      const activity = testDataFactory.createActivity()
      
      expect(activity).toHaveProperty('id')
      expect(activity).toHaveProperty('title')
      expect(activity).toHaveProperty('type')
      expect(typeof activity.id).toBe('number')
      expect(typeof activity.title).toBe('string')
    })

    it('should create multiple activities', () => {
      const activities = testDataFactory.createActivities(2)
      
      expect(activities).toHaveLength(2)
      expect(activities[0].id).not.toBe(activities[1].id)
    })
  })
})

describe('Test Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API Response Helpers', () => {
    it('should create success response', () => {
      const response = testHelpers.createSuccessResponse({ id: 1, name: 'test' })
      
      expect(response).toEqual({
        success: true,
        data: { id: 1, name: 'test' },
        message: '操作成功'
      })
    })

    it('should create error response', () => {
      const response = testHelpers.createErrorResponse('Error message', 400)
      
      expect(response).toEqual({
        success: false,
        message: 'Error message',
        code: 400
      })
    })

    it('should create paginated response', () => {
      const content = [{ id: 1 }, { id: 2 }]
      const response = testHelpers.createPaginatedResponse(content, 10, 1, 20)
      
      expect(response).toHaveProperty('content', content)
      expect(response).toHaveProperty('totalElements', 20)
      expect(response).toHaveProperty('totalPages', 2)
    })
  })

  describe('Mock Utilities', () => {
    it('should create mock router', () => {
      const router = testHelpers.mockRouter()
      
      expect(router).toHaveProperty('push')
      expect(router).toHaveProperty('replace')
      expect(typeof router.push).toBe('function')
      expect(typeof router.replace).toBe('function')
    })

    it('should create mock store', () => {
      const store = testHelpers.mockStore({ count: 0 })
      
      expect(store).toHaveProperty('count', 0)
      expect(store).toHaveProperty('$reset')
      expect(store).toHaveProperty('$patch')
      expect(typeof store.$reset).toBe('function')
    })

    it('should handle store patch', () => {
      const initialState = { count: 0 }
      const store = testHelpers.mockStore(initialState)
      
      store.$patch({ count: 5 })
      expect(store.$patch).toHaveBeenCalledWith({ count: 5 })
    })
  })

  describe('Async Utilities', () => {
    it('should wait for next tick', async () => {
      let updated = false
      
      // 使用Promise而不是setTimeout来确保测试的确定性
      Promise.resolve().then(() => {
        updated = true
      })
      
      await testHelpers.waitForNextTick()
      await new Promise(resolve => setTimeout(resolve, 0)) // 额外等待确保Promise执行
      
      expect(updated).toBe(true)
    })

    it('should simulate network delay', async () => {
      const start = Date.now()
      await testHelpers.simulateNetworkDelay(50)
      const end = Date.now()
      
      expect(end - start).toBeGreaterThanOrEqual(45) // 允许一些误差
    })
  })

  describe('Form Validation', () => {
    it('should mock successful validation', async () => {
      const validator = testHelpers.mockFormValidation(true)
      const result = await validator()
      
      expect(result).toBe(true)
    })

    it('should mock failed validation', async () => {
      const validator = testHelpers.mockFormValidation(false)
      const result = await validator()
      
      expect(result).toBe(false)
    })
  })

  describe('Mock Objects', () => {
    it('should create mock localStorage', () => {
      const storage = testHelpers.mockLocalStorage()
      
      expect(storage).toHaveProperty('getItem')
      expect(storage).toHaveProperty('setItem')
      expect(typeof storage.getItem).toBe('function')
      expect(typeof storage.setItem).toBe('function')
    })

    it('should handle localStorage operations', () => {
      const storage = testHelpers.mockLocalStorage()
      
      storage.setItem('test', 'value')
      expect(storage.setItem).toHaveBeenCalledWith('test', 'value')
    })

    it('should create mock file', () => {
      const file = testHelpers.createMockFile('test.txt', 'text/plain', 1024)
      
      expect(file.name).toBe('test.txt')
      expect(file.type).toBe('text/plain')
      expect(file.size).toBe(1024)
    })
  })

  describe('Error Handling', () => {
    it('should create mock error', () => {
      const error = testHelpers.createMockError('Test error', 500)
      
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Test error')
      expect(error.code).toBe(500)
    })
  })
})