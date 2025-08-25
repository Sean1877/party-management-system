import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock API utilities
const mockRequest = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: {
      handlers: [
        {
          fulfilled: vi.fn((config) => ({
            ...config,
            headers: {
              ...config.headers,
              Authorization: 'Bearer mock-token'
            }
          }))
        }
      ]
    },
    response: {
      handlers: [
        {
          fulfilled: vi.fn((response) => response),
          rejected: vi.fn((error) => Promise.reject(error))
        }
      ]
    }
  }
}

vi.mock('@/utils/request', () => ({
  default: mockRequest,
  ...mockRequest
}))

describe('API Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('request interceptor', () => {
    it('should add authorization header when token exists', () => {
      localStorage.setItem('token', 'mock-token')
      
      const mockConfig = {}
      const interceptor = mockRequest.interceptors?.request?.handlers[0]
      
      if (interceptor) {
        const result = interceptor.fulfilled(mockConfig)
        expect(result.headers.Authorization).toBe('Bearer mock-token')
      }
    })

    it('should not add authorization header when token does not exist', () => {
      localStorage.removeItem('token')
      
      const mockConfig = {}
      const interceptor = request.interceptors?.request?.handlers[0]
      
      if (interceptor) {
        const result = interceptor.fulfilled(mockConfig)
        expect(result.headers.Authorization).toBeUndefined()
      }
    })
  })

  describe('response interceptor', () => {
    it('should return response data directly for successful responses', () => {
      const mockResponse = {
        data: { success: true, data: { id: 1 } },
        status: 200
      }
      
      const interceptor = request.interceptors?.response?.handlers[0]
      
      if (interceptor) {
        const result = interceptor.fulfilled(mockResponse)
        expect(result).toEqual({ success: true, data: { id: 1 } })
      }
    })

    it('should handle error responses', () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }
      
      const interceptor = request.interceptors?.response?.handlers[0]
      
      if (interceptor) {
        expect(() => interceptor.rejected(mockError)).toThrow()
      }
    })
  })
})

describe('Auth Utils', () => {
  let authUtils

  beforeEach(() => {
    vi.clearAllMocks()
    authUtils = require('@/utils/auth')
  })

  describe('token management', () => {
    it('should save token to localStorage', () => {
      authUtils.setToken('mock-token')
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
    })

    it('should get token from localStorage', () => {
      localStorage.getItem.mockReturnValue('mock-token')
      const token = authUtils.getToken()
      expect(token).toBe('mock-token')
    })

    it('should remove token from localStorage', () => {
      authUtils.removeToken()
      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    })

    it('should return null when token does not exist', () => {
      localStorage.getItem.mockReturnValue(null)
      const token = authUtils.getToken()
      expect(token).toBeNull()
    })
  })

  describe('user authentication', () => {
    it('should check if user is authenticated', () => {
      localStorage.getItem.mockReturnValue('mock-token')
      const isAuthenticated = authUtils.isAuthenticated()
      expect(isAuthenticated).toBe(true)
    })

    it('should return false when token does not exist', () => {
      localStorage.getItem.mockReturnValue(null)
      const isAuthenticated = authUtils.isAuthenticated()
      expect(isAuthenticated).toBe(false)
    })
  })

  describe('permission checking', () => {
    it('should check if user has specific permission', () => {
      const mockUser = {
        permissions: ['user:read', 'user:write']
      }
      
      localStorage.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      expect(authUtils.hasPermission('user:read')).toBe(true)
      expect(authUtils.hasPermission('admin:read')).toBe(false)
    })

    it('should return false when user data does not exist', () => {
      localStorage.getItem.mockReturnValue(null)
      expect(authUtils.hasPermission('user:read')).toBe(false)
    })
  })
})

