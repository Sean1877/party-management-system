import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取用户
 * @param {number} id 用户ID
 * @returns {Promise}
 */
export function getUserById(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

/**
 * 创建用户
 * @param {Object} data 用户数据
 * @returns {Promise}
 */
export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @param {number} id 用户ID
 * @param {Object} data 用户数据
 * @returns {Promise}
 */
export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {number} id 用户ID
 * @returns {Promise}
 */
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除用户
 * @param {Array} ids 用户ID数组
 * @returns {Promise}
 */
export function batchDeleteUsers(ids) {
  return request({
    url: '/users/batch',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 激活用户
 * @param {number} id 用户ID
 * @returns {Promise}
 */
export function activateUser(id) {
  return request({
    url: `/users/${id}/activate`,
    method: 'post'
  })
}

/**
 * 停用用户
 * @param {number} id 用户ID
 * @returns {Promise}
 */
export function deactivateUser(id) {
  return request({
    url: `/users/${id}/deactivate`,
    method: 'post'
  })
}

/**
 * 重置用户密码
 * @param {number} id 用户ID
 * @returns {Promise}
 */
export function resetUserPassword(id) {
  return request({
    url: `/users/${id}/reset-password`,
    method: 'post'
  })
}

/**
 * 修改用户密码
 * @param {Object} data 密码数据
 * @returns {Promise}
 */
export function changePassword(data) {
  return request({
    url: '/users/change-password',
    method: 'post',
    data
  })
}

/**
 * 转移用户到其他组织
 * @param {number} id 用户ID
 * @param {number} organizationId 目标组织ID
 * @returns {Promise}
 */
export function transferUser(id, organizationId) {
  return request({
    url: `/users/${id}/transfer`,
    method: 'post',
    data: { organizationId }
  })
}

/**
 * 批量转移用户
 * @param {Array} ids 用户ID数组
 * @param {number} organizationId 目标组织ID
 * @returns {Promise}
 */
export function batchTransferUsers(ids, organizationId) {
  return request({
    url: '/users/batch-transfer',
    method: 'post',
    data: { ids, organizationId }
  })
}

/**
 * 更新用户头像
 * @param {number} id 用户ID
 * @param {string} avatarUrl 头像URL
 * @returns {Promise}
 */
export function updateUserAvatar(id, avatarUrl) {
  return request({
    url: `/users/${id}/avatar`,
    method: 'post',
    data: { avatarUrl }
  })
}

/**
 * 搜索用户
 * @param {string} keyword 关键词
 * @param {Object} params 其他参数
 * @returns {Promise}
 */
export function searchUsers(keyword, params = {}) {
  return request({
    url: '/users/search',
    method: 'get',
    params: { keyword, ...params }
  })
}

/**
 * 获取用户统计信息
 * @returns {Promise}
 */
export function getUserStats() {
  return request({
    url: '/users/stats',
    method: 'get'
  })
}

/**
 * 获取最近注册的用户
 * @param {number} limit 数量限制
 * @returns {Promise}
 */
export function getRecentUsers(limit = 10) {
  return request({
    url: '/users/recent',
    method: 'get',
    params: { limit }
  })
}

/**
 * 获取本月生日的用户
 * @returns {Promise}
 */
export function getBirthdayUsers() {
  return request({
    url: '/users/birthday',
    method: 'get'
  })
}

/**
 * 获取本月入党周年的用户
 * @returns {Promise}
 */
export function getPartyAnniversaryUsers() {
  return request({
    url: '/users/party-anniversary',
    method: 'get'
  })
}

/**
 * 根据组织ID获取用户
 * @param {number} organizationId 组织ID
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getUsersByOrganization(organizationId, params = {}) {
  return request({
    url: `/users/organization/${organizationId}`,
    method: 'get',
    params
  })
}

/**
 * 根据角色ID获取用户
 * @param {number} roleId 角色ID
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getUsersByRole(roleId, params = {}) {
  return request({
    url: `/users/role/${roleId}`,
    method: 'get',
    params
  })
}

/**
 * 根据党员状态获取用户
 * @param {number} status 党员状态
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getUsersByPartyStatus(status, params = {}) {
  return request({
    url: `/users/party-status/${status}`,
    method: 'get',
    params
  })
}