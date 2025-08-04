import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data 登录数据
 * @param {string} data.username 用户名
 * @param {string} data.password 密码
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/api/auth/me',
    method: 'get'
  })
}

/**
 * 刷新token
 * @param {string} refreshToken 刷新token
 * @returns {Promise}
 */
export function refreshToken(refreshToken) {
  return request({
    url: '/api/auth/refresh',
    method: 'post',
    data: { refreshToken }
  })
}

/**
 * 修改密码
 * @param {Object} data 密码数据
 * @param {string} data.oldPassword 旧密码
 * @param {string} data.newPassword 新密码
 * @returns {Promise}
 */
export function changePassword(data) {
  return request({
    url: '/api/auth/change-password',
    method: 'post',
    data
  })
}

/**
 * 重置密码
 * @param {Object} data 重置数据
 * @param {string} data.username 用户名
 * @param {string} data.phone 手机号
 * @param {string} data.code 验证码
 * @param {string} data.newPassword 新密码
 * @returns {Promise}
 */
export function resetPassword(data) {
  return request({
    url: '/api/auth/reset-password',
    method: 'post',
    data
  })
}

/**
 * 发送验证码
 * @param {string} phone 手机号
 * @returns {Promise}
 */
export function sendVerificationCode(phone) {
  return request({
    url: '/api/auth/send-code',
    method: 'post',
    data: { phone }
  })
}