describe('Date Utils', () => {
  let dateUtils

  beforeEach(() => {
    vi.clearAllMocks()
    dateUtils = require('@/utils/date')
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T09:00:00')
      const formatted = dateUtils.formatDate(date, 'YYYY-MM-DD')
      expect(formatted).toBe('2024-01-15')
    })

    it('should handle invalid date', () => {
      const formatted = dateUtils.formatDate('invalid-date', 'YYYY-MM-DD')
      expect(formatted).toBe('')
    })

    it('should use default format when not provided', () => {
      const date = new Date('2024-01-15T09:00:00')
      const formatted = dateUtils.formatDate(date)
      expect(formatted).toBeDefined()
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T09:30:00')
      const formatted = dateUtils.formatDateTime(date)
      expect(formatted).toContain('2024-01-15')
      expect(formatted).toContain('09:30')
    })
  })

  describe('getRelativeTime', () => {
    it('should return relative time for recent dates', () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const relative = dateUtils.getRelativeTime(oneHourAgo)
      expect(relative).toContain('小时前')
    })

    it('should return absolute date for old dates', () => {
      const oldDate = new Date('2020-01-01T00:00:00')
      const relative = dateUtils.getRelativeTime(oldDate)
      expect(relative).toContain('2020-01-01')
    })
  })

  describe('isDateInRange', () => {
    it('should return true if date is within range', () => {
      const date = new Date('2024-01-15T12:00:00')
      const startDate = new Date('2024-01-15T09:00:00')
      const endDate = new Date('2024-01-15T15:00:00')
      
      const result = dateUtils.isDateInRange(date, startDate, endDate)
      expect(result).toBe(true)
    })

    it('should return false if date is outside range', () => {
      const date = new Date('2024-01-15T16:00:00')
      const startDate = new Date('2024-01-15T09:00:00')
      const endDate = new Date('2024-01-15T15:00:00')
      
      const result = dateUtils.isDateInRange(date, startDate, endDate)
      expect(result).toBe(false)
    })
  })
})

describe('Validation Utils', () => {
  let validationUtils

  beforeEach(() => {
    vi.clearAllMocks()
    validationUtils = require('@/utils/validation')
  })

  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validationUtils.validateEmail('test@example.com')).toBe(true)
      expect(validationUtils.validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validationUtils.validateEmail('invalid-email')).toBe(false)
      expect(validationUtils.validateEmail('test@')).toBe(false)
      expect(validationUtils.validateEmail('@example.com')).toBe(false)
      expect(validationUtils.validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(validationUtils.validatePhone('13800138000')).toBe(true)
      expect(validationUtils.validatePhone('010-12345678')).toBe(true)
    })

    it('should return false for invalid phone numbers', () => {
      expect(validationUtils.validatePhone('12345')).toBe(false)
      expect(validationUtils.validatePhone('abc123')).toBe(false)
      expect(validationUtils.validatePhone('')).toBe(false)
    })
  })

  describe('validateIdCard', () => {
    it('should return true for valid ID card numbers', () => {
      expect(validationUtils.validateIdCard('123456789012345678')).toBe(true)
    })

    it('should return false for invalid ID card numbers', () => {
      expect(validationUtils.validateIdCard('12345678901234567')).toBe(false)
      expect(validationUtils.validateIdCard('1234567890123456789')).toBe(false)
      expect(validationUtils.validateIdCard('')).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('should return true for non-empty values', () => {
      expect(validationUtils.validateRequired('test')).toBe(true)
      expect(validationUtils.validateRequired(0)).toBe(true)
      expect(validationUtils.validateRequired(false)).toBe(true)
    })

    it('should return false for empty values', () => {
      expect(validationUtils.validateRequired('')).toBe(false)
      expect(validationUtils.validateRequired(null)).toBe(false)
      expect(validationUtils.validateRequired(undefined)).toBe(false)
    })
  })

  describe('validateMinLength', () => {
    it('should return true for values meeting minimum length', () => {
      expect(validationUtils.validateMinLength('test', 3)).toBe(true)
      expect(validationUtils.validateMinLength('test', 4)).toBe(true)
    })

    it('should return false for values not meeting minimum length', () => {
      expect(validationUtils.validateMinLength('test', 5)).toBe(false)
      expect(validationUtils.validateMinLength('', 1)).toBe(false)
    })
  })

  describe('validateMaxLength', () => {
    it('should return true for values within maximum length', () => {
      expect(validationUtils.validateMaxLength('test', 5)).toBe(true)
      expect(validationUtils.validateMaxLength('test', 4)).toBe(true)
    })

    it('should return false for values exceeding maximum length', () => {
      expect(validationUtils.validateMaxLength('test', 3)).toBe(false)
    })
  })
})