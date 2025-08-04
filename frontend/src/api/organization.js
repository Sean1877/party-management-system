import request from '@/utils/request'

/**
 * 获取组织列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getOrganizationList(params) {
  return request({
    url: '/organizations',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取组织
 * @param {number} id 组织ID
 * @returns {Promise}
 */
export function getOrganizationById(id) {
  return request({
    url: `/organizations/${id}`,
    method: 'get'
  })
}

/**
 * 创建组织
 * @param {Object} data 组织数据
 * @returns {Promise}
 */
export function createOrganization(data) {
  return request({
    url: '/organizations',
    method: 'post',
    data
  })
}

/**
 * 更新组织
 * @param {number} id 组织ID
 * @param {Object} data 组织数据
 * @returns {Promise}
 */
export function updateOrganization(id, data) {
  return request({
    url: `/organizations/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除组织
 * @param {number} id 组织ID
 * @returns {Promise}
 */
export function deleteOrganization(id) {
  return request({
    url: `/organizations/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除组织
 * @param {Array} ids 组织ID数组
 * @returns {Promise}
 */
export function batchDeleteOrganizations(ids) {
  return request({
    url: '/organizations/batch',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 激活组织
 * @param {number} id 组织ID
 * @returns {Promise}
 */
export function activateOrganization(id) {
  return request({
    url: `/organizations/${id}/activate`,
    method: 'post'
  })
}

/**
 * 停用组织
 * @param {number} id 组织ID
 * @returns {Promise}
 */
export function deactivateOrganization(id) {
  return request({
    url: `/organizations/${id}/deactivate`,
    method: 'post'
  })
}

/**
 * 移动组织
 * @param {number} id 组织ID
 * @param {number} parentId 新父组织ID
 * @returns {Promise}
 */
export function moveOrganization(id, parentId) {
  return request({
    url: `/organizations/${id}/move`,
    method: 'post',
    data: { parentId }
  })
}

/**
 * 设置组织书记
 * @param {number} id 组织ID
 * @param {number} secretaryId 书记用户ID
 * @returns {Promise}
 */
export function setOrganizationSecretary(id, secretaryId) {
  return request({
    url: `/organizations/${id}/secretary`,
    method: 'post',
    data: { secretaryId }
  })
}

/**
 * 获取组织树结构
 * @returns {Promise}
 */
export function getOrganizationTree() {
  return request({
    url: '/organizations/tree',
    method: 'get'
  })
}

/**
 * 根据编码获取组织
 * @param {string} code 组织编码
 * @returns {Promise}
 */
export function getOrganizationByCode(code) {
  return request({
    url: `/organizations/code/${code}`,
    method: 'get'
  })
}

/**
 * 根据父组织ID获取子组织
 * @param {number} parentId 父组织ID
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getChildOrganizations(parentId, params = {}) {
  return request({
    url: `/organizations/parent/${parentId}`,
    method: 'get',
    params
  })
}

/**
 * 根据类型获取组织
 * @param {number} type 组织类型
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getOrganizationsByType(type, params = {}) {
  return request({
    url: `/organizations/type/${type}`,
    method: 'get',
    params
  })
}

/**
 * 根据层级获取组织
 * @param {number} level 组织层级
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getOrganizationsByLevel(level, params = {}) {
  return request({
    url: `/organizations/level/${level}`,
    method: 'get',
    params
  })
}

/**
 * 根据书记ID获取组织
 * @param {number} secretaryId 书记ID
 * @returns {Promise}
 */
export function getOrganizationsBySecretary(secretaryId) {
  return request({
    url: `/organizations/secretary/${secretaryId}`,
    method: 'get'
  })
}

/**
 * 搜索组织
 * @param {string} keyword 关键词
 * @param {Object} params 其他参数
 * @returns {Promise}
 */
export function searchOrganizations(keyword, params = {}) {
  return request({
    url: '/organizations/search',
    method: 'get',
    params: { keyword, ...params }
  })
}

/**
 * 获取组织统计信息
 * @returns {Promise}
 */
export function getOrganizationStats() {
  return request({
    url: '/organizations/stats',
    method: 'get'
  })
}

/**
 * 获取根组织
 * @returns {Promise}
 */
export function getRootOrganizations() {
  return request({
    url: '/organizations/roots',
    method: 'get'
  })
}

/**
 * 获取叶子组织（没有子组织的组织）
 * @returns {Promise}
 */
export function getLeafOrganizations() {
  return request({
    url: '/organizations/leaves',
    method: 'get'
  })
}

/**
 * 验证组织编码是否存在
 * @param {string} code 组织编码
 * @param {number} excludeId 排除的组织ID（用于编辑时验证）
 * @returns {Promise}
 */
export function checkOrganizationCodeExists(code, excludeId = null) {
  return request({
    url: '/organizations/check-code',
    method: 'get',
    params: { code, excludeId }
  })
}