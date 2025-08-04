import Cookies from 'js-cookie'

const TokenKey = 'party-management-token'
const RefreshTokenKey = 'party-management-refresh-token'

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 }) // 7天过期
}

// 移除token
export function removeToken() {
  Cookies.remove(TokenKey)
  Cookies.remove(RefreshTokenKey)
}

// 获取刷新token
export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

// 设置刷新token
export function setRefreshToken(refreshToken) {
  return Cookies.set(RefreshTokenKey, refreshToken, { expires: 30 }) // 30天过期
}

// 移除刷新token
export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

// 检查是否已登录
export function isLoggedIn() {
  return !!getToken()
}

// 清除所有认证信息
export function clearAuth() {
  removeToken()
  removeRefreshToken()
}