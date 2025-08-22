import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { useRouter } from 'vue-router'
import Login from '@/views/Login.vue'

// Mock dependencies
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn()
}))

vi.mock('@/api/user', () => ({
  login: vi.fn()
}))

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('Login', () => {
  let routerMock
  let userStoreMock
  let pinia

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup router mock
    routerMock = {
      push: vi.fn(),
      replace: vi.fn()
    }
    useRouter.mockReturnValue(routerMock)

    // Setup user store mock
    userStoreMock = {
      login: vi.fn(),
      isAuthenticated: false,
      user: null
    }
    const { useUserStore } = require('@/stores/user')
    useUserStore.mockReturnValue(userStoreMock)

    // Setup Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })
  })

  it('renders login form correctly', () => {
    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    expect(screen.getByText('党建管理系统')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('请输入用户名')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('请输入密码')).toBeInTheDocument()
    expect(screen.getByText('登录')).toBeInTheDocument()
  })

  it('updates form data when typing', async () => {
    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    const usernameInput = screen.getByPlaceholderText('请输入用户名')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    await fireEvent.update(usernameInput, 'testuser')
    await fireEvent.update(passwordInput, 'password123')

    // Check if form data is updated (this would require accessing the component's data)
    // For now, we'll just verify the inputs have the correct values
    expect(usernameInput.value).toBe('testuser')
    expect(passwordInput.value).toBe('password123')
  })

  it('validates required fields', async () => {
    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    const loginButton = screen.getByText('登录')
    await fireEvent.click(loginButton)

    // The component should show validation errors
    // This depends on the actual validation implementation
    expect(screen.getByText('请输入用户名')).toBeInTheDocument()
    expect(screen.getByText('请输入密码')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const mockResponse = {
      data: {
        token: 'mock-token',
        user: {
          id: 1,
          username: 'testuser',
          realName: '测试用户'
        }
      }
    }

    userStoreMock.login.mockResolvedValue(mockResponse)

    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    // Fill form
    const usernameInput = screen.getByPlaceholderText('请输入用户名')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    await fireEvent.update(usernameInput, 'testuser')
    await fireEvent.update(passwordInput, 'password123')

    // Submit form
    const loginButton = screen.getByText('登录')
    await fireEvent.click(loginButton)

    await waitFor(() => {
      expect(userStoreMock.login).toHaveBeenCalledWith('testuser', 'password123')
      expect(routerMock.push).toHaveBeenCalledWith('/')
    })
  })

  it('handles login failure', async () => {
    const error = new Error('用户名或密码错误')
    userStoreMock.login.mockRejectedValue(error)

    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    // Fill form
    const usernameInput = screen.getByPlaceholderText('请输入用户名')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    await fireEvent.update(usernameInput, 'wronguser')
    await fireEvent.update(passwordInput, 'wrongpass')

    // Submit form
    const loginButton = screen.getByText('登录')
    await fireEvent.click(loginButton)

    await waitFor(() => {
      expect(userStoreMock.login).toHaveBeenCalledWith('wronguser', 'wrongpass')
      expect(screen.getByText('用户名或密码错误')).toBeInTheDocument()
    })
  })

  it('handles remember me functionality', async () => {
    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    const rememberMeCheckbox = screen.getByText('记住我')
    await fireEvent.click(rememberMeCheckbox)

    // Check if remember me is toggled
    expect(rememberMeCheckbox.checked).toBe(true)
  })

  it('navigates to forgot password page', async () => {
    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    const forgotPasswordLink = screen.getByText('忘记密码？')
    await fireEvent.click(forgotPasswordLink)

    expect(routerMock.push).toHaveBeenCalledWith('/forgot-password')
  })

  it('disables submit button during login', async () => {
    // Mock a slow login response
    userStoreMock.login.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'mock-token',
              user: { id: 1, username: 'testuser' }
            }
          })
        }, 1000)
      })
    })

    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    // Fill form
    const usernameInput = screen.getByPlaceholderText('请输入用户名')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    await fireEvent.update(usernameInput, 'testuser')
    await fireEvent.update(passwordInput, 'password123')

    // Submit form
    const loginButton = screen.getByText('登录')
    await fireEvent.click(loginButton)

    // Button should be disabled during login
    expect(loginButton.disabled).toBe(true)
    expect(loginButton.textContent).toBe('登录中...')
  })

  it('shows loading indicator during login', async () => {
    // Mock a slow login response
    userStoreMock.login.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'mock-token',
              user: { id: 1, username: 'testuser' }
            }
          })
        }, 1000)
      })
    })

    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true,
          'el-icon': true
        }
      }
    })

    // Fill form
    const usernameInput = screen.getByPlaceholderText('请输入用户名')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    await fireEvent.update(usernameInput, 'testuser')
    await fireEvent.update(passwordInput, 'password123')

    // Submit form
    const loginButton = screen.getByText('登录')
    await fireEvent.click(loginButton)

    // Loading indicator should be visible
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('redirects to home page if already authenticated', () => {
    // Mock user as already authenticated
    userStoreMock.isAuthenticated = true

    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    expect(routerMock.replace).toHaveBeenCalledWith('/')
  })

  it('handles network error', async () => {
    const networkError = new Error('网络连接失败')
    userStoreMock.login.mockRejectedValue(networkError)

    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    // Fill form
    const usernameInput = screen.getByPlaceholderText('请输入用户名')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    await fireEvent.update(usernameInput, 'testuser')
    await fireEvent.update(passwordInput, 'password123')

    // Submit form
    const loginButton = screen.getByText('登录')
    await fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('网络连接失败')).toBeInTheDocument()
    })
  })

  it('handles Enter key to submit form', async () => {
    const mockResponse = {
      data: {
        token: 'mock-token',
        user: {
          id: 1,
          username: 'testuser',
          realName: '测试用户'
        }
      }
    }

    userStoreMock.login.mockResolvedValue(mockResponse)

    render(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-button': true,
          'el-checkbox': true,
          'el-link': true
        }
      }
    })

    // Fill form
    const usernameInput = screen.getByPlaceholderText('请输入用户名')
    const passwordInput = screen.getByPlaceholderText('请输入密码')

    await fireEvent.update(usernameInput, 'testuser')
    await fireEvent.update(passwordInput, 'password123')

    // Press Enter key
    await fireEvent.keyUp(passwordInput, { key: 'Enter' })

    await waitFor(() => {
      expect(userStoreMock.login).toHaveBeenCalledWith('testuser', 'password123')
      expect(routerMock.push).toHaveBeenCalledWith('/')
    })
  })
})