import { describe, it, expect } from 'vitest'

describe('Utils Tests', () => {
  describe('Basic Utils', () => {
    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      expect(emailRegex.test('test@example.com')).toBe(true)
      expect(emailRegex.test('invalid-email')).toBe(false)
      expect(emailRegex.test('')).toBe(false)
    })

    it('should format date strings', () => {
      const date = new Date('2024-01-01T10:30:00Z')
      const formatted = date.toLocaleString('zh-CN')
      
      expect(formatted).toContain('2024')
      expect(formatted).toContain('1')
    })

    it('should validate phone numbers', () => {
      const phoneRegex = /^1[3-9]\d{9}$/
      
      expect(phoneRegex.test('13800138000')).toBe(true)
      expect(phoneRegex.test('12345678901')).toBe(false)
      expect(phoneRegex.test('1380013800')).toBe(false)
    })

    it('should handle empty strings', () => {
      const isEmpty = (str) => !str || str.trim().length === 0
      
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('   ')).toBe(true)
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
    })

    it('should format numbers', () => {
      const formatNumber = (num) => {
        return new Intl.NumberFormat('zh-CN').format(num)
      }
      
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
    })
  })

  describe('Data Validation', () => {
    it('should validate required fields', () => {
      const validateRequired = (value) => {
        return value !== null && value !== undefined && String(value).trim() !== ''
      }
      
      expect(validateRequired('test')).toBe(true)
      expect(validateRequired('')).toBe(false)
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
      expect(validateRequired(0)).toBe(true)
    })

    it('should validate ID card format', () => {
      const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      
      expect(idCardRegex.test('123456789012345678')).toBe(true)
      expect(idCardRegex.test('12345678901234567X')).toBe(true)
      expect(idCardRegex.test('123456789012345')).toBe(true)
      expect(idCardRegex.test('1234567890')).toBe(false)
    })

    it('should validate password strength', () => {
      const isStrongPassword = (password) => {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /[0-9]/.test(password)
      }
      
      expect(isStrongPassword('Password123')).toBe(true)
      expect(isStrongPassword('password123')).toBe(false)
      expect(isStrongPassword('PASSWORD123')).toBe(false)
      expect(isStrongPassword('Password')).toBe(false)
    })
  })
})