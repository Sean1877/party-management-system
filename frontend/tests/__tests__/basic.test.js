import { describe, it, expect } from 'vitest'
import { testDataFactory } from '@tests/fixtures/dataFactory'
import { testHelpers } from '@tests/mocks/testHelpers'

describe('Basic Tests', () => {
  describe('Test Data Factory', () => {
    it('should create a valid user object', () => {
      const user = testDataFactory.createUser()
      
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('email')
      expect(typeof user.id).toBe('number')
      expect(typeof user.username).toBe('string')
    })

    it('should create a valid activity object', () => {
      const activity = testDataFactory.createActivity()
      
      expect(activity).toHaveProperty('id')
      expect(activity).toHaveProperty('title')
      expect(activity).toHaveProperty('type')
      expect(typeof activity.id).toBe('number')
      expect(typeof activity.title).toBe('string')
    })

    it('should create multiple users', () => {
      const users = testDataFactory.createUsers(3)
      
      expect(users).toHaveLength(3)
      expect(users[0].id).not.toBe(users[1].id)
    })
  })

  describe('Test Helpers', () => {
    it('should create success response', () => {
      const response = testHelpers.createSuccessResponse({ id: 1 })
      
      expect(response).toEqual({
        success: true,
        data: { id: 1 },
        message: '操作成功'
      })
    })

    it('should create error response', () => {
      const response = testHelpers.createErrorResponse('Test error', 400)
      
      expect(response).toEqual({
        success: false,
        message: 'Test error',
        code: 400
      })
    })

    it('should create paginated response', () => {
      const content = [{ id: 1 }, { id: 2 }]
      const response = testHelpers.createPaginatedResponse(content, 10, 1, 20)
      
      expect(response).toHaveProperty('content', content)
      expect(response).toHaveProperty('totalElements', 20)
      expect(response).toHaveProperty('totalPages', 2)
      expect(response).toHaveProperty('size', 10)
    })
  })
})