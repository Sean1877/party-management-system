import request from '@/utils/request'

/**
 * 获取活动列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getActivityList(params) {
  return request({
    url: '/activities',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取活动
 * @param {number} id 活动ID
 * @returns {Promise}
 */
export function getActivityById(id) {
  return request({
    url: `/activities/${id}`,
    method: 'get'
  })
}

/**
 * 创建活动
 * @param {Object} data 活动数据
 * @returns {Promise}
 */
export function createActivity(data) {
  return request({
    url: '/activities',
    method: 'post',
    data
  })
}

/**
 * 更新活动
 * @param {number} id 活动ID
 * @param {Object} data 活动数据
 * @returns {Promise}
 */
export function updateActivity(id, data) {
  return request({
    url: `/activities/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除活动
 * @param {number} id 活动ID
 * @returns {Promise}
 */
export function deleteActivity(id) {
  return request({
    url: `/activities/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除活动
 * @param {Array} ids 活动ID数组
 * @returns {Promise}
 */
export function batchDeleteActivities(ids) {
  return request({
    url: '/activities/batch',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 报名参加活动
 * @param {number} id 活动ID
 * @param {string} remark 备注
 * @returns {Promise}
 */
export function joinActivity(id, remark = '') {
  return request({
    url: `/activities/${id}/join`,
    method: 'post',
    data: { remark }
  })
}

/**
 * 取消报名
 * @param {number} id 活动ID
 * @returns {Promise}
 */
export function cancelJoinActivity(id) {
  return request({
    url: `/activities/${id}/cancel`,
    method: 'post'
  })
}

/**
 * 签到
 * @param {number} id 活动ID
 * @returns {Promise}
 */
export function checkInActivity(id) {
  return request({
    url: `/activities/${id}/checkin`,
    method: 'post'
  })
}

/**
 * 请假
 * @param {number} id 活动ID
 * @param {string} reason 请假原因
 * @returns {Promise}
 */
export function leaveActivity(id, reason) {
  return request({
    url: `/activities/${id}/leave`,
    method: 'post',
    data: { reason }
  })
}

/**
 * 获取活动参与者列表
 * @param {number} id 活动ID
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getActivityParticipants(id, params = {}) {
  return request({
    url: `/activities/${id}/participants`,
    method: 'get',
    params
  })
}

/**
 * 批量签到
 * @param {number} id 活动ID
 * @param {Array} userIds 用户ID数组
 * @returns {Promise}
 */
export function batchCheckIn(id, userIds) {
  return request({
    url: `/activities/${id}/batch-checkin`,
    method: 'post',
    data: { userIds }
  })
}

/**
 * 导出参与者名单
 * @param {number} id 活动ID
 * @returns {Promise}
 */
export function exportParticipants(id) {
  return request({
    url: `/activities/${id}/export`,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 根据组织ID获取活动
 * @param {number} organizationId 组织ID
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getActivitiesByOrganization(organizationId, params = {}) {
  return request({
    url: `/activities/organization/${organizationId}`,
    method: 'get',
    params
  })
}

/**
 * 根据组织者ID获取活动
 * @param {number} organizerId 组织者ID
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getActivitiesByOrganizer(organizerId, params = {}) {
  return request({
    url: `/activities/organizer/${organizerId}`,
    method: 'get',
    params
  })
}

/**
 * 根据类型获取活动
 * @param {number} type 活动类型
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getActivitiesByType(type, params = {}) {
  return request({
    url: `/activities/type/${type}`,
    method: 'get',
    params
  })
}

/**
 * 根据状态获取活动
 * @param {number} status 活动状态
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getActivitiesByStatus(status, params = {}) {
  return request({
    url: `/activities/status/${status}`,
    method: 'get',
    params
  })
}

/**
 * 搜索活动
 * @param {string} keyword 关键词
 * @param {Object} params 其他参数
 * @returns {Promise}
 */
export function searchActivities(keyword, params = {}) {
  return request({
    url: '/activities/search',
    method: 'get',
    params: { keyword, ...params }
  })
}

/**
 * 获取活动统计信息
 * @returns {Promise}
 */
export function getActivityStats() {
  return request({
    url: '/activities/stats',
    method: 'get'
  })
}

/**
 * 获取我参与的活动
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getMyActivities(params = {}) {
  return request({
    url: '/activities/my',
    method: 'get',
    params
  })
}

/**
 * 获取即将开始的活动
 * @param {number} limit 数量限制
 * @returns {Promise}
 */
export function getUpcomingActivities(limit = 10) {
  return request({
    url: '/activities/upcoming',
    method: 'get',
    params: { limit }
  })
}

/**
 * 获取最近的活动
 * @param {number} limit 数量限制
 * @returns {Promise}
 */
export function getRecentActivities(limit = 10) {
  return request({
    url: '/activities/recent',
    method: 'get',
    params: { limit }
  })
}