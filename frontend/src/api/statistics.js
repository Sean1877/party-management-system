import request from '@/utils/request'

// 获取总体统计数据
export function getOverviewStats(params) {
  return request({
    url: '/statistics/overview',
    method: 'get',
    params
  })
}

// 获取组织统计数据
export function getOrganizationStats(params) {
  return request({
    url: '/statistics/organizations',
    method: 'get',
    params
  })
}

// 获取成员活动统计数据
export function getMemberActivityStats(params) {
  return request({
    url: '/statistics/member-activity',
    method: 'get',
    params
  })
}

// 获取党费分析统计数据
export function getFeeAnalysisStats(params) {
  return request({
    url: '/statistics/fee-analysis',
    method: 'get',
    params
  })
}

// 导出统计报告
export function exportStatisticsReport(params) {
  return request({
    url: '/statistics/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}